import { BloodGroup } from "@/lib/constants/bloodGroups";

export type UserRole = "donor" | "requester" | "admin";
export type RequestStatus = "open" | "locked" | "completed" | "expired" | "cancelled";
export type ResponseStatus = "pending" | "accepted" | "declined";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Donor {
  id: string;
  profile_id: string;
  blood_group: BloodGroup;
  is_available: boolean;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  } | null;
  latitude?: number;
  longitude?: number;
  address_text: string;
  last_donation_date: string | null;
  cooldown_ends_at: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  profile?: Profile;
  distance_km?: number;
}

export interface BloodRequest {
  id: string;
  requester_id: string;
  patient_name: string;
  contact_number: string;
  blood_group: BloodGroup;
  units_needed: number;
  hospital_name: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  } | null;
  latitude: number;
  longitude: number;
  address_text?: string;
  needed_by: string;
  deadline: string;
  current_stage: number; // 0, 1, 2, 3
  current_radius_km: number; // 3, 5, 10
  stage_duration_seconds: number;
  stage_started_at: string;
  status: RequestStatus;
  single_donor: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  requester?: Profile;
  responses_count?: number;
  accepted_donor?: {
    donor_id: string;
    full_name: string;
    phone: string;
    blood_group: BloodGroup;
  };
}

export interface DonorResponse {
  id: string;
  request_id: string;
  donor_id: string;
  status: ResponseStatus;
  responded_at: string;
  notes?: string | null;
  // Joined fields
  donor?: Donor;
  request?: BloodRequest;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "stage_expansion" | "request_locked" | "request_expired" | "donation_confirmed" | "emergency_alert" | "system";
  link?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface DonationHistory {
  id: string;
  request_id: string;
  donor_id: string;
  requester_id: string;
  units_donated: number;
  donation_date: string;
  hospital_name: string;
  notes?: string | null;
  created_at: string;
  // Joined fields
  donor?: Donor;
  request?: BloodRequest;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id?: string | null;
  details?: Record<string, unknown>;
  created_at: string;
  admin?: Profile;
}
