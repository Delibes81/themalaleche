import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-200 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="The Mala Leche Logo" className="w-12 h-12 object-contain" />
              <span className="text-gray-900 font-bold text-lg tracking-wider uppercase">
                The Mala Leche
              </span>
            </div>
            <p className="text-gray-600 text-sm font-light leading-relaxed">
              Tómala bajo tu propio riesgo.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold text-sm tracking-wider uppercase mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              {['Inicio', 'Servicios', 'Portafolio', 'Contacto'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-light"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold text-sm tracking-wider uppercase mb-4">
              Síguenos
            </h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/themalaleche"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs font-light">
              © 2025 The Mala Leche. Todos los derechos reservados. Hecho con mala leche.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacidad</a>
              <span>·</span>
              <a href="#" className="hover:text-gray-900 transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
