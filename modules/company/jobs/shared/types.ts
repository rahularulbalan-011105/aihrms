export interface SkillRow {
  id: string;
  name: string;
  years: number;
}

export interface JobDetailsData {
  title: string;
  roleCategory: string;
  department: string;
  employmentType: string;
  openings: number;
  workplaceLocation: string;
  startingDate: string;
  workMode: "On-site" | "Remote" | "Hybrid";
  description: string;
  experienceRange: string;
  experienceMin: string;
  experienceMax: string;
  noticePeriod: string;
  educationQualification: string;
  industry: string;
  jobShift: string;
  applicationDeadline: string;
  jobExpiry: string;
  confidential: "Yes" | "No";
}

export interface RequirementsData {
  minExperience: number;
  experienceUnit: string;
  experienceLevel: string;
  responsibilities: string;
  skills: SkillRow[];
}

export interface CompensationData {
  salaryType: "Fixed CTC" | "Salary Range";
  currency: string;
  annualCtc: string;
  salaryMin: string;
  salaryMax: string;
  basicPay: string;
  hra: string;
  specialAllowance: string;
  otherAllowances: string;
  variablePay: string;
  joiningBonus: string;
  benefits: string[];
  otherBenefits: string;
}

export interface PreferencesStepData {
  workArrangement: "On-site" | "Remote" | "Hybrid";
  workLocation: string;
  jobShift: string;
  workingHours: string;
  timeZone: string;
  seniority: string;
  employmentTypes: string[];
  noticePeriods: string[];
  genderPreference: string;
  diversityHiring: string;
  equalOpportunity: boolean;
  additionalPreferences: string;
}

export interface JobDraft {
  details: JobDetailsData;
  requirements: RequirementsData;
  compensation: CompensationData;
  preferences: PreferencesStepData;
}

export const EMPTY_JOB: JobDraft = {
  details: {
    title: "",
    roleCategory: "",
    department: "",
    employmentType: "Full-time",
    openings: 1,
    workplaceLocation: "",
    startingDate: "",
    workMode: "On-site",
    description: "",
    experienceRange: "",
    experienceMin: "",
    experienceMax: "",
    noticePeriod: "",
    educationQualification: "",
    industry: "",
    jobShift: "",
    applicationDeadline: "",
    jobExpiry: "",
    confidential: "No",
  },
  requirements: {
    minExperience: 2,
    experienceUnit: "Years",
    experienceLevel: "Mid Level",
    responsibilities: "",
    skills: [
      { id: "1", name: "JavaScript", years: 2 },
      { id: "2", name: "React.js",   years: 2 },
      { id: "3", name: "Node.js",    years: 2 },
      { id: "4", name: "SQL",        years: 1 },
      { id: "5", name: "Git",        years: 1 },
    ],
  },
  compensation: {
    salaryType: "Fixed CTC",
    currency: "INR (₹) – Indian Rupee",
    annualCtc: "12,00,000",
    salaryMin: "",
    salaryMax: "",
    basicPay: "6,00,000",
    hra: "2,40,000",
    specialAllowance: "1,60,000",
    otherAllowances: "0",
    variablePay: "2,00,000",
    joiningBonus: "0",
    benefits: ["Health Insurance", "Provident Fund (PF)", "Performance Bonus"],
    otherBenefits: "",
  },
  preferences: {
    workArrangement: "On-site",
    workLocation: "Bengaluru, Karnataka, India",
    jobShift: "General Shift",
    workingHours: "9:00 AM - 6:00 PM",
    timeZone: "(GMT+05:30) India Standard Time (IST)",
    seniority: "Mid Level",
    employmentTypes: ["Full-time"],
    noticePeriods: ["Immediate", "15 Days", "30 Days"],
    genderPreference: "No Preference",
    diversityHiring: "Open to All",
    equalOpportunity: true,
    additionalPreferences: "",
  },
};

export type StepNum = 1 | 2 | 3 | 4;

export const JOB_STEPS: { n: StepNum; label: string }[] = [
  { n: 1, label: "Job Details" },
  { n: 2, label: "Requirements" },
  { n: 3, label: "Compensation" },
  { n: 4, label: "Review & Publish" },
];
