import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const seekerId = searchParams.get('seekerId')
    const landlordId = searchParams.get('landlordId')
    const propertyId = searchParams.get('propertyId')

    const where: any = {}
    if (seekerId) where.seekerId = seekerId
    if (landlordId) where.landlordId = landlordId
    if (propertyId) where.propertyId = propertyId

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        seeker: {
          select: { name: true, phone: true, type: true }
        },
        landlord: {
          select: { name: true, phone: true }
        },
        property: {
          select: { 
            title: true, 
            location: true, 
            rent: true,
            images: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: inquiries })

  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { seekerId, propertyId, message, visitDate } = body

    // Get property details to find landlord
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { landlordId: true, title: true }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        seekerId,
        propertyId,
        landlordId: property.landlordId,
        message,
        visitDate: visitDate ? new Date(visitDate) : null,
        status: 'PENDING',
      },
      include: {
        seeker: {
          select: { name: true, phone: true }
        },
        property: {
          select: { title: true, location: true }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: inquiry 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create inquiry' },
      { status: 500 }
    )
  }
}
