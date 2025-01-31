import { useReducer } from 'react';

const useModals = () => {
  const initState = {
    successModal: false,
    signInModal: false,
    addProjectModal: false,
    addSectionModal: false,
    editSectionModal: false,
    addAPIEndpointModal: false,
    addAPIDocModal: false,
    editAPIEndpointModal: false,
    deleteAPIEndpointModal: false,
    deleteAPISectionModal: false,
    deleteAPIProjectModal: false,
    editAPIProjectModal: false
  };

  const [modals, updateModals] = useReducer(
    (prev: typeof initState, next: Partial<typeof initState>): typeof initState => {
      return { ...prev, ...next };
    },
    initState
  );

  return { modals, updateModals };
};

export { useModals }