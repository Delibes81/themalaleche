import { motion } from 'framer-motion';

const defaultWords = [
    "CERO GRASA",
    "CERO PLUGINS INÚTILES",
    "VENDER O MORIR",
    "PAGA TUS FACTURAS",
    "VELOCIDAD ILEGAL"
];

export default function Marquee({ items = defaultWords }: { items?: string[] }) {
    // Duplicate words to ensure seamless infinite scrolling
    const words = [...items, ...items, ...items, ...items];

    return (
        <div className="relative w-full overflow-hidden bg-gray-900 border-y border-gray-800 py-4 md:py-6 flex font-bold uppercase tracking-widest text-sm md:text-base text-gray-400 select-none">
            <motion.div
                className="flex whitespace-nowrap min-w-[200%]"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 20
                }}
            >
                {words.map((word, index) => (
                    <div key={index} className="flex items-center">
                        <span className="mx-8 hover:text-white transition-colors cursor-default">{word}</span>
                        <span className="text-gray-700">•</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
