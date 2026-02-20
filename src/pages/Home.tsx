import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Solutions from '../components/Solutions';
import Portfolio from '../components/Portfolio';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import Marquee from '../components/Marquee';

export default function Home() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white text-gray-900 relative overflow-x-hidden"
        >
            <SEO />
            <AnimatedBackground />
            <div className="relative z-10">
                <Navbar />
                <Hero />
                <Solutions />
                <Portfolio />
                <Marquee />
                <Contact />
                <Footer />
                <WhatsAppButton />
            </div>
        </motion.div>
    );
}
