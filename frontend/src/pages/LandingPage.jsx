import Navbar from '../components/Navbar';
import Home from '../features/landing/Home';
import About from '../features/landing/About';
import Requirements from '../features/landing/Requirements';
import Rules from '../features/landing/Rules';
import Schedule from '../features/landing/Schedule';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Home />
      <About />
      <Requirements />
      <Rules />
      <Schedule />
    </div>
  );
}
