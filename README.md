# Designer Blouse Website

A beautiful catalog website showcasing designer blouses with WhatsApp inquiry functionality.

## Features

- 🎨 Elegant design system with luxury fashion aesthetic
- 📱 Fully responsive (mobile, tablet, desktop)
- 🖼️ Product catalog with filtering
- 💬 WhatsApp inquiry integration
- ⚡ Fast loading with Next.js 14
- 🎯 SEO optimized

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd designer-blouse-website
```

2. Install dependencies
```bash
npm install
```

3. Configure WhatsApp number
Edit `lib/whatsapp.ts` and update the `WHATSAPP_NUMBER` constant with your WhatsApp Business number:
```typescript
export const WHATSAPP_NUMBER = '919876543210' // Replace with your number
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
designer-blouse-website/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── products/          # Products listing
│   ├── product/[id]/      # Product detail pages
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # React components
│   ├── layout/           # Header, Footer, Nav
│   ├── product/          # Product-related components
│   ├── common/           # Shared components
│   └── ui/               # UI primitives
├── lib/                  # Utility functions
│   ├── products.ts       # Product data functions
│   ├── whatsapp.ts       # WhatsApp helpers
│   └── utils.ts          # General utilities
├── data/                 # JSON data files
│   └── products.json     # Product catalog
├── types/                # TypeScript types
├── public/               # Static assets
│   └── images/           # Product images
└── ...config files
```

## Design System

### Colors
- **Primary:** Elegant Purple (#8B4789)
- **Secondary:** Champagne Gold (#C9A96E)
- **Accent:** Rose Pink (#D4517D)

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)
- **Accent:** Montserrat (sans-serif)

## Adding Products

Edit `data/products.json` to add or modify products. Each product should follow this structure:

```json
{
  "id": "blouse-001",
  "name": "Product Name",
  "slug": "product-name",
  "sku": "DSB-001",
  "category": "traditional",
  "price": 3500,
  "images": ["/images/products/..."],
  "description": {
    "short": "Short description",
    "full": "Full description"
  },
  "specifications": { ... },
  "available": true,
  "featured": true
}
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy
4. Add your custom domain in Vercel settings

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Update WhatsApp Number
Edit `lib/whatsapp.ts`

### Update Colors
Edit `tailwind.config.js` and `app/globals.css`

### Update Content
- Products: `data/products.json`
- About page: `app/about/page.tsx`
- Contact info: `app/contact/page.tsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All Rights Reserved

## Support

For support, contact us via WhatsApp or email at info@designerblouse.com
