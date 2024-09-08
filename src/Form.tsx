import type { ChangeEvent, FormEvent } from "react";
import { FormElt } from "./FormElt";
import type { PatientForm } from "./Patient";
import BinaryFormElt from "./BinaryFormElt";

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
			<FormElt
				type="text"
				name="treatmentType"
				label="treatment type"
				value={patient.treatmentType}
				onChange={handleChange}
			/>
			<FormElt
				type="text"
				name="prescriptionService"
				label="prescription service"
				value={patient.prescriptionService}
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
