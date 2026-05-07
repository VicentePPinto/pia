import { AppointmentService } from '../../services/appointmentService.ts';
import type { GraphState } from '../graph.ts';
import { z } from 'zod/v3';

const ScheduleRequiredFieldSchema = z.object({
  sellerId: z.number({ required_error: 'Seller ID is required' }),
  datetime: z.string({ required_error: 'Appointment datetime is required' }),
  clientName: z.string({ required_error: 'Client name is required' })
});

export function createSchedulerNode(appointmentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`📅 Scheduling appointment...`);

    try {
      const validation = ScheduleRequiredFieldSchema.safeParse(state);

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

      const result = await appointmentService.bookAppointment(
        validation.data.sellerId,
        new Date(validation.data.datetime),
        validation.data.clientName,
        state.reason ?? 'General Consultation'
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

      console.log(`✅ Appointment scheduled successfully`);

      return {
        ...state,
        actionSuccess: true,
        appointmentData: result.data,
      };

    } catch (error) {
      console.log(error);
      console.log(`❌ Scheduling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return {
        ...state,
        actionSuccess: false,
        actionError: error instanceof Error ? error.message : 'Scheduling failed',
        error: 'INTERNAL_ERROR'
      };
    }
  };
}