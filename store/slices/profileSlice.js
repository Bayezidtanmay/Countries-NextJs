import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabaseClient'

export const fetchUserProfileAsync = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Fetch profile error:', err)
      return rejectWithValue(err.message)
    }
  }
)

export const updateUserProfileAsync = createAsyncThunk(
  'profile/updateUserProfile',
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Update profile error:', err)
      return rejectWithValue(err.message)
    }
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfileAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUserProfileAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.data = action.payload
      })
  },
})

export const { clearProfile } = profileSlice.actions
export default profileSlice.reducer
