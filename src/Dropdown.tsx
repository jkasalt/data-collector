import Select, { type SingleValue } from "react-select";
type DropdownProps<T> = {
	items: T[];
	onChange: (item: T | null) => void;
};

type DropdownOption<T> = { value: T; label: T };

type ResetOption = { value: null; label: "None" };

export function Dropdown<T>({ items, onChange }: DropdownProps<T>) {
	const intoOption = (item: T) => {
		return { value: item, label: item };
	};

	const fromOption = (
		option: SingleValue<DropdownOption<T> | ResetOption>,
	): T | null => {
		if (!option?.value) {
			return null;
		}
		return option.value;
	};

	const options: (DropdownOption<T> | ResetOption)[] = [
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
