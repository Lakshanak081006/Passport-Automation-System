import { Link } from "react-router-dom";
import { homePathFor, useAuth } from "../context/AuthContext";
import TravelMarquee from "../components/TravelMarquee";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero travel-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-tag">🌐 Official Digital Gateway</span>
          <h1>Passport Automation System</h1>
          <p>
            Your journey around the globe starts here. Apply online, schedule your police verification appointment, and track every stage in real-time.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link className="btn btn-hero-primary" to={homePathFor(user.role)}>Go to Dashboard</Link>
            ) : (
              <>
                <Link className="btn btn-hero-primary" to="/register">Apply Now / Create Account</Link>
                <Link className="btn btn-hero-secondary" to="/login">Login to Account</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Marquee Image Ticker Slider */}
      <TravelMarquee />

      {/* Process Steps */}
      <h2 className="section-title">How Passport Automation Works</h2>
      <div className="grid-4">
        <div className="card step">
          <div className="step-no">1</div>
          <h4>Online Registration</h4>
          <p>Create your secure applicant profile with personal & address details.</p>
        </div>
        <div className="card step">
          <div className="step-no">2</div>
          <h4>Submit Application</h4>
          <p>Fill out the passport application form for Fresh or Renewal passport.</p>
        </div>
        <div className="card step">
          <div className="step-no">3</div>
          <h4>Police Verification</h4>
          <p>Get a scheduled appointment at your local police station with a reference ID.</p>
        </div>
        <div className="card step">
          <div className="step-no">4</div>
          <h4>Dispatch & Issue</h4>
          <p>Receive live status updates until your official passport is issued.</p>
        </div>
      </div>

      {/* Travel Showcase Cards */}
      <h2 className="section-title">Explore The World With Ease</h2>
      <div className="travel-destinations-grid">
        <div className="destination-card">
          <div className="dest-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
              alt="European Gateway"
            />
          </div>
          <div className="dest-info">
            <span className="dest-badge">International Destinations</span>
            <h3>Explore Europe</h3>
            <p>Hassle-free visa & passport verification for global travel options.</p>
          </div>
        </div>

        <div className="destination-card">
          <div className="dest-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
              alt="Asian Culture"
            />
          </div>
          <div className="dest-info">
            <span className="dest-badge">Cultural Expeditions</span>
            <h3>Discover Asia</h3>
            <p>Experience historical heritage and world-famous destinations.</p>
          </div>
        </div>

        <div className="destination-card">
          <div className="dest-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80"
              alt="Mountain Adventure"
            />
          </div>
          <div className="dest-info">
            <span className="dest-badge">Nature & Mountains</span>
            <h3>Mountain & Beach Getaways</h3>
            <p>Unlock worldwide destinations with your verified passport.</p>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <h2 className="section-title">Important Guidelines for Applicants</h2>
      <div className="card guidelines-card">
        <ul className="plain-list">
          <li><strong>Unique Reference:</strong> Keep your Application ID safe for tracking and police verification.</li>
          <li><strong>Police Station Verification:</strong> Attend your scheduled verification date with original identity proofs.</li>
          <li><strong>One Active Application:</strong> Only one active passport application is allowed per applicant.</li>
          <li><strong>Instant Email Notifications:</strong> All status updates and appointment alerts are emailed automatically.</li>
        </ul>
      </div>
    </div>
  );
}
