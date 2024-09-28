import type { PatientName } from "./Patient";
import { SidebarElt } from "./SidebarElt";

interface SidebarProps {
	onNew: () => void;
	onSelected: (n: number) => void;
	selectedId?: number | null;
	patientNames: PatientName[];
}

export function Sidebar({
	onNew,
	onSelected,
	patientNames,
	selectedId,
}: SidebarProps) {
	const newItem = (
		<SidebarElt
			className="text-6xl"
			isSelected={selectedId === undefined || selectedId === null}
			content="+"
			index={-1}
			onClick={onNew}
			key={"new-1"}
		/>
	);

	const normalItems = patientNames.map(({ id, name }, index) => (
		<SidebarElt
			isSelected={selectedId === id}
			content={name}
			index={index}
			onClick={() => onSelected(id)}
			key={`${name}${id}`}
		/>
	));

	const allItems = [newItem, ...normalItems];

	return (
		<div className="flex justify-center items-center">
			<nav className="flex flex-col p-4">
				<ul>{allItems}</ul>
			</nav>
		</div>
	);
}
