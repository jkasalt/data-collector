interface PatientInner {
	id: number;

	prescriptionYear: number;
	treatmentDuration: number;
	treatmentType: "TailorMade" | "Standardized";
	prescriptionService:
		| "Chph"
		| "Der1"
		| "Enfc"
		| "Hadp"
		| "Hel"
		| "Nath"
		| "Pedh"
		| "Ponh"
		| "Sipi";

	name: string;
	age: number;
	weight: number;
	height: number;
	cranialPerimeter: number;
	hadEvaluationNutriState: boolean;
	zScore: number;
}

export type Patient = Required<PatientInner>;

export type PatientName = Pick<Patient, "name" | "id">;

export type PatientForm = Omit<Patient, "id">;

export type PatientData = Omit<Patient, "id"> & { id: number | null };
