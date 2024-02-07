// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialDarkMode = localStorage.getItem('darkMode') === 'true';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: initialDarkMode,
  },
  reducers: {
    toggleTheme: state => {
      const newDarkMode = !state.darkMode;
      // Update local storage
      localStorage.setItem('darkMode', newDarkMode);
      state.darkMode = newDarkMode;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
