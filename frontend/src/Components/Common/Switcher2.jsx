import React from "react";

const Switcher2 = ({ checked, onChange }) => {
  return (
    <label className="hf-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hf-switch-input"
      />

      <span className="hf-switch-track">
        <span
          className={`hf-switch-thumb ${
            checked ? "hf-switch-thumb--on" : ""
          }`}
        />
      </span>
    </label>
  );
};

export default Switcher2;
