import { I_DataTableLocalStates } from "@/lib/interfaces/data-table-states";

export enum LOCAL_STORAGE_KEYS {
  DATATABLE_LOCAL_STATES = "datagrid_local_states",
}

const storage: Storage = localStorage;

export const accessLocalStorage = {
  getDataTableLocalState: (): I_DataTableLocalStates | null => {
    return JSON.parse(
      storage.getItem(LOCAL_STORAGE_KEYS.DATATABLE_LOCAL_STATES) as string,
    ) as I_DataTableLocalStates | null;
  },
  setDataTableLocalState: (state: I_DataTableLocalStates) => {
    storage.setItem(LOCAL_STORAGE_KEYS.DATATABLE_LOCAL_STATES, JSON.stringify(state));
  },
  addDataTableLocalState: <TState>(key: keyof I_DataTableLocalStates, value: TState) => {
    const localState = accessLocalStorage.getDataTableLocalState();

    if (localState) {
      accessLocalStorage.setDataTableLocalState({ ...localState, [key]: value });
    } else {
      accessLocalStorage.setDataTableLocalState({ [key]: value } as unknown as I_DataTableLocalStates);
    }
  },
};
