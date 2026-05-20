export type UserRole = 'admin' | 'sales';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface LeadsDataPayload {
  leads: Lead[];
  pagination: PaginationMetadata;
}

export interface AuthDataPayload {
  user: User;
  token: string;
}
