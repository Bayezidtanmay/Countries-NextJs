import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const loadCountries = createAsyncThunk('countries/load', async () => {
  const response = await axios.get(
    'https://restcountries.com/v3.1/all?fields=name,capital,flags,population,currencies,cca3,region,latlng'
  )
  return response.data
})

const countriesSlice = createSlice({
  name: 'countries',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadCountries.pending, state => {
        state.status = 'loading'
      })
      .addCase(loadCountries.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadCountries.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default countriesSlice.reducer

