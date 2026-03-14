import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { city, businessType, investment, targetCustomers } = await request.json()

    // Query location scores from database
    const { data: areas, error } = await supabase
      .from('location_scores')
      .select('*')
      .ilike('city', `%${city}%`)

    if (error || !areas || areas.length === 0) {
      // Return mock data if no areas found
      return NextResponse.json({
        success: true,
        data: getMockLocationData(city),
        source: 'mock'
      })
    }

    // Calculate match scores
    const scoredAreas = areas.map((area: any) => {
      let score = area.overall_score
      let reasons: string[] = []
      
      if (investment > 500000) {
        score += 5
        reasons.push('Premium area suitable for high investment')
      }
      if (investment < 100000) {
        score -= 10
        reasons.push('May be expensive for low budget')
      }
      
      if (businessType?.toLowerCase().includes('food') && area.foot_traffic_score > 70) {
        score += 10
        reasons.push('High foot traffic ideal for food business')
      }
      
      if (area.safety_score < 50) {
        score -= 15
        reasons.push('Safety concerns in this area')
      }

      return { 
        ...area, 
        calculatedScore: Math.min(100, Math.max(0, score)),
        reasons
      }
    })

    const sorted = scoredAreas.sort((a: any, b: any) => b.calculatedScore - a.calculatedScore)
    
    return NextResponse.json({
      success: true,
      data: {
        recommended: sorted.filter((a: any) => a.calculatedScore >= 70).slice(0, 5),
        moderate: sorted.filter((a: any) => a.calculatedScore >= 40 && a.calculatedScore < 70).slice(0, 5),
        avoid: sorted.filter((a: any) => a.calculatedScore < 40).slice(0, 3),
        totalAreas: areas.length
      },
      source: 'database'
    })

  } catch (error) {
    console.error('Error analyzing locations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze locations' },
      { status: 500 }
    )
  }
}

function getMockLocationData(city: string) {
  const baseAreas = [
    {
      id: '1',
      area_name: 'MG Road',
      city: city,
      latitude: 12.9716,
      longitude: 77.5946,
      overall_score: 85,
      foot_traffic_score: 90,
      competition_density: 60,
      demographics_score: 80,
      spending_power: 85,
      safety_score: 75,
      calculatedScore: 88,
      reasons: ['High foot traffic', 'Premium location', 'Good connectivity']
    },
    {
      id: '2',
      area_name: 'Koramangala',
      city: city,
      latitude: 12.9352,
      longitude: 77.6245,
      overall_score: 78,
      foot_traffic_score: 75,
      competition_density: 70,
      demographics_score: 85,
      spending_power: 80,
      safety_score: 80,
      calculatedScore: 82,
      reasons: ['Young demographics', 'Startup hub', 'High spending power']
    },
    {
      id: '3',
      area_name: 'Indiranagar',
      city: city,
      latitude: 12.9784,
      longitude: 77.6408,
      overall_score: 72,
      foot_traffic_score: 70,
      competition_density: 75,
      demographics_score: 75,
      spending_power: 75,
      safety_score: 85,
      calculatedScore: 75,
      reasons: ['Residential area', 'Good safety', 'Steady footfall']
    },
    {
      id: '4',
      area_name: 'Electronic City',
      city: city,
      latitude: 12.8458,
      longitude: 77.6785,
      overall_score: 35,
      foot_traffic_score: 40,
      competition_density: 30,
      demographics_score: 50,
      spending_power: 45,
      safety_score: 70,
      calculatedScore: 32,
      reasons: ['Low foot traffic', 'Industrial area', 'Limited residential']
    }
  ]

  return {
    recommended: baseAreas.filter(a => a.calculatedScore >= 70),
    moderate: baseAreas.filter(a => a.calculatedScore >= 40 && a.calculatedScore < 70),
    avoid: baseAreas.filter(a => a.calculatedScore < 40),
    totalAreas: baseAreas.length
  }
}
