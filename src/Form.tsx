import type { ChangeEvent, FormEvent } from "react";
import { FormElt } from "./FormElt";
import type { PatientForm } from "./Patient";

interface FormProps {
	onSubmit: (e: FormEvent) => void;
	onFormChange: (newPatient: PatientForm) => void;
	patient: PatientForm;
}

export function Form({ onSubmit, onFormChange, patient }: FormProps) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const changedField = e.target.name;
		let newValue: string | number = e.target.value;

		if (changedField === "age") {
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
			className="flex flex-col justify-start px-8 pt-6 pb-8 mb-4 rounded shadow-md"
		>
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
			<button type="submit">Submit</button>
		</form>
	);
}
