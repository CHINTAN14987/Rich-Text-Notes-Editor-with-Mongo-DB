import { createSlice } from '@reduxjs/toolkit';

const initialState = { ToggleColor: null };

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    backgroundToggleColor: (state, action) => {
      state.ToggleColor = action.payload;
      return state;
    },
  },
});
export default notesSlice.reducer;
export const NotesActions = notesSlice.actions;
