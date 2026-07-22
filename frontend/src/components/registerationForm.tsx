"use client";

import { SubmitEvent, useState } from "react";
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/service/auth";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

type StrengthLevel = 0 | 1 | 2 | 3 | 4 | 5;

const STRENGTH_WIDTHS = ["0%", "20%", "40%", "60%", "80%", "100%"];
const STRENGTH_COLORS = [
    "bg-error",
    "bg-error",
    "bg-tertiary-container",
    "bg-secondary-container",
    "bg-primary-container",
    "bg-primary",
];
const STRENGTH_LABELS = ["None", "Weak", "Fair", "Good", "Strong", "Excellent"];

function calculateStrength(password: string): StrengthLevel {
    let strength = 0;
    if (password.length > 6) strength++;
    if (password.length > 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength as StrengthLevel;
}

const INITIAL_VALUES: FormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function RegistrationForm() {
    const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<FormErrors>({});
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const strength = calculateStrength(values.password);

    const handleChange =
        (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const validate = (): FormErrors => {
        const nextErrors: FormErrors = {};

        if (values.name.trim().length < 3) {
            nextErrors.name = "Full name must be at least 2 characters";
        }
        if (!values.email.includes("@")) {
            nextErrors.email = "Please enter a valid email address";
        }
        if (values.password.length < 8) {
            nextErrors.password = "Min 8 characters required";
        }
        if (values.password !== values.confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match";
        }

        return nextErrors;
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nextErrors = validate();
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) return;

        registerMutation.mutate({
            name: values.name,
            email: values.email,
            password: values.password
        })
    };

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            toast.success("Registered successfully!")
            setValues(({ name: "", email: "", password: "", confirmPassword: "" }))
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
        <main className="flex-grow flex items-center justify-center px-margin-mobile py-2xl">
            <div className="w-full max-w-[480px]">
                {/* Registration Card */}
                <div className="p-4 space-y-2 glass-card rounded-2xl shadow-[0_20px_50px_rgba(0,108,73,0.08)] p-lg md:p-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Heading */}
                    <div className="text-center mb-xl">
                        <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mb-2">
                            Join StreetPulse
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Connect with your local community
                        </p>
                    </div>


                    {/* Registration Form */}
                    <form className="space-y-2" onSubmit={handleSubmit} noValidate>
                        {/* Full Name */}
                        <div className="space-y-xs">
                            <label
                                className="block font-label-md text-label-md text-on-surface-variant ml-1"
                                htmlFor="name"
                            >
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Jane Doe"
                                    required
                                    value={values.name}
                                    onChange={handleChange("name")}
                                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md text-body-md"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-error font-label-sm text-label-sm px-1 text-red-400 text-sm">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-xs">
                            <label
                                className="block font-label-md text-label-md text-on-surface-variant ml-1"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="jane@example.com"
                                    required
                                    value={values.email}
                                    onChange={handleChange("email")}
                                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md text-body-md"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-error font-label-sm text-label-sm px-1 text-red-400 text-sm">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-xs">
                            <label
                                className="block font-label-md text-label-md text-on-surface-variant ml-1"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={values.password}
                                    onChange={handleChange("password")}
                                    className="w-full pl-12 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md text-body-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            <div className="mt-2 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                <div
                                    className={`strength-bar h-full ${STRENGTH_COLORS[strength]}`}
                                    style={{ width: STRENGTH_WIDTHS[strength] }}
                                />
                            </div>
                            <div className="flex justify-between items-center px-1 min-h-[20px]">
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className={`inline-block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${STRENGTH_COLORS[strength]}`}
                                    />
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                                        Strength:{" "}
                                        <span className={`${(STRENGTH_LABELS[strength] === "None" || STRENGTH_LABELS[strength] === "Weak") ? "text-red-500" : (STRENGTH_LABELS[strength] === "Fair" || STRENGTH_LABELS[strength] === "Good") ? "text-yellow-500" : "text-green-500"} font-semibold text-on-surface`}>
                                            {STRENGTH_LABELS[strength]}
                                        </span>
                                    </p>
                                </div>
                                {errors.password && (
                                    <p className="flex items-center gap-1 text-error font-label-sm text-label-sm animate-in fade-in slide-in-from-top-1 duration-200">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-xs">
                            <label
                                className="block font-label-md text-label-md text-on-surface-variant ml-1"
                                htmlFor="confirmPassword"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={values.confirmPassword}
                                    onChange={handleChange("confirmPassword")}
                                    className="w-full pl-12 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md text-body-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-error font-label-sm text-label-sm px-1 text-red-400 text-sm">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Agreement */}
                        <div className="flex items-start gap-3 py-2 px-1">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                            />
                            <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">
                                I agree to the{" "}
                                <a className="text-primary hover:underline font-semibold" href="#">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a className="text-primary hover:underline font-semibold" href="#">
                                    Privacy Policy
                                </a>
                                .
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full bg-primary-container text-white font-label-md text-label-md py-4 rounded-xl shadow-lg shadow-primary-container/20 hover:bg-primary transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden relative group disabled:cursor-not-allowed disabled:opacity-80 bg-green-400"
                        >
                            <span className={registerMutation.isPending ? "opacity-0" : ""}>Create Account</span>
                            {registerMutation.isPending && (
                                <div className="absolute animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-lg text-center pt-lg">
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Already have an account?
                            <Link href={"/login"}>
                                <span className="text-primary font-bold hover:underline ml-1">
                                    Sign in
                                </span>
                            </Link>

                        </p>
                    </div>
                </div>


            </div>
        </main>
    );
}