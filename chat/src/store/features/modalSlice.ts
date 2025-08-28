import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ModalState {
    isCreateRoomOpen: boolean;
    isEditRoomOpen: boolean;
    editingRoom: EditingRoom | null;
}

interface EditingRoom {
    id: string;
    name: string;
    isPrivate: boolean;
    password?: string;
    maxParticipants: number; // Yeni eklenen
}

const initialState: ModalState = {
    isCreateRoomOpen: false,
    isEditRoomOpen: false,
    editingRoom: null
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openCreateRoomModal: (state) => {
            state.isCreateRoomOpen = true
        },
        closeCreateRoomModal: (state) => {
            state.isCreateRoomOpen = false
        },
        openEditRoomModal: (state, action: PayloadAction<{
            id: string;
            name: string;
            isPrivate: boolean;
            password?: string;
            maxParticipants: number; // Yeni eklenen
        }>) => {
            state.isEditRoomOpen = true
            state.editingRoom = action.payload
        },
        closeEditRoomModal: (state) => {
            state.isEditRoomOpen = false
            state.editingRoom = null
        }
    }
})

export const { 
    openCreateRoomModal, 
    closeCreateRoomModal,
    openEditRoomModal,
    closeEditRoomModal
} = modalSlice.actions

export default modalSlice.reducer
