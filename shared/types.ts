// Shared utility types used across server and client

export type AECBCategory = "VHS" | "HS" | "MS" | "LS" | "VLS";

export type LeadQuality = "hot" | "warm" | "cold";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export type UserRole = "admin" | "manager" | "agent";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type CampaignType = "whatsapp" | "email" | "sms";

export type CampaignStatus = "draft" | "scheduled" | "running" | "completed" | "paused";

export interface AECBInfo {
  score: number;
  category: AECBCategory;
  label: string;
  color: string;
}

export interface DBRInfo {
  ratio: number;
  isEligible: boolean;
  maxDBR: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}
