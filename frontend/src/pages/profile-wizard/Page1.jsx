import React, { useState } from 'react';
import { Tooltip } from '@mui/material';

export default function Page1({ value, onNext }) {
  const [local, setLocal] = useState({
    fullName: value.fullName || '',
    pronouns: value.pronouns || '',
    age: value.age || '',
    location: value.location || ''
  });

  const inputClass = "w-full mb-4 p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition";

  return (
    <div>
      <label className="block mb-2 font-semibold">Full name</label>
      <Tooltip title="Enter your full name" arrow>
        <input
          className={inputClass}
          value={local.fullName}
          onChange={e => setLocal({ ...local, fullName: e.target.value })}
        />
      </Tooltip>

      <label className="block mb-2 font-semibold">Pronouns</label>
      <Tooltip title="Your preferred pronouns (e.g., she/her, he/him, they/them)" arrow>
        <input
          className={inputClass}
          value={local.pronouns}
          onChange={e => setLocal({ ...local, pronouns: e.target.value })}
        />
      </Tooltip>

      <label className="block mb-2 font-semibold">Age</label>
      <Tooltip title="Your age in years" arrow>
        <input
          type="number"
          className={inputClass}
          value={local.age}
          onChange={e => setLocal({ ...local, age: e.target.value })}
        />
      </Tooltip>

      <label className="block mb-2 font-semibold">Location (city, country)</label>
      <Tooltip title="City and country you live in" arrow>
        <input
          className={inputClass}
          value={local.location}
          onChange={e => setLocal({ ...local, location: e.target.value })}
        />
      </Tooltip>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="ps-btn"
          onClick={() => onNext(local)}
        >
          Next
        </button>
      </div>
    </div>
  );
}