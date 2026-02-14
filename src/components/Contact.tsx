import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const InputField = ({ label, name, type = 'text', value, onChange }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <label className={`absolute left-0 transition-all duration-300 ${isFocused || value ? '-top-6 text-xs text-gray-900' : 'top-0 text-lg text-gray-500 font-light'}`}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
      />
      <div className={`absolute bottom-0 left-0 h-px bg-gray-900 transition-all duration-500 ${isFocused ? 'w-full' : 'w-0'}`} />
    </div>
  );
};

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contacto" ref={ref} className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
        {/* Left Column: Context & Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div>
            <span className="text-gray-500 text-xs tracking-[0.3em] uppercase font-light block mb-4">
              04 // La Neta
            </span>
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
              ¿Tienes <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
                el valor?
              </span>
            </h2>
          </div>

          <div className="space-y-8">
            <p className="text-gray-600 text-lg font-light leading-relaxed max-w-md">
              <strong className="text-gray-900 font-bold">The Mala Leche.</strong> No somos para todos.
              Si quieres que te endulcen el oído, ve a otra agencia.
              Si quieres facturar y dejar de perder el tiempo, llena el formulario.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Línea Roja</h4>
                <p className="text-gray-900 font-medium break-words">hola@themalaleche.com</p>
                <p className="text-gray-900 font-medium">+52 (55)5191-6061</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Base</h4>
                <p className="text-gray-900 font-medium">CDMX, MX</p>
                <p className="text-gray-500 text-sm">Operaciones Globales</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] relative"
        >
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-12">
              <InputField
                label="Nombre / Organización"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <InputField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="Tipo de Proyecto"
                name="project"
                value={formData.project}
                onChange={handleChange}
              />

              <div className="relative group">
                <label className={`absolute left-0 transition-all duration-300 ${formData.message ? '-top-6 text-xs text-gray-900' : 'top-0 text-lg text-gray-500 font-light'}`}>
                  Detalles de la Misión
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={1}
                  className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300 resize-none min-h-[40px]"
                  onFocus={(e) => e.target.rows = 4}
                  onBlur={(e) => !e.target.value && (e.target.rows = 1)}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="group relative inline-flex items-center gap-4 px-8 py-4 bg-gray-900 text-white overflow-hidden transition-all hover:pr-10"
              >
                <span className="relative z-10 font-medium tracking-widest text-sm uppercase">Iniciar Detonación</span>
                <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gray-700 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
