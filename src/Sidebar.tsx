import type { PatientName } from "./Patient";
import { SidebarElt } from "./SidebarElt";

interface SidebarProps {
	onSelected: (n: number) => void;
	patientNames: PatientName[];
}

export function Sidebar({ onSelected, patientNames }: SidebarProps) {
	const handleSelected = (n: number) => {
		onSelected(n);
	};

	const handleNew = () => {
		// TODO
		console.log("NEW");
	};

	const newItem = (
		<SidebarElt
			className="text-6xl"
			content="+"
			index={-1}
			onClick={handleNew}
			key={"new-1"}
		/>
	);

	const normalItems = patientNames.map(({ id, name }, index) => (
		<SidebarElt
			content={name}
			index={index}
			onClick={() => handleSelected(id)}
			key={`${name}${id}`}
		/>
	));

	const allItems = [newItem, ...normalItems];

	return (
		<div className="flex justify-center items-center bg-gray-700 border-gray-700">
			<nav className="flex flex-col p-4">
				<ul>{allItems}</ul>
			</nav>
		</div>
	);
}
