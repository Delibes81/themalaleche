import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function NotFound() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white text-gray-900 overflow-x-hidden pt-24 flex flex-col"
        >
            <SEO title="404 - The Mala Leche" description="Te perdiste. O nosotros rompimos algo, pero seguro fuiste tú." />
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-9xl md:text-[12rem] font-black tracking-tighter text-gray-100 select-none">
                            404
                        </h1>
                        <div className="-mt-16 md:-mt-24 relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
                                Te perdiste.
                            </h2>
                            <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-xl mx-auto">
                                O nosotros rompimos algo, pero conociendo a los usuarios, seguro fuiste tú. Ya no hay nada que ver aquí.
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-sm uppercase tracking-widest font-medium hover:bg-black transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Sacame de aquí
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </motion.div>
    );
}
