export default function AboutPage() {
	return (
		<div className="max-w-5xl mx-auto px-6 py-16">
			{/* Hero */}
			<div className="text-center mb-16 animate-fade-in-up">
				<span className="inline-block px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent bg-accent-soft rounded-full mb-6">
					Our Story
				</span>
				<h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
					About <span className="text-gradient italic">FUPREshop</span>
				</h1>
				<p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
					Born from the heart of the Federal University of Petroleum Resources, Effurun — we&apos;re building the ultimate marketplace for the FUPRE
					community.
				</p>
			</div>

			{/* Mission & Vision */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
				{[
					{
						title: "Our Mission",
						desc: "To provide FUPRE students with a convenient, affordable, and reliable platform to shop for everything they need — from tech gadgets to fashion essentials — without leaving campus.",
						icon: "🎯",
					},
					{
						title: "Our Vision",
						desc: "To become the most trusted university marketplace in the Niger Delta, empowering student entrepreneurs and connecting buyers with quality products at fair prices.",
						icon: "🌟",
					},
				].map((item, i) => (
					<div
						key={item.title}
						className="bg-surface border border-border rounded-2xl p-8 animate-fade-in-up"
						style={{ animationDelay: `${i * 100}ms` }}>
						<span className="text-4xl block mb-4">{item.icon}</span>
						<h3 className="font-display text-2xl font-bold mb-3">{item.title}</h3>
						<p className="text-muted leading-relaxed">{item.desc}</p>
					</div>
				))}
			</div>

			{/* Values */}
			<div className="mb-16 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
				<h2 className="font-display text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
					{[
						{
							title: "Quality Assured",
							desc: "Every product is vetted for quality before it reaches your hands.",
							icon: "✅",
						},
						{
							title: "Student Prices",
							desc: "We understand student budgets. Competitive pricing, always.",
							icon: "💰",
						},
						{
							title: "Fast Delivery",
							desc: "Same-day campus delivery for most products.",
							icon: "⚡",
						},
					].map((v, i) => (
						<div
							key={v.title}
							className="text-center p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-colors duration-300">
							<span className="text-3xl block mb-3">{v.icon}</span>
							<h4 className="font-display text-lg font-semibold mb-2">{v.title}</h4>
							<p className="text-sm text-muted">{v.desc}</p>
						</div>
					))}
				</div>
			</div>

			{/* CTA */}
			<div
				className="text-center bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl p-12 border border-accent/20 animate-fade-in-up"
				style={{ animationDelay: "300ms" }}>
				<h2 className="font-display text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
				<p className="text-muted mb-6">Join thousands of happy students already using FUPREshop.</p>
				<a
					href="/products"
					className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover shadow-[0_4px_20px_rgba(200,144,74,0.35)] transition-all duration-300">
					Browse Products
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
				</a>
			</div>
		</div>
	);
}
