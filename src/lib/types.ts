export type Language = 'en' | 'te';

export interface User {
  id: number;
  email: string;
  role: 'citizen' | 'admin';
  preferred_language: Language;
  created_at: string;
  has_profile: boolean;
}

export interface UserProfile {
  id?: number;
  user_id?: number;
  age?: number | null;
  gender?: string | null;
  state?: string | null;
  district?: string | null;
  occupation?: string | null;
  education_level?: string | null;
  income_range?: string | null;
  annual_income?: number | null;
  social_category?: string | null;
  is_student?: boolean;
  is_farmer?: boolean;
  is_differently_abled?: boolean;
  has_agricultural_land?: boolean;
  family_size?: number | null;
  updated_at?: string;
}

export interface SchemeFAQ {
  question: string;
  answer: string;
}

export interface Scheme {
  id: number;
  slug: string;
  name: string;
  name_te?: string;
  category: string;
  government_level: 'Central' | 'State';
  state_scope: string;
  department: string;
  department_te?: string;
  description: string;
  description_te?: string;
  benefit_description: string;
  benefit_description_te?: string;
  estimated_benefit_amount?: number;
  official_url: string;
  application_url: string;
  eligibility_rules: {
    min_age?: number;
    max_age?: number;
    max_annual_income?: number;
    eligible_states?: string[];
    eligible_occupations?: string[];
    eligible_education?: string[];
    eligible_genders?: string[];
    eligible_categories?: string[];
    requires_student?: boolean;
    requires_farmer?: boolean;
    requires_agricultural_land?: boolean;
    requires_differently_abled?: boolean;
    special_conditions?: string[];
  };
  required_documents: string[];
  exclusion_rules: string[];
  faqs: SchemeFAQ[];
  start_date?: string;
  end_date?: string;
  source_url: string;
  last_verified_at: string;
  verification_status: 'verified' | 'unverified' | 'draft';
  is_active: boolean;
}

export interface SchemeMatchResult {
  scheme: Scheme;
  eligibility_status: 'Likely eligible' | 'Possibly eligible' | 'Not eligible' | 'Insufficient information';
  relevance_score: number;
  matched_criteria: string[];
  failed_criteria: string[];
  missing_fields: string[];
  summary_explanation: string;
  official_application_url: string;
  verification_date: string;
}

export interface SavedScheme {
  id: number;
  user_id: number;
  scheme_id: number;
  saved_at: string;
  scheme: Scheme;
}

export type TrackerStatus =
  | 'INTERESTED'
  | 'CHECKING_ELIGIBILITY'
  | 'DOCUMENTS_PREPARED'
  | 'READY_TO_APPLY'
  | 'APPLIED'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_FOLLOW_UP';

export interface TrackerItem {
  id: number;
  user_id: number;
  scheme_id: number;
  status: TrackerStatus;
  notes?: string;
  target_deadline?: string;
  updated_at: string;
  scheme: Scheme;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  cited_schemes?: Scheme[];
  follow_up_suggestions?: string[];
}
