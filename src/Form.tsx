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
	const numerical_fields = [
		"age",
		"prescriptionYear",
		"treatmentDuration",
		"weight",
		"height",
		"cranialPerimeter",
		"zScore",
	];

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		console.log("in form", patient);
		const changedField = e.target.name;
		let newValue: string | number = e.target.value;

		if (numerical_fields.includes(changedField)) {
			newValue = Number.parseInt(newValue, 10);
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
			<div className="flex-1">
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
					<label className="py-2 px-3 my-2 mx-1 w-1/6 text-right wid">
						Type de traitement
					</label>
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
					<label className="py-2 px-3 my-2 mx-1 w-1/6 text-right wid">
						Service de prescription
					</label>
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
				<FormElt
					type="number"
					name="weight"
					label="Poids"
					value={patient.weight}
					onChange={handleChange}
				/>
				<FormElt
					type="number"
					name="height"
					label="Taille"
					value={patient.height}
					onChange={handleChange}
				/>
				<FormElt
					type="number"
					name="cranialPerimeter"
					label="Perimètre cranier"
					value={patient.cranialPerimeter}
					onChange={handleChange}
				/>
				<BinaryFormElt
					things={[
						{ label: "Oui", value: true },
						{ label: "Non", value: false },
					]}
					label="A eu une évaluation de l'état nutritif'?"
					onSelect={(value) => {
						patient.hadEvaluationNutriState = value;
					}}
				/>
				<FormElt
					type="number"
					name="zScore"
					label="z-score"
					value={patient.zScore}
					onChange={handleChange}
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
