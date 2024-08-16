export interface Patient {
	name: string;
	age: number;
	id: number;
}

export type PatientName = Pick<Patient, "name" | "id">;

export type PatientForm = Omit<Patient, "id">;

export type PatientData = Omit<Patient, "id"> & { id: number | null };
