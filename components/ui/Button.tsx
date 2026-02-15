"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary: "bg-accent text-white hover:bg-accent-hover shadow-[0_2px_8px_rgba(200,144,74,0.3)] hover:shadow-[0_4px_16px_rgba(200,144,74,0.4)]",
	secondary: "bg-surface text-foreground border border-border hover:bg-surface-hover",
	outline: "bg-transparent text-accent border-2 border-accent hover:bg-accent hover:text-white",
	danger: "bg-danger text-white hover:opacity-90 shadow-[0_2px_8px_rgba(192,57,43,0.3)]",
	ghost: "bg-transparent text-foreground hover:bg-surface-hover",
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: "px-4 py-2 text-xs",
	md: "px-6 py-2.5 text-sm",
	lg: "px-8 py-3.5 text-base",
};

export default function Button({ variant = "primary", size = "md", loading = false, disabled, className = "", children, ...props }: ButtonProps) {
	return (
		<button
			className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-xl
        transition-all duration-300 ease-out
        cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled || loading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        ${className}
      `}
			disabled={disabled || loading}
			{...props}>
			{loading && (
				<svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
				</svg>
			)}
			{children}
		</button>
	);
}
