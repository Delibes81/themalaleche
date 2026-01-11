import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'E-Commerce Premium',
    category: 'Comercio Electrónico',
    description: 'Plataforma de alta conversión con gestión de inventario en tiempo real',
    tech: ['React', 'Supabase', 'Stripe'],
  },
  {
    title: 'Dashboard Analytics',
    category: 'SaaS Platform',
    description: 'Sistema de visualización de métricas con integraciones complejas',
    tech: ['TypeScript', 'D3.js', 'PostgreSQL'],
  },
  {
    title: 'Booking System',
    category: 'Reservaciones',
    description: 'Motor de reservas con sincronización multi-calendario',
    tech: ['Next.js', 'Prisma', 'Redis'],
  },
];

export default function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="portafolio" ref={ref} className="relative py-16 px-6">
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
              03 // Evidencia
            </span>
            <div className="w-8 h-px bg-gray-300" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Hechos, no palabras.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-500 overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 font-light">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs border border-gray-300 px-2 py-1 text-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-900/0 via-gray-900/50 to-gray-900/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 text-sm font-light mb-6">
            Estos son solo algunos ejemplos. Cada proyecto es único.
          </p>
          <a
            href="#contacto"
            className="inline-block border border-gray-900 px-8 py-3 text-gray-900 text-sm uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Ver más proyectos
          </a>
        </motion.div>
      </div>
    </section>
  );
}
