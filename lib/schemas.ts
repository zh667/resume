import { z } from "zod";

// ========== Auth ==========

export const phoneSchema = z
  .string()
  .regex(/^1[3-9]\d{9}$/, "手机号格式错误");

export const otpSchema = z.string().regex(/^\d{6}$/, "验证码必须为 6 位数字");

export const sendOtpSchema = z.object({ phone: phoneSchema });

export const signInSchema = z.object({
  phone: phoneSchema,
  code: otpSchema,
});

// ========== ResumeContent (per TECH_SPEC §III) ==========
// All leaf fields are optional so the editor can auto-save partial state.

const dateStr = z.string().min(1); // "YYYY-MM" or "至今"

export const basicInfoSchema = z
  .object({
    name: z.string().default(""),
    phone: z.string().default(""),
    email: z.string().default(""),
    city: z.string().optional(),
    wechat: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
    birthday: z.string().optional(),
    gender: z.string().optional(),
    photoUrl: z.string().url().optional(),
  })
  .partial()
  .extend({
    name: z.string().default(""),
    phone: z.string().default(""),
    email: z.string().default(""),
  });

export const objectiveSchema = z
  .object({
    targetRole: z.string().optional(),
    targetIndustry: z.string().optional(),
    targetCity: z.string().optional(),
    expectedSalary: z.string().optional(),
    availableDate: z.string().optional(),
  })
  .partial();

export const educationItemSchema = z.object({
  id: z.string(),
  school: z.string().default(""),
  degree: z.string().default(""),
  major: z.string().default(""),
  startDate: dateStr.optional(),
  endDate: dateStr.optional(),
  gpa: z.string().optional(),
  rank: z.string().optional(),
  relevantCourses: z.array(z.string()).optional(),
  honors: z.array(z.string()).optional(),
});

export const workExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().default(""),
  position: z.string().default(""),
  department: z.string().optional(),
  startDate: dateStr.optional(),
  endDate: dateStr.optional(),
  city: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});

export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  role: z.string().default(""),
  startDate: dateStr.optional(),
  endDate: dateStr.optional(),
  techStack: z.array(z.string()).optional(),
  bullets: z.array(z.string()).default([]),
  linkUrl: z.string().url().optional(),
});

export const skillCategorySchema = z.object({
  name: z.string().default(""),
  items: z.array(z.string()).default([]),
  level: z.enum(["familiar", "proficient", "expert"]).optional(),
});

export const skillsSchema = z.object({
  categories: z.array(skillCategorySchema).default([]),
});

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  issuer: z.string().optional(),
  date: z.string().optional(),
  expiryDate: z.string().optional(),
});

export const awardItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  date: z.string().default(""),
  description: z.string().optional(),
});

export const publicationItemSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  authors: z.string().optional(),
  venue: z.string().optional(),
  date: z.string().optional(),
  url: z.string().url().optional(),
});

export const languageItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  level: z.string().default(""),
});

export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  content: z.string().default(""),
});

export const resumeContentSchema = z.object({
  basicInfo: basicInfoSchema,
  objective: objectiveSchema.optional(),
  education: z.array(educationItemSchema).default([]),
  workExperience: z.array(workExperienceItemSchema).default([]),
  projectExperience: z.array(projectItemSchema).default([]),
  skills: skillsSchema.default({ categories: [] }),
  certifications: z.array(certificationItemSchema).optional(),
  awards: z.array(awardItemSchema).optional(),
  publications: z.array(publicationItemSchema).optional(),
  languages: z.array(languageItemSchema).optional(),
  selfEvaluation: z.string().optional(),
  customSections: z.array(customSectionSchema).optional(),
});

export type ResumeContent = z.infer<typeof resumeContentSchema>;

export const emptyResumeContent: ResumeContent = {
  basicInfo: { name: "", phone: "", email: "" },
  education: [],
  workExperience: [],
  projectExperience: [],
  skills: { categories: [] },
};

// ========== API request bodies ==========

export const createResumeSchema = z.object({
  title: z.string().min(1).max(100),
  templateId: z.string().default("classic_single"),
  baseInfo: basicInfoSchema.optional(),
});

export const updateVersionSchema = z
  .object({
    name: z.string().min(1).max(100),
    templateId: z.string(),
    content: resumeContentSchema,
  })
  .partial();
