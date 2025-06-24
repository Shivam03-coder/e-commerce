import {
  PrismaClient,
  ProductCategory,
  MaterialType,
  SockSize,
} from "@prisma/client";

const prisma = new PrismaClient();

const generateRandomPrice = (base: number) => {
  return base + Math.floor(Math.random() * 10);
};

const generateRandomSalePrice = (price: number) => {
  return Math.random() > 0.3 ? price - Math.floor(Math.random() * 5) : null;
};

const generateSizeStocks = () => {
  const sizes = [
    SockSize.ONE_SIZE,
    SockSize.XS_S,
    SockSize.S_M,
    SockSize.M_L,
    SockSize.L_XL
  ];
  
  return sizes.map(size => ({
    size,
    stock: Math.floor(Math.random() * 50) + 10 // Stock between 10-60
  }));
};

const products = [
  // Crew Socks (8 items)
  {
    title: "Classic Cotton Crew",
    description: "Timeless crew socks made from premium cotton for all-day comfort.",
    category: ProductCategory.CREW_SOCKS,
    material: MaterialType.COTTON,
    tags: "classic,crew,cotton"
  },
  {
    title: "Bamboo Bliss Crew",
    description: "Eco-friendly crew socks made from sustainable bamboo fibers.",
    category: ProductCategory.CREW_SOCKS,
    material: MaterialType.BAMBOO,
    tags: "bamboo,eco,crew"
  },
  {
    title: "Athletic Performance Crew",
    description: "Moisture-wicking crew socks designed for athletes.",
    category: ProductCategory.CREW_SOCKS,
    material: MaterialType.COTTON,
    tags: "athletic,sport,performance"
  },
  {
    title: "Striped Casual Crew",
    description: "Fun striped crew socks for everyday wear.",
    category: ProductCategory.CREW_SOCKS,
    material: MaterialType.COTTON,
    tags: "striped,casual,colorful"
  },
  {
    title: "Merino Wool Hiker",
    description: "Warm merino wool crew socks for outdoor adventures.",
    category: ProductCategory.CREW_SOCKS,
    material: MaterialType.COTTON,
    tags: "wool,hiking,warm"
  },
  {
    title: "No Show Liner Crew",
    description: "Ultra-low profile crew socks that stay hidden.",
    category: ProductCategory.CREW_SOCKS,
    material: MaterialType.COTTON,
    tags: "liner,hidden,low"
  },
  {
    title: "Compression Recovery Crew",
    description: "Medical-grade compression crew socks for recovery.",
    category: ProductCategory.CREW_SOCKS,
    material: MaterialType.COTTON,
    tags: "compression,recovery,medical"
  },
  {
    title: "Holiday Pattern Crew",
    description: "Festive crew socks with seasonal designs.",
    category: ProductCategory.CREW_SOCKS,
    material: MaterialType.COTTON,
    tags: "holiday,festive,seasonal"
  },

  // Ankle Socks (4 items)
  {
    title: "Running Pro Ankle",
    description: "Performance ankle socks with arch support.",
    category: ProductCategory.ANKLE_SOCKS,
    material: MaterialType.COTTON,
    tags: "running,athletic,ankle"
  },
  {
    title: "No Show Essential Ankle",
    description: "Basic ankle socks that disappear in shoes.",
    category: ProductCategory.ANKLE_SOCKS,
    material: MaterialType.COTTON,
    tags: "essential,hidden,ankle"
  },
  {
    title: "Gym Trainer Ankle",
    description: "Cushioned ankle socks for weight training.",
    category: ProductCategory.ANKLE_SOCKS,
    material: MaterialType.COTTON,
    tags: "gym,training,cushioned"
  },
  {
    title: "Breathable Mesh Ankle",
    description: "Lightweight ankle socks with mesh ventilation.",
    category: ProductCategory.ANKLE_SOCKS,
    material: MaterialType.COTTON,
    tags: "breathable,mesh,light"
  },

  // No Show Socks (4 items)
  {
    title: "Ultra Low No Show",
    description: "Deep no show socks that never slip.",
    category: ProductCategory.NO_SHOW_SOCKS,
    material: MaterialType.COTTON,
    tags: "ultra,hidden,low"
  },
  {
    title: "Grip Sole No Show",
    description: "No show socks with silicone grips to stay in place.",
    category: ProductCategory.NO_SHOW_SOCKS,
    material: MaterialType.COTTON,
    tags: "grip,secure,no-show"
  },
  {
    title: "Luxury Linen No Show",
    description: "Premium no show socks made with linen blend.",
    category: ProductCategory.NO_SHOW_SOCKS,
    material: MaterialType.COTTON,
    tags: "linen,luxury,premium"
  },
  {
    title: "Invisible Liner No Show",
    description: "Thin no show socks for dress shoes.",
    category: ProductCategory.NO_SHOW_SOCKS,
    material: MaterialType.COTTON,
    tags: "invisible,liner,formal"
  },

  // Half Socks (4 items)
  {
    title: "Mini Loafer Half",
    description: "Half socks designed for loafers and boat shoes.",
    category: ProductCategory.HALF_SOCKS,
    material: MaterialType.COTTON,
    tags: "loafer,mini,half"
  },
  {
    title: "Kids Colorful Half",
    description: "Fun half socks for children with bright colors.",
    category: ProductCategory.HALF_SOCKS,
    material: MaterialType.COTTON,
    tags: "kids,colorful,half"
  },
  {
    title: "Breathable Toe Half",
    description: "Half socks with toe ventilation.",
    category: ProductCategory.HALF_SOCKS,
    material: MaterialType.COTTON,
    tags: "breathable,toe,half"
  },
  {
    title: "Ballet Flat Half",
    description: "Ultra low half socks for ballet flats.",
    category: ProductCategory.HALF_SOCKS,
    material: MaterialType.COTTON,
    tags: "ballet,flat,half"
  }
];

async function main() {
  // Clear existing data
  await prisma.sizeStock.deleteMany();
  await prisma.product.deleteMany();

  // Create products with size stocks
  for (const product of products) {
    const basePrice = generateRandomPrice(8);
    const salePrice = generateRandomSalePrice(basePrice);
    const sizeStocks = generateSizeStocks();
    
    const totalInventory = sizeStocks.reduce((sum, item) => sum + item.stock, 0);

    await prisma.product.create({
      data: {
        ...product,
        productImage: "https://res.cloudinary.com/ddggctwjl/image/upload/v1750747620/s2gxn76mstoztiargkry.png",
        price: basePrice,
        salePrice,
        inStock: true,
        inventory: totalInventory,
        sizeStocks: {
          create: sizeStocks
        }
      }
    });
  }

  console.log("🧦 Successfully seeded 20 realistic sock products with size stocks!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });