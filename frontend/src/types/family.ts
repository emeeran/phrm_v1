// Types for family member management
export interface FamilyMember {
  id: number;
  userId: number;
  fullName: string;
  relationType: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  emergencyContact: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  healthRecords?: HealthRecord[];
  medications?: Medication[];
  appointments?: Appointment[];
}

export interface FamilyMemberCreate {
  fullName: string;
  relationType: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  emergencyContact?: boolean;
  notes?: string;
}

export interface FamilyMemberUpdate {
  fullName?: string;
  relationType?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  emergencyContact?: boolean;
  notes?: string;
}

export interface HealthRecord {
  id: number;
  familyMemberId: number;
  recordType: string;
  title: string;
  description?: string;
  dateRecorded: string;
  doctorName?: string;
  hospitalClinic?: string;
  severity?: string;
  status?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecordCreate {
  recordType: string;
  title: string;
  description?: string;
  dateRecorded: string;
  doctorName?: string;
  hospitalClinic?: string;
  severity?: string;
  status?: string;
  notes?: string;
}

export interface Medication {
  id: number;
  familyMemberId: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  purpose?: string;
  sideEffects?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationCreate {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  purpose?: string;
  sideEffects?: string;
  isActive?: boolean;
  notes?: string;
}

export interface Appointment {
  id: number;
  familyMemberId: number;
  title: string;
  doctorName?: string;
  hospitalClinic?: string;
  appointmentDate: string;
  appointmentType?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentCreate {
  title: string;
  doctorName?: string;
  hospitalClinic?: string;
  appointmentDate: string;
  appointmentType?: string;
  status?: string;
  notes?: string;
}
