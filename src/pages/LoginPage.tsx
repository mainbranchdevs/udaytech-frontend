import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { requestOtp, verifyOtp } from '../api/endpoints';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await requestOtp(email);
      setStep('otp');
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await verifyOtp(email, otp);
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      const from = (location.state as any)?.from?.pathname;
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else if (res.data.is_new) {
        navigate('/complete-profile');
      } else {
        navigate(from || '/');
      }
    } catch {
      setError('Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-indigo-600">Udaya Tech</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {step === 'email' ? (
            <form onSubmit={handleEmail} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" loading={loading} className="w-full">Send OTP</Button>
            </form>
          ) : (
            <form onSubmit={handleOtp} className="space-y-4">
              <p className="text-sm text-gray-600">Enter the 6-digit code sent to <strong>{email}</strong></p>
              <Input
                label="Verification code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                required
                autoFocus
                className="text-center text-2xl tracking-[0.5em] font-mono"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" loading={loading} className="w-full">Verify</Button>
              <button type="button" onClick={() => { setStep('email'); setOtp(''); setError(''); }} className="w-full text-sm text-gray-500 hover:text-indigo-600">
                Use a different email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
