import Select from "react-select";
import type { PatientForm } from "./Patient";

type FormDropdownProps<V> = {
	label: string;
	options: { label: string; value: V }[];
	patient: PatientForm;
	onFormChange: (newPatient: PatientForm) => void;
};

export function FormDropdown<V>({
	label,
	options,
	patient,
	onFormChange,
}: FormDropdownProps<V>) {
	return (
		<div className="flex items-center">
			<label className="py-2 px-3 my-2 mx-1 w-1/6 text-right wid">
				{label}
			</label>
			<Select
				className="flex-1 px-1 focus:outline-blue-400"
				options={options}
				onChange={(selected) => {
					if (!selected) {
						return;
					}
					onFormChange({
						...patient,
						[typeof selected.value]: selected.value,
					});
				}}
			/>
		</div>
	);
}
