import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import SEO from '../components/SEO';

export default function Terms() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white text-gray-900 overflow-x-hidden pt-24"
        >
            <SEO
                title="Términos y Condiciones"
                description="Las reglas del juego. Lee nuestros términos y condiciones antes de iniciar tu proyecto con The Mala Leche."
                url="https://themalaleche.com/terminos"
            />
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-light text-gray-500 hover:text-gray-900 transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" /> Volver al Inicio
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-gray-500 text-xs tracking-[0.3em] uppercase font-light block mb-4">
                        06 // Reglas
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-16">
                        Términos y <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Condiciones</span>
                    </h1>

                    <div className="space-y-12 text-gray-800 text-lg font-light leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">1. Aceptación (Sí, obligatoria)</h2>
                            <p>
                                Al navegar por esta página, estás aceptando estas reglas. Si no te gustan, ahí está la X en tu navegador. Nosotros hacemos las cosas bién y rápido; esperamos lo mismo de ti al usar nuestro sitio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">2. El Contenido</h2>
                            <p>
                                Todo lo que ves aquí: textos, imágenes, logos y código es propiedad de <strong>The Mala Leche</strong> (a menos que indiquemos lo contrario). No te lo robes. Somos creativos, no tontos. Si quieres usar algo de lo nuestro, pregúntanos primero a <strong>hola@themalaleche.com</strong>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">3. Nuestro Servicio</h2>
                            <p>
                                La información en este sitio es para que veas que no somos improvisados. Sin embargo, lo que ves aquí no es un contrato. Los servicios de verdad, los precios y las fechas de entrega se cierran en una propuesta formal. Este sitio web es solo nuestra tarjeta de presentación glorificada.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">4. Enlaces de Terceros</h2>
                            <p>
                                Podríamos poner links a otras páginas. Si le das clic y esa página resulta ser un desastre, no es nuestra culpa. Navega bajo tu propio riesgo.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">5. Modificaciones</h2>
                            <p>
                                Si nos aburrimos de estos términos o si nuestro abogado nos regaña, los vamos a cambiar sin avisarte. La versión que está aquí siempre es la que vale. Así de crudo.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>

            <Footer />
            <WhatsAppButton />
        </motion.div>
    );
}
