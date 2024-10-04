import { type FormEvent, useCallback, useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api";
import { Dropdown } from "./Dropdown";
import type { Patient, PatientData, PatientForm, PatientName } from "./Patient";
import { Sidebar } from "./Sidebar";
import { Form } from "./Form";

const DEFAULT_PATIENT: Readonly<PatientData> = {
	name: "",
	age: 0,
	id: null,
	prescriptionYear: 0,
	treatmentDuration: 0,
	treatmentType: "TailorMade",
	prescriptionService: "Chph",

	weight: 0,
	height: 0,
	cranialPerimeter: 0,
	hadEvaluationNutriState: false,
	zScore: 0,
	diagnostic: { t: "Digestive", c: "" },
};

function App() {
	const [selectedPatient, setSelectedPatient] =
		useState<PatientData>(DEFAULT_PATIENT);
	const [names, setNames] = useState<PatientName[]>([]);
	const [years, setYears] = useState<number[]>([]);

	const fetchNames = useCallback(async (by_year?: number | null) => {
		const toInvoke = by_year ? "get_by_prescription_year" : "names";
		const args = by_year ? { prescriptionYear: by_year } : undefined;

		const namesResult = (await invoke(toInvoke, args).catch((err) => {
			console.error(err);
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
		const { id, ...formData } = selectedPatient;
		return formData;
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const id = selectedPatient.id;
		const toInvoke = id !== undefined && id !== null ? "update" : "save";
		console.log({ patient: selectedPatient });
		invoke(toInvoke, { patient: selectedPatient })
			.catch((err) => console.error(err))
			.then(() => {
				fetchNames();
				fetchYears();
				setSelectedPatient(DEFAULT_PATIENT);
			});
	}

	function handleFormChange(patientForm: PatientForm) {
		setSelectedPatient({ id: selectedPatient.id, ...patientForm });
	}

	return (
		<>
			<div className="flex flex-row">
				<div className="flex flex-col p-4 bg-gray-700 border-gray-700 max-w-[150px]">
					<Dropdown items={years} onChange={fetchNames} />
					<Sidebar
						className="overflow-y-auto overflow-x-visible"
						onNew={() => setSelectedPatient(DEFAULT_PATIENT)}
						onSelected={handleSelectedChange}
						selectedId={selectedPatient.id}
						patientNames={names}
					/>
				</div>
				<div className="flex-1 bg-zinc-200">
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
