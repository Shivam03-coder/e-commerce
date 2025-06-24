import {
  PrismaClient,
  ProductCategory,
  MaterialType,
  SockSize,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        title: "Daily Comfort Socks",
        description: "Soft cotton socks designed for everyday comfort and durability.",
        category: ProductCategory.CREW_SOCKS,
        productImage: "https://res.cloudinary.com/ddggctwjl/image/upload/v1750747620/s2gxn76mstoztiargkry.png",
        material: MaterialType.COTTON,
        size: SockSize.ONE_SIZE,
        price: 11,
        salePrice: 9,
        inStock: true,
        inventory: 110,
        tags: "daily,comfort,crew",
      },
      {
        title: "Summer Stripe Socks",
        description: "Bright and colorful striped socks perfect for summer outings.",
        category: ProductCategory.CREW_SOCKS,
        productImage: "https://res.cloudinary.com/ddggctwjl/image/upload/v1750747620/s2gxn76mstoztiargkry.png",
        material: MaterialType.COTTON,
        size: SockSize.S_M,
        price: 13,
        salePrice: 10,
        inStock: true,
        inventory: 90,
        tags: "summer,stripe,colorful",
      },
      {
        title: "Runner's Ankle Socks",
        description: "Low-cut socks crafted for running and sports performance.",
        category: ProductCategory.ANKLE_SOCKS,
        productImage: "https://res.cloudinary.com/ddggctwjl/image/upload/v1750747620/s2gxn76mstoztiargkry.png",
        material: MaterialType.COTTON,
        size: SockSize.M_L,
        price: 16,
        salePrice: 13,
        inStock: true,
        inventory: 95,
        tags: "running,ankle,sport",
      },
      {
        title: "Nature Bamboo Socks",
        description: "Sustainable and eco-friendly bamboo socks with a smooth finish.",
        category: ProductCategory.CREW_SOCKS,
        productImage: "https://res.cloudinary.com/ddggctwjl/image/upload/v1750747620/s2gxn76mstoztiargkry.png",
        material: MaterialType.BAMBOO,
        size: SockSize.L_XL,
        price: 14,
        salePrice: 12,
        inStock: true,
        inventory: 80,
        tags: "bamboo,nature,eco",
      },
      {
        title: "Tiny Feet Cartoon Socks",
        description: "Fun and playful cartoon-themed socks for kids.",
        category: ProductCategory.HALF_SOCKS,
        productImage: "https://res.cloudinary.com/ddggctwjl/image/upload/v1750747620/s2gxn76mstoztiargkry.png",
        material: MaterialType.COTTON,
        size: SockSize.XS_S,
        price: 7,
        salePrice: 5,
        inStock: true,
        inventory: 180,
        tags: "kids,cartoon,fun",
      },
      {
        title: "Pro Circulation Socks",
        description: "Engineered compression socks for better blood flow and recovery.",
        category: ProductCategory.CREW_SOCKS,
        productImage: "https://res.cloudinary.com/ddggctwjl/image/upload/v1750747620/s2gxn76mstoztiargkry.png",
        material: MaterialType.COTTON,
        size: SockSize.M_L,
        price: 26,
        salePrice: 21,
        inStock: true,
        inventory: 65,
        tags: "compression,recovery,health",
      },
      {
        title: "Stealth No Show Socks",
        description: "Invisible design perfect for loafers and dress shoes.",
        category: ProductCategory.NO_SHOW_SOCKS,
        productImage: "https://res.cloudinary.com/ddggctwjl/image/upload/v1750747620/s2gxn76mstoztiargkry.png",
        material: MaterialType.COTTON,
        size: SockSize.S_M,
        price: 10,
        salePrice: 8,
        inStock: true,
        inventory: 140,
        tags: "stealth,invisible,low",
      },
      {
        title: "Zen Toe Socks",
        description: "Five-toe socks designed for maximum flexibility and yoga sessions.",
        category: ProductCategory.CREW_SOCKS,
        productImage: "https://res.cloudinary.com/ddggctwjl/image/upload/v1750747620/s2gxn76mstoztiargkry.png",
        material: MaterialType.COTTON,
        size: SockSize.M_L,
        price: 15,
        salePrice: 12,
        inStock: true,
        inventory: 50,
        tags: "toe,yoga,flex",
      },
    ],
  });

  console.log("🧦 Seeded updated socks data!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
