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
	diagnostic: Diagnostic;
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

export type DiagnosticType =
	| "ChromosomicSyndrome"
	| "Respiratory"
	| "Cardiac"
	| "Snc"
	| "Urologic"
	| "MetabolicIllness"
	| "Digestive";

export type CardiacDiagnostic = "Cyanogenic" | "Other";

export type SncDiagnostic = "Malformative" | "Aquired" | "Trauma";

export type Diagnostic =
	| { t: "ChromosomicSyndrome"; c: string }
	| { t: "Respiratory"; c: boolean }
	| { t: "Cardiac"; c: CardiacDiagnostic }
	| { t: "Snc"; c: SncDiagnostic }
	| { t: "Urologic" }
	| { t: "MetabolicIllness" }
	| { t: "Digestive"; c: string }
	| { t: "Premature"; c: string }
	| { t: "Other"; c: string };

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
	{ label: "CHPH", value: "Chph" as PrescriptionService },
	{ label: "DER1", value: "Der1" as PrescriptionService },
	{ label: "ENFC", value: "Enfc" as PrescriptionService },
	{ label: "HADP", value: "Hadp" as PrescriptionService },
	{ label: "HEL", value: "Hel" as PrescriptionService },
	{ label: "NATH", value: "Nath" as PrescriptionService },
	{ label: "PEDH", value: "Pedh" as PrescriptionService },
	{ label: "PONH", value: "Ponh" as PrescriptionService },
	{ label: "SIPI", value: "Sipi" as PrescriptionService },
];
