import Select from "react-select";
import BinaryFormElt from "./BinaryFormElt";
import type { CardiacDiagnostic, Diagnostic, SncDiagnostic } from "./Patient";
import { useEffect } from "react";

interface DiagnosticFormProps {
	diagnostic: Diagnostic;
	textBox?: string;
	onSelDiagnostic: (d: string | undefined) => void;
	onChangeTextBox: (text: string) => void;
	onSelCardiac: (c: CardiacDiagnostic) => void;
	onSelSnc: (snc: SncDiagnostic) => void;
	onSelRespiratory: (r: boolean) => void;
}

export function DiagnosticForm({
	diagnostic,
	onSelDiagnostic,
	onSelSnc,
	onSelCardiac,
	onSelRespiratory,
	textBox,
	onChangeTextBox,
}: DiagnosticFormProps) {
	const diagnosticOptions = [
		{ label: "Syndrome Chromosomique", value: "ChromosomicSyndrome" },
		{ label: "Respiratoire", value: "Respiratory" },
		{ label: "Cardiaque", value: "Cardiac" },
		{ label: "Snc", value: "Snc" },
		{ label: "Urologique", value: "Urologic" },
		{ label: "Maladie Metabolique", value: "MetabolicIllness" },
		{ label: "Digestif", value: "Digestive" },
	];

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

	const needsTextBox = (d: string | undefined) =>
		d === "ChromosomicSyndrome" || d === "Digestive";

	useEffect(() => {
		console.log(diagnostic);
	}, [diagnostic]);

	return (
		<>
			<Select
				options={diagnosticOptions}
				value={diagnosticOptions.find((opt) => opt.value === diagnostic.t)}
				onChange={(option) => {
					onSelDiagnostic(option?.value);
				}}
			/>
			{diagnostic.t === "Snc" && (
				<BinaryFormElt
					things={choiceSnc}
					onSelect={(thing) => {
						onSelSnc(thing);
					}}
				/>
			)}
			{diagnostic.t === "Cardiac" && (
				<BinaryFormElt
					things={choiceCardiac}
					onSelect={(thing) => {
						onSelCardiac(thing);
					}}
				/>
			)}
			{diagnostic.t === "Respiratory" && (
				<>
					<BinaryFormElt
						things={choiceRespiratory}
						label="Support respiratoire?"
						onSelect={(thing) => {
							onSelRespiratory(thing);
						}}
					/>
				</>
			)}
			{needsTextBox(diagnostic.t) && (
				<>
					{"Détails:\n"}
					<textarea
						className="w-full rounded shadow min-h-[300px] outline-offset-2 focus:outline-blue-400"
						value={textBox}
						onChange={(e) => {
							onChangeTextBox(e.target.value);
						}}
					/>
				</>
			)}
		</>
	);
}
