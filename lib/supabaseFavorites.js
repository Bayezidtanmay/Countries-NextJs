import { supabase } from './supabaseClient'

export async function fetchFavorites(userId) {
  const { data, error } = await supabase
    .from('favourites')
    .select('country_code')
    .eq('user_id', userId)

  if (error) throw error
  return data.map(f => f.country_code)
}

export async function addFavorite(userId, countryCode) {
  const { error } = await supabase.from('favourites').insert([{ user_id: userId, country_code: countryCode }])
  if (error) throw error
}

export async function removeFavorite(userId, countryCode) {
  const { error } = await supabase
    .from('favourites')
    .delete()
    .eq('user_id', userId)
    .eq('country_code', countryCode)
  if (error) throw error
}
