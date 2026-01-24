import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Code2, Network } from 'lucide-react';

const solutions = [
  {
    icon: Zap,
    title: 'Vender o Morir',
    description: 'Psicología agresiva. Si tu usuario no compra, tu web es un adorno costoso.',
  },
  {
    icon: Code2,
    title: 'Tech Detox',
    description: 'Cero grasa. Cero plugins inútiles. Velocidad ilegal en 50 estados.',
  },
  {
    icon: Network,
    title: 'Gestión de Desastres',
    description: '¿Tu sistema actual es un chiste? Construimos ecosistemas blindados para cuando las cosas se ponen serias.',
  },
];

export default function Solutions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="servicios" ref={ref} className="relative py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gray-300" />
            <span className="text-gray-600 text-xs tracking-[0.3em] uppercase font-light">
              02 // SIN PAUSTERIZAR
            </span>
            <div className="w-8 h-px bg-gray-300" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Hecho con Mala Leche, obvio.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              <div className="relative bg-gray-50 border border-gray-200 p-8 h-full hover:border-gray-300 transition-all duration-500">
                <div className="absolute top-0 left-0 w-1 h-0 bg-gray-900 group-hover:h-full transition-all duration-500" />

                <div className="mb-6">
                  <solution.icon className="w-10 h-10 text-gray-700 stroke-[1.5]" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  {solution.title}
                </h3>

                <p className="text-gray-600 leading-relaxed font-light">
                  {solution.description}
                </p>

                <div className="absolute top-8 right-8 text-6xl font-bold text-gray-200 group-hover:text-gray-300 transition-all duration-500">
                  0{index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-block border border-gray-300 px-6 py-3">
            <p className="text-gray-600 text-sm font-light tracking-wider">
              <span className="text-gray-900 font-medium">ARMAMENTO:</span> React · TypeScript · Supabase · Vite · lactosa
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
