import Select from "react-select";
import type { ChangeEvent, FormEvent } from "react";
import { FormElt } from "./FormElt";
import {
	PrescriptionServices,
	TreatmentTypes,
	type PatientForm,
} from "./Patient";
import BinaryFormElt from "./BinaryFormElt";
import { Dropdown } from "./Dropdown";

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

	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-col justify-start px-8 pt-6 pb-8 mb-4 align-baseline rounded"
		>
			<h2>Treatment</h2>
			<FormElt
				type="number"
				name="prescriptionYear"
				label="prescription year"
				value={patient.prescriptionYear}
				onChange={handleChange}
			/>
			<FormElt
				type="number"
				name="treatmentDuration"
				label="treatment duration"
				value={patient.treatmentDuration}
				onChange={handleChange}
			/>
			<div className="flex items-center">
				<label className="py-2 px-3 my-2 mx-1 w-1/6 text-right wid">
					Type de traitement
				</label>
				<Select
					className="flex-1 px-1 focus:outline-blue-400"
					options={TreatmentTypes}
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
					options={PrescriptionServices}
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
			<h2>Demography</h2>
			<FormElt
				type="text"
				name="name"
				value={patient.name}
				onChange={handleChange}
			/>
			<FormElt
				type="number"
				name="age"
				value={patient.age}
				onChange={handleChange}
			/>
			<FormElt
				type="number"
				name="weight"
				label="weight"
				value={patient.weight}
				onChange={handleChange}
			/>
			<FormElt
				type="number"
				name="height"
				label="height"
				value={patient.height}
				onChange={handleChange}
			/>
			<FormElt
				type="number"
				name="cranialPerimeter"
				label="cranial perimeter"
				value={patient.cranialPerimeter}
				onChange={handleChange}
			/>
			<BinaryFormElt
				things={["Yes", "No"]}
				label="had evaluation nutritional state?"
				onSelect={(idx) => {
					patient.hadEvaluationNutriState = !!idx;
				}}
			/>
			<FormElt
				type="number"
				name="zScore"
				label="z-score"
				value={patient.zScore}
				onChange={handleChange}
			/>
			<h2>Diagnostic</h2>
			<button
				className="self-center py-1 px-3 rounded bg-zinc-500"
				type="submit"
			>
				Submit
			</button>
		</form>
	);
}
