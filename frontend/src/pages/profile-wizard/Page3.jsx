import React, { useState } from 'react';
import { Tooltip } from '@mui/material';

export default function Page3({ value, onBack, onFinish }) {
  const [community, setCommunity] = useState(value.community || '');
  const [fileName, setFileName] = useState(value.resumeFileName || '');
  const [dataUrl, setDataUrl] = useState(value.resumeDataUrl || '');

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => setDataUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const inputClass = "w-full mb-3 p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onFinish({ community, resumeFileName: fileName, resumeDataUrl: dataUrl }); }}>
      <label className="block mb-2">Community identities</label>
      <Tooltip title="Your community identities (e.g., LGBTQ+, First-gen)" arrow>
        <input
          className={inputClass}
          value={community}
          onChange={e => setCommunity(e.target.value)}
        />
      </Tooltip>

      <label className="block mb-2">Upload resume</label>
      <Tooltip title="Upload a PDF resume (optional)" arrow>
        <input
          type="file"
          accept="application/pdf"
          onChange={e => handleFile(e.target.files[0])}
          className="mb-3"
        />
      </Tooltip>

      {fileName && <div className="mb-3 ps-selected">Selected: {fileName}</div>}

      <div className="ps-actions">
        <button type="button" className="ps-btn ps-btn-ghost" onClick={onBack}>Back</button>
        <button type="submit" className="ps-btn">Finish</button>
      </div>
    </form>
  );
}