import { type FormEvent, useCallback, useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api";
import { Form } from "./Form";
import type { Patient, PatientData, PatientForm, PatientName } from "./Patient";
import { Sidebar } from "./Sidebar";
import { Dropdown } from "./Dropdown";

const DEFAULT_PATIENT: Readonly<PatientData> = {
	name: "",
	age: 0,
	id: null,
	prescription_year: 0,
};

function App() {
	const [selectedPatieent, setSelectedPatient] =
		useState<PatientData>(DEFAULT_PATIENT);
	const [names, setNames] = useState<PatientName[]>([]);
	const [years, setYears] = useState<number[]>([]);

	const fetchNames = useCallback(async (by_year?: number | null) => {
		const toInvoke = by_year ? "get_by_prescription_year" : "names";
		const args = by_year ? { prescriptionYear: by_year } : undefined;

		const namesResult = (await invoke(toInvoke, args).catch((err) => {
			console.error(`error: ${err}`);
			return [];
		})) as PatientName[];

		setNames(namesResult);
	}, []);

	const fetchYears = useCallback(async () => {
		const yearsResult = (await invoke("prescription_years").catch((err) =>
			console.error(err),
		)) as number[];
		setYears(yearsResult);
	}, []);

	useEffect(() => {
		fetchNames();
		fetchYears();
	}, [fetchNames, fetchYears]);

	function handleSelectedChange(id: number) {
		console.log("clicked 2");
		invoke("get_patient", { id: id }).then((patient) => {
			console.log(patient);
			setSelectedPatient(patient as Patient);
		});
	}

	function formData(): PatientForm {
		const { id, ...formData } = selectedPatieent;
		return formData;
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (selectedPatieent.id) {
			invoke("update", {
				patient: selectedPatieent,
			});
		} else {
			invoke("save", {
				patient: {
					name: selectedPatieent.name,
					age: selectedPatieent.age,
					prescription_year: selectedPatieent.prescription_year,
				},
			})
				.catch((err) => console.error(err))
				.then(() => {
					fetchNames();
					fetchYears();
				});
		}
	}

	function handleFormChange({ name, age, prescription_year }: PatientForm) {
		setSelectedPatient({
			name,
			age,
			prescription_year,
			id: selectedPatieent.id,
		});
	}

	return (
		<>
			<div className="flex flex-row">
				<div className="flex flex-col p-4 bg-gray-700 border-gray-700">
					<Dropdown items={years} onChange={fetchNames} />
					<Sidebar
						onNew={() => setSelectedPatient(DEFAULT_PATIENT)}
						onSelected={handleSelectedChange}
						patientNames={names}
					/>
				</div>
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
