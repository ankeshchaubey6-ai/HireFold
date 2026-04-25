import React from "react";

const JobFilters = () => {
  return (
    <div className="job-filters">
      <select className="job-filter">
        <option>Location</option>
        <option>Remote</option>
        <option>Bangalore</option>
        <option>Hyderabad</option>
      </select>

      <select className="job-filter">
        <option>Job Type</option>
        <option>Full Time</option>
        <option>Part Time</option>
        <option>Contract</option>
      </select>

      <select className="job-filter">
        <option>Experience</option>
        <option>Junior</option>
        <option>Mid</option>
        <option>Senior</option>
      </select>
    </div>
  );
};

export default JobFilters;
