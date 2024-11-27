'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/Toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { useCsrf } from '@/hooks/useCsrf';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const passwordStrengthText = {
  0: 'Very Weak',
  1: 'Weak',
  2: 'Medium',
  3: 'Strong',
  4: 'Very Strong'
} as const;

const passwordStrengthColor = {
  0: 'bg-red-500',
  1: 'bg-orange-500',
  2: 'bg-yellow-500',
  3: 'bg-green-500',
  4: 'bg-emerald-500'
} as const;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { withCsrf } = useCsrf();
  const token = searchParams.get('token');

  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm<ResetPasswordForm>();
  const password = watch('password', '');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link. Please request a new password reset.');
      router.push('/forgot-password');
    }
  }, [token, router]);

  // Calculate password strength
  const getPasswordStrength = (pass: string): number => {
    let score = 0;
    if (!pass) return score;
    
    // Length check
    if (pass.length >= 8) score++;
    
    // Contains number
    if (/\d/.test(pass)) score++;
    
    // Contains lowercase and uppercase
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    return score;
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);
      const response = await withCsrf('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.error.includes('password')) {
          setError('password', { message: result.error });
        } else {
          throw new Error(result.error);
        }
        return;
      }

      toast.success('Password has been successfully reset! Please log in with your new password.');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            Reset your password
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            Please enter your new password below
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: 'Password must include uppercase, lowercase, number and special character',
                    },
                  })}
                  className={cn(
                    'pr-10',
                    errors.password && 'border-red-500 focus:ring-red-500'
                  )}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password && (
                <div className="space-y-2">
                  <div className="flex h-2 gap-1">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={cn(
                          'h-full w-full rounded-full transition-colors',
                          index <= passwordStrength
                            ? passwordStrengthColor[passwordStrength as keyof typeof passwordStrengthColor]
                            : 'bg-gray-200'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Password strength: {passwordStrengthText[passwordStrength as keyof typeof passwordStrengthText]}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value =>
                      value === password || 'The passwords do not match',
                  })}
                  className={cn(
                    'pr-10',
                    errors.confirmPassword && 'border-red-500 focus:ring-red-500'
                  )}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
