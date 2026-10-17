# SEO & Production Deployment Checklist
## SafeGuard: Web Architecture, Indexing, and Search Readiness

- **Author**: Javeria Farhan
- **Date**: October 17, 2026
- **Version**: 1.0.0

---

## 1. Technical SEO & Indexing Infrastructure

### 1.1 Web Metadata & Canonical Configuration
- [x] **Canonical Tag**: `<link rel="canonical" href="https://safeguard-pk.org/" />`
- [x] **Title Tag**: `SafeGuard | Open-Source Winter Smog Accident Prevention Engine (Pakistan)`
- [x] **Meta Description**: `Real-time road safety and Stopping Sight Distance (SSD) physics engine powered by Google DeepMind Gemma 4. Protecting Pakistani motorists from winter smog highway pileups.`
- [x] **Meta Viewport**: `width=device-width, initial-scale=1.0, maximum-scale=5.0`
- [x] **Robots Configuration**: `index, follow, max-image-preview:large, max-snippet:-1`

### 1.2 OpenGraph & Twitter Card Markup
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://safeguard-pk.org/" />
<meta property="og:title" content="SafeGuard - Zero Smog Accidents Vision for Pakistan" />
<meta property="og:description" content="Open-source AI and deterministic physics calculating real-time Stopping Sight Distance on M-2 and GT Road during winter smog." />
<meta property="og:image" content="https://safeguard-pk.org/assets/safeguard-social-card.png" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="SafeGuard - AI Road Safety System" />
<meta name="twitter:description" content="Autonomous smog accident prevention platform built for Hacktoberfest 2026 by Javeria Farhan." />
```

### 1.3 Schema.org Structured Data (JSON-LD)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SafeGuard",
  "operatingSystem": "All (Web, Android, iOS via PWA)",
  "applicationCategory": "SafetyApplication",
  "creator": {
    "@type": "Person",
    "name": "Javeria Farhan"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "PKR"
  },
  "description": "An open-source road safety telematics engine using Stopping Sight Distance physics and Gemma 4 multimodal vision to prevent highway collisions in dense winter smog."
}
</script>
```

---

## 2. Crawlability & Production Site Health Checklist

| Item | Action Required | Status |
| :--- | :--- | :--- |
| **Google Search Console (GSC)** | Verify domain ownership via DNS TXT record or HTML file tag | Ready |
| **Google Analytics 4 (GA4)** | Configure measurement ID `G-SAFEGUARDPK1` for privacy-first telemetry tracking | Ready |
| **XML Sitemap** | Host auto-generated `sitemap.xml` listing `/`, `/docs`, `/telemetry`, `/api` | Ready |
| **Robots.txt** | Ensure `robots.txt` allows indexing of all public assets; disallow raw API debug dumps | Ready |
| **Broken Links & 404s** | Run link checker across all markdown docs and external documentation hyperlinks | Passed |
| **Clean URLs & Breadcrumbs** | Use semantic paths: `/corridor/m2-lahore`, `/docs/physics-engine` | Configured |
| **Core Web Vitals** | Target LCP < 1.2s, FID / INP < 50ms, CLS < 0.02 using lightweight Streamlit CSS | Optimized |
| **Mobile Responsiveness** | Test 360px viewport phone display on in-car phone mounts | Passed |

---

## 3. Server-Side `robots.txt` Specification
```txt
User-agent: *
Allow: /
Disallow: /api/v1/internal/
Disallow: /admin/
Sitemap: https://safeguard-pk.org/sitemap.xml
```
