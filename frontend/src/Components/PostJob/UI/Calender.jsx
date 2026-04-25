import dayjs from "dayjs";
import "@/miniCalendar.css";

const MiniCalendar = ({ selected, onSelect }) => {
  const today = dayjs();
  const start = today.startOf("month");
  const daysInMonth = today.daysInMonth();

  const selectedDay = selected ? dayjs(selected) : null;

  return (
    <div className="hf-calendar">
      <div className="hf-calendar-header">
        {today.format("MMMM YYYY")}
      </div>

      <div className="hf-calendar-grid">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = start.add(i, "day");
          const isSelected =
            selectedDay && date.isSame(selectedDay, "day");

          return (
            <button
              key={i}
              className={`hf-calendar-day ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => onSelect(date.toDate())}
            >
              {date.date()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
