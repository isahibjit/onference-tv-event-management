import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface EventState {
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isViewDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedEventId: string | null;
}

const initialState: EventState = {
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  isViewDialogOpen: false,
  isDeleteDialogOpen: false,
  selectedEventId: null,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    openCreateDialog(state) {
      state.isCreateDialogOpen = true;
    },
    closeCreateDialog(state) {
      state.isCreateDialogOpen = false;
    },
    openEditDialog(state, action: PayloadAction<string>) {
      state.isEditDialogOpen = true;
      state.selectedEventId = action.payload;
    },
    closeEditDialog(state) {
      state.isEditDialogOpen = false;
      state.selectedEventId = null;
    },
    openViewDialog(state, action: PayloadAction<string>) {
      state.isViewDialogOpen = true;
      state.selectedEventId = action.payload;
    },
    closeViewDialog(state) {
      state.isViewDialogOpen = false;
      state.selectedEventId = null;
    },
    openDeleteDialog(state, action: PayloadAction<string>) {
      state.isDeleteDialogOpen = true;
      state.selectedEventId = action.payload;
    },
    closeDeleteDialog(state) {
      state.isDeleteDialogOpen = false;
      state.selectedEventId = null;
    },
  },
});

export const {
  openCreateDialog,
  closeCreateDialog,
  openEditDialog,
  closeEditDialog,
  openViewDialog,
  closeViewDialog,
  openDeleteDialog,
  closeDeleteDialog,
} = eventSlice.actions;

export default eventSlice.reducer;
