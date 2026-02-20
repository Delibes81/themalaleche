import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  const handleHomeClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navItems = ['Inicio', 'Servicios', 'Portafolio', 'Contacto'];

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const linkVariants: Variants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm'
        : 'py-4 md:py-6 bg-white/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-gray-100 md:border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={handleHomeClick}>
            <motion.div
              className="flex items-center gap-3 relative z-50 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src="/logo.png" alt="The Mala Leche Logo" className="w-10 h-10 md:w-16 md:h-16 object-contain" />
              <span className={`font-bold text-lg md:text-xl tracking-wider uppercase transition-colors duration-300 ${isOpen ? 'text-gray-900' : 'text-gray-900'}`}>
                The Mala Leche
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {item === 'Inicio' ? (
                  <Link
                    to="/"
                    onClick={handleHomeClick}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm tracking-wide uppercase font-light"
                  >
                    {item}
                  </Link>
                ) : (
                  <Link
                    to={`/#${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm tracking-wide uppercase font-light"
                  >
                    {item}
                  </Link>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 p-2 text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-white md:hidden flex flex-col justify-center px-8 h-dvh"
          >
            <div className="space-y-8 mt-20">
              {navItems.map((item, i) => (
                <div key={item} className="overflow-hidden">
                  {item === 'Inicio' ? (
                    <Link
                      to="/"
                      className="block text-4xl font-bold text-gray-900 tracking-tight hover:text-gray-600 transition-colors"
                      onClick={handleHomeClick}
                    >
                      {item}
                    </Link>
                  ) : (
                    <motion.div custom={i} variants={linkVariants}>
                      <Link
                        to={`/#${item.toLowerCase()}`}
                        className="block text-4xl font-bold text-gray-900 tracking-tight hover:text-gray-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item}
                      </Link>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-12 border-t border-gray-200"
            >
              <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">Contacto</p>
              <a href="mailto:hola@themalaleche.com" className="text-xl text-gray-900 block mb-2">hola@themalaleche.com</a>
              <div className="flex gap-4 mt-8">
                <a href="#" className="w-10 h-10 border border-gray-200 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-900 hover:text-white transition-colors">IG</a>
                <a href="#" className="w-10 h-10 border border-gray-200 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-900 hover:text-white transition-colors">LI</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
