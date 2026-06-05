import type { LoginPayload, SignupPayload, AuthUser } from '../types/auth.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Stub service — all functions simulate network delay.
// Replace each with a real API call (POST /api/auth/...) when backend is ready.
export const authService = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    await delay(800);
    return {
      id: 'usr_1',
      email: payload.email,
      fullName: 'Test User',
      role: payload.role,
      token: 'mock-access-token',
    };
  },

  signup: async (payload: SignupPayload): Promise<{ message: string; email: string }> => {
    await delay(900);
    return { message: 'OTP sent to your email', email: payload.email };
  },

  verifyOtp: async (email: string, otp: string): Promise<AuthUser> => {
    await delay(700);
    if (otp === '000000') throw new Error('Invalid OTP');
    return {
      id: 'usr_1',
      email,
      fullName: 'New User',
      role: 'candidate',
      token: 'mock-access-token',
    };
  },

  resendOtp: async (_email: string): Promise<{ message: string }> => {
    await delay(500);
    return { message: 'OTP resent successfully' };
  },
};
