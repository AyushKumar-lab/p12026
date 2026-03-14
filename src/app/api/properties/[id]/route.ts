import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            phone: true,
            verified: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { inquiries: true, reviews: true },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.property.update({
      where: { id: params.id },
      data: { viewsCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true, data: property })

  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const property = await prisma.property.update({
      where: { id: params.id },
      data: body,
      include: {
        landlord: {
          select: { name: true, phone: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: property })

  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.property.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Property deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
