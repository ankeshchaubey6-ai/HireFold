const UploadResumeCard = ({ onUpload }) => {
  return (
    <div className="resume-action-card" onClick={onUpload}>
      <h3>Upload Resume</h3>
      <p>Upload an existing resume to analyze</p>
    </div>
  );
};

export default UploadResumeCard;
