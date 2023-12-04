const ProgressRangeBar = ({ value, onChange }) => {
  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  return (
    <div>
      <input
        type="range"
        id="myRange"
        min="0"
        max="300"
        value={value}
        onChange={handleSliderChange}
        className="cursorPtr"
      />
      <style >{`
      #myRange {
        background: red;
        accent-color: var(--l_base);
        border-radius: 8px;
        height: 3px;
        outline: none;
        transition: background 450ms ease-in;
      }

      `}</style>
    </div>
  );
};

export default ProgressRangeBar;