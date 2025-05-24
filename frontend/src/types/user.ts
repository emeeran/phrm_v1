// Types for user profile management
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalInfo?: {
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
  };
  avatar?: string; // Base64 string or URL
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalInfo?: {
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
  };
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}
