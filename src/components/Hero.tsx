import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="inline-block"
          >
            <span className="inline-block text-gray-600 text-[10px] sm:text-xs md:text-sm tracking-[0.15em] md:tracking-[0.3em] uppercase font-light border border-gray-300 px-3 py-2 md:px-4 rounded-full max-w-[90vw] break-words">
              Código Crudo. No apto para intolerantes.
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[0.9] tracking-tight mb-6"
          >
            Tu web actual
            <br />
            <span className="text-gray-400">da pena.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-gray-600 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed font-light mb-10 text-balance"
          >
            Hagamos la web que tu marca se merece.
            <br className="hidden md:block" />
            <span className="font-medium text-gray-900">React, Supabase y 0% tonterías.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href="#contacto"
              className="w-full md:w-auto group inline-flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition-all duration-300"
            >
              Dame la dura verdad
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-500 text-xs tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-12 bg-gradient-to-b from-gray-900/50 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
