import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/auth/require-admin'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string || 'spa'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 10 * 1024 * 1024 // 10MB per file

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}. Allowed: JPEG, PNG, WebP, GIF` },
          { status: 400 }
        )
      }
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Maximum size: 10MB` },
          { status: 400 }
        )
      }
    }

    const uploadedImages = []
    const errors = []

    for (const file of files) {
      try {
        // Generate unique filename
        const extension = file.name.split('.').pop() || 'jpg'
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 8)
        const filename = `gallery/${category}/${timestamp}_${randomId}.${extension}`

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: false
          })

        if (uploadError) {
          console.error(`Upload error for ${file.name}:`, uploadError)
          errors.push({ file: file.name, error: uploadError.message })
          continue
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(filename)

        const publicUrl = urlData.publicUrl

        // Get max sort_order for this category
        const { data: maxOrderData } = await supabase
          .from('gallery_images')
          .select('sort_order')
          .eq('category', category)
          .order('sort_order', { ascending: false })
          .limit(1)
          .single()

        const nextSortOrder = (maxOrderData?.sort_order ?? -1) + 1

        // Insert into gallery_images table
        const { data: imageData, error: dbError } = await supabase
          .from('gallery_images')
          .insert({
            image_url: publicUrl,
            category: category,
            is_active: true,
            is_featured: false,
            sort_order: nextSortOrder,
            title_es: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
          })
          .select()
          .single()

        if (dbError) {
          console.error(`Database error for ${file.name}:`, dbError)
          errors.push({ file: file.name, error: dbError.message })
          continue
        }

        uploadedImages.push(imageData)
      } catch (fileError) {
        console.error(`Error processing ${file.name}:`, fileError)
        errors.push({ file: file.name, error: String(fileError) })
      }
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedImages,
      errors: errors.length > 0 ? errors : undefined,
      message: `${uploadedImages.length} of ${files.length} images uploaded successfully`
    })
  } catch (error) {
    console.error('Gallery upload handler error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
