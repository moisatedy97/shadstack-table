import { I_DataTableSessionStates } from "@/lib/interfaces/data-table-states";

export enum SESSION_STORAGE_KEYS {
  DATATABLE_SESSION_STATES = "datagrid_session_states",
}

const storage: Storage = sessionStorage;

export const accessSessionStorage = {
  getDataTableSessionState: (): I_DataTableSessionStates | null => {
    return JSON.parse(
      storage.getItem(SESSION_STORAGE_KEYS.DATATABLE_SESSION_STATES) as string,
    ) as I_DataTableSessionStates | null;
  },
  setDataTableSessionState: (state: I_DataTableSessionStates) => {
    storage.setItem(SESSION_STORAGE_KEYS.DATATABLE_SESSION_STATES, JSON.stringify(state));
  },
  addDataTableSessionState: <TState>(key: keyof I_DataTableSessionStates, value: TState) => {
    const sessionState = accessSessionStorage.getDataTableSessionState();

    if (sessionState) {
      accessSessionStorage.setDataTableSessionState({ ...sessionState, [key]: value });
    } else {
      accessSessionStorage.setDataTableSessionState({ [key]: value } as unknown as I_DataTableSessionStates);
    }
  },
};
