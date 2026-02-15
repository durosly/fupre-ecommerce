import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-surface border-t border-border mt-20">
			<div className="max-w-7xl mx-auto px-6 py-16">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10">
					{/* Brand */}
					<div className="md:col-span-1">
						<Link href="/" className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-display font-bold text-base">
								F
							</div>
							<span className="font-display text-lg font-bold tracking-tight">
								FUPRE<span className="text-accent">shop</span>
							</span>
						</Link>
						<p className="text-sm text-muted leading-relaxed">
							Your premier university marketplace. Quality products, trusted sellers, and seamless shopping — built for the FUPRE
							community.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Shop</h4>
						<ul className="space-y-2.5">
							{["All Products", "Electronics", "Fashion", "Beauty", "Home"].map((item) => (
								<li key={item}>
									<Link href="/products" className="text-sm text-muted hover:text-accent transition-colors duration-200">
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div>
						<h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Company</h4>
						<ul className="space-y-2.5">
							{[
								{ label: "About Us", href: "/about" },
								{ label: "Contact", href: "/contact" },
								{ label: "FAQs", href: "/contact" },
								{ label: "Privacy Policy", href: "#" },
							].map((item) => (
								<li key={item.label}>
									<Link href={item.href} className="text-sm text-muted hover:text-accent transition-colors duration-200">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Stay Updated</h4>
						<p className="text-sm text-muted mb-4">Get notified about new products and exclusive deals.</p>
						<div className="flex gap-2">
							<input
								type="email"
								placeholder="Your email"
								className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted/50 transition-all duration-200"
							/>
							<button className="px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-hover transition-colors duration-200 cursor-pointer whitespace-nowrap">
								Subscribe
							</button>
						</div>
					</div>
				</div>

				{/* Bottom */}
				<div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted">© {new Date().getFullYear()} FUPREshop. Built with ❤️ for the FUPRE community.</p>
					<div className="flex items-center gap-6">
						{["Twitter", "Instagram", "GitHub"].map((social) => (
							<a key={social} href="#" className="text-xs text-muted hover:text-accent transition-colors duration-200">
								{social}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
