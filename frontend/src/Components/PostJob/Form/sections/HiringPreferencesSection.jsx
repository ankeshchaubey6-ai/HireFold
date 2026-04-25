import { useJob } from "../../../../Context/JobContext";

const HiringPreferencesSection = () => {
  const { job, setJob } = useJob(); //  use setJob

  return (
    <section className="section-surface">
      <div className="form-section">
        <div className="form-section-header">
          <h3>Hiring Preferences</h3>
          <p>
            Share any preferences or guidelines you want
            the hiring process to follow.
          </p>
        </div>

        <textarea
          rows={6}
          placeholder="Example:
 Preferred background or experience
 Interview availability
 Cultural or team fit expectations
 Any special screening instructions"
          value={job.hiringPreferences || ""}
          onChange={(e) =>
            setJob((prev) => ({
              ...prev,
              hiringPreferences: e.target.value, //  string stays string
            }))
          }
        />
      </div>
    </section>
  );
};

export default HiringPreferencesSection;

