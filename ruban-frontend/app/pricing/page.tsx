import Link from 'next/link';

const monthlyLink = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_LINK;
const annualLink = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_LINK;

export default function Pricing() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <div className="inline-block mb-4 px-4 py-2 bg-signal-green/10 border border-signal-green rounded-full text-signal-green text-sm font-bold uppercase tracking-wider">
          White House Event Access
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          ENTER THE WHITE HOUSE ROOM
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          Unlock all 13 White House fight reads, confidence ratings, volatility notes, tracked performance visibility, and premium Discord access.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <h3 className="text-3xl font-bold mb-2">OPERATOR</h3>
          <p className="text-muted mb-4">Monthly access for active fight weeks</p>
          <div className="text-6xl font-extrabold mb-6">
            $20<span className="text-2xl text-muted">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 text-lg">
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>All White House event breakdowns</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Confidence + volatility indicators</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Discord premium access</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Fight-day updates and notes</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Tracked performance visibility</span>
            </li>
          </ul>
          <a
            href={monthlyLink || '/discord'}
            className="btn-primary w-full block text-center"
          >
            {monthlyLink ? 'GET OPERATOR ACCESS' : 'GET ACCESS DETAILS'}
          </a>
        </div>

        <div className="card border-gold relative shadow-lg shadow-gold/10">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-gold to-accent rounded-full text-sm font-bold uppercase tracking-wider text-void">
            BEST VALUE
          </div>
          <h3 className="text-3xl font-bold mb-2 text-gold">SYNDICATE</h3>
          <p className="text-muted mb-4">Annual access for disciplined operators</p>
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
              <span>Earlier event-week access</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Top-tier spots surfaced faster</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Premium chart visibility</span>
            </li>
            <li className="flex items-start">
              <span className="text-signal-green mr-3 text-xl">✓</span>
              <span>Priority member path as systems mature</span>
            </li>
          </ul>
          <a
            href={annualLink || '/discord'}
            className="btn-primary w-full block text-center"
          >
            {annualLink ? 'REQUEST SYNDICATE ACCESS' : 'REQUEST SYNDICATE DETAILS'}
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <div className="text-4xl font-extrabold text-accent mb-3">1</div>
          <h3 className="text-2xl font-bold mb-2">Choose Access</h3>
          <p className="text-muted">Select the level that matches how aggressively you want to track the card.</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-extrabold text-accent mb-3">2</div>
          <h3 className="text-2xl font-bold mb-2">Get Your Discord Path</h3>
          <p className="text-muted">Receive access instructions and enter the premium environment where the board actually lives.</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-extrabold text-accent mb-3">3</div>
          <h3 className="text-2xl font-bold mb-2">Track The Full Card</h3>
          <p className="text-muted">See the complete White House slate, confidence scores, volatility notes, and event-night movement.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center text-muted space-y-3">
        <p>🔒 <strong>Cancel anytime.</strong> No fake lock-in.</p>
        <p>💬 <strong>Discord access instructions are delivered after payment.</strong> Automated role access is being tightened for this event.</p>
        <p>⚖️ Analysis only. Never guaranteed outcomes.</p>
        <p>
          Need more proof first? <Link href="/methodology" className="text-accent underline">Review methodology</Link> or <Link href="/discord" className="text-accent underline">see the premium Discord flow</Link>.
        </p>
      </div>
    </div>
  );
}
