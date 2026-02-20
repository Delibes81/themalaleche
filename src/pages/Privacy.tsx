import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import SEO from '../components/SEO';

export default function Privacy() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white text-gray-900 overflow-x-hidden pt-24"
        >
            <SEO
                title="Aviso de Privacidad"
                description="Conoce nuestro aviso de privacidad. En The Mala Leche somos transparentes sobre cómo procesamos y protegemos tus datos."
                url="https://themalaleche.com/privacidad"
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
                        05 // Legales
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-16">
                        Aviso de <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Privacidad</span>
                    </h1>

                    <div className="space-y-12 text-gray-800 text-lg font-light leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">1. La Neta de tus Datos</h2>
                            <p>
                                Mira, no te vamos a mentir con textos aburridos que nadie lee. Si llenas un formulario en esta página, es porque quieres trabajar con nosotros. <strong>The Mala Leche</strong> (nosotros) vamos a guardar tu nombre, correo y lo que sea que nos cuentes, pura y exclusivamente para venderte nuestros servicios o decirte que tu proyecto no nos late. No se los vamos a vender a terceros a lo tonto.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">2. ¿Para qué los usamos?</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>Para responderte y ver si hacemos negocio.</li>
                                <li>Para mandarte propuestas (si es que sobrevives al primer filtro).</li>
                                <li>Para facturarte, obvio.</li>
                                <li>Para entender quién nos visita y cómo mejorar esta web.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">3. Cookies y Rastreos</h2>
                            <p>
                                Sí, usamos cookies. Como todos. Nos sirven para ver si te quedas viendo nuestro portafolio o si huyes despavorido. Si no te gusta que te rastreen para fines analíticos básicos, cierra la pestaña. Así de simple.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">4. Tus Derechos (Derechos ARCO)</h2>
                            <p>
                                Si un día te despiertas y decides que ya no quieres que tengamos tu correo, nos mandas un mensaje a <strong>hola@themalaleche.com</strong> pidiendo que te borremos y lo hacemos. Tienes derecho a acceder, rectificar, cancelar u oponerte a que usemos tus datos. Nosotros no perdemos el tiempo, tú tampoco.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">5. Cambios a este aviso</h2>
                            <p>
                                Podemos cambiar este aviso cuando nos dé la gana, sobre todo si la ley cambia o si se nos ocurre una mejor forma de explicarlo. Revísalo de vez en cuando si te quita el sueño.
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
