// store/slices/favoritesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabaseClient'

export const fetchFavoritesAsync = createAsyncThunk(
  'favorites/fetchFavoritesAsync',
  async (userId) => {
    const { data, error } = await supabase
      .from('favorites')
      .select('country_data')
      .eq('user_id', userId)

    if (error) throw error
    return data.map((f) => f.country_data.cca3)
  }
)

export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggleFavoriteAsync',
  async ({ userId, country, isFavorite }) => {
    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', userId).eq('country_name', country.name.common)
      return { countryId: country.cca3, remove: true }
    } else {
      await supabase.from('favorites').insert({
        user_id: userId,
        country_name: country.name.common,
        country_data: country,
      })
      return { countryId: country.cca3, remove: false }
    }
  }
)

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    ids: [],
    status: 'idle',
  },
  reducers: {
    clearFavorites: (state) => {
      state.ids = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritesAsync.fulfilled, (state, action) => {
        state.ids = action.payload
      })
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        const { countryId, remove } = action.payload
        if (remove) {
          state.ids = state.ids.filter((id) => id !== countryId)
        } else {
          state.ids.push(countryId)
        }
      })
  },
})

export const { clearFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer

