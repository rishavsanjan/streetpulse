"use client";

import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { MapPin, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/service/auth";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface FormValues {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const EMAIL_PATTERN =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const INITIAL_VALUES: FormValues = {
    email: "",
    password: "",
};

export default function LoginForm() {
    const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<FormErrors>({});
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { saveToken } = useAuth();
    const handleChange =
        (field: keyof FormValues) => (e: ChangeEvent<HTMLInputElement>) => {
            setValues((prev) => ({ ...prev, [field]: e.target.value }));
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        };

    const validate = (): FormErrors => {
        const nextErrors: FormErrors = {};

        if (!values.email) {
            nextErrors.email = "Email is required";
        } else if (!EMAIL_PATTERN.test(values.email.toLowerCase())) {
            nextErrors.email = "Please enter a valid  email";
        }

        if (!values.password) {
            nextErrors.password = "Password is required";
        } else if (values.password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters";
        }

        return nextErrors;
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nextErrors = validate();
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) return;
        loginMutation.mutate({
            email: values.email,
            password: values.password
        })
    };

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            saveToken(data.token, data.user)

            setValues(({ email: "", password: "" }))
            router.push("/feed/?isLoggedIn=true")
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                console.log("Backend response:", error.response?.data);
                console.log("Status:", error.response?.status);

                toast.error(
                    error.response?.data?.message || "Registration failed"
                );
            } else {
                console.error(error);
                toast.error("Something went wrong");
            }

        },
    })

    return (
        <main className="w-full max-w-110 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="glass-card rounded-2xl p-xl md:p-2xl flex flex-col items-center">
                {/* Brand Identity */}
                <div className="mb-xl text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-container rounded-xl mb-md shadow-lg shadow-primary/20">
                        <MapPin className="text-on-primary w-8 h-8" strokeWidth={2.25} />
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs tracking-tight">
                        StreetPulse
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Welcome back to your neighborhood
                    </p>
                </div>



                {/* Login Form */}
                <form className="w-full space-y-lg" onSubmit={handleSubmit} noValidate>
                    {/* Email Field */}
                    <div className="space-y-sm">
                        <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors w-5 h-5" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="alex@neighborhood.com"
                                required
                                value={values.email}
                                onChange={handleChange("email")}
                                className={`w-full pl-xl pr-md py-md bg-surface-container border rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline/60 input-focus-ring focus:border-primary transition-soft ${errors.email ? "border-error" : "border-outline-variant"
                                    }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="font-label-sm text-label-sm text-error mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-sm">
                        <div className="flex justify-between items-center">
                            <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                                Password
                            </label>
                            <a
                                className="font-label-sm text-label-sm text-primary hover:text-on-primary-container transition-colors"
                                href="#"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors w-5 h-5" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                value={values.password}
                                onChange={handleChange("password")}
                                className={`w-full pl-xl pr-xl py-md bg-surface-container border rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline/60 input-focus-ring focus:border-primary transition-soft ${errors.password ? "border-error" : "border-outline-variant"
                                    }`}
                            />
                            <button
                                type="button"
                                aria-label="Toggle password visibility"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="font-label-sm text-label-sm text-error mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center gap-sm">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-soft"
                        />
                        <label
                            className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none"
                            htmlFor="remember"
                        >
                            Remember me for 30 days
                        </label>
                    </div>

                    {/* Primary Action */}
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full py-md bg-primary text-on-primary font-label-md text-label-md rounded-xl shadow-lg shadow-primary/20 hover:bg-on-primary-fixed-variant transition-soft active:scale-[0.98] flex items-center justify-center gap-sm disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                        <span>{loginMutation.isPending ? "Verifying..." : "Sign In"}</span>
                        {loginMutation.isPending && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                    </button>
                </form>

                {/* Social Login Divider */}
                <div className="w-full flex items-center gap-md my-xl">
                    <div className="h-px flex-1 bg-outline-variant/30" />
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
                        or
                    </span>
                    <div className="h-px flex-1 bg-outline-variant/30" />
                </div>

                {/* Social Actions */}
                <div className="w-full grid grid-cols-2 gap-md">
                    <button className="flex items-center justify-center gap-sm py-sm border border-outline-variant rounded-xl font-label-sm text-label-sm text-on-surface hover:bg-surface-container transition-soft">

                        Google
                    </button>

                </div>

                {/* Footer Link */}
                <div className="mt-2xl text-center">
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Don&apos;t have an account?
                        <a className="text-primary font-bold hover:underline ml-1" href="#">
                            Sign up for free
                        </a>
                    </p>
                </div>
            </div>

            {/* Accessibility & System Info Footer */}
            <footer className="mt-xl flex justify-center items-center gap-lg text-outline">
                <a className="font-label-sm text-label-sm hover:text-on-surface transition-colors" href="#">
                    Privacy Policy
                </a>
                <span className="w-1 h-1 bg-outline-variant rounded-full" />
                <a className="font-label-sm text-label-sm hover:text-on-surface transition-colors" href="#">
                    Terms of Service
                </a>
                <span className="w-1 h-1 bg-outline-variant rounded-full" />
                <span className="font-label-sm text-label-sm">© 2026 StreetPulse</span>
            </footer>
        </main>
    );
}