import { AppointmentService } from '../../services/appointmentService.ts';
import type { GraphState } from '../graph.ts';
import { z } from 'zod/v3';

const UpdaterRequiredFieldSchema = z.object({
  sellerId: z.number({ required_error: 'Seller ID is required' }),
  olddate: z.string({ required_error: 'Appointment datetime is required' }),
  newdate: z.string({ required_error: 'New meeting datetime is required' }),
  clientName: z.string({ required_error: 'Client name is required' })
 // clientId: z.number({ required_error: 'Client ID is required' })
});

export function createUpdaterNode(appointmentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`📅 Updating appointment...`);

    try {
      const validation = UpdaterRequiredFieldSchema.safeParse(state);

      if (!validation.success) {
        const errorMessages = validation.error.errors.map(e => e.message).join(', ');
        console.log(`⚠️ Validation failed: ${errorMessages}`);

        return {
          ...state,
          actionSuccess: false,
          actionError: `VALIDATION_ERROR: ${errorMessages}`,
          error: 'VALIDATION_ERROR'
        };
      }

      const result = await appointmentService.updateMeeting(
        validation.data.sellerId,
        validation.data.clientName,
        new Date(validation.data.olddate),
        new Date(validation.data.newdate)
      );

      // 🔴 NOVO: tratar retorno estruturado
      if (!result.success) {
        console.log(`⚠️ Business rule failed: ${result.code}`);

        return {
          ...state,
          actionSuccess: false,
          actionError: result.code,
          error: result.code
        };
      }

      console.log(`✅ Appointment updated successfully`);

      return {
        ...state,
        actionSuccess: true,
        appointmentData: result.data,
      };

    } catch (error) {
      console.log(error);
      console.log(`❌ Updating failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return {
        ...state,
        actionSuccess: false,
        actionError: error instanceof Error ? error.message : 'Updating failed',
        error: 'INTERNAL_ERROR'
      };
    }
  };
}