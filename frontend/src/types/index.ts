export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  user: User;
}

export interface ResumeSkill {
  id: string;
  skill_id: string;
  skill_name: string;
  canonical_name: string;
  category: string;
  detected_as: string;
  evidence_level: "WEAK" | "MODERATE" | "STRONG";
  context_snippet?: string;
  confidence_score: number;
}

export interface Experience {
  id: string;
  company_name: string;
  job_title: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  bullet_points: string[];
  technologies: string[];
  years_duration: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  url?: string;
  bullet_points: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  gpa?: number;
  max_gpa?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string;
  issue_date?: string;
  credential_url?: string;
}

export interface ResumeSection {
  id: string;
  section_type: string;
  raw_content: string;
  section_order: number;
}

export interface ResumeListItem {
  id: string;
  title: string;
  original_filename: string;
  file_size_bytes: number;
  status: "UPLOADED" | "PROCESSING" | "COMPLETED" | "FAILED";
  error_message?: string;
  parsed_at?: string;
  created_at: string;
  skills_count: number;
  experience_count: number;
}

export interface ResumeDetail extends ResumeListItem {
  raw_text?: string;
  sections: ResumeSection[];
  skills: ResumeSkill[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}

export interface JobRequirement {
  id: string;
  requirement_type: string;
  description: string;
  weight: number;
  skill_id?: string;
  skill_name?: string;
}

export interface JobListItem {
  id: string;
  title: string;
  company?: string;
  location?: string;
  job_type: string;
  min_experience_years: number;
  target_degree?: string;
  created_at: string;
  requirements_count: number;
}

export interface JobDetail extends JobListItem {
  raw_text: string;
  requirements: JobRequirement[];
  required_skills: string[];
  preferred_skills: string[];
}

export interface SkillMatch {
  id: string;
  skill_name: string;
  requirement_type: "REQUIRED_SKILL" | "PREFERRED_SKILL";
  match_status: "EXACT_MATCH" | "SEMANTIC_MATCH" | "MISSING";
  resume_evidence_level: "NONE" | "WEAK" | "MODERATE" | "STRONG";
  resume_snippet?: string;
  similarity_score: number;
}

export interface Suggestion {
  id: string;
  suggestion_type: "MISSING_REQUIRED_SKILL" | "MISSING_PREFERRED_SKILL" | "WEAK_EVIDENCE" | "EXPERIENCE_GAP" | "FORMATTING";
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  action_category?: string;
}

export interface AnalysisDetail {
  id: string;
  resume_id: string;
  job_description_id: string;
  overall_score: number;
  required_skills_score: number;
  preferred_skills_score: number;
  experience_score: number;
  project_score: number;
  education_score: number;
  other_score: number;
  status: string;
  created_at: string;
  resume_title?: string;
  job_title?: string;
  job_company?: string;
  scoring_weights: Record<string, number>;
  explanation_summary?: string;
  detailed_breakdown?: {
    scores: Record<string, number>;
    weights: Record<string, number>;
    total_experience_years: number;
    required_skills_matched: number;
    required_skills_total: number;
    strong_evidence_count: number;
    weak_evidence_count: number;
    missing_required_count: number;
  };
  skill_matches: SkillMatch[];
  suggestions: Suggestion[];
}

export interface DashboardStats {
  total_resumes: number;
  total_jobs: number;
  total_analyses: number;
  average_match_score: number;
  highest_match_score: number;
  lowest_match_score: number;
  top_missing_skills: Array<{
    skill_name: string;
    frequency: number;
    category: string;
  }>;
  score_distribution: Array<{
    range_label: string;
    count: number;
  }>;
  recent_analyses: Array<{
    id: string;
    resume_id: string;
    job_id: string;
    resume_title: string;
    job_title: string;
    company?: string;
    overall_score: number;
    created_at: string;
  }>;
}

export interface CandidateComparisonItem {
  resume_id: string;
  resume_title: string;
  candidate_name?: string;
  overall_score: number;
  required_skills_score: number;
  preferred_skills_score: number;
  experience_score: number;
  project_score: number;
  education_score: number;
  matched_skills_count: number;
  missing_skills_count: number;
  matched_skills: string[];
  missing_skills: string[];
  experience_years: number;
  rank: number;
}

export interface CompareResponse {
  job_description_id: string;
  job_title: string;
  required_skills: string[];
  preferred_skills: string[];
  candidates: CandidateComparisonItem[];
  skill_coverage_matrix: Record<string, Record<string, boolean>>;
}
