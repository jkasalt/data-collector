import type { ChangeEvent, FormEvent } from "react";
import Select from "react-select";
import BinaryFormElt from "./BinaryFormElt";
import { FormElt } from "./FormElt";
import {
	type Diagnostic,
	type PatientForm,
	PrescriptionServices,
	TreatmentTypes,
} from "./Patient";
import { DiagnosticForm } from "./Diagnostic";

interface FormProps {
	onSubmit: (e: FormEvent) => void;
	onFormChange: (newPatient: PatientForm) => void;
	patient: PatientForm;
}

export function Form({ onSubmit, onFormChange, patient }: FormProps) {
	const intFields = new Set([
		"prescriptionYear",
		"treatmentDuration",
		"nombreDePrescriptions",
	]);

	const floatFields = new Set([
		"age",
		"weight",
		"height",
		"cranialPerimeter",
		"zScoreWeight",
		"zScoreHeight",
		"zScorePc",
	]);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const changedField = e.target.name;
		let newValue: string | number = e.target.value;

		if (intFields.has(changedField)) {
			newValue = Number.parseInt(newValue, 10);
		} else if (floatFields.has(changedField)) {
			newValue = Number.parseFloat(newValue);
		}

		onFormChange({
			...patient,
			[changedField]: newValue,
		});
	}

	function handleDiagnosticChange(s: Diagnostic) {
		onFormChange({ ...patient, diagnostic: s });
	}

	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-row justify-between px-8 pt-6 pb-8 mb-4 align-baseline rounded"
		>
			<div className="flex flex-col flex-1">
				<h2 className="font-bold">Traitement</h2>
				<FormElt
					type="number"
					name="prescriptionYear"
					label="Année de prescription"
					value={patient.prescriptionYear}
					onChange={handleChange}
				/>
				<FormElt
					type="number"
					name="treatmentDuration"
					label="Durée du traitement"
					value={patient.treatmentDuration}
					onChange={handleChange}
				/>
				<div className="flex items-center">
					<p className="py-2 px-3 my-2 mx-1 w-1/6 text-right wid">
						Type de traitement
					</p>
					<Select
						className="flex-1 px-1 focus:outline-blue-400"
						isClearable
						options={TreatmentTypes}
						value={{
							label: patient.treatmentType.toString(),
							value: patient.treatmentType,
						}}
						onChange={(selected) => {
							if (!selected) {
								return;
							}
							onFormChange({
								...patient,
								treatmentType: selected.value,
							});
						}}
					/>
				</div>
				<div className="flex items-center">
					<p className="py-2 px-3 my-2 mx-1 w-1/6 text-right wid">
						Service de prescription
					</p>
					<Select
						className="flex-1 px-1 focus:outline-blue-400"
						isClearable
						options={PrescriptionServices}
						value={{
							label: patient.prescriptionService.toString(),
							value: patient.prescriptionService,
						}}
						onChange={(selected) => {
							if (!selected) {
								return;
							}
							onFormChange({
								...patient,
								prescriptionService: selected.value,
							});
						}}
					/>
				</div>
				<FormElt
					type="number"
					name="nombreDePrescriptions"
					label="Nombre de Prescriptions"
					value={patient.nombreDePrescriptions}
					onChange={handleChange}
				/>
				<h2 className="font-bold">Demographie</h2>
				<FormElt
					type="text"
					name="name"
					label="Nom"
					value={patient.name}
					onChange={handleChange}
				/>
				<FormElt
					type="number"
					name="age"
					label="Age"
					value={patient.age}
					onChange={handleChange}
				/>
				<BinaryFormElt
					things={[
						{ label: "M", value: "m" },
						{ label: "F", value: "f" },
					]}
					label="Sexe"
					value={patient.sex}
					onSelect={(value) => onFormChange({ ...patient, sex: value })}
				/>
				<FormElt
					type="number"
					name="weight"
					label="Poids [g]"
					value={patient.weight}
					onChange={handleChange}
				/>
				<FormElt
					type="number"
					name="zScoreWeight"
					label="z-score poids"
					value={patient.zScoreWeight}
					onChange={handleChange}
				/>
				<FormElt
					type="number"
					name="height"
					label="Taille [cm]"
					value={patient.height}
					onChange={handleChange}
				/>
				<FormElt
					type="number"
					name="zScoreHeight"
					label="z-score taille"
					value={patient.zScoreHeight}
					onChange={handleChange}
				/>
				<div className="flex items-center">
					<p className="px-3 my-1 mx-1 w-1/6 text-right">BMI</p>
					<p className="flex-1 py-2 px-3 my-1 mx-1 leading-tight text-left rounded border-black shadow">
						{(10 * patient.weight) / patient.height ** 2}
					</p>
				</div>
				<FormElt
					type="number"
					name="cranialPerimeter"
					label="Perimètre cranier"
					value={patient.cranialPerimeter}
					onChange={handleChange}
				/>
				<FormElt
					type="number"
					name="zScorePc"
					label="z-score PC"
					value={patient.zScorePc}
					onChange={handleChange}
				/>
				<BinaryFormElt
					things={[
						{ label: "Non", value: false },
						{ label: "Oui", value: true },
					]}
					label="A eu une évaluation de l'état nutritif?"
					value={patient.hadEvaluationNutriState}
					onSelect={(value) => {
						patient.hadEvaluationNutriState = value;
					}}
				/>
			</div>
			<div className="flex-1">
				<h2 className="font-bold">Diagnostic</h2>
				<DiagnosticForm
					diagnostic={patient.diagnostic}
					onChange={handleDiagnosticChange}
				/>
				<button
					className="self-center py-1 px-3 m-3 rounded bg-zinc-500"
					type="submit"
				>
					Submit
				</button>
			</div>
		</form>
	);
}
