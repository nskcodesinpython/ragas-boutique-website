# Designer Blouse Catalog Website - MVP Build Plan

**Document Version:** 1.0 MVP  
**Date:** October 6, 2026  
**Project:** Designer Blouse AI Platform - Phase 1 MVP  
**Scope:** Catalog Website with WhatsApp Inquiry

---

## Executive Summary

This MVP focuses on creating a beautiful catalog website to showcase designer blouses with WhatsApp inquiry functionality. No payment processing, order management, or stock tracking at this stage.

**Core MVP Features:**
- Professional product catalog
- Product browsing and filtering
- Product detail pages with image galleries
- WhatsApp inquiry integration
- Contact information
- Mobile-responsive design

---

## Table of Contents

1. [MVP Scope](#1-mvp-scope)
2. [Design System](#2-design-system)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Implementation Phases](#5-implementation-phases)
6. [Page Requirements](#6-page-requirements)
7. [WhatsApp Integration](#7-whatsapp-integration)
8. [Timeline](#8-timeline)

---

## 1. MVP Scope

### ✅ What's Included

**Core Features:**
- Homepage with hero section and featured products
- Product catalog/browse page with filters
- Individual product detail pages
- About page
- Contact page
- WhatsApp "Inquire Now" buttons on every product
- Mobile-responsive design
- Fast loading and optimized images

**Design Features:**
- Elegant color scheme (luxury fashion)
- High-quality product photography display
- Smooth animations and transitions
- Professional typography
- Clean, spacious layouts

### ❌ What's NOT Included (Future Phases)

- Shopping cart
- Checkout process
- Payment gateway
- User authentication/login
- Order management
- Stock tracking
- AI design tools
- Virtual try-on
- Customer dashboard
- Reviews and ratings
- Search functionality (can add later)
- Email newsletter (can add later)

---

## 2. Design System

### 2.1 Color Palette

```css
/* Primary Colors */
--primary: #8B4789;           /* Elegant Purple */
--primary-light: #A566A3;
--primary-dark: #6B3567;

--secondary: #C9A96E;         /* Champagne Gold */
--secondary-light: #E0C890;
--secondary-dark: #B08F50;

--accent: #D4517D;            /* Rose Pink */
--accent-light: #E377A0;
--accent-dark: #B03A5F;

/* Neutrals */
--black: #1A1A1A;
--gray-900: #2A2A2A;
--gray-700: #4A4A4A;
--gray-500: #6B6B6B;
--gray-300: #A0A0A0;
--gray-100: #E5E5E5;
--gray-50: #F5F5F5;
--white: #FFFFFF;

/* Semantic Colors */
--success: #2D7A3E;
--info: #457B9D;
```

### 2.2 Typography

**Font Families:**
```css
--font-heading: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;
--font-accent: 'Montserrat', sans-serif;
```

**Font Sizes:**
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
```

### 2.3 Spacing

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
```

### 2.4 Breakpoints

```css
/* Mobile First */
--screen-sm: 640px;   /* Small devices */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
```

---

## 3. Technology Stack

### Frontend (Recommended)

**Option A: Next.js 14 (Recommended)**
```json
{
  "framework": "Next.js 14",
  "styling": "Tailwind CSS",
  "ui-components": "shadcn/ui",
  "animation": "Framer Motion",
  "icons": "Lucide Icons",
  "forms": "React Hook Form"
}
```

**Why Next.js?**
- Built-in image optimization
- Fast page loads with SSG/SSR
- SEO-friendly out of the box
- Easy deployment to Vercel
- Great developer experience

### Backend (Minimal for MVP)

For MVP, you can use:
- **Static hosting** (Vercel, Netlify) - No backend needed
- **Product data** stored in JSON files or CMS like:
  - Sanity.io (free tier)
  - Contentful (free tier)
  - Or simple JSON files in the project

### WhatsApp Integration

- WhatsApp Business API (optional for advanced features)
- Or simple `wa.me` links (free, works immediately)

---

## 4. Project Structure

```
designer-blouse-website/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   │   └── hero-banner.jpg
│   │   ├── products/
│   │   │   ├── product-1.jpg
│   │   │   ├── product-2.jpg
│   │   │   └── ...
│   │   ├── collections/
│   │   │   ├── traditional.jpg
│   │   │   ├── contemporary.jpg
│   │   │   └── festive.jpg
│   │   └── about/
│   │       └── studio.jpg
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   ├── globals.css          # Global styles
│   │   ├── products/
│   │   │   └── page.tsx         # Products listing
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Product detail
│   │   ├── about/
│   │   │   └── page.tsx         # About page
│   │   └── contact/
│   │       └── page.tsx         # Contact page
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── ProductGallery.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── WhatsAppButton.tsx
│   │   │   └── Container.tsx
│   │   └── ui/
│   │       └── (shadcn components)
│   │
│   ├── lib/
│   │   ├── products.ts          # Product data/API
│   │   ├── whatsapp.ts          # WhatsApp helper functions
│   │   └── utils.ts             # Utility functions
│   │
│   ├── data/
│   │   └── products.json        # Product catalog data
│   │
│   └── types/
│       └── index.ts             # TypeScript types
│
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 5. Implementation Phases

### Phase 1: Setup & Foundation (Week 1)
**Duration:** 3-4 days

- [x] Initialize Next.js 14 project with TypeScript
- [x] Install and configure Tailwind CSS
- [x] Set up design tokens (CSS variables)
- [x] Install shadcn/ui components
- [x] Create basic layout components (Header, Footer)
- [x] Set up responsive navigation
- [x] Configure image optimization
- [x] Create product data structure

### Phase 2: Core Pages (Week 1-2)
**Duration:** 4-5 days

- [ ] **Homepage**
  - [ ] Hero section with CTA
  - [ ] Featured products section
  - [ ] Collections showcase
  - [ ] About preview
  - [ ] Contact CTA

- [ ] **Products Listing Page**
  - [ ] Product grid layout
  - [ ] Filter sidebar (category, color, style)
  - [ ] Product cards with images
  - [ ] Responsive grid
  - [ ] Loading states

- [ ] **Product Detail Page**
  - [ ] Image gallery with zoom
  - [ ] Product information
  - [ ] Specifications
  - [ ] WhatsApp inquiry button
  - [ ] Related products
  - [ ] Size guide

- [ ] **About Page**
  - [ ] Brand story
  - [ ] Studio images
  - [ ] Values section

- [ ] **Contact Page**
  - [ ] Contact information
  - [ ] Location/address
  - [ ] Business hours
  - [ ] WhatsApp direct link

### Phase 3: WhatsApp Integration (Week 2)
**Duration:** 1-2 days

- [ ] Create WhatsApp button component
- [ ] Implement pre-filled message templates
- [ ] Add floating WhatsApp button
- [ ] Product-specific inquiry messages
- [ ] Test WhatsApp links on mobile

### Phase 4: Polish & Optimization (Week 2)
**Duration:** 2-3 days

- [ ] Add animations and transitions
- [ ] Optimize images (WebP format)
- [ ] Add loading skeletons
- [ ] Implement lazy loading
- [ ] Add hover effects
- [ ] Mobile responsiveness fine-tuning
- [ ] Cross-browser testing

### Phase 5: Testing & Launch (Week 3)
**Duration:** 2-3 days

- [ ] Functionality testing
- [ ] Mobile device testing
- [ ] Browser compatibility
- [ ] Performance optimization
- [ ] SEO setup (meta tags, sitemap)
- [ ] Deploy to Vercel
- [ ] Domain configuration
- [ ] Google Analytics setup

---

## 6. Page Requirements

### 6.1 Homepage

**Hero Section:**
- Full-width banner image (1920x800px)
- Headline: "Exquisite Designer Blouses"
- Subheadline: "Handcrafted Traditional & Contemporary Designs"
- CTA Button: "Browse Collection"
- WhatsApp button: "Inquire on WhatsApp"

**Featured Products:**
- Title: "Featured Designs"
- 4-8 product cards
- "View All Products" link

**Collections Showcase:**
- 3-4 collection cards:
  - Traditional Collection
  - Contemporary Collection
  - Festive Collection
  - Bridal Collection
- Each with image, title, and "Explore" button

**About Preview:**
- Short brand story (2-3 sentences)
- Studio image
- "Learn More" link

**Contact CTA:**
- "Have Questions? Let's Talk"
- WhatsApp button

### 6.2 Products Listing Page

**Layout:**
- Sidebar filters (left side, collapsible on mobile)
- Product grid (right side)
- 3 columns on desktop, 2 on tablet, 1 on mobile

**Filters:**
- Category: All, Traditional, Contemporary, Festive, Bridal
- Color: Visual color swatches
- Sleeve Type: Sleeveless, Short Sleeve, Elbow Length, Full Sleeve
- Neckline: Round, V-Neck, Boat Neck, Sweetheart, Halter
- Fabric: Silk, Cotton, Brocade, Velvet, Georgette

**Product Card:**
- Product image (hover shows second image)
- Product name
- Category tag
- Price (or "Inquire for Price")
- "View Details" button
- WhatsApp quick inquiry icon

**Results:**
- Show count (e.g., "Showing 24 products")
- Sort option (Featured, Newest, Price)

### 6.3 Product Detail Page

**Image Gallery:**
- Main large image
- Thumbnail strip (4-6 images)
- Click to zoom
- Swipe on mobile

**Product Information:**
```
Product Name
Category Tag | SKU

Price: ₹X,XXX (or "Inquire for Price")

Short Description (2-3 sentences)

[WhatsApp Inquiry Button - Primary CTA]

Specifications:
- Fabric: [Fabric type]
- Color: [Color name]
- Sleeve Type: [Type]
- Neckline: [Style]
- Work: [Embroidery/Plain/etc]
- Care Instructions: [Instructions]

Size Guide: [Link to size chart modal]

Available Customizations:
- Custom measurements
- Color variations
- Embroidery options
```

**Tabs Section:**
- Details (full description)
- Size Chart
- Care Instructions
- Shipping Info

**Related Products:**
- "Similar Designs" section
- 4 product cards

### 6.4 About Page

**Content Structure:**
- Hero image of studio/workshop
- "Our Story" section (300-400 words)
- "What We Do" (3-4 points with icons)
- "Why Choose Us" (quality, craftsmanship, customization)
- Team photo (optional)
- Call to action: "Browse Our Collection"

### 6.5 Contact Page

**Information Display:**
```
Get In Touch

We'd love to hear from you! Reach out for inquiries, 
custom orders, or any questions about our designs.

Phone: +91 XXXXX XXXXX
Email: info@designerblouse.com
WhatsApp: [Button with direct link]

Business Hours:
Monday - Saturday: 10:00 AM - 7:00 PM
Sunday: Closed

Address:
[Your Studio Address]
[City, State - PIN]

[Optional: Google Maps embed]
```

**Social Media Links:**
- Instagram
- Facebook
- Pinterest
- WhatsApp Business

---

## 7. WhatsApp Integration

### 7.1 WhatsApp Link Format

```
https://wa.me/91XXXXXXXXXX?text=MESSAGE
```

**Example:**
```
https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20your%20designer%20blouses
```

### 7.2 Pre-filled Message Templates

**Homepage CTA:**
```
Hi! I'm interested in your designer blouses. I'd like to know more about your collections.
```

**Product Page Inquiry:**
```
Hi! I'm interested in [Product Name] (SKU: [SKU]). 
Could you provide more details about:
- Pricing
- Customization options
- Delivery time
```

**General Inquiry (Contact Page):**
```
Hi! I have a question about your designer blouses.
```

### 7.3 WhatsApp Button Component

**Floating Button (Bottom Right):**
- Fixed position
- WhatsApp icon
- Green color (#25D366)
- Pulse animation
- Visible on all pages

**Product-specific Button:**
- "Inquire on WhatsApp" text
- Product details pre-filled
- Primary button style

### 7.4 Implementation Example

```typescript
// lib/whatsapp.ts
export const WHATSAPP_NUMBER = '919876543210'; // Your number

export function getWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function getProductInquiryMessage(product: Product): string {
  return `Hi! I'm interested in ${product.name} (SKU: ${product.sku}). Could you provide more details about pricing, customization options, and delivery time?`;
}

// components/WhatsAppButton.tsx
export function WhatsAppButton({ product }: { product?: Product }) {
  const message = product 
    ? getProductInquiryMessage(product)
    : "Hi! I'm interested in your designer blouses.";
  
  const link = getWhatsAppLink(message);
  
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <Button className="bg-green-500 hover:bg-green-600">
        <WhatsAppIcon /> Inquire on WhatsApp
      </Button>
    </a>
  );
}
```

---

## 8. Product Data Structure

### 8.1 JSON Schema

```json
{
  "id": "blouse-001",
  "name": "Elegant Silk Blouse with Gold Zari",
  "slug": "elegant-silk-blouse-gold-zari",
  "sku": "DSB-001",
  "category": "traditional",
  "price": 3500,
  "priceDisplay": "₹3,500",
  "showPrice": true,
  "images": [
    "/images/products/blouse-001-1.jpg",
    "/images/products/blouse-001-2.jpg",
    "/images/products/blouse-001-3.jpg",
    "/images/products/blouse-001-4.jpg"
  ],
  "description": {
    "short": "Exquisite silk blouse with intricate gold zari work, perfect for weddings and special occasions.",
    "full": "This stunning blouse is crafted from premium silk fabric and features intricate gold zari embroidery. The traditional design is complemented by a modern silhouette, making it perfect for weddings, festivals, and special occasions. Each piece is handcrafted by skilled artisans."
  },
  "specifications": {
    "fabric": "Pure Silk",
    "color": "Deep Maroon",
    "sleeveType": "Elbow Length",
    "neckline": "Round Neck",
    "work": "Gold Zari Embroidery",
    "care": "Dry clean only",
    "occasion": "Wedding, Festive"
  },
  "features": [
    "Handcrafted gold zari work",
    "Premium silk fabric",
    "Custom fit available",
    "Made to order"
  ],
  "available": true,
  "featured": true,
  "tags": ["traditional", "silk", "zari", "wedding", "festive"],
  "relatedProducts": ["blouse-002", "blouse-005", "blouse-008"]
}
```

### 8.2 Sample Products for MVP

**Minimum Products for Launch:** 12-20 products

**Distribution:**
- Traditional: 5-7 products
- Contemporary: 5-7 products
- Festive: 3-4 products
- Bridal: 2-3 products

---

## 9. Timeline

### Week 1 (5 days)
- Day 1-2: Project setup, design system, layout components
- Day 3-4: Homepage and Products listing page
- Day 5: Product detail page structure

### Week 2 (5 days)
- Day 1: Complete product detail page
- Day 2: About and Contact pages
- Day 3: WhatsApp integration
- Day 4-5: Polish, animations, mobile optimization

### Week 3 (3-4 days)
- Day 1-2: Testing and bug fixes
- Day 3: SEO setup, performance optimization
- Day 4: Deploy and launch

**Total Duration:** 13-14 days (2-3 weeks)

---

## 10. Content Requirements

### Product Photography
- **Per Product:** 4-6 high-quality images minimum
- **Shots Needed:**
  - Front view (main image)
  - Back view
  - Side view
  - Detail shots (embroidery, fabric texture)
  - Styled/worn on model (optional but recommended)
- **Format:** JPG/WebP, minimum 1200x1600px
- **Background:** White or lifestyle setting

### Written Content
- [ ] Brand story (300-400 words)
- [ ] Product descriptions (12-20 products)
- [ ] Size guide content
- [ ] Care instructions
- [ ] Shipping information
- [ ] Privacy policy
- [ ] Terms of service

### Other Assets
- [ ] Logo (SVG + PNG)
- [ ] Favicon
- [ ] Hero banner image (1920x800px)
- [ ] Collection category images (3-4)
- [ ] About page images
- [ ] Social media icons

---

## 11. Hosting & Domain

### Recommended: Vercel (Free Tier)
**Pros:**
- Free hosting for Next.js
- Automatic deployments from GitHub
- Built-in SSL certificate
- CDN included
- Easy custom domain setup
- Excellent performance

**Setup:**
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Automatic build and deploy
4. Add custom domain

### Domain Registration
- GoDaddy, Namecheap, or Google Domains
- Suggested domains:
  - designerblouse.com
  - yourbrandblouse.com
  - [brandname]blouses.com

---

## 12. Budget Estimate (MVP)

### One-Time Costs
- **Domain Name:** ₹500-1,000/year
- **Product Photography:** ₹10,000-30,000
- **Development (if outsourcing):** ₹30,000-80,000
- **Content Writing:** ₹5,000-15,000
- **Logo/Branding (if needed):** ₹5,000-20,000

**Total Estimated:** ₹50,000-1,46,000 ($600-$1,750)

### Monthly Costs
- **Hosting (Vercel):** ₹0 (Free tier sufficient for MVP)
- **Domain renewal:** ~₹100/month (annual cost)
- **WhatsApp Business (optional):** ₹0 (using wa.me links)
- **Total Monthly:** ₹0-500

---

## 13. Success Metrics

### Technical KPIs
- Page Load Speed: <2 seconds
- Mobile Lighthouse Score: >90
- 100% mobile responsive
- Zero broken links
- All WhatsApp buttons working

### Business KPIs (Post-Launch)
- WhatsApp inquiries per week
- Most viewed products
- Time spent on product pages
- Mobile vs desktop traffic
- Bounce rate <60%

---

## 14. Post-MVP Enhancements (Future)

Once MVP is validated, add:

**Phase 2:**
- Product search functionality
- Email newsletter signup
- Customer reviews/testimonials
- Blog/styling tips section
- More products (expand to 50+)

**Phase 3:**
- Shopping cart & online payments
- User accounts
- Order tracking
- Size recommendation quiz
- Live chat support

**Phase 4:**
- AI design tools
- Virtual try-on
- Mobile app
- International shipping

---

## 15. Next Steps - Getting Started

### Step 1: Prepare Content
- [ ] Collect 12-20 product images (4-6 per product)
- [ ] Write product descriptions
- [ ] Prepare brand story
- [ ] Get WhatsApp Business number ready

### Step 2: Development
- [ ] Initialize Next.js project
- [ ] Set up design system
- [ ] Build layout components
- [ ] Create all pages

### Step 3: Launch
- [ ] Register domain
- [ ] Deploy to Vercel
- [ ] Connect custom domain
- [ ] Test all features
- [ ] Go live!

---

## 16. Checklist for Launch Day

### Content
- [ ] All product images uploaded and optimized
- [ ] All product descriptions complete
- [ ] About page content finalized
- [ ] Contact information verified
- [ ] WhatsApp number tested

### Technical
- [ ] All pages responsive on mobile
- [ ] All WhatsApp buttons working
- [ ] All images loading properly
- [ ] Navigation working correctly
- [ ] Forms validated (if any)
- [ ] Browser testing complete (Chrome, Safari, Firefox)
- [ ] SSL certificate active
- [ ] Favicon showing correctly

### SEO
- [ ] Meta titles and descriptions for all pages
- [ ] Open Graph images set
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Google Analytics installed

### Legal
- [ ] Privacy Policy page
- [ ] Terms of Service page
- [ ] Return/Refund policy (even if basic)

---

**Document Status:** MVP Plan v1.0  
**Last Updated:** October 6, 2026

---

## Ready to Build! 🚀

This streamlined MVP will get you online quickly with a professional catalog website. Once you validate customer interest through WhatsApp inquiries, you can add payment processing and advanced features in later phases.

**Recommended Next Action:** Set up the Next.js project with design tokens and layout components!
