import Navbar from '../components/Navbar';
import Hero from '../features/landing/Hero';
import About from '../features/landing/About';
import Tracks from '../features/landing/Tracks';
import Requirements from '../features/landing/Requirements';
import Rules from '../features/landing/Rules';
import Schedule from '../features/landing/Schedule';
import Sponsors from '../features/landing/Sponsors';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Tracks />
      <Requirements />
      <Rules />
      <Schedule />
      <Sponsors />
    </div>
  );
}
