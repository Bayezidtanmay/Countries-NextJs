import { configureStore } from '@reduxjs/toolkit'
import countriesReducer from './slices/countriesSlice'
import favoritesReducer from './slices/favoritesSlice'
import authReducer from './slices/authSlice'
import profileReducer from './slices/profileSlice'

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    profile: profileReducer,
  },
})


