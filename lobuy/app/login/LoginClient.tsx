"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Mail, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { apiFetch, type ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/lib/types";

const RESEND_AFTER_SEC = 30;
const CODE_LENGTH = 6;

export default function LoginClient() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    if (step === "code") boxes.current[0]?.focus();
  }, [step]);

  const sendCode = async () => {
    setError("");
    setIsLoading(true);
    try {
      const data = await apiFetch<{ isNewUser?: boolean }>("/api/user/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      setIsNewUser(Boolean(data.isNewUser));
      setCode(Array(CODE_LENGTH).fill(""));
      setStep("code");
      setResendIn(RESEND_AFTER_SEC);
    } catch (err) {
      setError((err as ApiError).data?.message || "Could not send the code. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verify = async (digits: string) => {
    setError("");
    setIsLoading(true);
    try {
      const data = await apiFetch<{ user: User }>("/api/user/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), otp: digits }),
      });
      setUser(data.user);
      router.replace(redirectTo.startsWith("/") ? redirectTo : "/");
    } catch (err) {
      setError((err as ApiError).data?.message || "That code didn't work. Try again.");
      setCode(Array(CODE_LENGTH).fill(""));
      boxes.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const setDigits = (start: number, value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, CODE_LENGTH - start).split("");
    if (digits.length === 0) {
      const next = [...code];
      next[start] = "";
      setCode(next);
      return;
    }
    const next = [...code];
    digits.forEach((d, i) => (next[start + i] = d));
    setCode(next);
    const focusAt = Math.min(start + digits.length, CODE_LENGTH - 1);
    boxes.current[focusAt]?.focus();
    const joined = next.join("");
    if (joined.length === CODE_LENGTH && !next.includes("")) void verify(joined);
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      boxes.current[i - 1]?.focus();
    }
  };

  return (
    <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian px-5 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-[#7A2552]/25 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-9 flex justify-center">
          <Logo />
        </div>

        <div className="glass-strong hairline rounded-[28px] p-7 shadow-glass sm:p-9">
          {step === "email" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendCode();
              }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-2xl font-bold text-titanium">Login or sign up</h1>
                <p className="mt-2 font-body text-sm text-titanium-muted">
                  Enter your email and we&apos;ll send you a one-time code. No password needed.
                </p>
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-titanium-muted/70" />
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-surface py-4 pl-12 pr-4 font-body text-sm text-titanium placeholder-titanium-muted/50 outline-none transition-colors focus:border-gold/50"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                  {error}
                </p>
              )}

              <button
                disabled={isLoading || !email.trim()}
                className="btn-metal group flex h-14 w-full items-center justify-center gap-2 rounded-xl text-[12px] font-bold uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Continue
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-titanium-muted">
                By continuing, you agree to Lobuy&apos;s Terms of Use and Privacy Policy.
              </p>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void verify(code.join(""));
              }}
              className="space-y-6"
            >
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setError("");
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-titanium-muted hover:text-gold"
              >
                <ArrowLeft size={14} /> Change email
              </button>

              <div className="flex flex-col items-center text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                  <ShieldCheck size={26} strokeWidth={1.5} />
                </span>
                <h1 className="font-display text-2xl font-bold text-titanium">
                  {isNewUser ? "Create your account" : "Enter verification code"}
                </h1>
                <p className="mt-2 font-body text-sm text-titanium-muted">
                  We sent a 6-digit code to
                  <br />
                  <span className="font-medium text-titanium">{email.trim()}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2 sm:gap-3">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      boxes.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) => setDigits(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    onPaste={(e) => {
                      e.preventDefault();
                      setDigits(i, e.clipboardData.getData("text"));
                    }}
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    aria-label={`Digit ${i + 1}`}
                    disabled={isLoading}
                    className={`h-14 w-11 rounded-xl border bg-surface text-center font-display text-2xl font-bold text-titanium outline-none transition-colors sm:w-12 ${
                      error ? "border-red-500/40" : "border-slate-200 focus:border-gold/60"
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p role="alert" className="text-center text-xs text-red-300">
                  {error}
                </p>
              )}

              <button
                disabled={isLoading || code.includes("")}
                className="btn-metal flex h-14 w-full items-center justify-center gap-2 rounded-xl text-[12px] font-bold uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Verify & continue"}
              </button>

              <p className="text-center text-xs text-titanium-muted">
                Didn&apos;t get it?{" "}
                {resendIn > 0 ? (
                  <span>Resend in {resendIn}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => void sendCode()}
                    disabled={isLoading}
                    className="font-semibold text-gold hover:text-gold-soft"
                  >
                    Resend code
                  </button>
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
