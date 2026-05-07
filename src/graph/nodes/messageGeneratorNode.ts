import type { GraphState } from '../graph.ts';

import { AIMessage } from '@langchain/core/messages';

import { ScheduleMessages } from '../../domain/messages/scheduleMessages.ts';
import { CancelMessages } from '../../domain/messages/cancelMessages.ts';
import { CommonMessages } from '../../domain/messages/commonMessages.ts';
import { UpdateMessages } from '../../domain/messages/updateMessages.ts';
export function createMessageGeneratorNode() {

  return async (state: GraphState): Promise<Partial<GraphState>> => {

    console.log('💬 Generating deterministic response...');

    let message = CommonMessages.unknownIntent();

    // SCHEDULE
    if (state.intent === 'schedule') {

      if (state.actionSuccess) {

        message = ScheduleMessages.success(
          state.clientName!,
          state.datetime!
        );
      }

      else if (state.actionError === 'CLIENT_NOT_FOUND') {

        message = ScheduleMessages.clientNotFound(
          state.clientName!
        );
      }

      else if (state.actionError === 'TIME_CONFLICT') {

        message = ScheduleMessages.sellerConflict(
          state.datetime!
        );
      }

      else if (state.actionError === 'DATETIME_MISSING') {

        message = ScheduleMessages.datetimeMissing();
      }
    }
    // UPDATE
    if (state.intent === 'update') {
      if (state.actionSuccess) {

        message = UpdateMessages.success(
          state.clientName!,
          state.olddate!,
          state.newdate!

        );
      }
    }
    // CANCEL
    if (state.intent === 'cancel') {

      if (state.actionSuccess) {

        message = CancelMessages.success(
          state.clientName!,
          state.datetime!
        );
      }

      else if (state.actionError === 'APPOINTMENT_NOT_FOUND') {

        message = CancelMessages.notFound();
      }
    }

    return {
      messages: [
        ...state.messages,
        new AIMessage(message)
      ]
    };
  };
}