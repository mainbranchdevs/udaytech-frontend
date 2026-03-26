import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { updateProfile, createAddress } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

export default function CompleteProfilePage() {
  const { isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Spinner className="h-10 w-10" /></div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name });
      if (address && city && state && pincode) {
        await createAddress({ full_address: address, city, state, pincode, landmark: null });
      }
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, var(--brand-50) 0%, var(--surface-page) 60%)' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
            Complete your profile
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Welcome! Let us know a bit about you.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 flex flex-col gap-4"
          style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
        >
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input label="State" value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <Input label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} />
          <Button type="submit" loading={loading} fullWidth variant="accent">Save & Continue</Button>
        </form>
      </div>
    </div>
  );
}
