export type Locale = "en" | "hr";

export const translations = {
  en: {
    // Nav
    nav: {
      shop: "Shop",
      about: "About",
      journal: "Journal",
      care: "Care",
      shipping: "Shipping",
      contact: "Contact",
    },

    // Announcement
    announcement: "Complimentary shipping on all orders",

    // Hero
    hero: {
      introducing: "Introducing",
      title: "The Piece You Need",
      titleLead: "the",
      titleAccent: "Piece",
      titleTrail: "you need",
      subtitle: "A delicate hand chain you return to, day after day.",
      cta: "Shop the Piece",
    },

    // Brand statement
    brandStatement:
      "Good jewellery is not bought all at once, it is built over time. Piece by piece.",

    // Homepage product highlight
    productHighlight: {
      title: "One piece. Endless wear.",
      text: "Crafted to move with you, from day to night, without effort.",
      cta: "View Details",
    },

    // Why it's different
    whyDifferent: {
      label: "Why it's different",
      items: [
        { title: "Water-resistant", text: "Made to be worn every day." },
        { title: "Minimal & timeless", text: "Designed beyond trends." },
        { title: "Lightweight comfort", text: "Feels like nothing, looks like everything." },
        { title: "Designed to last", text: "Quality you don\u2019t have to think about." },
      ],
    },

    // Product
    product: {
      label: "Hand Chain 001",
      name: "The First Piece",
      description:
        "A hand chain that feels like part of you.\nOne quiet line, from wrist to finger.\nSubtle. Intentional. Yours.",
      viewPiece: "View Details",
      addToBag: "Add to Bag",
      added: "Added",
      material: "Material",
      length: "Length",
      gold: "Gold",
      silver: "Silver",
      materialsAndDimensions: "Materials & Dimensions",
      materialsAndDimensionsContent:
        "14k gold-filled chain (Gold) or sterling silver (Silver). Total length adjustable between 16\u201318cm. Lobster clasp. Chain width: 1mm. Handmade with care.",
      care: "Care",
      careContent:
        "This piece is deliberately fine. It is meant to be felt, not seen from across the room. Wear it with awareness, the way you would anything you value. Avoid catching it on fabrics, zippers, or rough surfaces. Remove before sleeping or exercise. Avoid prolonged contact with water, perfume, and lotions. Store flat when not worn. This is not fragility. It is lightness, by design.",
      shippingLabel: "Shipping",
      shippingContent:
        "Complimentary shipping on all orders. Delivered in 3\u20135 business days. Each piece arrives in a branded linen pouch.",
      soldOut: "Sold Out",
      unavailable: "Currently unavailable",
      onlyUnitsLeft: "Only {count} left",
      liveStock: "Live stock updates at checkout.",
    },

    // Philosophy section
    philosophy: {
      label: "The Philosophy",
      title: "The best collections\ntake time.",
      p1: "Built over time, piece by piece, each one chosen with intention.",
      p2: "Start with one. The rest will follow.",
    },

    // Pull quote
    pullQuote:
      "The most powerful jewellery\ndoesn\u2019t ask for attention.\nIt belongs.",

    // Coming soon
    comingSoon: {
      label: "What comes next",
      title: "Built over time.",
      text: "New pieces arrive when they\u2019re ready, never to replace, only to add. Sign up to know when the next one arrives.",
    },

    // Newsletter
    newsletter: {
      title: "Be the first to add\nthe next piece.",
      placeholder: "Email address",
      submit: "Join",
      thanks: "Thank you for joining.",
    },

    // PDP wear story
    wearStory: {
      quote:
        "Wear it tomorrow. And the day after.\nLet it become part of how you move through the world.",
      text: "This piece is designed to stay. Not for a season, not for an occasion, for your life. The chain will soften with wear. The clasp will become familiar. In time, you will forget you put it on. That is the point.",
    },

    // PDP delicacy note
    delicacy: {
      label: "Made to be light",
      title: "Delicate by design.",
      text: "This chain is fine because it is meant to be. Heavier jewellery announces itself. This piece whispers. It sits so close to the skin that it becomes part of your hand, not something sitting on top of it. That lightness is intentional, it is what makes the piece feel like yours from the first wear. Treat it gently. It will repay you with years of quiet presence.",
    },

    // Collection page
    collection: {
      launchLabel: "The Launch Collection",
      title: "Hand Chains",
      storyQuote:
        "We started with hand chains because hands are how you meet the world.",
      storyText:
        "They hold, they gesture, they rest. A hand chain follows all of it, tracing the natural lines, accompanying every movement without interrupting it. This felt like the only honest place to begin.",
      moreLabel: "This is the beginning",
      moreTitle: "More pieces are coming.",
      moreText:
        "Each one designed to layer with what came before. Join the list to be the first to know.",
    },

    // About page
    about: {
      opening:
        "A great jewellery collection is not built all at once. It is built over time, with intention, and a personal hand.",
      beliefLabel: "What We Believe",
      beliefP1:
        "We make jewellery that feels natural on the body and easy to wear daily. It elevates the wearer without overpowering them. The pieces never scream for attention, they sit close to the skin, catch light softly, and make you feel comfortable, put-together, and confident.",
      beliefP2:
        "Each piece marks a moment, a mood, or a phase. When layered together, those pieces tell a story. You build your stack the same way you build confidence and style. Over time. Thoughtfully. Piece by piece.",
      values: [
        {
          title: "Everyday Wear",
          text: "Designed to be worn from morning to night, not saved for occasions. The same piece appears in every moment of your day, becoming invisible in the best way.",
        },
        {
          title: "Intentional Design",
          text: "Nothing exists by accident. Every chain, link, and clasp is considered, not to impress, but to feel right. When jewellery feels right, it changes how you carry yourself.",
        },
        {
          title: "Built to Layer",
          text: "Each piece is designed to work alone and alongside everything that comes after. Your collection grows when you are ready. There is no pressure to complete the look.",
        },
      ],
      closing:
        "Good jewellery takes time.\nGreat stacks are built piece by piece.",
    },

    // Journal
    journal: {
      label: "Thoughts",
      title: "Journal",
      featuredPiece: "Featured Piece",
      backToJournal: "Back to Journal",
      entries: [
        {
          title: "Why Hands",
          excerpt:
            "We chose to begin here because hands are how you meet the world. They hold, they gesture, they rest. A hand chain follows all of it.",
          content: [
            "Think about what your hands do in a single day. They hold coffee cups and door handles and other people. They gesture when you talk. They rest in your lap when you listen. They are always present, always in motion, always telling something about you.",
            "A hand chain follows that. It traces the natural lines, the gesture of the wrist, the stillness of the fingers at rest. It does not interrupt. It accompanies.",
            "We did not start with hand chains because they are trending. We started here because the most personal jewellery should live on the most personal part of the body. Your hands are how you connect. This felt like the only honest place to begin.",
          ],
        },
        {
          title: "The Case for One",
          excerpt:
            "You do not need a full collection to feel complete. You need one piece that feels right. The rest will follow when it is time.",
          content: [
            "There is pressure everywhere to have more. More options, more pieces, more everything. We are not interested in that.",
            "We launched with a single hand chain because we believe one intentional piece changes how you carry yourself more than ten impulse purchases ever could. One piece you chose carefully. One piece that sits on your skin and becomes part of your day.",
            "When you wear the same piece every morning, it stops being jewellery and starts being identity. That is what we are building toward. Not a catalogue. A collection that grows when you are ready, not when we tell you to be.",
          ],
        },
        {
          title: "Quiet Confidence",
          excerpt:
            "The most powerful jewellery is the kind that does not ask for attention. It simply belongs on the body, as if it was always there.",
          content: [
            "Confidence is not volume. It is certainty. The same is true of how we wear jewellery. A piece that sits close to the skin, that moves with the body, that catches light without demanding it, that is confidence made tangible.",
            "Every chain, every link, every clasp is considered. Not to impress anyone. To feel right. When jewellery feels right on the body, it changes posture, gesture, presence. You stand a little differently. Your hand moves a little more deliberately.",
            "You do not need to explain it. You do not need anyone to notice. You know it is there, and that is enough.",
          ],
        },
      ],
    },

    // Cart
    cart: {
      title: "Your Bag",
      empty: "Your bag is empty.",
      continueShopping: "Continue Shopping",
      remove: "Remove",
      completeStack: "Complete Your Stack",
      subtotal: "Subtotal",
      shippingNote: "Complimentary shipping on all orders.",
      checkout: "Checkout",
      quantity: "Qty",
    },

    // Checkout
    checkout: {
      title: "Checkout",
      orderSummary: "Order Summary",
      shippingDetails: "Shipping Details",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      country: "Country",
      croatia: "Croatia",
      total: "Total",
      shippingFree: "Free",
      placeOrder: "Place Order",
      paymentNote: "You will be redirected to complete payment.",
      stockConflict:
        "One of the items in your bag sold out while you were checking out. Please review your bag and try again.",
    },

    // Footer
    footer: {
      tagline:
        "Minimalist, everyday jewellery designed to be worn and built over time.",
      stayInTouch: "Be the first to know.",
      copyright: "\u00A9 2026 Piece by Piece",
      privacy: "Privacy",
      terms: "Terms",
    },
  },

  hr: {
    nav: {
      shop: "Trgovina",
      about: "O nama",
      journal: "Journal",
      care: "Njega",
      shipping: "Dostava",
      contact: "Kontakt",
    },

    announcement: "Besplatna dostava na sve narud\u017Ebe",

    hero: {
      introducing: "Predstavljamo",
      title: "Komad koji ti treba",
      titleLead: "",
      titleAccent: "Komad",
      titleTrail: "koji ti treba",
      subtitle:
        "Nje\u017Ean lan\u010Di\u0107 za ruku kojem se vra\u0107a\u0161 dan za danom.",
      cta: "Kupi komad",
    },

    productHighlight: {
      title: "Jedan komad. Beskrajno no\u0161enje.",
      text: "Stvoren da se kre\u0107e s tobom, od jutra do ve\u010Deri, bez napora.",
      cta: "Pogledaj detalje",
    },

    whyDifferent: {
      label: "Za\u0161to je druga\u010Dije",
      items: [
        { title: "Otporno na vodu", text: "Stvoreno za svakodnevno no\u0161enje." },
        { title: "Minimalno i bezvremensko", text: "Dizajnirano izvan trendova." },
        { title: "Lagana udobnost", text: "Osjeti se kao ni\u0161ta, izgleda kao sve." },
        { title: "Stvoreno da traje", text: "Kvaliteta na koju ne mora\u0161 misliti." },
      ],
    },

    brandStatement:
      "Dobar nakit se ne kupuje odjednom, gradi se s vremenom. Komad po komad.",

    product: {
      label: "Lan\u010Di\u0107 za ruku 001",
      name: "Prvi komad",
      description:
        "Lan\u010Di\u0107 za ruku koji se osje\u0107a kao dio tebe.\nJedna tiha linija, od zape\u0161\u0107a do prsta.\nSuptilno. Namjerno. Tvoje.",
      viewPiece: "Pogledaj detalje",
      addToBag: "Dodaj u ko\u0161aricu",
      added: "Dodano",
      material: "Materijal",
      length: "Duljina",
      gold: "Zlato",
      silver: "Srebro",
      materialsAndDimensions: "Materijali i dimenzije",
      materialsAndDimensionsContent:
        "14k pozla\u0107eni lanac (Zlato) ili sterling srebro (Srebro). Ukupna duljina podesiva izme\u0111u 16\u201318cm. Kopca jastog. \u0160irina lanca: 1mm. Ru\u010Dno izra\u0111eno s pa\u017Enjom.",
      care: "Njega",
      careContent:
        "Ovaj komad je namjerno fin. Napravljen je da se osjeti, ne da se vidi s drugog kraja prostorije. Nosi ga svjesno, kao \u0161to bi nosila bilo \u0161to \u0161to cijeni\u0161. Izbjegavaj da se zakvaci za tkanine, patentne zatvara\u010De ili grube povr\u0161ine. Skini prije spavanja ili vje\u017Ebanja. Izbjegavaj dulji kontakt s vodom, parfemom i losionima. Spremi ravno kad ga ne nosi\u0161. Ovo nije krhkost. Ovo je lako\u0107a, prema dizajnu.",
      shippingLabel: "Dostava",
      shippingContent:
        "Besplatna dostava na sve narud\u017Ebe. Isporuka u 3\u20135 radnih dana. Svaki komad dolazi u brendiranoj lanenoj vre\u0107ici.",
      soldOut: "Rasprodano",
      unavailable: "Trenutno nedostupno",
      onlyUnitsLeft: "Ostalo jo\u0161 {count}",
      liveStock: "Stanje se provjerava u stvarnom vremenu pri naplati.",
    },

    philosophy: {
      label: "Filozofija",
      title: "Najbolje kolekcije\nzahtijevaju vrijeme.",
      p1: "Gra\u0111eno s vremenom, komad po komad, svaki odabran s namjerom.",
      p2: "Po\u010Dni s jednim. Ostalo \u0107e do\u0107i samo.",
    },

    pullQuote:
      "Najmo\u0107niji nakit\nne tra\u017Ei pa\u017Enju.\nPripada.",

    comingSoon: {
      label: "\u0160to dolazi dalje",
      title: "Gra\u0111eno s vremenom.",
      text: "Novi komadi dolaze kad su spremni, nikad da zamijene, samo da nadograde. Prijavi se da sazna\u0161 kad sljede\u0107i stigne.",
    },

    newsletter: {
      title: "Budi prva koja \u0107e dodati\nsljede\u0107i komad.",
      placeholder: "Email adresa",
      submit: "Prijavi se",
      thanks: "Hvala na prijavi.",
    },

    wearStory: {
      quote:
        "Nosi ga sutra. I prekosutra.\nNeka postane dio na\u010Dina na koji se kre\u0107e\u0161 kroz svijet.",
      text: "Ovaj komad je napravljen da ostane. Ne za sezonu, ne za priliku, za tvoj \u017Eivot. Lanac \u0107e omek\u0161ati no\u0161enjem. Kopca \u0107e postati poznata. S vremenom \u0107e\u0161 zaboraviti da si ga stavila. To je poanta.",
    },

    delicacy: {
      label: "Stvoreno da bude lagano",
      title: "Nježno prema dizajnu.",
      text: "Ovaj lanac je fin jer tako treba biti. Te\u017Ei nakit najavljuje sebe. Ovaj komad \u0161ap\u0107e. Sjedi toliko blizu ko\u017Ee da postaje dio tvoje ruke, a ne ne\u0161to \u0161to sjedi na njoj. Ta lako\u0107a je namjerna, to je ono \u0161to \u010Dini da se komad osjeti kao tvoj od prvog no\u0161enja. Postupaj s njim ne\u017Eno. Uzvratit \u0107e ti godinama tihe prisutnosti.",
    },

    collection: {
      launchLabel: "Prva kolekcija",
      title: "Lan\u010Di\u0107i za ruku",
      storyQuote:
        "Po\u010Deli smo s lan\u010Di\u0107ima za ruku jer su ruke na\u010Din na koji upoznaje\u0161 svijet.",
      storyText:
        "Dr\u017Ee, gestikuliraju, miruju. Lan\u010Di\u0107 za ruku prati sve to, prateci prirodne linije, prate\u0107i svaki pokret bez prekidanja. Ovo se \u010Dinilo kao jedino iskreno mjesto za po\u010Detak.",
      moreLabel: "Ovo je po\u010Detak",
      moreTitle: "Dolaze novi komadi.",
      moreText:
        "Svaki dizajniran da se sla\u017Ee s prethodnim. Prijavi se da prva sazna\u0161.",
    },

    about: {
      opening:
        "Velika kolekcija nakita ne nastaje odjednom. Gradi se s vremenom, s namjerom i osobno.",
      beliefLabel: "U \u0161to vjerujemo",
      beliefP1:
        "Pravimo nakit koji se osje\u0107a prirodno na tijelu i lako se nosi svaki dan. Uzdi\u017Ee osobu koja ga nosi bez da je zasjeni. Komadi nikada ne vi\u010Du za pa\u017Enjom, sjede blizu ko\u017Ee, ne\u017Eno hvataju svjetlo i daju osje\u0107aj ugode, urednosti i samopouzdanja.",
      beliefP2:
        "Svaki komad obilje\u017Eava trenutak, raspolo\u017Eenje ili fazu. Kad se sla\u017Eu zajedno, ti komadi pri\u010Daju pri\u010Du. Gradi\u0161 svoj stack na isti na\u010Din na koji gradi\u0161 samopouzdanje i stil. Polako. Promi\u0161ljeno. Komad po komad.",
      values: [
        {
          title: "Za svaki dan",
          text: "Dizajnirano za no\u0161enje od jutra do ve\u010Deri, ne \u010Duva se za posebne prilike. Isti komad pojavljuje se u svakom trenutku tvog dana, postaju\u0107i nevidljiv na najbolji mogu\u0107i na\u010Din.",
        },
        {
          title: "Namjeran dizajn",
          text: "Ni\u0161ta ne postoji slu\u010Dajno. Svaki lanac, karika i kopca su promi\u0161ljeni, ne da impresioniraju, nego da se osjete ispravno. Kad se nakit osjeti ispravno, mijenja na\u010Din na koji se dr\u017Ei\u0161.",
        },
        {
          title: "Stvoreno za slaganje",
          text: "Svaki komad dizajniran je da funkcionira sam i uz sve \u0161to dolazi poslije. Tvoja kolekcija raste kad si ti spremna. Nema pritiska da dovr\u0161i\u0161 izgled.",
        },
      ],
      closing:
        "Dobar nakit zahtijeva vrijeme.\nVeliki stackovi se grade komad po komad.",
    },

    journal: {
      label: "Misli",
      title: "Journal",
      featuredPiece: "Istaknuti komad",
      backToJournal: "Natrag na Journal",
      entries: [
        {
          title: "Za\u0161to ruke",
          excerpt:
            "Odabrali smo po\u010Deti ovdje jer su ruke na\u010Din na koji upoznaje\u0161 svijet. Dr\u017Ee, gestikuliraju, miruju. Lan\u010Di\u0107 za ruku prati sve to.",
          content: [
            "Razmisli \u0161to tvoje ruke rade u jednom danu. Dr\u017Ee \u0161alice za kavu, kvake i druge ljude. Gestikuliraju kad pri\u010Da\u0161. Miruju u krilu kad slu\u0161a\u0161. Uvijek su prisutne, uvijek u pokretu, uvijek govore ne\u0161to o tebi.",
            "Lan\u010Di\u0107 za ruku prati to. Prati prirodne linije, gestu zape\u0161\u0107a, mirovanje prstiju. Ne prekida. Prati.",
            "Nismo po\u010Deli s lan\u010Di\u0107ima za ruku jer su u trendu. Po\u010Deli smo ovdje jer najintimniji nakit treba \u017Eivjeti na najintimnijem dijelu tijela. Tvoje ruke su na\u010Din na koji se povezuje\u0161. Ovo se \u010Dinilo kao jedino iskreno mjesto za po\u010Detak.",
          ],
        },
        {
          title: "Argument za jedan",
          excerpt:
            "Ne treba ti cijela kolekcija da se osjeti\u0161 potpuno. Treba ti jedan komad koji se osjeti ispravno. Ostalo \u0107e do\u0107i kad do\u0111e vrijeme.",
          content: [
            "Svugdje je pritisak da ima\u0161 vi\u0161e. Vi\u0161e opcija, vi\u0161e komada, vi\u0161e svega. To nas ne zanima.",
            "Lansirali smo jedan lan\u010Di\u0107 za ruku jer vjerujemo da jedan namjeran komad mijenja na\u010Din na koji se dr\u017Ei\u0161 vi\u0161e nego deset impulzivnih kupnji ikad. Jedan komad koji si pa\u017Eljivo odabrala. Jedan komad koji sjedi na tvojoj ko\u017Ei i postaje dio tvog dana.",
            "Kad svako jutro stavi\u0161 isti komad, on prestaje biti nakit i postaje identitet. To je ono \u0161to gradimo. Ne katalog. Kolekciju koja raste kad si ti spremna, ne kad mi ka\u017Eemo da bude\u0161.",
          ],
        },
        {
          title: "Tiho samopouzdanje",
          excerpt:
            "Najmo\u0107niji nakit je onaj koji ne tra\u017Ei pa\u017Enju. Jednostavno pripada tijelu, kao da je oduvijek bio tu.",
          content: [
            "Samopouzdanje nije glasno\u0107a. To je sigurnost. Isto vrijedi i za na\u010Din na koji nosimo nakit. Komad koji sjedi blizu ko\u017Ee, koji se kre\u0107e s tijelom, koji hvata svjetlo bez da ga zahtijeva, to je samopouzdanje u\u010Dinjeno opipljivim.",
            "Svaki lanac, svaka karika, svaka kopca je promi\u0161ljena. Ne da impresionira nekoga. Da se osjeti ispravno. Kad se nakit osjeti ispravno na tijelu, mijenja dr\u017Eanje, gestu, prisutnost. Stoji\u0161 malo druga\u010Dije. Tvoja ruka se kre\u0107e malo namjernije.",
            "Ne treba\u0161 to obja\u0161njavati. Ne treba\u0161 da itko primijeti. Zna\u0161 da je tu, i to je dovoljno.",
          ],
        },
      ],
    },

    cart: {
      title: "Tvoja ko\u0161arica",
      empty: "Tvoja ko\u0161arica je prazna.",
      continueShopping: "Nastavi kupovinu",
      remove: "Ukloni",
      completeStack: "Dovr\u0161i svoj stack",
      subtotal: "Me\u0111uzbroj",
      shippingNote: "Besplatna dostava na sve narud\u017Ebe.",
      checkout: "Na blagajnu",
      quantity: "Kol",
    },

    checkout: {
      title: "Blagajna",
      orderSummary: "Pregled narud\u017Ebe",
      shippingDetails: "Podaci za dostavu",
      firstName: "Ime",
      lastName: "Prezime",
      email: "Email",
      phone: "Telefon",
      address: "Adresa",
      city: "Grad",
      postalCode: "Po\u0161tanski broj",
      country: "Dr\u017Eava",
      croatia: "Hrvatska",
      total: "Ukupno",
      shippingFree: "Besplatno",
      placeOrder: "Naruci",
      paymentNote: "Bit \u0107e\u0161 preusmjeren/a za dovr\u0161etak pla\u0107anja.",
      stockConflict:
        "Jedan od komada u tvojoj ko\u0161arici se rasprodao tijekom naplate. Pregledaj ko\u0161aricu i poku\u0161aj ponovno.",
    },

    footer: {
      tagline:
        "Minimalan, svakodnevni nakit dizajniran da se nosi i gradi s vremenom.",
      stayInTouch: "Budi prva koja \u0107e saznati.",
      copyright: "\u00A9 2026 Piece by Piece",
      privacy: "Privatnost",
      terms: "Uvjeti",
    },
  },
} as const;

export type Translations = (typeof translations)[Locale];
