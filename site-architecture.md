# Piece by Piece — Site Architecture

---

## 1. Sitemap

```
/                           → Home
/collections                → All Collections
/collections/hand-chains    → Hand Chains (launch collection)
/collections/[slug]         → Future collection pages
/products/[slug]            → Product Detail Page (PDP)
/about                      → About / Brand Story
/journal                    → Journal / Editorial (lookbooks, styling guides)
/journal/[slug]             → Journal Article
/pages/shipping-returns     → Shipping & Returns
/pages/care                 → Jewellery Care
/pages/faq                  → FAQ
/pages/contact              → Contact
/pages/privacy-policy       → Privacy Policy
/pages/terms                → Terms & Conditions
/cart                       → Cart (slide-out or page)
/checkout                   → Checkout
/account                    → Account Dashboard
/account/orders             → Order History
/search                     → Search Results
```

---

## 2. Page Structure

### Home (`/`)

| Section | Purpose |
|---|---|
| **Hero** | Full-width or near-full editorial image (on-body, hand chain focus). Minimal text: tagline + single CTA ("Shop Hand Chains" or "Explore the Collection"). |
| **Brand Statement** | One short paragraph or single sentence on warm off-white background. Introduces the "piece by piece" philosophy. |
| **Featured Collection** | 3–4 product cards in a horizontal scroll or grid. Clean studio shots. Collection title + "View All" link. |
| **Editorial Split** | Two-column layout: intimate on-body image on one side, short copy block on the other. Tells the stacking / layering story. |
| **On-Body Gallery** | 2–3 lifestyle images in an asymmetric mosaic. No text overlay. Clicking leads to tagged products or collection. |
| **Stack Builder Teaser** | Optional interactive prompt: "Start Your Stack" with a visual showing layering progression. |
| **Newsletter Signup** | Minimal form: email input + "Join" button. One line of copy ("Be the first to add the next piece."). |
| **Footer** | Navigation links, social icons, one-line brand descriptor. |

### Collection Page (`/collections/[slug]`)

| Section | Purpose |
|---|---|
| **Collection Header** | Collection title, one-line description, optional editorial banner image. |
| **Filter / Sort Bar** | Minimal: material (gold / silver), price, sort order. Hidden by default on mobile, icon toggle. |
| **Product Grid** | 2-column (mobile) / 3-column (desktop). Cards show studio shot by default, on-body on hover. |
| **Collection Story** | Optional bottom section with editorial image + short narrative about the collection. |

### Product Detail Page (`/products/[slug]`)

| Section | Purpose |
|---|---|
| **Image Gallery** | Lead with studio shot. Scroll/swipe through on-body detail crops (hand, wrist, collarbone). 4–6 images. |
| **Product Info** | Product name, price, one-sentence description, material, size/length, Add to Cart. |
| **"Layers With" Row** | Horizontal scroll of 2–3 complementary products. Encourages stacking. |
| **Details Accordion** | Materials & dimensions, Care instructions, Shipping info. Collapsed by default. |
| **Editorial Image** | One full-width on-body image below the fold to reinforce the mood. |

### About (`/about`)

| Section | Purpose |
|---|---|
| **Hero Image** | Warm, intimate brand image (hands, detail, texture). |
| **Brand Story** | 2–3 short paragraphs. The "piece by piece" philosophy, the belief in slow collection building. |
| **Values / Pillars** | 3 icon-less blocks: e.g., "Everyday Wear," "Intentional Design," "Built to Layer." |
| **Founder Note** | Optional. Short, personal, first-person. |

### Journal (`/journal`)

| Section | Purpose |
|---|---|
| **Article Grid** | 2-column. Large featured image, title, date. Minimal cards, generous spacing. |
| **Article Page** | Editorial layout: large images, short paragraphs, embedded product links. |

### Cart (Slide-out Panel)

| Section | Purpose |
|---|---|
| **Line Items** | Thumbnail, product name, price, quantity, remove. |
| **Stack Suggestion** | "Complete Your Stack" — one complementary product recommendation. |
| **Totals + CTA** | Subtotal, shipping note, "Checkout" button. |

---

## 3. Component System

### Layout Components

| Component | Description |
|---|---|
| `SiteHeader` | Logo (centered or left-aligned), minimal nav links (Shop, About, Journal), cart icon with count badge. Sticky on scroll. Transparent on hero, solid on scroll. |
| `SiteFooter` | 3–4 column grid: navigation, info links, newsletter signup, social icons. |
| `MobileNav` | Slide-out drawer. Clean list of links, no icons. |
| `PageContainer` | Max-width wrapper with generous horizontal padding. |
| `SectionSpacer` | Vertical rhythm spacer between page sections. |

### Product Components

| Component | Description |
|---|---|
| `ProductCard` | Image (swap on hover: studio → on-body), product name, price. No borders, no shadows. Minimal. |
| `ProductGallery` | Vertical scroll or thumbnail strip on desktop; horizontal swipe on mobile. |
| `ProductInfo` | Name, price, description, variant selector (material/size), Add to Cart button. |
| `LayersWithRow` | Horizontal scroll of `ProductCard` components. Heading: "Layers With" or "Complete Your Stack." |
| `PriceDisplay` | Formatted price with currency. Handles sale price (original struck through). |
| `AddToCartButton` | Primary CTA. Transitions to "Added" state briefly on click. |
| `VariantSelector` | Pill-style toggles for material (Gold / Silver) or size. |

### Media Components

| Component | Description |
|---|---|
| `HeroImage` | Full-width responsive image with optional text overlay. Lazy-loaded, priority on LCP. |
| `EditorialSplit` | Two-column: image + text block. Reverses on alternate use. Stacks on mobile. |
| `ImageMosaic` | 2–3 image asymmetric grid. Variable aspect ratios. |
| `ResponsiveImage` | Wraps `<picture>` / `srcset` with aspect-ratio placeholder to prevent layout shift. |

### UI Components

| Component | Description |
|---|---|
| `Button` | Two variants: `primary` (black fill, white text) and `secondary` (outlined, black border). |
| `TextLink` | Underlined on hover. Subtle transition. |
| `Accordion` | Single-open accordion for product details, FAQ. Smooth height animation. |
| `Badge` | Small indicator (e.g., "New", cart count). Minimal, no background on product badge. |
| `Input` | Bottom-border-only text input. Used in newsletter signup, contact, search. |
| `SlideOutPanel` | Right-side drawer for cart and mobile nav. Overlay backdrop with fade. |
| `Modal` | Centered overlay for size guide, newsletter popup (delayed). |
| `Toast` | Bottom-right notification for "Added to cart" confirmation. Auto-dismiss. |

### Content Components

| Component | Description |
|---|---|
| `SectionHeading` | Centered or left-aligned heading with optional subtext. |
| `RichText` | Styled block for journal articles and brand story prose. |
| `NewsletterForm` | Email input + submit button. Inline success message. |
| `AnnouncementBar` | Top-of-page thin bar for shipping thresholds or launch messaging. Dismissible. |

---

## 4. Design Tokens

### Colors

```
/* --- Backgrounds --- */
--color-bg-primary:       #FDFCFA;    /* warm white — main background */
--color-bg-secondary:     #F7F5F0;    /* soft off-white — alternate sections */
--color-bg-tertiary:      #EFEBE4;    /* cream / sand — subtle contrast blocks */

/* --- Surfaces --- */
--color-surface-cream:    #F5F0E8;    /* cream */
--color-surface-sand:     #E8E0D4;    /* sand */
--color-surface-stone:    #D8D2C8;    /* pale stone */
--color-surface-grey:     #C8C4BE;    /* muted grey */

/* --- Text --- */
--color-text-primary:     #1A1A1A;    /* near-black — headings, body */
--color-text-secondary:   #5C5750;    /* warm dark grey — secondary copy */
--color-text-tertiary:    #8A857D;    /* muted — captions, meta */
--color-text-inverse:     #FDFCFA;    /* on dark backgrounds */

/* --- Accent / Interactive --- */
--color-accent-dark:      #1A1A1A;    /* buttons, links, active states */
--color-accent-hover:     #333333;    /* hover state */
--color-border:           #E0DBD3;    /* dividers, input borders */
--color-border-dark:      #1A1A1A;    /* active input, outlined buttons */

/* --- Metallic (reference only, not UI) --- */
--color-gold:             #C9A96E;    /* warm gold — used in lifestyle context */
--color-silver:           #B0AFA8;    /* soft silver */

/* --- Feedback --- */
--color-success:          #4A6E50;    /* muted green */
--color-error:            #9E4A4A;    /* muted red */
```

### Typography

```
/* --- Font Families --- */
--font-heading:           'Cormorant Garamond', Georgia, serif;      /* editorial, refined */
--font-body:              'Inter', 'Helvetica Neue', sans-serif;     /* clean, modern */
--font-accent:            'Cormorant Garamond', Georgia, serif;      /* pull quotes, brand moments */

/* --- Scale (fluid, clamp-based) --- */
--text-xs:                clamp(0.625rem, 0.6rem + 0.15vw, 0.75rem);     /* 10–12px  — legal, fine print */
--text-sm:                clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);      /* 12–14px  — captions, meta */
--text-base:              clamp(0.875rem, 0.85rem + 0.2vw, 1rem);        /* 14–16px  — body */
--text-md:                clamp(1rem, 0.95rem + 0.3vw, 1.125rem);        /* 16–18px  — large body */
--text-lg:                clamp(1.125rem, 1rem + 0.5vw, 1.5rem);         /* 18–24px  — section headings */
--text-xl:                clamp(1.5rem, 1.2rem + 1vw, 2.25rem);          /* 24–36px  — page headings */
--text-2xl:               clamp(2rem, 1.5rem + 1.5vw, 3rem);             /* 32–48px  — hero headings */
--text-3xl:               clamp(2.5rem, 2rem + 2vw, 4rem);               /* 40–64px  — display / hero statement */

/* --- Line Heights --- */
--leading-tight:          1.1;
--leading-snug:           1.3;
--leading-normal:         1.6;
--leading-relaxed:        1.8;

/* --- Letter Spacing --- */
--tracking-tight:         -0.01em;
--tracking-normal:        0;
--tracking-wide:          0.05em;
--tracking-wider:         0.1em;

/* --- Font Weights --- */
--weight-light:           300;
--weight-regular:         400;
--weight-medium:          500;
--weight-semibold:        600;
```

#### Type Styles (Semantic)

| Token | Family | Size | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `display` | heading | `--text-3xl` | light | wide | Hero statements |
| `h1` | heading | `--text-2xl` | light | wide | Page titles |
| `h2` | heading | `--text-xl` | regular | wide | Section headings |
| `h3` | heading | `--text-lg` | medium | normal | Sub-section headings |
| `body` | body | `--text-base` | regular | normal | Paragraphs |
| `body-sm` | body | `--text-sm` | regular | normal | Secondary text |
| `caption` | body | `--text-xs` | regular | wider | Labels, meta |
| `button` | body | `--text-sm` | medium | wider | Button labels, CTAs |
| `nav` | body | `--text-sm` | medium | wider | Navigation links |
| `price` | body | `--text-base` | medium | normal | Product prices |

### Spacing

```
/* --- Base unit: 4px --- */
--space-1:    0.25rem;    /*  4px  */
--space-2:    0.5rem;     /*  8px  */
--space-3:    0.75rem;    /* 12px  */
--space-4:    1rem;       /* 16px  */
--space-5:    1.25rem;    /* 20px  */
--space-6:    1.5rem;     /* 24px  */
--space-8:    2rem;       /* 32px  */
--space-10:   2.5rem;     /* 40px  */
--space-12:   3rem;       /* 48px  */
--space-16:   4rem;       /* 64px  */
--space-20:   5rem;       /* 80px  */
--space-24:   6rem;       /* 96px  */
--space-32:   8rem;       /* 128px */

/* --- Semantic Spacing --- */
--section-gap:            var(--space-24);    /* between major page sections */
--section-gap-sm:         var(--space-16);    /* between minor sections */
--component-gap:          var(--space-8);     /* between components within a section */
--card-padding:           var(--space-4);     /* internal card padding */
--page-margin-mobile:     var(--space-4);     /* 16px side margins on mobile */
--page-margin-desktop:    var(--space-12);    /* 48px side margins on desktop */
--max-width:              1280px;             /* content max width */
--max-width-narrow:       720px;              /* text-heavy content (journal, about) */
```

### Borders & Radii

```
--radius-none:    0;
--radius-sm:      2px;       /* subtle rounding on buttons, inputs */
--radius-md:      4px;       /* cards if needed — keep minimal */
--border-width:   1px;
--border-color:   var(--color-border);
```

### Shadows

```
/* Minimal use — brand is flat and clean */
--shadow-sm:      0 1px 2px rgba(26, 26, 26, 0.04);
--shadow-md:      0 4px 12px rgba(26, 26, 26, 0.06);     /* slide-out panels, modals */
```

### Motion

```
--duration-fast:      150ms;
--duration-base:      250ms;
--duration-slow:      400ms;
--ease-default:       cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-in-out:        cubic-bezier(0.42, 0, 0.58, 1);
```

### Breakpoints

```
--bp-sm:    480px;     /* large phones */
--bp-md:    768px;     /* tablets */
--bp-lg:    1024px;    /* small desktops */
--bp-xl:    1280px;    /* standard desktops */
--bp-2xl:   1536px;    /* wide screens */
```

---

## 5. UI Patterns

### Product Card

```
┌──────────────────────┐
│                      │
│    [Product Image]   │  ← Studio shot; on-body on hover
│     aspect: 4:5      │
│                      │
├──────────────────────┤
│  Product Name        │  ← font: body, weight: medium
│  $XX.00              │  ← font: price
└──────────────────────┘
```

- No border, no shadow, no background
- Image swap on hover with crossfade (`--duration-base`)
- Name + price left-aligned below image
- Entire card is clickable
- Spacing: `--space-3` between image and text, `--space-1` between name and price

### Product Gallery (PDP)

- **Desktop**: Main image (left, ~60% width) + vertical thumbnail strip (right). Click thumbnail to swap main. Or single-column scroll.
- **Mobile**: Full-width horizontal swipe carousel with dot indicators.
- Images: mix of studio product shots and intimate on-body crops.
- Aspect ratio: 3:4 or 4:5 for consistency.
- Zoom: tap/click to open lightbox with pan-zoom.

### "Layers With" / Stack Suggestion Row

```
Layers With
─────────────────────────────────────────────────
[ProductCard]  [ProductCard]  [ProductCard]
```

- Horizontal scroll on mobile, 3-up grid on desktop
- Section heading uses `h3` type style
- Appears on PDP below product info and in cart panel

### Hero Section

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              [Full-width editorial image]            │
│                                                     │
│           Quiet confidence, piece by piece.          │  ← display type, text-inverse
│               [ Shop Hand Chains ]                  │  ← Button, primary
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Image: on-body, warm light, hand chain focus
- Text overlay: centered, lower third
- Text shadow or semi-transparent scrim for legibility
- Full viewport height or 80vh with `object-fit: cover`

### Editorial Split

```
┌───────────────────────┬───────────────────────┐
│                       │                       │
│   [Intimate photo]    │   Short brand copy    │
│   aspect: 3:4         │   with heading and    │
│                       │   one paragraph.      │
│                       │        [CTA link →]   │
│                       │                       │
└───────────────────────┴───────────────────────┘
```

- 50/50 split on desktop, stacks on mobile (image first)
- Alternates direction on repeat use (image left / image right)
- Text side has generous padding (`--space-16` vertical, `--space-12` horizontal)

### Image Mosaic

```
┌─────────────────┬──────────┐
│                 │          │
│   Large image   │  Small   │
│   aspect: 3:4   │  1:1     │
│                 ├──────────┤
│                 │  Small   │
│                 │  1:1     │
└─────────────────┴──────────┘
```

- Asymmetric grid, 2–3 images
- No gaps or very tight gaps (`--space-1`)
- On-body lifestyle imagery, no text overlay
- Optional: images link to tagged products

### Cart Slide-Out

```
                          ┌──────────────────────┐
                          │  Your Bag        ✕   │
                          ├──────────────────────┤
                          │ [img] Name     $XX   │
                          │       Qty: 1   Remove│
                          │──────────────────────│
                          │ [img] Name     $XX   │
                          │       Qty: 1   Remove│
                          ├──────────────────────┤
                          │ Complete Your Stack   │
                          │ [ProductCard mini]    │
                          ├──────────────────────┤
                          │ Subtotal      $XX.00 │
                          │ [ Checkout ]         │
                          └──────────────────────┘
```

- Slides in from right with backdrop overlay
- "Complete Your Stack" recommendation keeps stacking story alive at point of purchase
- Minimal line items: thumbnail, name, price, quantity, remove

### Newsletter Signup

```
Be the first to add the next piece.
┌──────────────────────────────┬─────────┐
│  Email address               │  Join   │
└──────────────────────────────┴─────────┘
```

- Inline layout on desktop, stacked on mobile
- Bottom-border input style
- Success state replaces form with "Thank you" message
- Background: `--color-bg-secondary`

### Announcement Bar

```
┌─────────────────────────────────────────────────────┐
│   Free shipping on orders over $XX            ✕     │
└─────────────────────────────────────────────────────┘
```

- Full-width, top of page, above header
- Background: `--color-text-primary`, text: `--color-text-inverse`
- `caption` type style, centered
- Dismissible, remembers state via localStorage

### Accordion (PDP Details, FAQ)

```
┌──────────────────────────────────────┐
│  Materials & Dimensions          +   │
├──────────────────────────────────────┤
│  (expanded content area)             │
│  14k gold-filled chain...            │
├──────────────────────────────────────┤
│  Care Instructions               +   │
├──────────────────────────────────────┤
│  Shipping & Returns              +   │
└──────────────────────────────────────┘
```

- Single item open at a time
- Smooth height transition (`--duration-base`, `--ease-default`)
- Divider lines using `--color-border`
- `+` / `−` icon toggle, no chevrons

### Size / Variant Selector

```
 Material:   [ Gold ]   [ Silver ]
 Length:     [ 16cm ]   [ 18cm ]
```

- Pill-style toggles with border
- Active state: filled `--color-accent-dark` with inverse text
- Inactive: outlined `--color-border`

---

## Summary of Key Principles

- **White space is a design element.** Every section breathes. Never crowd.
- **Photography leads, UI supports.** The jewellery and on-body imagery are always the hero.
- **Flat and borderless.** Avoid shadows, heavy borders, or card outlines unless essential.
- **Motion is subtle.** Crossfades, gentle slides — nothing bouncy or attention-grabbing.
- **Two fonts max.** Serif for headings/editorial moments, sans-serif for everything functional.
- **The stack story is everywhere.** "Layers With" rows, cart suggestions, and editorial content all reinforce building a collection piece by piece.
