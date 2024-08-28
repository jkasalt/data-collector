import type { ChangeEvent, FormEvent } from "react";
import { FormElt } from "./FormElt";
import type { PatientForm } from "./Patient";

interface FormProps {
	onSubmit: (e: FormEvent) => void;
	onFormChange: (newPatient: PatientForm) => void;
	patient: PatientForm;
}

export function Form({ onSubmit, onFormChange, patient }: FormProps) {
	const numerical_fields = ["age", "prescription_year"];

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
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
				name="prescription_year"
				label="prescription year"
				value={patient.prescription_year}
				onChange={handleChange}
			/>
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
