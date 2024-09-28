interface SidebarEltProps {
	content: string;
	index: number;
	onClick: (index: number) => void;
	className?: string;
	isSelected?: boolean;
}

export function SidebarElt({
	content,
	index,
	onClick,
	className = "",
	isSelected = false,
}: SidebarEltProps) {
	return (
		<li>
			<button
				type="button"
				className={`p-2 my-2 text-gray-400 min-w-[120px] rounded hover:text-white hover:bg-gray-950 ${className} ${isSelected ? "text-white bg-gray-950" : ""}`}
				onClick={() => {
					console.log("clicked 1");
					onClick(index);
				}}
				onKeyUp={() => onClick(index)}
			>
				{content}
			</button>
		</li>
	);
}
