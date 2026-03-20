import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';
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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--brand)' }}>
      {/* Hero panel */}
      <div className="px-8 pt-16 pb-10 flex flex-col items-center text-center">
        <div className="mb-2">
          <span className="text-white font-extrabold text-3xl italic tracking-tight">Udaya</span>
          <span className="text-yellow-300 font-extrabold text-3xl ml-1">Tech</span>
        </div>
        <p className="text-blue-100 text-sm font-medium mt-1">Your trusted tech partner</p>
        <div className="mt-6 text-5xl">🛒</div>
        <p className="mt-4 text-white/80 text-xs max-w-xs leading-relaxed">
          Login to access exclusive deals on products & services
        </p>
      </div>

      {/* White card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-8 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {step === 'email' ? 'Sign In' : 'Verify OTP'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {step === 'email'
            ? 'Enter your email to receive a one-time password'
            : `Code sent to ${email}`}
        </p>

        {step === 'email' ? (
          <form onSubmit={handleEmail} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<EnvelopeIcon className="h-4 w-4" />}
              required
              autoFocus
            />
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">{error}</div>
            )}
            <Button type="submit" loading={loading} fullWidth size="lg">
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Verification Code
              </label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em] font-mono"
                icon={<KeyIcon className="h-4 w-4" />}
                required
                autoFocus
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">{error}</div>
            )}
            <Button type="submit" loading={loading} fullWidth size="lg">
              Verify &amp; Login
            </Button>
            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              className="w-full text-sm text-[--brand] font-medium hover:underline"
            >
              ← Use a different email
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-gray-400">
          By continuing, you agree to our Terms &amp; Privacy Policy
        </p>
      </div>
    </div>
  );
}
