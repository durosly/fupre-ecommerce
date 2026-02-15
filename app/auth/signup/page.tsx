"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignupPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}

		setLoading(true);
		try {
			const result = await signUp.email({
				name,
				email,
				password,
			});

			if (result.error) {
				setError(result.error.message || "Signup failed");
			} else {
				router.push("/");
				router.refresh();
			}
		} catch (err: any) {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-6 py-16">
			<div className="w-full max-w-md animate-scale-in">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent flex items-center justify-center text-white font-display font-bold text-2xl shadow-[0_4px_20px_rgba(200,144,74,0.4)]">
						F
					</div>
					<h1 className="font-display text-3xl font-bold mb-2">Create Account</h1>
					<p className="text-sm text-muted">Join the FUPREshop community</p>
				</div>

				{/* Form */}
				<div className="bg-surface border border-border rounded-2xl p-7">
					<form onSubmit={handleSubmit} className="space-y-5">
						<Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
						<Input
							label="Email Address"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
						/>
						<Input
							label="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
						/>
						<Input
							label="Confirm Password"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="••••••••"
							required
						/>

						{error && (
							<div className="p-3 bg-danger/10 border border-danger/20 rounded-xl">
								<p className="text-xs text-danger font-medium">{error}</p>
							</div>
						)}

						<Button type="submit" size="lg" loading={loading} className="w-full">
							Create Account
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-muted">
							Already have an account?{" "}
							<Link href="/auth/login" className="text-accent font-semibold hover:text-accent-hover transition-colors">
								Sign In
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
