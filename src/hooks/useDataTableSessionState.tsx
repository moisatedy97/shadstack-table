import React from "react";

import { I_DataTableSessionStates } from "@/lib/interfaces/data-table-states";
import { accessSessionStorage } from "@/stores/session-storage";

/**
 * Custom hook for managing and persisting session state related to data table configurations.
 *
 * This hook initializes the state with either the value from session storage (if available) or a default value.
 * It also provides a setter function that updates the state and persists the new state to session storage.
 *
 * @template TState The type of the state being managed.
 * @param {keyof I_DataTableSessionStates} key The key identifying the specific piece of state to manage.
 * @param {TState} defaultValue The default value to use for the state if no value is found in session storage.
 * @returns A tuple containing the current state and a setter function to update the state.
 */
function useDataTableSessionState<TState>(key: keyof I_DataTableSessionStates, defaultValue: TState) {
  const [state, setState] = React.useState<TState>(() => {
    const sessionValue = accessSessionStorage.getDataTableSessionState();

    return sessionValue && (sessionValue[key] as TState) ? (sessionValue[key] as TState) : defaultValue;
  });

  const setAndStoreState: React.Dispatch<React.SetStateAction<TState>> = (
    newState: TState | ((prevState: TState) => TState),
  ) => {
    setState((prevState) => {
      const value = newState instanceof Function ? newState(prevState) : newState;

      accessSessionStorage.addDataTableSessionState(key, value);

      return value;
    });
  };

  return [state, setAndStoreState] as [TState, React.Dispatch<React.SetStateAction<TState>>];
}

export default useDataTableSessionState;
