import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api";
import { Form } from "./Form";
import type { Patient, PatientName } from "./Patient";
import { Sidebar } from "./Sidebar";

function App() {
	const [selected, setSelected] = useState<Patient | null>(null);
	const [names, setNames] = useState<PatientName[]>([]);

	const fetchNames = useCallback(async () => {
		const namesResult = (await invoke("names").catch((err) =>
			console.error(`error: ${err}`),
		)) as PatientName[];
		setNames(namesResult);
	}, []);

	useEffect(() => {
		fetchNames();
	}, [fetchNames]);

	function handleSelectedChange(id: number) {
		invoke("get_patient", { id: id }).then((patient) =>
			setSelected(patient as Patient),
		);
	}

	return (
		<>
			<h1>Hello !!</h1>
			<div className="flex flex-row">
				<Sidebar onSelected={handleSelectedChange} patientNames={names} />
				<div className="flex-grow bg-zinc-300">
					<Form onSubmit={fetchNames} patient={selected} />
				</div>
			</div>
		</>
	);
}

export default App;
