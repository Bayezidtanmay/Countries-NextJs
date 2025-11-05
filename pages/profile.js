import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [avatarFile, setAvatarFile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error(error)
        alert('Error loading profile')
      } else if (data) {
        setProfile(data)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleChange = e => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  // 🟢 Handles avatar upload and shows it instantly
  const handleAvatarChange = async e => {
    const file = e.target.files[0]
    if (!file) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      alert('Error uploading avatar')
      return
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // ⚡ Instantly show uploaded image (local preview)
    setProfile(prev => ({
      ...prev,
      avatar_url: publicUrl.publicUrl,
    }))

    setAvatarFile(file)
  }

  const removeAvatar = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (profile.avatar_url) {
      const path = profile.avatar_url.split('/').slice(-2).join('/')
      await supabase.storage.from('avatars').remove([path])
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ avatar_url: null })
      .eq('user_id', user.id)

    if (error) alert('Error removing avatar')
    else setProfile(prev => ({ ...prev, avatar_url: '' }))
  }

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let avatarUrl = profile.avatar_url

    const updates = {
      ...profile,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert({ ...updates, user_id: user.id })

    if (error) alert('Error saving profile: ' + error.message)
    else alert('Profile updated successfully!')

    setLoading(false)
  }

  if (loading) return <p className="profile-loading">Loading...</p>

  return (
    <div className="profile-page-wrapper">
      <button
        className="profile-close-btn"
        onClick={() => router.push('/dashboard')}
      >
        ✕
      </button>

      <div className="profile-card">
        <h1 className="profile-title">My Profile</h1>

        <div className="profile-avatar-section">
          <img
            src={profile.avatar_url || '/default-avatar.png'}
            alt=""
            className="profile-avatar"
          />
          <div className="profile-avatar-buttons">
            <label className="upload-label">
              📸 Upload
              <input type="file" onChange={handleAvatarChange} hidden />
            </label>
            {profile.avatar_url && (
              <button className="remove-avatar-btn" onClick={removeAvatar}>
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="profile-fields">
          <label>Display Name</label>
          <input
            type="text"
            name="display_name"
            value={profile.display_name}
            onChange={handleChange}
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
          />

          <label>Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
          />
        </div>

        <button className="save-profile-btn" onClick={handleSave}>
          Save Profile
        </button>
      </div>
    </div>
  )
}