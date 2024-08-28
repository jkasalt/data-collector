import Select, { type SingleValue } from "react-select";
type DropdownProps = {
	items: number[];
	onChange: (item: number | null) => void;
};

type NumericalOption = { value: number; label: number };

type ResetOption = { value: null; label: "None" };

export function Dropdown({ items, onChange }: DropdownProps) {
	const intoOption = (item: number) => {
		return { value: item, label: item };
	};

	const fromOption = (
		option: SingleValue<NumericalOption | ResetOption>,
	): number | null => {
		if (!option?.value) {
			return null;
		}
		return option.value;
	};

	const options: (NumericalOption | ResetOption)[] = [
		{ value: null, label: "None" },
		...items.map(intoOption),
	];

	return (
		<Select
			options={options}
			onChange={(option) => {
				onChange(fromOption(option));
			}}
		/>
	);
}
