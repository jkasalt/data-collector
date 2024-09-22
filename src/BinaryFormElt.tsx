import { type ReactNode, useState } from "react";

interface BinaryFormEltProps<T> {
	things: T[];
	label: string;
	onSelect: (thing: T, idx: number) => void;
}

export default function BinaryFormElt<T extends ReactNode>({
	things,
	label,
	onSelect,
}: BinaryFormEltProps<T>) {
	const [selected, setSelected] = useState(0);
	const basicClass =
		"flex-1 py-2 px-3 my-2 mx-1 leading-tight rounded shadow appearance-none focus:shadow-none hover:outline-blue-400";

	return (
		<div className="flex items-center">
			<label
				htmlFor="name"
				className="py-2 px-3 my-2 mx-1 w-1/6 text-right wid"
			>
				{label}
			</label>
			{things.map((thing, idx) => {
				const bgClass = idx === selected ? "bg-zinc-400" : "bg-zinc-300";
				return (
					<button
						type="button"
						key={JSON.stringify(thing)}
						className={`${basicClass} ${bgClass}`}
						onClick={() => {
							setSelected(idx);
							onSelect(thing, idx);
						}}
					>
						{thing}
					</button>
				);
			})}
		</div>
	);
}
