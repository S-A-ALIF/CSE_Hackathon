import Navbar from '../components/Navbar';
import Home from '../features/landing/Home';
import About from '../features/landing/About';
import Requirements from '../features/landing/Requirements';
import Judging from '../features/landing/Judging';
import Timeline from '../features/landing/Timeline';
import Rules from '../features/landing/Rules';
import Footer from '../features/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Home />
      <About />
      <Requirements />

      <Judging />
      <Timeline />
      <Rules />
      <Footer />
    </div>
  );
}
