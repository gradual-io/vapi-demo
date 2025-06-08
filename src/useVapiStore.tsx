import { create } from 'zustand';
import type { VapiRoomData } from './vapiTypes';

interface VapiStore {
  vapiRoomData?: VapiRoomData;
  setVapiRoomData: (value: VapiRoomData) => void;
}

export const useVapiStore = create<VapiStore>((set) => ({
  vapiRoomData: undefined,
  setVapiRoomData: (value: VapiRoomData) => set(() => ({ vapiRoomData: value })),
}));
