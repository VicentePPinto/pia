import { AppointmentRepository } from '../../modules/appointment/appointment.repository.ts';
import type { GraphState } from '../graph.ts';

export function createCheckAvailabilityNode() {
  const repo = new AppointmentRepository();

  return async (state: GraphState): Promise<Partial<GraphState>> => {

    if (!state.clientId || !state.datetime || !state.sellerId) {
      return {
        ...state,
        error: 'MISSING_REQUIRED_DATA'
      };
    }

    const date = new Date(state.datetime);
const startsAt = new Date(date);
    const endsAt = new Date(startsAt);
    endsAt.setHours(endsAt.getHours() + 1);

    const sellerConflict = await repo.findConflict(state.sellerId, startsAt, endsAt);

    if (sellerConflict) {
      return {
        ...state,
        error: 'TIME_CONFLICT'
      };
    }

    const clientConflict = await repo.findByClientAndDatetime(state.clientId, date);

    if (clientConflict) {
      return {
        ...state,
        error: 'CLIENT_ALREADY_BOOKED'
      };
    }

    return state;
  };
}