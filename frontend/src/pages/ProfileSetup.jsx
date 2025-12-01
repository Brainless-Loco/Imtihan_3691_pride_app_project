import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Page1 from './profile-wizard/Page1';
import Page2 from './profile-wizard/Page2';
import Page3 from './profile-wizard/Page3';
import { saveProfile as apiSaveProfile, getProfile as apiGetProfile } from '../utils/api';
import '../styles/ProfileSetup.css';

const STORAGE_KEY = 'ps_profile';
const USE_BACKEND = true;
const userId = localStorage.getItem('userId');

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '',
    pronouns: '',
    age: '',
    location: '',
    stemSpecialization: '',
    researchIdea: '',
    professionalFocus: '',
    passionTopic: '',
    community: '',
    resumeFileName: '',
    resumeDataUrl: '',
    profileComplete: false
  });

  useEffect(() => {
    async function load() {
      if (USE_BACKEND) {
        try {
          const p = await apiGetProfile(userId);
          if (p) setForm(prev => ({ ...prev, ...p }));
        } catch {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setForm(prev => ({ ...prev, ...JSON.parse(saved) }));
        }
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setForm(prev => ({ ...prev, ...JSON.parse(saved) }));
      }
    }
    load();
  }, []);

  const saveAndNext = async (updates = {}) => {
    const updated = { ...form, ...updates };
    setForm(updated);

    if (USE_BACKEND) {
      try {
        await apiSaveProfile(updated, userId);
      } catch (e) {
        console.error('Backend save failed; saving locally', e);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    setStep(s => Math.min(s + 1, 2));
  };

  const back = () => setStep(s => Math.max(0, s - 1));

  const finish = async (updates = {}) => {
    const final = { ...form, ...updates, profileComplete: true };
    setForm(final);
    console.log(final);
    try {
      if (USE_BACKEND) {
        await apiSaveProfile(final);
      }
    } catch (e) {
      console.error('Final save failed; stored locally', e);
    } finally {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
      localStorage.setItem('ps_profileComplete', '1');
    }

    navigate('/home');
  };

  const steps = [
    <Page1 key="p1" value={form} onNext={saveAndNext} />,
    <Page2 key="p2" value={form} onNext={saveAndNext} onBack={back} />,
    <Page3 key="p3" value={form} onBack={back} onFinish={finish} />
  ];

  return (
    <div className="ps-page">
      <div className="ps-panel">
          <h1 className="forgot-pass-text text-center mb-4">Tell us about yourself</h1>
          <div className="ps-step mb-4">Step {step + 1} of {steps.length}</div>
          <div>{steps[step]}</div>
        </div>
    </div>
  );
}