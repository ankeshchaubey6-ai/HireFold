import resumeSanitizer from "./resumeSanitizer";
import resumeSchema from "./resumeSchema";

const dummyResume = resumeSanitizer({
  ...resumeSchema,
  meta: {
    ...resumeSchema.meta,
    targetTemplate: "Modern01",
    accentColor: "#111827",
  },
});

export default dummyResume;

