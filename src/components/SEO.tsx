import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object | object[];
}

const DEFAULT_TITLE = 'Best Nursing College in Tamil Nadu | Mahalakshmi College of Nursing - Admissions 2026';
const DEFAULT_DESCRIPTION = 'Ranked #1 Best Nursing College in Tamil Nadu: Mahalakshmi College of Nursing. INC Code 986 & TNNMC approved B.Sc Nursing & GNM with 10+ bed hospital rotations, 9 simulation labs, hostel & 100% placements. Admissions 2026–27.';
const DEFAULT_KEYWORDS = [
  'best nursing college in tamilnadu',
  'best nursing college in tamil nadu',
  'best nursing colleges in tamilnadu',
  'best nursing colleges in tamil nadu',
  'top nursing college in tamil nadu',
  'top nursing colleges in tamil nadu',
  'top 10 nursing colleges in tamilnadu',
  'Best Nursing Colleges in Tamil Nadu - Courses, Fees',
  'best bsc nursing colleges in tamil nadu',
  'nursing colleges in tamilnadu with hostel',
  'nursing colleges in tamilnadu with hospital training',
  'nursing colleges in trichy',
  'best nursing college in trichy',
  'nursing admission 2026 tamil nadu',
  'bsc nursing admission 2026 tamil nadu',
  'inc approved nursing colleges in tamilnadu',
  'top private nursing colleges in tamil nadu',
  'gnm nursing colleges in tamilnadu',
  'post basic bsc nursing colleges in tamil nadu',
  'nursing colleges with 100% placement in tamil nadu',
  'tamil nadu dr mgr medical university affiliated nursing colleges',
  'Mahalakshmi College of Nursing',
  'Nursing Admission 2026-27',
  'Nursing College with Placements',
  'Nursing College with Hospital Training',
  'Best Nursing College for Clinical Practice',
  'Scholarships for Nursing Students',
  'Nursing Career After 12th',
  'Nursing College with Hostel Facilities',
  'Staff Nurse Course in Tamil Nadu'
];
const DEFAULT_DOMAIN = 'https://mahalakshmicollegeofnursing.com';
const DEFAULT_OG_IMAGE = `${DEFAULT_DOMAIN}/mahalakshmi_nursing_logo.png`;

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl = DEFAULT_DOMAIN,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  schema,
}) => {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Helper to update or create meta tags
    const updateMetaTag = (selector: string, attribute: 'name' | 'property', attrValue: string, contentValue: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    const combinedKeywords = Array.from(new Set([...keywords, ...DEFAULT_KEYWORDS])).join(', ');

    // Primary Meta
    updateMetaTag('meta[name="title"]', 'name', 'title', title);
    updateMetaTag('meta[name="description"]', 'name', 'description', description);
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', combinedKeywords);

    // Open Graph
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Mahalakshmi College of Nursing');
    updateMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_IN');

    // Twitter
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // Canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    // Default fallback Schema.org JSON-LD structured data
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['EducationalOrganization', 'CollegeOrUniversity', 'Organization', 'LocalBusiness', 'MedicalOrganization'],
          '@id': `${DEFAULT_DOMAIN}/#college`,
          'name': 'Mahalakshmi College of Nursing',
          'legalName': 'Mahalakshmi College of Nursing',
          'alternateName': [
            'Best Nursing College in Tamilnadu',
            'Best Nursing College in Tamil Nadu',
            'Best Nursing Colleges in Tamil Nadu',
            'Best Nursing Colleges in Tamil Nadu - Courses, Fees',
            'Top Nursing College in Tamil Nadu',
            'Top Nursing Colleges in Tamil Nadu',
            'Mahalakshmi Nursing College Trichy',
            'Mahalakshmi School of Nursing',
            'MCN Trichy',
            'Best Nursing College in Trichy',
            'Best Nursing College in India'
          ],
          'url': DEFAULT_DOMAIN,
          'logo': DEFAULT_OG_IMAGE,
          'image': DEFAULT_OG_IMAGE,
          'description': DEFAULT_DESCRIPTION,
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Trichy–Salem Highway, Thodayur Post, Melpathu Village, Mannachanallur Taluk',
            'addressLocality': 'Tiruchirappalli',
            'addressRegion': 'Tamil Nadu',
            'postalCode': '621105',
            'addressCountry': 'IN'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': '10.8872',
            'longitude': '78.6784'
          },
          'telephone': '+91-7358873106',
          'email': 'info@mahalakshmicollegeofnursing.com',
          'sameAs': [
            'https://facebook.com/mahalakshmicollegeofnursing',
            'https://instagram.com/mahalakshmicollegeofnursing',
            'https://youtube.com/@mahalakshmicollegeofnursing',
            'https://www.crunchbase.com/organization/mahalakshmi-college-of-nursing',
            'https://www.justdial.com/Trichy/Mahalakshmi-College-Of-Nursing-Thuraiyur/0431PX431-X431-230812124111-T9N4_BZDET',
            'https://www.justdial.com/Trichy/Mahalakshmi-College-Of-Nursing-Thuraiyur/0431PX431-X431-230812124111-T9N4_BZDET/service-catalog-courses',
            'https://mynursingadmission.com/college/mahalakshmi-college-of-nursing-trichy/',
            'https://www.tamilnaducolleges.org/nursing-colleges-in-trichy-district/mahalakshmi-college-of-nursing/2900'
          ]
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Mahalakshmi College of Nursing',
              'item': DEFAULT_DOMAIN
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': title.split('|')[0].trim(),
              'item': canonicalUrl
            }
          ]
        }
      ]
    };

    const finalSchema = schema || defaultSchema;

    // Inject Schema.org JSON-LD structured data
    let schemaScript = document.getElementById('dynamic-seo-schema') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'dynamic-seo-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.innerHTML = JSON.stringify(finalSchema);

    return () => {
      // Clean up dynamic schema script on component unmount
      const existingScript = document.getElementById('dynamic-seo-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, schema]);

  return null;
};

export default SEO;
