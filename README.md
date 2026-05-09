# Jalan Overseas Admin Panel

Vue 3 + Tailwind CSS + TypeScript admin panel implementation based on the supplied reference screens.

## Included pages

- Login screen
- Tour Listing with AI assistant drawer
- Create New Tour flow
  - Tour Overview
  - Package & Pricing
  - Itinerary Details
  - Media & Images
  - Package, Pricing, Add-on, Price Exceptions, and Cancellation Policy subtabs
- Tour Detail page with Overview, Itinerary, Pricing & Offers, Media, and Analytics tabs
- Purchase Orders
- Customer Management
- Staff Management
- Discount Settings
- Package Management / simulation screen

## Working dummy interactions

- Sidebar navigation and top-level routes
- Login redirects to Tour Listing
- Tour list rows open the detail page
- Create Tour tabs and pricing subtabs switch live
- Add/remove package rows, add pricing rows, add add-ons, add price exceptions
- Regenerate content buttons update dummy copy
- Generate Image appends a dummy image card
- Publish buttons toggle draft/published UI
- Preview and duplicate actions open a modal
- Customer/staff/discount add, edit/toggle, delete actions
- Order/customer export downloads a CSV

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
