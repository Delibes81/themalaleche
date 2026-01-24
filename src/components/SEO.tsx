import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export default function SEO({
    title = "The Mala Leche | Web Studio",
    description = "Desarrollo web premium con React y Supabase. Sin plantillas, solo código crudo. Sitios que venden.",
    keywords = "desarrollo web, react, supabase, diseño web, agencia digital, the mala leche, web design, web development",
    image = "/og-image.jpg",
    url = "https://themalaleche.com"
}: SEOProps) {
    const siteTitle = title === "The Mala Leche | Web Studio" ? title : `${title} | The Mala Leche`;

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
                    "@type": "WebSite",
                    "name": "The Mala Leche",
                    "url": url,
                    "description": description,
                    "publisher": {
                        "@type": "Organization",
                        "name": "The Mala Leche",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://themalaleche.com/logo.png" // We might want to fix this later if we have a real URL
                        }
                    }
                })}
            </script>
        </Helmet>
    );
}
