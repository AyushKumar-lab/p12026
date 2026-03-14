import { prisma } from '../src/lib/prisma'

async function seed() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.review.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.property.deleteMany()
  await prisma.businessProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.locationScore.deleteMany()

  console.log('✅ Cleaned existing data')

  // Create sample users
  const landlord1 = await prisma.user.create({
    data: {
      phone: '+911234567890',
      name: 'Rajesh Sharma',
      type: 'LANDLORD',
      verified: true,
      email: 'rajesh@example.com',
    }
  })

  const landlord2 = await prisma.user.create({
    data: {
      phone: '+919876543210',
      name: 'Priya Patel',
      type: 'LANDLORD',
      verified: true,
      email: 'priya@example.com',
    }
  })

  const seeker1 = await prisma.user.create({
    data: {
      phone: '+919988776655',
      name: 'Fahad Khan',
      type: 'SEEKER',
      verified: true,
      email: 'fahad@example.com',
      profile: {
        create: {
          category: 'Food & Beverage',
          subCategory: 'Tea Stall',
          investmentCapacity: 150000,
          targetCustomers: ['Students', 'Office Workers'],
          preferredCity: 'Bangalore',
        }
      }
    }
  })

  console.log('✅ Created users')

  // Create sample properties
  const properties = [
    {
      landlordId: landlord1.id,
      title: 'Prime Commercial Space - MG Road',
      location: 'MG Road, Bangalore, Karnataka 560001',
      city: 'Bangalore',
      latitude: 12.9716,
      longitude: 77.5946,
      rent: 25000,
      sizeSqft: 450,
      type: 'SHOP',
      amenities: ['Water', 'Power', 'Parking'],
      images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80'],
      badge: 'Featured',
      verified: true,
      matchScore: 95,
    },
    {
      landlordId: landlord1.id,
      title: 'Street Facing Retail Space',
      location: 'Koramangala 5th Block, Bangalore',
      city: 'Bangalore',
      latitude: 12.9352,
      longitude: 77.6245,
      rent: 18000,
      sizeSqft: 320,
      type: 'RETAIL',
      amenities: ['Water', 'Power'],
      images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'],
      badge: 'Hot',
      verified: true,
      matchScore: 88,
    },
    {
      landlordId: landlord2.id,
      title: 'Food Court Stall - Phoenix Marketcity',
      location: 'Phoenix Marketcity, Whitefield Road, Bangalore',
      city: 'Bangalore',
      latitude: 12.9898,
      longitude: 77.7265,
      rent: 35000,
      sizeSqft: 200,
      type: 'FOOD_COURT',
      amenities: ['Water', 'Power', 'Security'],
      images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
      badge: null,
      verified: true,
      matchScore: 92,
    },
    {
      landlordId: landlord2.id,
      title: 'Modern Office Space - IT Hub',
      location: 'Electronic City Phase 1, Bangalore',
      city: 'Bangalore',
      latitude: 12.8458,
      longitude: 77.6785,
      rent: 42000,
      sizeSqft: 850,
      type: 'OFFICE',
      amenities: ['Water', 'Power', 'Parking', 'Security'],
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
      badge: 'Premium',
      verified: true,
      matchScore: 85,
    },
    {
      landlordId: landlord1.id,
      title: 'Budget Shop - Jayanagar',
      location: 'Jayanagar 4th Block, Bangalore',
      city: 'Bangalore',
      latitude: 12.9308,
      longitude: 77.5838,
      rent: 12000,
      sizeSqft: 280,
      type: 'SHOP',
      amenities: ['Water', 'Power'],
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'],
      badge: null,
      verified: true,
      matchScore: 75,
    },
  ]

  for (const property of properties) {
    await prisma.property.create({ data: property })
  }

  console.log('✅ Created properties')

  // Create location scores
  const locations = [
    {
      areaName: 'MG Road',
      city: 'Bangalore',
      latitude: 12.9716,
      longitude: 77.5946,
      footTrafficScore: 90,
      competitionDensity: 60,
      demographicsScore: 80,
      spendingPower: 85,
      safetyScore: 75,
      overallScore: 85,
    },
    {
      areaName: 'Koramangala',
      city: 'Bangalore',
      latitude: 12.9352,
      longitude: 77.6245,
      footTrafficScore: 75,
      competitionDensity: 70,
      demographicsScore: 85,
      spendingPower: 80,
      safetyScore: 80,
      overallScore: 78,
    },
    {
      areaName: 'Indiranagar',
      city: 'Bangalore',
      latitude: 12.9784,
      longitude: 77.6408,
      footTrafficScore: 70,
      competitionDensity: 75,
      demographicsScore: 75,
      spendingPower: 75,
      safetyScore: 85,
      overallScore: 72,
    },
    {
      areaName: 'Whitefield',
      city: 'Bangalore',
      latitude: 12.9698,
      longitude: 77.7500,
      footTrafficScore: 60,
      competitionDensity: 50,
      demographicsScore: 70,
      spendingPower: 70,
      safetyScore: 80,
      overallScore: 65,
    },
    {
      areaName: 'Jayanagar',
      city: 'Bangalore',
      latitude: 12.9308,
      longitude: 77.5838,
      footTrafficScore: 55,
      competitionDensity: 80,
      demographicsScore: 65,
      spendingPower: 60,
      safetyScore: 75,
      overallScore: 60,
    },
    {
      areaName: 'Electronic City',
      city: 'Bangalore',
      latitude: 12.8458,
      longitude: 77.6785,
      footTrafficScore: 40,
      competitionDensity: 30,
      demographicsScore: 50,
      spendingPower: 45,
      safetyScore: 70,
      overallScore: 35,
    },
  ]

  for (const location of locations) {
    await prisma.locationScore.create({ data: location })
  }

  console.log('✅ Created location scores')

  // Create sample inquiry
  await prisma.inquiry.create({
    data: {
      seekerId: seeker1.id,
      propertyId: (await prisma.property.findFirst())!.id,
      landlordId: landlord1.id,
      message: 'Hi, I am interested in this property for my tea stall business. Is it available for a 2-year lease?',
      visitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'PENDING',
    }
  })

  console.log('✅ Created sample inquiry')

  console.log('\n🎉 Database seeded successfully!')
  console.log(`\nSample login credentials:`)
  console.log(`  Landlord: ${landlord1.phone} / Rajesh Sharma`)
  console.log(`  Seeker: ${seeker1.phone} / Fahad Khan`)
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
