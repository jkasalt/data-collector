interface PatientInner {
	id: number;

	prescriptionYear: number;
	treatmentDuration: number;
	treatmentType: TreatmentType;
	prescriptionService: PrescriptionService;
	nombreDePrescriptions: number;
	name: string;
	age: number;
	weight: number;
	height: number;
	cranialPerimeter: number;
	hadEvaluationNutriState: boolean;
	diagnostic: Diagnostic;
	zScoreWeight: number;
	zScoreHeight: number;
	zScorePc: number;
	sex: string;
}

export type Patient = Required<PatientInner>;

export type PatientName = Pick<Patient, "name" | "id">;

export type PatientForm = Omit<Patient, "id">;

export type PatientData = Omit<Patient, "id"> & { id: number | null };

export type TreatmentType =
	| { type: "TailorMade" }
	| { type: "Standardized"; content: StandardizedTreatmentType };

export const STANDADIZED_TREATMENT_TYPES = [
	"Aliped",
	"Periolimel1500",
	"Aminomix",
	"SmofKabiven986",
	"SmofKabiven1477",
	"NutriflexNeoperi",
	"NutriflexOmegaSpecial",
	"Omegaflex625",
	"Omegaflex1250",
	"Omegaflex1875",
] as const;

export const STANDADIZED_TREATMENT_TYPES_OPTIONS = [
	["Aliped", "Aliped"],
	["Perilomel 1500", "Periolimel1500"],
	["Aminomix", "Aminomix"],
	["Smof Kabiven 986", "SmofKabiven986"],
	["Smof Kabiven 1477", "SmofKabiven1477"],
	["Nutriflex Neoperi", "NutriflexNeoperi"],
	["Nutriflex Omega Special", "NutriflexOmegaSpecial"],
	["Omegaflex 625", "Omegaflex625"],
	["Omegaflex 1250", "Omegaflex1250"],
	["Omegaflex 1875", "Omegaflex1875"],
].map((it) => {
	return { label: it[0], value: it[1] as StandardizedTreatmentType };
});

export type StandardizedTreatmentType =
	(typeof STANDADIZED_TREATMENT_TYPES)[number];

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
	| "Digestive"
	| "Premature"
	| "Other";

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

export const TREATMENT_TYPES = [
	{
		label: "Standadized",
		value: { type: "Standardized" } as TreatmentType,
	},
	{
		label: "Tailor Made",
		value: { type: "TailorMade" } as TreatmentType,
	},
];

export const PRESCRIPTION_SERVICES = [
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
