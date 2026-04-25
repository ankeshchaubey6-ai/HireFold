import { useJob } from "../../../Context/JobContext";

const JobPreviewCard = () => {
  const { job } = useJob();

  return (
    <div className="card">
      <h4>{job.basics.title || "Job Preview"}</h4>
      <p>{job.basics.location}</p>
      <span className="badge">
        {job.hiringModel === "ASSISTED"
          ? "Assisted Hiring"
          : "Self-Managed"}
      </span>
    </div>
  );
};

export default JobPreviewCard;
