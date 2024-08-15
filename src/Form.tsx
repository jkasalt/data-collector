import { invoke } from "@tauri-apps/api";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { FormElt } from "./FormElt";
import type { NewPatient, Patient } from "./Patient";

interface FormProps {
	onSubmit: () => void;
	patient: Patient | NewPatient | null;
}

export function Form({ onSubmit, patient }: FormProps) {
	const [formData, setFormData] = useState<Patient | NewPatient>(() => {
		if (patient == null) {
			return {
				name: "",
				age: 0,
			};
		}
		return patient;
	});

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const changedField = e.target.name;
		let newValue: string | number = e.target.value;

		if (changedField === "age") {
			newValue = Number.parseInt(newValue, 10);
		}

		setFormData({
			...formData,
			[changedField]: newValue,
		});
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const id = "id" in formData ? formData.id : null;

		invoke("save", {
			newPatient: { name: formData.name, age: formData.age, id },
		})
			.catch((err) => console.error(err))
			.then(() => onSubmit());
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col justify-start px-8 pt-6 pb-8 mb-4 rounded shadow-md"
		>
			<FormElt
				type="text"
				name="name"
				value={formData.name}
				onChange={handleChange}
			/>
			<FormElt
				type="number"
				name="age"
				value={formData.age}
				onChange={handleChange}
			/>
			<button type="submit">Submit</button>
		</form>
	);
}
