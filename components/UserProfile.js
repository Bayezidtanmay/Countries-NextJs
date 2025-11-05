import { useSelector } from 'react-redux'

export default function UserProfile() {
  const profile = useSelector(state => state.profile.data)
  if (!profile) return null

  return (
    <div style={{
      background: '#f9f9f9',
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
    }}>
      <h3>{profile.display_name || 'User'}</h3>
      {profile.avatar_url && (
        <img
          src={profile.avatar_url}
          alt="Avatar"
          style={{ width: 60, height: 60, borderRadius: '50%' }}
        />
      )}
      {profile.bio && <p>{profile.bio}</p>}
    </div>
  )
}
