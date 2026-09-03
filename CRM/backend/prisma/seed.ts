import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AVS CRM database...');

  // Locations
  const brampton = await prisma.location.upsert({
    where: { name: 'Brampton Rejuvenation Centre' },
    update: {},
    create: {
      name: 'Brampton Rejuvenation Centre',
      shortName: 'Brampton',
      address: '157 Queen Street West, Brampton, ON L6Y 1P9',
      phone: '+1 647-987-5451',
      email: 'brampton@auravitalstar.ca',
      isActive: true,
    },
  });

  const mississauga = await prisma.location.upsert({
    where: { name: 'Mississauga Centre' },
    update: {},
    create: {
      name: 'Mississauga Centre',
      shortName: 'Mississauga',
      address: 'Mississauga, Ontario',
      phone: '+1 647-987-5451',
      email: 'mississauga@auravitalstar.ca',
      isActive: false,
    },
  });

  console.log('✅ Locations seeded');

  // Admin user
  const passwordHash = await bcrypt.hash('Admin@AVS2025', 12);
  await prisma.user.upsert({
    where: { email: 'admin@auravitalstar.ca' },
    update: {},
    create: {
      email: 'admin@auravitalstar.ca',
      name: 'AVS Admin',
      passwordHash,
      role: 'ADMIN',
      locationId: brampton.id,
    },
  });
  console.log('✅ Admin user created: admin@auravitalstar.ca / Admin@AVS2025');

  // Services
  const serviceData = [
    { name: 'RMT Massage Therapy', category: 'Massage Therapy', price: 100, duration: '60 min', description: 'Registered Massage Therapy for muscle relief and restoration.', sortOrder: 1 },
    { name: 'Deep Tissue Massage', category: 'Massage Therapy', price: 120, duration: '60 min', description: 'Targets deeper layers of muscle for chronic tension relief.', sortOrder: 2 },
    { name: 'Aroma Therapy Massage', category: 'Massage Therapy', price: 90, duration: '60 min', description: 'Essential oil-infused relaxation massage.', sortOrder: 3 },
    { name: 'Hot Stone Therapy', category: 'Massage Therapy', price: 110, duration: '75 min', description: 'Heated stones melt away tension and restore balance.', sortOrder: 4 },
    { name: 'Prenatal Massage', category: 'Massage Therapy', price: 100, duration: '60 min', description: 'Safe and nurturing massage for expecting mothers.', sortOrder: 5 },
    { name: 'Sports Massage', category: 'Massage Therapy', price: 115, duration: '60 min', description: 'Performance-focused therapy for athletic recovery.', sortOrder: 6 },
    { name: 'Luxury 24K Gold Facial', category: 'Facial & Skincare', price: 180, duration: '75 min', description: 'Anti-aging gold-infused facial for radiant skin.', sortOrder: 10 },
    { name: 'Hydra-Glow Cleansing Facial', category: 'Facial & Skincare', price: 130, duration: '60 min', description: 'Deep cleansing with hydration boost.', sortOrder: 11 },
    { name: 'Body Polishing Ritual', category: 'Body Rituals', price: 140, duration: '75 min', description: 'Full-body exfoliation and nourishment treatment.', sortOrder: 20 },
    { name: 'Foot Spa & Reflexology', category: 'Body Rituals', price: 70, duration: '45 min', description: 'Restorative foot treatment with pressure point therapy.', sortOrder: 21 },
    { name: 'Hair Spa & Scalp Detox', category: 'Hair Spa', price: 95, duration: '60 min', description: 'Revitalizing scalp treatment and deep conditioning.', sortOrder: 30 },
    { name: 'Gel Nail Care', category: 'Nail Care', price: 55, duration: '45 min', description: 'Precision nail shaping and premium gel polish.', sortOrder: 40 },
    { name: 'Laser Hair Removal', category: 'Laser & Waxing', price: 80, duration: '30 min', description: 'Long-lasting smooth skin with laser technology.', sortOrder: 50 },
    { name: 'Orthotics Consultation', category: 'RMT', price: 60, duration: '45 min', description: 'Custom orthotics assessment and fitting.', sortOrder: 60 },
    { name: 'AVS Signature Couple Retreat', category: 'Body Rituals', price: 380, duration: '120 min', description: 'Luxurious dual treatment experience for two.', sortOrder: 22 },
  ];

  for (const svc of serviceData) {
    await prisma.service.upsert({
      where: { id: `seed-svc-${svc.sortOrder}` },
      update: {},
      create: { id: `seed-svc-${svc.sortOrder}`, ...svc, status: 'Active' },
    });
  }
  console.log('✅ Services seeded:', serviceData.length);

  // Packages
  const packageData = [
    {
      name: 'Wellness Starter Pack',
      category: 'Wellness',
      description: 'Perfect introduction to AVS wellness. 3 essential treatments.',
      price: 249,
      originalPrice: 299,
      discount: 50,
      sessions: 3,
      validity: '3 months',
      status: 'Active' as const,
      sortOrder: 1,
      services: ['RMT Massage Therapy', 'Aroma Therapy Massage', 'Foot Spa & Reflexology'],
    },
    {
      name: 'Luxury Glow Package',
      category: 'Skincare',
      description: 'Radiance-focused package combining facials and body treatments.',
      price: 399,
      originalPrice: 460,
      discount: 61,
      sessions: 4,
      validity: '6 months',
      status: 'Active' as const,
      sortOrder: 2,
      services: ['Luxury 24K Gold Facial', 'Hydra-Glow Cleansing Facial', 'Body Polishing Ritual', 'Foot Spa & Reflexology'],
    },
    {
      name: 'RMT Therapeutic Bundle',
      category: 'RMT',
      description: 'Therapeutic massage bundle for ongoing pain management and recovery.',
      price: 549,
      originalPrice: 630,
      discount: 81,
      sessions: 6,
      validity: '4 months',
      status: 'Active' as const,
      sortOrder: 3,
      services: ['RMT Massage Therapy', 'Deep Tissue Massage', 'Sports Massage'],
    },
  ];

  for (const pkg of packageData) {
    const { services, ...pkgData } = pkg;
    await prisma.package.upsert({
      where: { id: `seed-pkg-${pkg.sortOrder}` },
      update: {},
      create: {
        id: `seed-pkg-${pkg.sortOrder}`,
        ...pkgData,
        servicesIncluded: { create: services.map(s => ({ serviceName: s })) },
      },
    });
  }
  console.log('✅ Packages seeded:', packageData.length);

  // Staff
  const staffData = [
    { name: 'Sarah Chen', role: 'RMT Therapist', phone: '+1 647-555-0101', locationId: brampton.id },
    { name: 'Priya Sharma', role: 'Esthetician', phone: '+1 647-555-0102', locationId: brampton.id },
    { name: 'Michael Torres', role: 'RMT Therapist', phone: '+1 647-555-0103', locationId: brampton.id },
    { name: 'Anya Kapoor', role: 'Nail Technician', phone: '+1 647-555-0104', locationId: brampton.id },
  ];
  for (const staff of staffData) {
    await prisma.staff.upsert({
      where: { id: `seed-staff-${staff.name.replace(/\s/g, '')}` },
      update: {},
      create: { id: `seed-staff-${staff.name.replace(/\s/g, '')}`, ...staff, active: true },
    });
  }
  console.log('✅ Staff seeded:', staffData.length);

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('   Admin Login: admin@auravitalstar.ca');
  console.log('   Password:    Admin@AVS2025');
  console.log('   API:         http://localhost:4000/api\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
