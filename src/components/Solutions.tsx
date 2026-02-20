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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-200 p-8 md:p-10 h-full hover:border-gray-900 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-0 h-1 bg-gray-900 group-hover:w-full transition-all duration-500 ease-out z-20" />

                <div className="absolute -bottom-8 -right-4 text-8xl md:text-9xl font-black text-gray-50 group-hover:text-gray-100 transition-all duration-500 select-none z-0">
                  0{index + 1}
                </div>

                <div className="relative z-10">
                  <div className="mb-8">
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-none mb-4 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-500">
                      <solution.icon className="w-6 h-6 stroke-[1.5]" />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
                    {solution.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
                    {solution.description}
                  </p>
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
