import type { ChangeEvent } from "react";

type InputMode =
	| "text"
	| "search"
	| "email"
	| "tel"
	| "url"
	| "none"
	| "numeric"
	| "decimal"
	| undefined;

type FormEltType =
	| { type: "number"; value: number }
	| { type: "text"; value: string };

type FormEltProps = FormEltType & {
	name: string;
	inputmode?: InputMode;
	label?: string;
	step?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function FormElt({
	type,
	step,
	label,
	name,
	inputmode,
	value,
	onChange,
}: FormEltProps) {
	return (
		<div className="flex items-center">
			<label htmlFor="name" className="px-3 my-1 mx-1 w-1/6 text-right">
				{label ?? name}
			</label>
			<input
				type={type}
				id={name}
				inputMode={inputmode}
				name={name}
				value={value}
				step={step}
				onChange={onChange}
				className="flex-1 py-2 px-3 my-1 mx-1 leading-tight rounded shadow appearance-none focus:shadow-none focus:outline-blue-400"
			/>
		</div>
	);
}
