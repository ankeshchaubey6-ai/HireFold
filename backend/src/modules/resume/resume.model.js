import mongoose from "mongoose";

/* =========================================================
   SIMPLIFIED HIREFOLD RESUME SCHEMA
   Removed pre-save hooks to fix "next is not a function" error
========================================================= */

const BasicsSchema = new mongoose.Schema({
  fullName: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" }
}, { _id: false });

const SkillItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  confidence: { type: Number, default: 0.9 }
}, { _id: false });

const SkillCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  count: { type: Number, default: 0 },
  items: [SkillItemSchema]
}, { _id: false });

const DurationSchema = new mongoose.Schema({
  start: { type: Number, default: null },
  end: { type: Number, default: null },
  months: { type: Number, default: 0 },
  raw: { type: String, default: "" }
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, default: "" },
  company: { type: String, default: "" },
  duration: { type: DurationSchema, default: () => ({}) },
  description: [String],
  achievements: [String]
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  degree: { type: String, default: "" },
  field: { type: String, default: "" },
  institution: { type: String, default: "" },
  year: { type: Number, default: null },
  level: { type: Number, default: null },
  raw: { type: String, default: "" }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  techStack: [String],
  complexity: { type: String, enum: ["low", "medium", "high"], default: "low" },
  description: { type: String, default: "" },
  impact: { type: String, default: "" },
  duration: { type: Number, default: null }
}, { _id: false });

const CertificationSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  issuer: { type: String, default: "" },
  year: { type: Number, default: null }
}, { _id: false });

const FeatureNormalizedSchema = new mongoose.Schema({
  skillsNorm: { type: Number, default: 0 },
  experienceNorm: { type: Number, default: 0 },
  educationNorm: { type: Number, default: 0 },
  projectsNorm: { type: Number, default: 0 }
}, { _id: false });

const FeaturesSchema = new mongoose.Schema({
  totalSkills: { type: Number, default: 0 },
  skillCounts: { type: mongoose.Schema.Types.Mixed, default: {} },
  skillDiversity: { type: Number, default: 0 },
  experienceCount: { type: Number, default: 0 },
  totalExperienceMonths: { type: Number, default: 0 },
  averageExperienceMonths: { type: Number, default: 0 },
  educationCount: { type: Number, default: 0 },
  highestEducationLevel: { type: Number, default: 0 },
  hasAdvancedDegree: { type: Boolean, default: false },
  projectCount: { type: Number, default: 0 },
  highComplexProjects: { type: Number, default: 0 },
  projectTechDiversity: { type: Number, default: 0 },
  certificationCount: { type: Number, default: 0 },
  wordCount: { type: Number, default: 0 },
  sectionCount: { type: Number, default: 0 },
  textComplexity: { type: String, enum: ["low", "medium", "high"], default: "low" },
  normalized: { type: FeatureNormalizedSchema, default: () => ({}) }
}, { _id: false });

const StructuredDataSchema = new mongoose.Schema({
  rawText: { type: String, default: "" },
  basics: { type: BasicsSchema, default: () => ({}) },
  summary: { type: String, default: "" },
  skills: [SkillCategorySchema],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  projects: [ProjectSchema],
  certifications: [CertificationSchema],
  features: { type: FeaturesSchema, default: () => ({}) },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const ATSSchema = new mongoose.Schema({
  score: { type: Number, default: null },
  engine: { type: String, default: "hirefold-ats-v2.0" },
  jobRole: { type: String, default: "default" },
  evaluatedAt: { type: Number, default: null },
  breakdown: { type: mongoose.Schema.Types.Mixed, default: null },
  rawMetrics: { type: mongoose.Schema.Types.Mixed, default: null }
}, { _id: false });

const OriginalFileMetaSchema = new mongoose.Schema({
  fileName: { type: String, default: null },
  fileSize: { type: Number, default: null },
  mimeType: { type: String, default: null },
  cloudUrl: { type: String, default: null },
  cloudPublicId: { type: String, default: null },
  uploadedAt: { type: Number, default: null }
}, { _id: false });

const ResumeMetaSchema = new mongoose.Schema({
  schema: { type: String, default: "resume-entity-v4" },
  createdFrom: { type: String, default: "builder" },
  isAnonymous: { type: Boolean, default: false }
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  resumeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    default: "anonymous",
    index: true
  },
  title: {
    type: String,
    default: "Untitled Resume"
  },
  source: {
    type: String,
    enum: ["builder", "upload", "import"],
    default: "builder"
  },
  templateId: {
    type: String,
    default: null
  },
  isEditable: {
    type: Boolean,
    default: true
  },
  isDraft: {
    type: Boolean,
    default: true
  },
  structuredData: {
    type: StructuredDataSchema,
    default: () => ({})
  },
  atsScore: {
    type: Number,
    default: null
  },
  ats: {
    type: ATSSchema,
    default: null
  },
  snapshotHtml: {
    type: String,
    default: null
  },
  snapshotCss: {
    type: String,
    default: null
  },
  originalFileMeta: {
    type: OriginalFileMetaSchema,
    default: null
  },
  meta: {
    type: ResumeMetaSchema,
    default: () => ({})
  },
  createdAt: {
    type: Number,
    default: () => Date.now()
  },
  updatedAt: {
    type: Number,
    default: () => Date.now()
  }
}, {
  versionKey: false,
  collection: "resumes"
});

// NO PRE-SAVE HOOKS - REMOVED COMPLETELY

// Indexes
resumeSchema.index({ userId: 1, updatedAt: -1 });
resumeSchema.index({ userId: 1, isDraft: 1 });
resumeSchema.index({ atsScore: -1 });

// Virtual properties
resumeSchema.virtual("isAnalyzed").get(function() {
  return this.atsScore !== null && this.atsScore !== undefined;
});

resumeSchema.set("toJSON", { virtuals: true });
resumeSchema.set("toObject", { virtuals: true });

export const ResumeModel = mongoose.model("Resume", resumeSchema);