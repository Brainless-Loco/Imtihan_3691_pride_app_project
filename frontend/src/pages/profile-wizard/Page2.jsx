import React, { useState } from 'react';
import { Tooltip } from '@mui/material';

export default function Page2({ value, onNext, onBack }) {
  const [local, setLocal] = useState({
    stemSpecialization: value.stemSpecialization || '',
    researchIdea: value.researchIdea || '',
    professionalFocus: value.professionalFocus || '',
    passionTopic: value.passionTopic || ''
  });

  const inputClass = "w-full mb-3 p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition";

  return (
    <div>
      <label className="block mb-2">STEM specialization</label>
      <Tooltip title="Your STEM field or specialization (e.g., CS, Bio)" arrow>
        <input
          className={inputClass}
          value={local.stemSpecialization}
          onChange={e => setLocal({ ...local, stemSpecialization: e.target.value })}
        />
      </Tooltip>

      <label className="block mb-2">Research idea</label>
      <Tooltip title="Briefly describe a research idea you're interested in" arrow>
        <textarea
          className={inputClass}
          rows={4}
          value={local.researchIdea}
          onChange={e => setLocal({ ...local, researchIdea: e.target.value })}
        />
      </Tooltip>

      <label className="block mb-2">Professional focus / role</label>
      <Tooltip title="Your professional focus or role you aspire to" arrow>
        <input
          className={inputClass}
          value={local.professionalFocus}
          onChange={e => setLocal({ ...local, professionalFocus: e.target.value })}
        />
      </Tooltip>

      <label className="block mb-2">Passion topic</label>
      <Tooltip title="A topic you are passionate about" arrow>
        <input
          className={inputClass}
          value={local.passionTopic}
          onChange={e => setLocal({ ...local, passionTopic: e.target.value })}
        />
      </Tooltip>

      <div className="ps-actions">
        <button className="ps-btn ps-btn-ghost" onClick={onBack}>Back</button>
        <button className="ps-btn" onClick={() => onNext(local)}>Next</button>
      </div>
    </div>
  );
}