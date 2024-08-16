interface SidebarEltProps {
	content: string;
	index: number;
	onClick: (index: number) => void;
	className?: string;
}

export function SidebarElt({
	content,
	index,
	onClick,
	className = "",
}: SidebarEltProps) {
	return (
		<a href="#hello">
			<li
				className={`p-2 my-2 text-gray-400 rounded hover:text-white hover:bg-gray-950 ${className}`}
				onClick={() => {
					console.log("clicked 1");
					onClick(index);
				}}
				onKeyUp={() => onClick(index)}
			>
				{content}
			</li>
		</a>
	);
}
