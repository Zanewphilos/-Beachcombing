export interface TrashCategories {
    [category: string]: string[];
  }
  
  export const TRASH_CATEGORIES: TrashCategories = {
    "Most Common Items": [
      "Grocery Bags (Plastic)",
      "Other Bags (Plastic)",
      "Beverage Bottles (Glass)",
      "Bottles (Plastic)",
      "Beverage Cans",
      "Beverage Sachets/Pouches",
      "Bottle Caps (Metal)",
      "Bottle Caps (Plastic)",
      "Cigarette Butts",
    ],
    "Food-Related Items": [
      "Cups, Plates (Foam)",
      "Cups, Plates (Paper)",
      "Cups, Plates (Plastic)",
      "Food Containers (Foam)",
      "Food Containers (Plastic)",
      "Food Wrappers",
      "Lids (Plastic)",
      "Straws/Stirrers (Plastic)",
      "Utensils (Plastic)",
    ],
    "Fishing & Boating": [
      "Fishing Line, Nets, Traps, Ropes, etc.",
      "Foam Dock Pieces",
    ],
    "Illegal Dumping": [
      "Appliances",
      "Construction Materials",
      "Tires",
    ],
    "Packaging Material": [
      "6-Pack Holders",
      "Foam Packaging",
      "Other Plastic Bottles (Oil, Bleach, etc.)",
      "Strapping Bands",
    ],
    "Other Items / Debris": [
      "Balloons",
      "Clothing",
      "E-Cigarettes",
      "Electronic Waste (Phones, Batteries)",
      "Footwear (Shoes/Slippers)",
      "Tobacco Products (Lighters, Cigar Tips, Wrap)",
      "Toys",
      "Other Plastic Waste",
      "Other Waste (Metal, Paper, etc.)",
    ],
    "Personal Hygiene": [
      "Condoms",
      "Cotton Bud Sticks (Swabs)",
      "Diapers",
      "Gloves & Masks (PPE)",
      "Syringes",
      "Tampons & Applicators",
    ],
    "Tiny Trash (Under 2.5 cm)": [
      "Plastic/Foam Pieces",
    ],
  };