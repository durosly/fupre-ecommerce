"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export default function Input({ label, error, className = "", id, ...props }: InputProps) {
	const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className="flex flex-col gap-1.5">
			{label && (
				<label htmlFor={inputId} className="text-sm font-medium text-muted">
					{label}
				</label>
			)}
			<input
				id={inputId}
				className={`
          w-full px-4 py-3
          bg-surface text-foreground
          border border-border rounded-xl
          text-sm
          placeholder:text-muted/60
          transition-all duration-200
          ${error ? "border-danger" : ""}
          ${className}
        `}
				{...props}
			/>
			{error && <span className="text-xs text-danger">{error}</span>}
		</div>
	);
}
