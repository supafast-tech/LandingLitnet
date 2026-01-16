import { useEffect } from 'react';
import { SeoData } from '../utils/seoApi';

interface SEOHeadProps {
  seoData: SeoData;
}

export function SEOHead({ seoData }: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = seoData.meta_title;

    // Helper function to set meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.content = content;
    };

    // Set meta description
    setMetaTag('description', seoData.meta_description);
    
    // Set meta keywords
    if (seoData.meta_keywords) {
      setMetaTag('keywords', seoData.meta_keywords);
    }

    // Set Open Graph tags
    setMetaTag('og:title', seoData.og_title, true);
    setMetaTag('og:description', seoData.og_description, true);
    setMetaTag('og:image', seoData.og_image_url, true);
    setMetaTag('og:url', seoData.og_url, true);
    setMetaTag('og:type', 'website', true);

    // Set Twitter Card tags
    setMetaTag('twitter:card', seoData.twitter_card);
    setMetaTag('twitter:title', seoData.twitter_title);
    setMetaTag('twitter:description', seoData.twitter_description);
    setMetaTag('twitter:image', seoData.twitter_image_url);

    // Set canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = seoData.og_url;

  }, [seoData]);

  return null; // This component doesn't render anything
}
