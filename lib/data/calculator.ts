export const BHK_OPTIONS = [
  { id: "1bhk", name: "1 BHK", image: "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&q=80&w=800", price: 450000 },
  { id: "2bhk", name: "2 BHK", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800", price: 750000 },
  { id: "3bhk", name: "3 BHK", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800", price: 1100000 },
  { id: "4bhk", name: "4 BHK+", image: "https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=800", price: 1500000 },
];

export const ROOM_OPTIONS = [
  { id: "living", name: "Living Room", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800", basePrice: 200000 },
  { id: "kitchen", name: "Modular Kitchen", image: "https://images.unsplash.com/photo-1556911223-053b7c336582?auto=format&fit=crop&q=80&w=800", basePrice: 250000 },
  { id: "bedroom", name: "Master Bedroom", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800", basePrice: 180000 },
  { id: "kids_bedroom", name: "Kids Bedroom", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800", basePrice: 150000 },
  { id: "dining", name: "Dining Area", image: "https://images.unsplash.com/photo-1517705008128-361805f42e8a?auto=format&fit=crop&q=80&w=800", basePrice: 120000 },
];

export const FURNITURE_ITEMS = [
  { 
    id: "bed", 
    name: "Bed", 
    image: "https://images.unsplash.com/photo-1505693413171-293669746a57?auto=format&fit=crop&q=80&w=800",
    options: [
      { id: "king_bed", name: "King Size Bed", price: 45000, unit: "unit" },
      { id: "queen_bed", name: "Queen Size Bed", price: 35000, unit: "unit" },
    ]
  },
  { 
    id: "bed_back", 
    name: "Bed Back", 
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
    options: [
      { id: "cushioned_back", name: "Cushioned Back", price: 15000, unit: "unit" },
      { id: "wooden_back", name: "Wooden Back", price: 12000, unit: "unit" },
    ]
  },
  { 
    id: "modular_kitchen", 
    name: "Modular Kitchen", 
    image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=800",
    options: [
      { id: "kitchen_15ft", name: "Upto 15 FT", price: 150000, unit: "unit" },
      { id: "kitchen_20ft", name: "Upto 20 FT", price: 200000, unit: "unit" },
      { id: "kitchen_25ft", name: "Upto 25 FT", price: 250000, unit: "unit" },
    ]
  },
  { 
    id: "mirror", 
    name: "Dressing mirror", 
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
    options: [
      { id: "mirror_storage", name: "Dressing mirror with storage", price: 18000, unit: "unit" },
      { id: "mirror_no_storage", name: "Dressing mirror without storage", price: 12000, unit: "unit" },
    ]
  },
  { id: "mandir", name: "Mandir", image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=800", price: 25000, unit: "unit" },
  { id: "kitchen_overhead", name: "Modular kitchen - Overhead unit", image: "https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?auto=format&fit=crop&q=80&w=800", price: 40000, unit: "unit" },
  { id: "curtain", name: "Curtain", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800", price: 8000, unit: "unit" },
  { 
    id: "wardrobe", 
    name: "Wardrobe", 
    image: "https://images.unsplash.com/photo-1616486341351-79b5b038378d?auto=format&fit=crop&q=80&w=800",
    options: [
      { id: "wardrobe_2", name: "Wardrobe with 2 drawer storage", price: 35000, unit: "unit" },
      { id: "wardrobe_5", name: "Wardrobe with 5 drawer storage", price: 85000, unit: "unit" },
    ]
  },
];

export const DETAILED_FURNITURE = {
  "Living Area": [
    { id: "main_door", name: "Main Door", price: 25000, unit: "unit" },
    { id: "mandir_detailed", name: "Mandir", price: 30000, unit: "unit" },
    { id: "jali_door", name: "Jali door", price: 15000, unit: "unit" },
    { id: "tv_unit_detailed", name: "TV Unit", price: 45000, unit: "unit" },
    { id: "shoe_rack", name: "Shoe Rack", price: 12000, unit: "unit" },
    { id: "ac_piping_detailed", name: "AC Piping", price: 10000, unit: "unit" },
    { id: "decorative_wall", name: "Decorative Wall", price: 350, unit: "sqft" },
    { id: "paneling", name: "Paneling", price: 250, unit: "sqft" },
    { id: "sofa_fabric", name: "Sofa with fabric", price: 65000, unit: "unit" },
    { id: "partition", name: "Partition", price: 180, unit: "sqft" },
    { id: "curtain_detailed", name: "Curtain", price: 12000, unit: "unit" },
  ],
  "Kitchen": [
    { id: "modular_kitchen_overhead", name: "Modular kitchen - Overhead unit", price: 45000, unit: "unit" },
    { id: "breakfast_table", name: "Breakfast Table", price: 25000, unit: "unit" },
    { id: "profile_shutter", name: "Profile shutter unit", price: 35000, unit: "unit" },
  ],
  "Bedroom": [
    { id: "king_bed_detailed", name: "King Size Bed", price: 45000, unit: "unit" },
    { id: "queen_bed_detailed", name: "Queen Size Bed", price: 35000, unit: "unit" },
    { id: "sliding_wardrobe", name: "Sliding Wardrobe", price: 75000, unit: "unit" },
    { id: "swing_wardrobe", name: "Swing Wardrobe", price: 60000, unit: "unit" },
  ]
};

export const BASIC_REQUIREMENTS = [
  { id: "elec_switch", name: "Electrical work with switch", icon: "Zap", price: 15000, unit: "unit" },
  { id: "ceiling", name: "Ceiling Work", icon: "Layers", price: 120, unit: "sqft" },
  { id: "switch", name: "Switch", icon: "Zap", price: 5000, unit: "unit" },
  { id: "paint", name: "Wall Paint", icon: "Paintbrush", price: 35, unit: "sqft" },
  { id: "fan", name: "Fan", icon: "Wind", price: 8000, unit: "unit" },
  { id: "ac_pipe", name: "AC Piping", icon: "Wind", price: 12000, unit: "unit" },
];

export const GENERAL_SERVICES = [
  { id: "wall_paint", name: "Wall Paint", price: 35, icon: "Paintbrush", unit: "sqft" },
  { id: "ceiling_work", name: "Ceiling Work", price: 120, icon: "Layers", unit: "sqft" },
  { id: "electrical", name: "Electrical work with switch", price: 15000, icon: "Zap", unit: "unit" },
  { id: "ac_piping", name: "AC Piping", price: 10000, icon: "Wind", unit: "unit" },
];

export const BRAND_OPTIONS = [
  { id: "standard", name: "Brand 1", multiplier: 1.0, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" },
  { id: "premium", name: "Brand 2", multiplier: 1.2, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800" },
  { id: "luxury", name: "Brand 3", multiplier: 1.5, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" },
];
