export interface Patient {
	name: string;
	age: number;
	id: number;
}

export type PatientName = Pick<Patient, "name" | "id">;

export type NewPatient = Omit<Patient, "id">;
