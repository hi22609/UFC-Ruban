export default function Methodology() {
  const factors = [
    { title: "Opponent Quality", desc: "Who has faced real competition? Strength of schedule matters." },
    { title: "Recent Form", desc: "Momentum, recency, trajectory. Performance trends over last 3-5 fights." },
    { title: "Striking Profile", desc: "Output, accuracy, finishing rate. Power, volume, and defensive metrics." },
    { title: "Grappling Profile", desc: "Control time, submission threat, takedown defense. Grappling dominance." },
    { title: "Durability", desc: "Chin integrity, recovery ability, war history. Can they survive adversity?" },
    { title: "Contextual Factors", desc: "Weight cuts, camp changes, layoffs, short notice. The invisible edges." },
    { title: "Confidence Bands", desc: "50%-80% confidence scoring. We quantify uncertainty." },
    { title: "Volatility Rating", desc: "Low, Medium, High risk assessment. How explosive is this fight?" },
  ];

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-6xl font-extrabold mb-6">
          HOW WE ANALYZE FIGHTS
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          Structured. Explainable. Confidence-based. Every fight is analyzed through 8+ data lenses.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
        {factors.map((factor, idx) => (
          <div key={idx} className="card">
            <h3 className="text-xl font-bold mb-2">{factor.title}</h3>
            <p className="text-muted">{factor.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto card bg-elevated text-center">
        <p className="text-lg text-muted leading-relaxed">
          <strong className="text-white">We don't promise wins.</strong> We structure edge. Every fight is analyzed through 8+ lenses. Every pick includes confidence, volatility, and reasoning. <strong className="text-white">No locks. No guarantees.</strong> Just sharper reads.
        </p>
      </div>
    </div>
  );
}
