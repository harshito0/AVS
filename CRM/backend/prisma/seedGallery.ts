import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GALLERY_DATA = [
  {
    title: 'Basalt Hot Stone Ritual',
    category: 'SPA & WELLNESS',
    imageUrl: '/gallery_hot_stones.webp',
    altText: 'Luxury hot stone ritual with basalt stones, natural orchids, and aromatic candles',
    sortOrder: 1,
    status: 'Published'
  },
  {
    title: 'Glow & Rejuvenate',
    category: 'FACIALS & SKIN',
    imageUrl: '/hero_facial.webp',
    altText: 'Rejuvenating facial skincare treatment at Aura Vital Star',
    sortOrder: 2,
    status: 'Published'
  },
  {
    title: 'The Grand AVS Sanctuary',
    category: 'AVS SPACE',
    imageUrl: '/gallery_lounge_interior.webp',
    altText: 'Luxury boutique spa reception and lounge interior with curved green velvet seating',
    sortOrder: 3,
    status: 'Published'
  },
  {
    title: 'Therapeutic Massage Therapy',
    category: 'MASSAGE',
    imageUrl: '/hero_massage.webp',
    altText: 'Professional massage therapy session in tranquil treatment suite',
    sortOrder: 4,
    status: 'Published'
  },
  {
    title: 'Scalp Detox & Hair Spa',
    category: 'HAIR CARE',
    imageUrl: '/svc_hair_head.webp',
    altText: 'Nourishing scalp massage and Japanese style hair spa ritual',
    sortOrder: 5,
    status: 'Published'
  },
  {
    title: 'Harmony Couples Retreat',
    category: 'COUPLE EXPERIENCES',
    imageUrl: '/svc_couple_retreat.webp',
    altText: 'Luxury couple spa environment with two treatment beds and candles',
    sortOrder: 6,
    status: 'Published'
  },
  {
    title: 'Couture Nail Artistry',
    category: 'MANICURE & PEDICURE',
    imageUrl: '/salon_nails_beauty.webp',
    altText: 'Elegant manicure and nail styling treatment',
    sortOrder: 7,
    status: 'Published'
  },
  {
    title: 'Haute Bridal & Glamour',
    category: 'MAKEUP',
    imageUrl: '/svc_bridal_makeup.webp',
    altText: 'Flawless wedding and event makeup styling',
    sortOrder: 8,
    status: 'Published'
  },
  {
    title: 'Botanical Body Polish',
    category: 'SPA & WELLNESS',
    imageUrl: '/svc_body_polishing.webp',
    altText: 'Gentle exfoliating body polish with organic botanicals',
    sortOrder: 9,
    status: 'Published'
  },
  {
    title: 'Royal Foot Spa & Reflexology',
    category: 'SPA & WELLNESS',
    imageUrl: '/svc_foot_spa.webp',
    altText: 'Relaxing foot bath soak and reflexology pressure therapy',
    sortOrder: 10,
    status: 'Published'
  },
  {
    title: 'Silk Touch Waxing & Laser',
    category: 'WAXING & LASER',
    imageUrl: '/svc_waxing_smooth.webp',
    altText: 'Gentle waxing and state-of-the-art laser hair removal',
    sortOrder: 11,
    status: 'Published'
  },
  {
    title: 'Hydrotherapy Suite',
    category: 'AVS SPACE',
    imageUrl: '/gallery_hydrotherapy_suite.webp',
    altText: 'Luxurious private hydrotherapy wellness bath suite',
    sortOrder: 12,
    status: 'Published'
  },
  {
    title: 'Swedish Gentle Relaxation',
    category: 'MASSAGE',
    imageUrl: '/rmt_relaxation.webp',
    altText: 'Relaxing Swedish massage therapy treatment at AVS',
    sortOrder: 13,
    status: 'Published'
  },
  {
    title: 'Herbal Foot Spa & Pedicure',
    category: 'MANICURE & PEDICURE',
    imageUrl: '/svc_foot_spa.webp',
    altText: 'Relaxing foot spa and pedicure treatment with natural florals',
    sortOrder: 14,
    status: 'Published'
  },
  {
    title: 'Luminous Facial Glow',
    category: 'FACIALS & SKIN',
    imageUrl: '/salon_facial_glow.webp',
    altText: 'Glowing skin facial treatment with hydrating mask',
    sortOrder: 15,
    status: 'Published'
  },
  {
    title: 'Modern Salon Studio',
    category: 'AVS SPACE',
    imageUrl: '/salon_bg.webp',
    altText: 'Interior of Aura Vital Star luxury hair salon and styling chairs',
    sortOrder: 16,
    status: 'Published'
  },
  {
    title: 'Deep Tissue Release',
    category: 'MASSAGE',
    imageUrl: '/rmt_deep_tissue.webp',
    altText: 'Deep tissue therapy by certified massage professional',
    sortOrder: 17,
    status: 'Published'
  },
  {
    title: 'Mind & Body Harmony',
    category: 'SPA & WELLNESS',
    imageUrl: '/hero_wellness.webp',
    altText: 'Holistic wellness sanctuary experience with soft green accents',
    sortOrder: 18,
    status: 'Published'
  }
];

async function seed() {
  console.log('🌱 Seeding Gallery images into CRM database...');

  for (const item of GALLERY_DATA) {
    const existing = await prisma.galleryImage.findFirst({
      where: { title: item.title }
    });

    if (!existing) {
      await prisma.galleryImage.create({
        data: item
      });
      console.log(`+ Added: ${item.title}`);
    } else {
      console.log(`= Already exists: ${item.title}`);
    }
  }

  const count = await prisma.galleryImage.count();
  console.log(`✨ Total Gallery images in DB: ${count}`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
