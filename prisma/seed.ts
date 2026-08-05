import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../src/generated/prisma/client";

const required = (name: string) => { const value = process.env[name]; if (value === undefined) throw new Error(`Missing ${name}`); return value; };
const adapter = new PrismaMariaDb({
  host: required("DATABASE_HOST"), port: Number(process.env.DATABASE_PORT ?? 3306), user: required("DATABASE_USER"),
  password: required("DATABASE_PASSWORD"), database: required("DATABASE_NAME"), connectionLimit: 2,
});
const db = new PrismaClient({ adapter });
const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

const products = [
  { slug: "notebook-harian", name: "Notebook Harian", category: "alat-tulis", price: 89000, stock: 24, badge: "Baru", featured: true, description: "Notebook minimalis untuk ide, daftar, dan coretan spontan. Kertasnya nyaman untuk pena maupun pensil.", keywords: ["buku", "catatan", "pensil", "kertas", "ide"], imageUrl: image("photo-1743760521201-ddb298df18cd"), imageAlt: "Buku catatan putih minimalis dengan pensil", photographer: "Adrian Regeci", photoPage: "https://unsplash.com/photos/notebook-with-a-pencil-on-top-kNTu4tGXlEA" },
  { slug: "lilin-senja", name: "Lilin Senja", category: "dekorasi", price: 129000, stock: 16, badge: "Favorit", featured: true, description: "Lilin aromaterapi bernuansa lembut untuk menutup hari tanpa terburu-buru.", keywords: ["lilin", "aroma", "kaca", "rumah", "rileks"], imageUrl: image("photo-1616172890963-a45e7da8de31"), imageAlt: "Lilin aromaterapi putih dalam wadah kaca", photographer: "Annie Spratt", photoPage: "https://unsplash.com/photos/white-candle-in-clear-glass-container-vrmuFpBOodw" },
  { slug: "mug-bumi", name: "Mug Bumi", category: "dekorasi", price: 149000, stock: 10, featured: true, description: "Mug keramik bernuansa hangat untuk ritual minum favoritmu setiap pagi.", keywords: ["mug", "cangkir", "keramik", "kopi", "minum"], imageUrl: image("photo-1516646227334-6102731f3c25"), imageAlt: "Mug keramik krem di atas meja dengan biji kopi", photographer: "Robert Shunev", photoPage: "https://unsplash.com/photos/ceramic-mug-on-table-OmOvMdiaZZ0" },
  { slug: "pot-teduh", name: "Pot Teduh", category: "dekorasi", price: 179000, stock: 5, badge: "Terbatas", featured: true, description: "Sentuhan hijau mungil untuk sudut rumah yang butuh ruang bernapas.", keywords: ["pot", "tanaman", "hijau", "meja", "minimal"], imageUrl: image("photo-1746393877488-1dfd62264775"), imageAlt: "Tanaman hijau kecil dalam pot minimalis", photographer: "Jor Eg", photoPage: "https://unsplash.com/photos/a-plant-in-a-pot-on-a-gray-background--CHU5URjLLQ" },
  { slug: "set-warna-studio", name: "Set Warna Studio", category: "alat-tulis", price: 119000, stock: 20, badge: "Baru", featured: false, description: "Perlengkapan warna untuk moodboard, jurnal, dan eksplorasi visual sehari-hari.", keywords: ["stationery", "marker", "pena", "warna", "gambar"], imageUrl: image("photo-1764818958908-d5efcec563d1"), imageAlt: "Perlengkapan alat tulis warna-warni tersusun di meja", photographer: "Jess Bailey", photoPage: "https://unsplash.com/photos/desk-flat-lay-with-stationery-and-macaron-9byKncZaV0c" },
  { slug: "lampu-temaram", name: "Lampu Temaram", category: "dekorasi", price: 329000, stock: 8, featured: false, description: "Cahaya hangat yang membuat waktu baca dan ruang kerja terasa lebih nyaman.", keywords: ["lampu", "meja", "cahaya", "ruang", "baca"], imageUrl: image("photo-1760530647543-be53b6ba22f6"), imageAlt: "Lampu meja modern menyala di ruang temaram", photographer: "MonkWork", photoPage: "https://unsplash.com/photos/a-modern-desk-lamp-illuminates-a-dark-room-MjG4XieVV4s" },
  { slug: "vas-rupa", name: "Vas Rupa", category: "dekorasi", price: 219000, stock: 7, badge: "Kurator", featured: false, description: "Siluet keramik sederhana yang tetap mencuri perhatian di ruangan.", keywords: ["vas", "keramik", "minimal", "bunga", "rumah"], imageUrl: image("photo-1665512594386-051aad8b9f68"), imageAlt: "Vas keramik minimalis bernuansa abu-abu", photographer: "Jocelyn Morales", photoPage: "https://unsplash.com/photos/a-close-up-of-a-vase-uscciPpiMY4" },
  { slug: "sabun-hutan", name: "Sabun Hutan", category: "perawatan", price: 59000, stock: 32, badge: "Natural", featured: false, description: "Sabun artisan dengan aroma hijau yang membumi dan lembut untuk keseharian.", keywords: ["sabun", "handmade", "natural", "mandi", "aroma"], imageUrl: image("photo-1775210603565-37cc9269326f"), imageAlt: "Deretan sabun artisan alami di atas meja kayu", photographer: "Tanya Barrow", photoPage: "https://unsplash.com/photos/rows-of-artisanal-soaps-displayed-on-a-wooden-counter-ts3gC_gv47A" },
] as const;

async function upsertSeedUser(email: string | undefined, password: string | undefined, name: string, role: "ADMIN" | "CUSTOMER") {
  if (!email || !password) return null;
  const user = await db.user.upsert({ where: { email }, create: { email, name, role, emailVerified: true }, update: { name, role } });
  const hash = await hashPassword(password);
  await db.account.upsert({ where: { providerId_accountId: { providerId: "credential", accountId: user.id } }, create: { providerId: "credential", accountId: user.id, userId: user.id, password: hash }, update: { password: hash } });
  return user;
}

type SeedOptions = {
  overwriteCatalog?: boolean;
  seedDemoUsers?: boolean;
};

export async function seedDatabase({ overwriteCatalog = true, seedDemoUsers = true }: SeedOptions = {}) {
  const categories = await Promise.all([
    ["Alat Tulis", "alat-tulis"], ["Dekorasi", "dekorasi"], ["Perawatan", "perawatan"],
  ].map(([name, slug]) => db.category.upsert({
    where: { slug },
    create: { name: name!, slug: slug! },
    update: overwriteCatalog ? { name: name!, isActive: true } : {},
  })));
  const categoryIds = Object.fromEntries(categories.map((category) => [category.slug, category.id]));
  for (const product of products) {
    const { imageUrl, imageAlt, photographer, photoPage, category, ...data } = product;
    const savedProduct = await db.product.upsert({
      where: { slug: data.slug },
      create: { ...data, keywords: [...data.keywords], categoryId: categoryIds[category]!, images: { create: { url: imageUrl, alt: imageAlt, photographer, photoPage } } },
      update: overwriteCatalog ? { ...data, keywords: [...data.keywords], categoryId: categoryIds[category]!, isActive: true } : {},
    });

    const hasImage = await db.productImage.findFirst({ where: { productId: savedProduct.id }, select: { id: true } });
    if (!hasImage) {
      await db.productImage.create({ data: { productId: savedProduct.id, url: imageUrl, alt: imageAlt, photographer, photoPage } });
    }
  }
  await db.storeSetting.upsert({ where: { id: "default" }, create: { id: "default", storeName: "KreasiKita", email: "halo@kreasikita.id", shippingCost: 18000 }, update: {} });

  if (seedDemoUsers) {
    await upsertSeedUser(process.env.SEED_ADMIN_EMAIL, process.env.SEED_ADMIN_PASSWORD, "Admin KreasiKita", "ADMIN");
    await upsertSeedUser(process.env.SEED_CUSTOMER_EMAIL, process.env.SEED_CUSTOMER_PASSWORD, "Pelanggan Kreasi", "CUSTOMER");
  }
}

export async function disconnectSeedDatabase() {
  await db.$disconnect();
}

const entryFile = process.argv[1]?.replaceAll("\\", "/");
if (entryFile?.endsWith("/prisma/seed.ts")) {
  seedDatabase().finally(disconnectSeedDatabase);
}
