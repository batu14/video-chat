import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkMode: boolean;
}

// HTML class yönetimi
const applyTheme = (isDark: boolean) => {
  document.documentElement.classList.toggle('dark', isDark);
};

const getInitialTheme = (): boolean => {
    if (typeof window === 'undefined') return false;
  
    const savedTheme = localStorage.getItem('theme');
    
    // Eğer localStorage yoksa light mod ile başlat
    const isDark = savedTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  
    return isDark;
  };

const initialState: ThemeState = {
  isDarkMode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
      applyTheme(state.isDarkMode);
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
      localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
      applyTheme(state.isDarkMode);
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
