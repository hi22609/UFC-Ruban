import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-6xl font-extrabold mb-6">
          MEMBERSHIP ACCESS
        </h1>
        <p className="text-xl text-muted">
          Join the premium Discord. Get the full intelligence.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <h3 className="text-3xl font-bold mb-4">OPERATOR</h3>
          <div className="text-6xl font-extrabold mb-6">
            $20<span className="text-2xl text-muted">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 text-lg">
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Full event breakdowns</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Discord premium access</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Live event-night updates</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Member-only channels</span>
            </li>
          </ul>
          <a href="https://buy.stripe.com/test_MONTHLY_LINK" className="btn-primary w-full block text-center">
            JOIN OPERATOR
          </a>
        </div>

        <div className="card border-accent relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-accent to-purple-600 rounded-full text-sm font-bold uppercase tracking-wider">
            ⭐ BEST VALUE
          </div>
          <h3 className="text-3xl font-bold mb-4">SYNDICATE</h3>
          <div className="text-6xl font-extrabold mb-2">
            $120<span className="text-2xl text-muted">/yr</span>
          </div>
          <p className="text-signal-green font-bold mb-6">SAVE $120/YEAR</p>
          <ul className="space-y-4 mb-8 text-lg">
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Everything in Operator</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Early access (48h before events)</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>1-on-1 strategy call</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Affiliate access (10% revenue share)</span>
            </li>
          </ul>
          <a href="https://buy.stripe.com/test_ANNUAL_LINK" className="btn-primary w-full block text-center">
            JOIN SYNDICATE
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center text-muted">
        <p className="mb-4">🔒 <strong>Cancel anytime.</strong> No questions asked.</p>
        <p>💬 <strong>Premium Discord invite sent instantly</strong> after payment.</p>
      </div>
    </div>
  );
}
