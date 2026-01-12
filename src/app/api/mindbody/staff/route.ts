import { NextRequest, NextResponse } from 'next/server'
import { getStaff } from '@/lib/booking/mindbody'

// GET /api/mindbody/staff?locationId=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')
    
    // Get staff from Mindbody
    const staffMembers = await getStaff(
      locationId ? parseInt(locationId) : undefined
    )
    
    return NextResponse.json({
      staff: staffMembers,
      total: staffMembers.length
    })
    
  } catch (error) {
    console.error('Get staff error:', error)
    return NextResponse.json(
      { error: 'Failed to get staff' },
      { status: 500 }
    )
  }
}
