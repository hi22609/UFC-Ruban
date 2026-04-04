export default function FAQ() {
  const faqs = [
    {
      q: "What is RUBAN?",
      a: "Premium UFC intelligence. Structured fight analysis. Discord-first membership. We analyze every event through 8+ data lenses and deliver confidence-based reads.",
    },
    {
      q: "What do I get?",
      a: "Full event breakdowns, premium Discord access, live event-night updates, member-only channels, and high-signal discussion. The real intelligence lives inside the Discord.",
    },
    {
      q: "How accurate are the reads?",
      a: "67% historical win rate over 200+ fights. We show confidence bands, not guarantees. Every pick includes reasoning, volatility assessment, and transparent tracking.",
    },
    {
      q: "Can I cancel?",
      a: "Yes. Anytime. No questions asked. Premium Discord access remains active until the end of your billing period.",
    },
    {
      q: "Is this gambling advice?",
      a: "No. This is entertainment and analysis only. We provide structured intelligence. You make your own decisions. 18+ only. Gamble responsibly.",
    },
    {
      q: "How does Discord access work?",
      a: "After payment, you receive an instant invite link via email. Join the server, verify your membership, and access premium channels immediately.",
    },
    {
      q: "What's the difference between Operator and Syndicate?",
      a: "Operator is monthly ($20/mo) with full access. Syndicate is annual ($120/yr) with early access (48h before events), a 1-on-1 strategy call, and affiliate revenue share (10%).",
    },
  ];

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-6xl font-extrabold mb-6">
          FREQUENTLY ASKED QUESTIONS
        </h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="card">
            <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
            <p className="text-muted leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
