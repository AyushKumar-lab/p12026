import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const where: any = {}
    if (type) where.type = type.toUpperCase()

    const users = await prisma.user.findMany({
      where,
      include: {
        profile: true,
        _count: {
          select: { 
            properties: true,
            inquiries: true 
          },
        },
      },
      take: 100,
    })

    return NextResponse.json({ success: true, data: users })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, name, type, email, password, ...profileData } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this phone number' },
        { status: 400 }
      )
    }

    // Hash password if provided
    let hashedPassword = null
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        phone,
        email,
        name,
        type: type.toUpperCase(),
        verified: false,
        ...(type.toUpperCase() === 'SEEKER' && profileData && {
          profile: {
            create: {
              category: profileData.category,
              subCategory: profileData.subCategory,
              investmentCapacity: parseInt(profileData.investmentCapacity),
              targetCustomers: profileData.targetCustomers,
              preferredCity: profileData.preferredCity,
            }
          }
        })
      },
      include: {
        profile: true,
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: user 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
