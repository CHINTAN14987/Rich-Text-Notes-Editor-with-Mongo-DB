import { configureStore } from '@reduxjs/toolkit';
import NotesReducer from './notesSlice';

const store = configureStore({
  reducer: { NotesReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export default store;
