// app/admin/edit/[id]/page.js
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PostEditor from '@/components/PostEditor';

export default function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('posts').select('*').eq('id', id).single();
      setPost(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 40px', fontSize: 16, color: 'var(--gray-500)' }}>
        Loading post...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 40px' }}>
        <h2>Post not found</h2>
      </div>
    );
  }

  return <PostEditor existing={post} />;
}
