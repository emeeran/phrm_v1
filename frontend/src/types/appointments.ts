// Types for Appointment Management
export interface Appointment {
  id: string;
  title: string;
  type: AppointmentType;
  description?: string;
  familyMemberId: number;
  familyMemberName: string;
  provider: HealthProvider;
  dateTime: string;
  duration: number; // in minutes
  location: AppointmentLocation;
  status: AppointmentStatus;
  priority: Priority;
  reminderSet: boolean;
  reminderTime?: number; // minutes before appointment
  notes?: string;
  followUpRequired?: boolean;
  cost?: number;
  insuranceCovered?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentType = 
  | 'General Checkup'
  | 'Specialist Visit'
  | 'Emergency'
  | 'Dental'
  | 'Eye Exam'
  | 'Physical Therapy'
  | 'Mental Health'
  | 'Vaccination'
  | 'Laboratory'
  | 'Imaging'
  | 'Surgery'
  | 'Follow-up'
  | 'Telemedicine'
  | 'Other';

export interface HealthProvider {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  address: string;
  rating?: number;
}

export interface AppointmentLocation {
  type: 'In-Person' | 'Telemedicine' | 'Home Visit';
  address?: string;
  room?: string;
  meetingLink?: string;
  platform?: string; // Zoom, Teams, etc.
}

export type AppointmentStatus = 
  | 'Scheduled'
  | 'Confirmed'
  | 'Cancelled'
  | 'Completed'
  | 'No-Show'
  | 'Rescheduled';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

// Form interfaces
export interface AppointmentFormData {
  title: string;
  type: AppointmentType;
  description: string;
  familyMemberId: number | '';
  provider: HealthProvider;
  dateTime: string;
  duration: number;
  location: AppointmentLocation;
  priority: Priority;
  reminderSet: boolean;
  reminderTime: number;
  notes: string;
  followUpRequired: boolean;
  cost: number;
  insuranceCovered: boolean;
}

export interface CreateAppointmentRequest {
  appointment: Omit<AppointmentFormData, 'provider'> & {
    providerId: string;
  };
}

export interface UpdateAppointmentRequest {
  id: string;
  appointment: Partial<AppointmentFormData>;
}

export interface AppointmentFilters {
  familyMemberId?: number;
  status?: AppointmentStatus;
  type?: AppointmentType;
  priority?: Priority;
  dateRange?: {
    start: string;
    end: string;
  };
  provider?: string;
}

// Calendar view interfaces
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  textColor: string;
  extendedProps: {
    appointment: Appointment;
  };
}

export interface AppointmentSummary {
  total: number;
  upcoming: number;
  today: number;
  thisWeek: number;
  overdue: number;
  byStatus: Record<AppointmentStatus, number>;
  byType: Record<AppointmentType, number>;
}
