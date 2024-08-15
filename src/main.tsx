import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// biome-ignore lint/style/noNonNullAssertion: it's up to react
const root = document.getElementById("root")!;
root.className = "bg-zinc-200";
ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
