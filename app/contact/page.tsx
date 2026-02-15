"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ContactPage() {
	const [submitted, setSubmitted] = useState(false);
	const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Simulate form submission
		setSubmitted(true);
	};

	return (
		<div className="max-w-5xl mx-auto px-6 py-16">
			{/* Header */}
			<div className="text-center mb-12 animate-fade-in-up">
				<span className="inline-block px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent bg-accent-soft rounded-full mb-6">
					Get in Touch
				</span>
				<h1 className="font-display text-5xl font-bold mb-4">Contact Us</h1>
				<p className="text-muted max-w-lg mx-auto">
					Have a question or need help? We&apos;d love to hear from you. Reach out and we&apos;ll respond within 24 hours.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
				{/* Contact Info */}
				<div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
					{[
						{
							icon: "📍",
							title: "Visit Us",
							lines: ["Federal University of Petroleum Resources", "Effurun, Delta State, Nigeria"],
						},
						{
							icon: "📧",
							title: "Email Us",
							lines: ["support@fupreshop.com", "admin@fupreshop.com"],
						},
						{
							icon: "📱",
							title: "Call Us",
							lines: ["+234 801 234 5678", "Mon – Fri, 8AM – 6PM"],
						},
					].map((info) => (
						<div
							key={info.title}
							className="flex gap-4 p-5 bg-surface border border-border rounded-2xl hover:border-accent/30 transition-colors duration-300">
							<span className="text-2xl shrink-0">{info.icon}</span>
							<div>
								<h3 className="font-display font-semibold mb-1">{info.title}</h3>
								{info.lines.map((line) => (
									<p key={line} className="text-sm text-muted">
										{line}
									</p>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Contact Form */}
				<div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
					{submitted ? (
						<div className="bg-surface border border-border rounded-2xl p-10 text-center animate-scale-in">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
								<svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<h3 className="font-display text-xl font-semibold mb-2">Message Sent!</h3>
							<p className="text-sm text-muted">Thank you for reaching out. We&apos;ll get back to you soon.</p>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-7 space-y-5">
							<Input
								label="Your Name"
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								placeholder="John Doe"
								required
							/>
							<Input
								label="Email Address"
								type="email"
								value={form.email}
								onChange={(e) => setForm({ ...form, email: e.target.value })}
								placeholder="you@example.com"
								required
							/>
							<Input
								label="Subject"
								value={form.subject}
								onChange={(e) => setForm({ ...form, subject: e.target.value })}
								placeholder="How can we help?"
								required
							/>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-muted">Message</label>
								<textarea
									value={form.message}
									onChange={(e) => setForm({ ...form, message: e.target.value })}
									placeholder="Tell us more..."
									rows={5}
									required
									className="w-full px-4 py-3 bg-surface text-foreground border border-border rounded-xl text-sm placeholder:text-muted/60 transition-all duration-200 resize-none"
								/>
							</div>
							<Button type="submit" size="lg" className="w-full">
								Send Message
							</Button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
