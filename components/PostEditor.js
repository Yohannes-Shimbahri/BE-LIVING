'use client'

import { useState } from 'react'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PostEditor({ existing }) {
  const router = useRouter()

  const [title, setTitle] = useState(existing?.title || '')
  const [content, setContent] = useState(existing?.content || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    if (existing) {
      // UPDATE
      const { error } = await supabase
        .from('posts')
        .update({ title, content })
        .eq('id', existing.id)

      if (error) {
        alert('Error updating post')
        console.error(error)
      } else {
        alert('Post updated!')
        router.push('/admin/dashboard')
      }
    } else {
      // CREATE
      const { error } = await supabase
        .from('posts')
        .insert([{ title, content }])

      if (error) {
        alert('Error creating post')
        console.error(error)
      } else {
        alert('Post created!')
        router.push('/admin/dashboard')
      }
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto' }}>
      <h2>{existing ? 'Edit Post' : 'Create Post'}</h2>

      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '16px'
        }}
      />

      <textarea
        placeholder="Write your content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '16px'
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '12px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Saving...' : existing ? 'Update Post' : 'Create Post'}
      </button>
    </div>
  )
}