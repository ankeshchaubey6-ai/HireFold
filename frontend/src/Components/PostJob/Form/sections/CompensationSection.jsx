import { useJob } from "../../../../Context/JobContext";
import Switcher2 from "../../../Common/Switcher2";

const CompensationSection = () => {
  const { job, updateSection } = useJob();
  const { compensation } = job;

  const updateComp = (data) =>
    updateSection("compensation", data);

  return (
    <section className="section-surface">
      <div className="form-section">
        <div className="form-section-header">
          <h3>Compensation</h3>
          <p>Salary, bonuses and equity</p>
        </div>

        {/* ROW 1: MIN / MAX */}
        <div className="form-grid">
          <input
            type="number"
            placeholder="Min Salary"
            value={compensation.min}
            onChange={(e) =>
              updateComp({ min: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Max Salary"
            value={compensation.max}
            onChange={(e) =>
              updateComp({ max: e.target.value })
            }
          />
        </div>

        {/* ROW 2: PAY FREQUENCY / BONUS */}
        <div className="form-grid">
          <select
            value={compensation.frequency}
            onChange={(e) =>
              updateComp({ frequency: e.target.value })
            }
          >
            <option value="">Pay Frequency</option>
            <option value="Yearly">Yearly</option>
            <option value="Monthly">Monthly</option>
            <option value="Hourly">Hourly</option>
          </select>

          <input
            placeholder="Bonus Structure (e.g. 10% yearly)"
            value={compensation.bonus || ""}
            onChange={(e) =>
              updateComp({ bonus: e.target.value })
            }
          />
        </div>

        {/* BOTTOM TOGGLES */}
        <div className="compensation-toggle-row">
          <div className="toggle-item">
            <span>Display salary to candidates</span>
            <Switcher2
              checked={compensation.showPublicly}
              onChange={(e) =>
                updateComp({
                  showPublicly: e.target.checked,
                })
              }
            />
          </div>

          <div className="toggle-item">
            <span>Equity / ESOP offered</span>
            <Switcher2
              checked={compensation.hasEquity || false}
              onChange={(e) =>
                updateComp({
                  hasEquity: e.target.checked,
                })
              }
            />
          </div>
        </div>

        {/* CONDITIONAL EQUITY FIELDS */}
        {compensation.hasEquity && (
          <div className="form-grid">
            <input
              placeholder="Equity Range (%)"
              value={compensation.equityRange || ""}
              onChange={(e) =>
                updateComp({ equityRange: e.target.value })
              }
            />

            <input
              placeholder="Vesting Period (years)"
              value={compensation.vestingPeriod || ""}
              onChange={(e) =>
                updateComp({
                  vestingPeriod: e.target.value,
                })
              }
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CompensationSection;
