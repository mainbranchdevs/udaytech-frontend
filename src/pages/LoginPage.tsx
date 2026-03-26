import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { requestOtp, verifyOtp } from '../api/endpoints';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import logoIcon from '../assets/main-logo-removebg.png';

function OtpBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '');

  const handleChange = useCallback((idx: number, char: string) => {
    const clean = char.replace(/\D/g, '').slice(-1);
    const arr = [...digits];
    arr[idx] = clean;
    const next = arr.join('');
    onChange(next);
    if (clean && idx < 5) refs.current[idx + 1]?.focus();
  }, [digits, onChange]);

  const handleKey = useCallback((idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  }, [digits]);

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-11 h-13 text-center outline-none transition-all"
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'var(--text-xl)',
            color: 'var(--text-primary)',
            border: d ? '2px solid var(--brand-500)' : '1.5px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-card)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--brand-500)';
            e.target.style.boxShadow = '0 0 0 2px var(--brand-100)';
          }}
          onBlur={(e) => {
            if (!e.target.value) {
              e.target.style.borderColor = 'var(--border-default)';
              e.target.style.boxShadow = 'none';
            }
          }}
        />
      ))}
    </div>
  );
}

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
    if (otp.length < 6) return;
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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(180deg, var(--brand-50) 0%, var(--surface-page) 60%)' }}
    >
      <div
        className="w-full max-w-[400px]"
        style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-8) var(--space-6)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logoIcon} alt="Udaya Tech" className="logo-brand" style={{ width: 56, height: 56 }} />
          <span className="mt-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)' }}>
            <span style={{ color: 'var(--brand-700)' }}>Udaya</span>
            <span style={{ color: 'var(--accent-500)' }}>Tech</span>
          </span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', textAlign: 'center' }}>
          {step === 'email' ? 'Welcome Back' : 'Verify OTP'}
        </h2>
        <p className="text-center mt-1 mb-6" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          {step === 'email' ? 'Enter your email to sign in' : `Code sent to ${email}`}
        </p>

        {step === 'email' ? (
          <form onSubmit={handleEmail} className="flex flex-col gap-4">
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
              <div
                className="text-xs px-3 py-2"
                style={{ background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)' }}
              >
                {error}
              </div>
            )}
            <Button type="submit" loading={loading} fullWidth size="lg" variant="accent">
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtp} className="flex flex-col gap-4">
            <div>
              <label
                className="block mb-2"
                style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}
              >
                Verification Code
              </label>
              <OtpBoxes value={otp} onChange={setOtp} />
            </div>
            {error && (
              <div
                className="text-xs px-3 py-2"
                style={{ background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)' }}
              >
                {error}
              </div>
            )}
            <Button type="submit" loading={loading} fullWidth size="lg" variant="accent">
              Verify & Login
            </Button>
            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              className="w-full text-sm font-medium"
              style={{ color: 'var(--brand-600)' }}
            >
              ← Use a different email
            </button>
          </form>
        )}

        <p className="mt-6 text-center" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
