import type { PatientName } from "./Patient";
import { SidebarElt } from "./SidebarElt";

interface SidebarProps {
	className?: string;
	onNew: () => void;
	onSelected: (n: number) => void;
	selectedId?: number | null;
	patientNames: PatientName[];
}

export function Sidebar({
	className = "",
	onNew,
	onSelected,
	patientNames,
	selectedId,
}: SidebarProps) {
	const newItem = (
		<SidebarElt
			className="max-w-full text-6xl"
			isSelected={selectedId === undefined || selectedId === null}
			content="+"
			index={-1}
			onClick={onNew}
			key={"new-1"}
		/>
	);

	const normalItems = patientNames.map(({ id, name }, index) => (
		<SidebarElt
			className="max-w-full"
			isSelected={selectedId === id}
			content={name}
			index={index}
			onClick={() => onSelected(id)}
			key={`${name}${id}`}
		/>
	));

	const allItems = [newItem, ...normalItems];

	// TODO: If an element overflows, the content of the sidebar looks shifted to the left
	return (
		<div className={`flex justify-center items-center ${className}`}>
			<nav className="flex flex-col p-4 max-w-full h-screen">
				<ul>{allItems}</ul>
			</nav>
		</div>
	);
}
