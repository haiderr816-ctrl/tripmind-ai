# TripMind AI

An AI-powered travel planning SaaS application built with Next.js 16, Clerk authentication, and modern UI components.

## Features

- **AI-Powered Trip Planning**: Generate personalized travel itineraries in seconds
- **Dynamic Destination Guides**: SEO-friendly pages for popular destinations
- **Travel Blog**: Content marketing with newsletter signup
- **Lead Generation**: Exit intent popups, sticky CTAs, and consultation forms
- **User Dashboard**: Manage trips, view itineraries, and track leads
- **Payment Integration**: Stripe checkout for premium features
- **Responsive Design**: Mobile-first with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: OpenAI API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Clerk account
- Stripe account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/haiderr816-ctrl/tripmind-ai.git
cd tripmind-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see below)

4. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tripmind

# OpenAI API
OPENAI_API_KEY=sk-xxxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google AdSense (replace with real ID)
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

## Revenue Model

TripMind AI operates on a freemium model:

1. **Free Tier**: Users can generate basic itineraries with limited features
2. **Premium Tier**: $9/month for unlimited trips, advanced AI features, and priority support
3. **Lead Generation**: Capture leads through consultation forms and newsletter signups
4. **Affiliate Revenue**: Partner with hotels, airlines, and tour operators for bookings

## Project Structure

```
tripmind-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── dashboard/         # User dashboard
│   ├── destinations/      # Destination guides
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── motion/           # Animation components
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

For other platforms, ensure you have:
- Node.js runtime
- PostgreSQL database
- Environment variables configured

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## License

MIT License - feel free to use this project for your own travel planning needs.

