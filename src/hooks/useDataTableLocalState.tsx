import React from "react";

import { I_DataTableLocalStates } from "@/lib/interfaces/data-table-states";
import { accessLocalStorage } from "@/stores/local-storage";

/**
 * Custom hook for managing and persisting local state related to data table configurations.
 *
 * This hook initializes the state with either the value from local storage (if available) or a default value.
 * It also provides a setter function that updates the state and persists the new state to local storage.
 *
 * @template TState The type of the state being managed.
 * @param {keyof I_DataTableLocalStates} key The key identifying the specific piece of state to manage.
 * @param {TState} defaultValue The default value to use for the state if no value is found in local storage.
 * @returns A tuple containing the current state and a setter function to update the state.
 */
function useDataTableLocalState<TState>(key: keyof I_DataTableLocalStates, defaultValue: TState) {
  const [state, setState] = React.useState<TState>(() => {
    const localValue = accessLocalStorage.getDataTableLocalState();

    return localValue && (localValue[key] as TState) ? (localValue[key] as TState) : defaultValue;
  });

  const setAndStoreState: React.Dispatch<React.SetStateAction<TState>> = (
    newState: TState | ((prevState: TState) => TState),
  ) => {
    setState((prevState) => {
      const value = newState instanceof Function ? newState(prevState) : newState;

      accessLocalStorage.addDataTableLocalState(key, value);

      return value;
    });
  };

  return [state, setAndStoreState] as [TState, React.Dispatch<React.SetStateAction<TState>>];
}

export default useDataTableLocalState;
