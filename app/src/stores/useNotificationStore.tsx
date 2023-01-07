import create, { State } from "zustand";
import produce from "immer";

interface NotificationStore extends State {
  notifications: Array<{
    type: string;
    message: string;
    timeSec?: number;
    description?: string;
    txid?: string;
  }>;
  set: (x: any) => void;
}

const useNotificationStore = create<NotificationStore>((set, _get) => ({
  notifications: [],
  set: (fn) => set(produce(fn)),
}));

export default useNotificationStore;
