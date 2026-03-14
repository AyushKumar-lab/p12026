import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const type = searchParams.get('type')

    let query = supabase
      .from('properties')
      .select(`
        *,
        landlord:users(name, verified)
      `)
      .eq('status', 'AVAILABLE')

    if (city) {
      query = query.ilike('city', `%${city}%`)
    }
    if (type) {
      query = query.eq('type', type)
    }
    if (minPrice) {
      query = query.gte('rent', parseInt(minPrice))
    }
    if (maxPrice) {
      query = query.lte('rent', parseInt(maxPrice))
    }

    const { data: properties, error } = await query
      .order('match_score', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        success: true, 
        data: [],
        count: 0 
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: properties || [],
      count: properties?.length || 0 
    })

  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        ...body,
        status: 'AVAILABLE',
        verified: false,
        views_count: 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: property 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    )
  }
}
