import { type FormEvent, useCallback, useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api";
import { Form } from "./Form";
import type { Patient, PatientData, PatientForm, PatientName } from "./Patient";
import { Sidebar } from "./Sidebar";

const DEFAULT_PATIENT: Readonly<PatientData> = {
	name: "",
	age: 0,
	id: null,
};

function App() {
	const [selected, setSelected] = useState<PatientData>(DEFAULT_PATIENT);
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
		console.log("clicked 2");
		invoke("get_patient", { id: id }).then((patient) => {
			console.log(patient);
			setSelected(patient as Patient);
		});
	}

	function formData(): PatientForm {
		const { id, ...formData } = selected;
		return formData;
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (selected.id) {
			// TODO: update patient
			invoke("update", {
				patient: selected,
			});
		} else {
			invoke("save", {
				newPatient: { name: selected.name, age: selected.age },
			})
				.catch((err) => console.error(err))
				.then(() => fetchNames());
		}
	}

	function handleFormChange({ name, age }: PatientForm) {
		setSelected({ name, age, id: selected.id });
	}

	return (
		<>
			<h1>Hello !!</h1>
			<div className="flex flex-row">
				<Sidebar
					onNew={() => setSelected(DEFAULT_PATIENT)}
					onSelected={handleSelectedChange}
					patientNames={names}
				/>
				<div className="flex-grow bg-zinc-300">
					<Form
						onSubmit={handleSubmit}
						onFormChange={handleFormChange}
						patient={formData()}
					/>
				</div>
			</div>
		</>
	);
}

export default App;
