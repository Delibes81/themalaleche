import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export default function SEO({
    title = "The Mala Leche | Web Studio - Desarrollo Web Premium",
    description = "Agencia de desarrollo web especializada en React y Supabase. Creamos sitios web rápidos, optimizados y sin plantillas. Código crudo para marcas que buscan rendimiento y exclusividad.",
    keywords = "desarrollo web a medida, react, supabase, diseño web premium, optimización web, seo técnico, programación web, the mala leche, sitio web rápido, web studio mexico",
    image = "/og-image.jpg",
    url = "https://themalaleche.com"
}: SEOProps) {
    const siteTitle = title === "The Mala Leche | Web Studio - Desarrollo Web Premium" ? title : `${title} | The Mala Leche`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="The Mala Leche" />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="The Mala Leche" />
            <meta property="og:locale" content="es_MX" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@themalaleche" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ProfessionalService",
                    "name": "The Mala Leche | Web Studio",
                    "url": url,
                    "logo": "https://themalaleche.com/logo.png",
                    "image": "https://themalaleche.com/og-image.jpg",
                    "description": description,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Mexico",
                        "addressCountry": "MX"
                    },
                    "priceRange": "$$$",
                    "openingHoursSpecification": {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday"
                        ],
                        "opens": "09:00",
                        "closes": "18:00"
                    },
                    "sameAs": [
                        "https://www.instagram.com/themalaleche",
                        "https://github.com/Delibes81"
                    ]
                })}
            </script>
        </Helmet>
    );
}
