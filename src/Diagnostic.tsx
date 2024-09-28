import Select from "react-select";
import BinaryFormElt from "./BinaryFormElt";
import type {
	CardiacDiagnostic,
	Diagnostic,
	DiagnosticType,
	SncDiagnostic,
} from "./Patient";
import { useEffect } from "react";

interface DiagnosticFormProps {
	diagnostic: Diagnostic;
	textBox?: string;
	onChange: (d: Diagnostic) => void;
}

export function DiagnosticForm({ diagnostic, onChange }: DiagnosticFormProps) {
	const diagnosticOptions = [
		{ label: "Syndrome Chromosomique", value: "ChromosomicSyndrome" },
		{ label: "Respiratoire", value: "Respiratory" },
		{ label: "Cardiaque", value: "Cardiac" },
		{ label: "Snc", value: "Snc" },
		{ label: "Urologique", value: "Urologic" },
		{ label: "Maladie Metabolique", value: "MetabolicIllness" },
		{ label: "Digestif", value: "Digestive" },
	] as { label: string; value: DiagnosticType }[];

	const choiceCardiac = [
		{ label: "Cyanogenique", value: "Cyanogenic" },
		{ label: "Autre", value: "Other" },
	] as { label: string; value: CardiacDiagnostic }[];

	const choiceSnc = [
		{ label: "Malformatif", value: "Malformative" },
		{ label: "Acquéri", value: "Acquired" },
		{ label: "Trauma", value: "Trauma" },
	] as { label: string; value: SncDiagnostic }[];

	const choiceRespiratory = [
		{ label: "Avec", value: true },
		{ label: "Sans", value: false },
	];

	useEffect(() => {
		console.log(diagnostic);
	}, [diagnostic]);

	return (
		<>
			<Select
				options={diagnosticOptions}
				value={diagnosticOptions.find((opt) => opt.value === diagnostic.t)}
				onChange={(option) => {
					if (!option) {
						return;
					}
					const opt = option.value;
					if (opt === "ChromosomicSyndrome" || opt === "Digestive") {
						onChange({ t: opt, c: "" });
					} else if (opt === "Respiratory") {
						onChange({ t: opt, c: false });
					} else if (opt === "Cardiac") {
						onChange({ t: opt, c: "Cyanogenic" });
					} else if (opt === "Snc") {
						onChange({ t: opt, c: "Malformative" });
					} else {
						onChange({ t: opt });
					}
				}}
			/>
			{diagnostic.t === "Snc" && (
				<BinaryFormElt
					things={choiceSnc}
					defaultSelection={choiceSnc.findIndex(
						(c) => c.value === diagnostic.c,
					)}
					onSelect={(thing) => {
						onChange({ t: "Snc", c: thing });
					}}
				/>
			)}
			{diagnostic.t === "Cardiac" && (
				<BinaryFormElt
					things={choiceCardiac}
					defaultSelection={choiceCardiac.findIndex(
						(c) => c.value === diagnostic.c,
					)}
					onSelect={(thing) => {
						onChange({ t: "Cardiac", c: thing });
					}}
				/>
			)}
			{diagnostic.t === "Respiratory" && (
				<>
					<BinaryFormElt
						things={choiceRespiratory}
						label="Support respiratoire?"
						defaultSelection={choiceRespiratory.findIndex(
							(c) => c.value === diagnostic.c,
						)}
						onSelect={(thing) => {
							onChange({ t: "Respiratory", c: thing });
						}}
					/>
				</>
			)}
			{(diagnostic.t === "Digestive" ||
				diagnostic.t === "ChromosomicSyndrome") && (
				<>
					{"Détails:\n"}
					<textarea
						className="w-full rounded shadow min-h-[300px] outline-offset-2 focus:outline-blue-400"
						value={diagnostic.c}
						onChange={(e) => {
							onChange({ t: diagnostic.t, c: e.target.value });
						}}
					/>
				</>
			)}
		</>
	);
}
