interface PatientInner {
	id: number;

	prescriptionYear: number;
	treatmentDuration: number;
	treatmentType: TreatmentType;
	prescriptionService: PrescriptionService;
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

export type TreatmentType = "TailorMade" | "Standardized";

export type PrescriptionService =
	| "Chph"
	| "Der1"
	| "Enfc"
	| "Hadp"
	| "Hel"
	| "Nath"
	| "Pedh"
	| "Ponh"
	| "Sipi";

export const TreatmentTypes = [
	{
		label: "Standadized",
		value: "Standardized" as TreatmentType,
	},
	{
		label: "Tailor Made",
		value: "TailorMade" as TreatmentType,
	},
];

export const PrescriptionServices = [
	{ label: "Chph", value: "Chph" as PrescriptionService },
	{ label: "Der1", value: "Der1" as PrescriptionService },
	{ label: "Enfc", value: "Enfc" as PrescriptionService },
	{ label: "Hadp", value: "Hadp" as PrescriptionService },
	{ label: "Hel", value: "Hel" as PrescriptionService },
	{ label: "Nath", value: "Nath" as PrescriptionService },
	{ label: "Pedh", value: "Pedh" as PrescriptionService },
	{ label: "Ponh", value: "Ponh" as PrescriptionService },
	{ label: "Sipi", value: "Sipi" as PrescriptionService },
];
