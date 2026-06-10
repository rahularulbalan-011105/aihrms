export type UserRole = 'candidate' | 'recruiter';

export interface LoginPayload {
  role: UserRole;
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  token: string;
}

/* ── Candidate Registration ── */

export interface Education {
  id: string;
  degree: string;
  institution: string;
  specialization: string;
  location: string;
  yearOfPassing: string;
  grade: string;
  educationType: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  startDate: string;
  endDate: string;
  teamSize: string;
  technologies: string[];
}

export interface Experience {
  id: string;
  company: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  totalExperience: string;
  jobTitle: string;
  location: string;
  noticePeriod: string;
  expanded: boolean;
  projects: Project[];
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  credentialId?: string;
  certificateUrl?: string;
  passedYear: string;
  validTill: string;
  doesNotExpire: boolean;
  description?: string;
  displayOnProfile: boolean;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: string;       // Beginner | Intermediate | Advanced | Expert | Master
  experienceValue: string;   // "5"
  experienceUnit: string;    // "Years" | "Months"
  lastUsed: string;          // "May 2024"
  yearsOfExperience: number; // 0–10 (slider)
  highlighted: boolean;      // Top Skill
  additionalDetails?: string;
}

export interface CandidateRegStep1Data {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  currentLocation: string;
  hearAboutUs: string;
  acceptTerms: boolean;
}

export interface CandidateRegStep2Data {
  education: Education[];
  experience: Experience[];
}

export interface CandidateRegStep3Data {
  skills: Skill[];
  certifications: Certification[];
  noticePeriod: string;
  expectedSalary: string;
  salaryType: string;
  jobRolePreferences: string[];
  preferredLocation: string;
  openToRelocate: boolean;
  employmentTypes: string[];
  benefits: string[];
  additionalNotes: string;
}

export interface CandidateRegData {
  step1: CandidateRegStep1Data;
  step2: CandidateRegStep2Data;
  step3: CandidateRegStep3Data;
}
