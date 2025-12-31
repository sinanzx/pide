# Deployment Guide for 10/10 Performance

## Overview
This guide provides deployment recommendations to achieve top-tier performance scores (Lighthouse 100, PageSpeed Insights A+).

## Build Process

### Production Build
```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

### Build Optimization Checklist
- ✅ Code splitting enabled
- ✅ Minification (Terser)
- ✅ Tree shaking
- ✅ Source maps disabled
- ✅ Console logs removed
- ✅ Bundle size optimized

## Server Configuration

### Recommended Hosting Platforms
1. **Vercel** (Recommended)
   - Zero-config deployment
   - Automatic HTTPS
   - Edge network CDN
   - Serverless functions support

2. **Netlify**
   - Git-based deployment
   - Automatic HTTPS
   - Edge handlers
   - Form handling

3. **Cloudflare Pages**
   - Global CDN
   - Workers support
   - Analytics included
   - DDoS protection

### HTTP Headers

#### Security Headers
```nginx
# Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://plausible.io; frame-ancestors 'none';

# Other Security Headers
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

#### Caching Headers
```nginx
# Static Assets (JS, CSS, Images) - 1 year
Cache-Control: public, max-age=31536000, immutable

# HTML Files - No cache
Cache-Control: no-cache, no-store, must-revalidate

# Service Worker - No cache
Cache-Control: no-cache
```

#### Compression
```nginx
# Enable Gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Enable Brotli (if available)
brotli on;
brotli_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Nginx Configuration Example
```nginx
server {
    listen 443 ssl http2;
    server_name pide.protocol;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Root directory
    root /var/www/pide/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Static assets with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service worker - no cache
    location /sw.js {
        add_header Cache-Control "no-cache";
        expires 0;
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
```

### Vercel Configuration
Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify Configuration
Create `netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"
```

## CDN Configuration

### Cloudflare
1. **Enable Auto Minify**: JS, CSS, HTML
2. **Enable Brotli Compression**
3. **Enable HTTP/3**
4. **Page Rules**:
   - Cache Level: Standard
   - Browser Cache TTL: Respect Existing Headers
   - Edge Cache TTL: 1 month for static assets

### Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading
- Use responsive images (srcset)
- Consider image CDN (Cloudinary, Imgix)

## Environment Variables

### Production Environment
```bash
# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_PLAUSIBLE_DOMAIN=pide.protocol

# Error Tracking
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_APP_VERSION=1.0.0

# API Endpoints
VITE_API_URL=https://api.pide.protocol
```

## Performance Monitoring

### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install && npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://pide.protocol
          uploadArtifacts: true
```

### Performance Budgets
```json
{
  "budgets": [
    {
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 300
        },
        {
          "resourceType": "stylesheet",
          "budget": 50
        },
        {
          "resourceType": "image",
          "budget": 200
        },
        {
          "resourceType": "total",
          "budget": 600
        }
      ]
    }
  ]
}
```

## Pre-Deployment Checklist

### Performance
- [ ] Lighthouse score 90+ (all categories)
- [ ] Bundle size < 600kb
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] TTFB < 600ms

### SEO
- [ ] Meta tags complete
- [ ] Open Graph tags
- [ ] Structured data (JSON-LD)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Canonical URLs

### Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSP policy set
- [ ] security.txt present
- [ ] No exposed secrets
- [ ] Dependencies updated

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast passes
- [ ] Focus indicators visible

### PWA
- [ ] Service worker registered
- [ ] Manifest.json valid
- [ ] Icons provided
- [ ] Offline fallback works
- [ ] Install prompt functional

### Monitoring
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Uptime monitoring set
- [ ] Alerts configured

## Post-Deployment

### Verification
1. Run Lighthouse audit
2. Test on PageSpeed Insights
3. Check WebPageTest
4. Verify GTmetrix score
5. Test on real devices

### Monitoring
1. Set up uptime monitoring (UptimeRobot, Pingdom)
2. Configure error alerts (Sentry)
3. Monitor analytics (Google Analytics, Plausible)
4. Track Core Web Vitals
5. Review performance regularly

### Continuous Improvement
1. Monthly performance audits
2. Quarterly dependency updates
3. Regular security patches
4. User feedback integration
5. A/B testing for optimizations

## Troubleshooting

### Common Issues

**Slow Initial Load**
- Check bundle size
- Verify code splitting
- Enable compression
- Use CDN

**Poor LCP Score**
- Optimize images
- Preload critical resources
- Reduce server response time
- Remove render-blocking resources

**High CLS**
- Set image dimensions
- Reserve space for ads
- Avoid inserting content above existing content
- Use transform animations

**Service Worker Issues**
- Clear browser cache
- Check scope configuration
- Verify HTTPS
- Update service worker version

## Resources
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Web.dev Performance](https://web.dev/performance/)
