import { ClientRepository } from '../../modules/client/client.repository';

export const createValidateClientNode = () => {
  const repo = new ClientRepository();

  return async (state: any) => {

    const clients = await repo.findByName(state.clientName);

    if (clients.length === 0) {
      return { ...state, error: 'CLIENT_NOT_FOUND' };
    }

    if (clients.length > 1) {
      return { ...state, error: 'MULTIPLE_CLIENTS', clients };
    }

    return {
      ...state,
      clientId: clients[0].id
    };
  };
};