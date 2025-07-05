# Unseen: Artist Booking Platform

A sleek, dark-themed mobile app for booking artists, managing events, and generating AI-powered art/poems. Built with React Native (Expo), Firebase, and Supabase.

## Tech Stack
- React Native + Expo (iOS/Android)
- Firebase (Auth, Firestore, Functions, Storage)
- Supabase (Postgres, Realtime)
- External APIs: OpenAI, Replicate, DocuSign, BayPhoto, Stripe/Shopify

## Folder Structure
```
/app
  /components
  /screens
  /navigation
  /context
  /hooks
  /api
  /utils
  /assets
  App.tsx
  theme.ts
  app.json
/backend
  /functions
    /wrappers
    /tasks
  /schemas
  /utils
  index.ts
.env.example
README.md
package.json
```

## Features
- Role-based user accounts (Artist, Event Planner, End User)
- Artist profiles, event booking, in-app messaging
- AI art/poem generation, e-commerce, QR code system
- Secure, scalable, and modular architecture
