import type { Education } from "../../../types/auth.types";

/* ── Modal Form Data Interfaces ── */
export interface EducationFormData {
  degree: string;
  specialization: string;
  institution: string;
  location: string;
  yearOfPassing: string;
  grade: string;
  educationType: string;
  description: string;
}

export interface ExperienceFormData {
  company: string;
  employmentType: string;
  totalExperience: string;
  jobTitle: string;
  location: string;
  noticePeriod: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface ProjectForm {
  title: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: string[];
  skillInput: string;
}

export interface CertificationFormData {
  name: string;
  institution: string;
  credentialId: string;
  certificateUrl: string;
  passedYear: string;
  validTillMonth: string;
  validTillYear: string;
  doesNotExpire: boolean;
  description: string;
  displayOnProfile: boolean;
}

/* ── Preferences Form Data ── */
export interface PreferencesData {
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

/* ── Modal State Types ── */
export interface EduModalState {
  open: boolean;
  editId?: string;
  initialData?: Partial<Education>;
}

export interface ConfirmState {
  open: boolean;
  label: string;
  onConfirm: () => Promise<void>;
}
