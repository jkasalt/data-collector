import type { ChangeEvent } from "react";

type FormEltType =
	| { type: "number"; value: number }
	| { type: "text"; value: string };

type FormEltProps = FormEltType & {
	name: string;
	label?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function FormElt({ type, label, name, value, onChange }: FormEltProps) {
	return (
		<div className="flex items-center">
			<label
				htmlFor="name"
				className="py-2 px-3 my-2 mx-1 w-1/6 text-right wid"
			>
				{label ?? name}
			</label>
			<input
				type={type}
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				className="flex-1 py-2 px-3 my-2 mx-1 leading-tight rounded shadow appearance-none focus:shadow-none focus:outline-blue-400"
			/>
		</div>
	);
}
