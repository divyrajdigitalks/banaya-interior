export const CATEGORIES = [
  { id: "1", name: "Living Room", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800", count: 42 },
  { id: "2", name: "Dining Room", image: "https://images.unsplash.com/photo-1616486886892-ff366aa67ba4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGluaW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D", count: 28 },
  { id: "3", name: "Bedroom", image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D", count: 35 },
  { id: "4", name: "Home Office", image: "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SG9tZSUyME9mZmljZXxlbnwwfHwwfHx8MA%3D%3D", count: 15 },
  { id: "5", name: "Decor", image: "https://plus.unsplash.com/premium_photo-1682259448848-90967eec2edb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVjb3J8ZW58MHx8MHx8fDA%3D", count: 64 },
];

export const FEATURED_PRODUCTS = [
  {
    id: "p1",
    name: "Walnut Minimalist Coffee Table",
    price: 18500,
    category: "Living Room",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1554295405-abb8fd54f153?auto=format&fit=crop&q=80&w=800",
    tag: "Bestseller",
  },
  {
    id: "p2",
    name: "Sleek Oak Dining Set",
    price: 42000,
    category: "Dining Room",
    image: "https://images.unsplash.com/photo-1567016578473-9fd62f9f1881?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1556912995-0c7bd9e88b56?auto=format&fit=crop&q=80&w=800",
    tag: "New Arrival",
  },
  {
    id: "p3",
    name: "Elegant White Bedframe",
    price: 35000,
    category: "Bedroom",
    image: "https://images.unsplash.com/photo-1598300052995-3622ccc86d67?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1582719478250-620c534ca1e8?auto=format&fit=crop&q=80&w=800",
    tag: "Featured",
  },
  {
    id: "p4",
    name: "Modern Home Office Desk",
    price: 27000,
    category: "Home Office",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1505691723518-974bfa1b841e?auto=format&fit=crop&q=80&w=800",
    tag: "Popular",
  },
  {
    id: "p5",
    name: "Rustic Leather Armchair",
    price: 19000,
    category: "Living Room",
    image: "https://images.unsplash.com/photo-1550581190-9c1c48d98d71?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1584762223575-061cdc64c599?auto=format&fit=crop&q=80&w=800",
    tag: "Trending",
  }
];

export const INTERIORS = [
  {
    id: "i1",
    title: "Minimalist Sanctuary",
    category: "Residential",
    description: "A serene living space designed with a focus on natural light, clean lines, and our signature walnut furniture pieces.",
    image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&q=80&w=1200",
    products: ["p1", "p5"],
    features: ["Natural Walnut", "Open Floor Plan", "Custom Lighting"]
  },
  {
    id: "i2",
    title: "Modern Executive Suite",
    category: "Commercial",
    description: "A sophisticated office environment blending productivity with high-end aesthetics using our professional collection.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
    products: ["p4"],
    features: ["Ergonomic Design", "Acoustic Panels", "Bespoke Desks"]
  },
  {
    id: "i3",
    title: "The Nordic Loft",
    category: "Residential",
    description: "An airy apartment interior inspired by Scandinavian design, featuring light oak and minimalist decor.",
    image: "https://images.unsplash.com/photo-1556912177-f51b0c2f2c4c?auto=format&fit=crop&q=80&w=1200",
    products: ["p2", "p3"],
    features: ["White Oak", "Monochromatic Palette", "Textured Fabrics"]
  }
];
