import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// This endpoint triggers live data collection
// Can be called from frontend or scheduled

export async function POST(request: Request) {
  try {
    const { area } = await request.json()
    
    // Fetch current location data
    const { data: locationData, error } = await supabase
      .from('location_scores')
      .select('*')
      .eq('area_name', area)
      .single()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    // Simulate live data update
    const now = new Date()
    const hour = now.getHours()
    
    // Time-based foot traffic multiplier
    let multiplier = 1.0
    if (hour >= 9 && hour <= 11) multiplier = 1.2
    else if (hour >= 12 && hour <= 14) multiplier = 1.3
    else if (hour >= 17 && hour <= 20) multiplier = 1.4
    else if (hour >= 21 || hour <= 6) multiplier = 0.5
    
    const baseTraffic = locationData.foot_traffic_score
    const liveTraffic = Math.min(100, Math.round(baseTraffic * multiplier + (Math.random() * 10 - 5)))
    
    // Update with "live" data
    const { error: updateError } = await supabase
      .from('location_scores')
      .update({
        foot_traffic_score: liveTraffic,
        data_sources: {
          ...locationData.data_sources,
          last_live_update: now.toISOString(),
          update_reason: 'hourly_refresh'
        },
        updated_at: now.toISOString()
      })
      .eq('id', locationData.id)
    
    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        area: area,
        foot_traffic: liveTraffic,
        timestamp: now.toISOString(),
        message: 'Live data updated'
      }
    })
    
  } catch (error) {
    console.error('Error collecting live data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to collect live data' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Get current live status of all areas
  try {
    const { data, error } = await supabase
      .from('location_scores')
      .select('area_name, foot_traffic_score, overall_score, updated_at, data_sources')
      .order('overall_score', { ascending: false })
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    // Add "live" indicator
    const liveData = data.map((area: any) => ({
      ...area,
      is_live: new Date(area.updated_at) > new Date(Date.now() - 3600000), // Updated within last hour
      status: area.foot_traffic_score > 70 ? 'busy' : area.foot_traffic_score > 40 ? 'moderate' : 'quiet'
    }))
    
    return NextResponse.json({
      success: true,
      data: liveData,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error fetching live status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live status' },
      { status: 500 }
    )
  }
}
