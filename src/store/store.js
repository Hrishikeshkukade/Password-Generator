import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../store/themeSlice';


export default configureStore({
  reducer: {
    theme: themeReducer,
  },
});