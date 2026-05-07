import { AppointmentService } from '../../services/appointmentService.ts';
import type { GraphState } from '../graph.ts';
import { z } from 'zod/v3';

const CancelRequiredFieldSchema = z.object({
  sellerId: z.number({required_error: 'Professional ID is required'}),
  datetime: z.string({required_error: 'Appointment datetime is required'}),
  clientName: z.string({required_error: 'Patient name is required'})
});

export function createCancellerNode(appointmentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    
    
    try {
      console.log(`❌ Cancelling appointment...`);
       const validation = CancelRequiredFieldSchema.safeParse(state);
    if (!validation.success) {
      const errorMessages = validation.error.errors.map(e => e.message).join(', ');
      console.log(`❌ Cancellation failed: ${errorMessages}`);
      
      return {
        actionSuccess: false,
        actionError: errorMessages,
      }
      }
      appointmentService.cancelAppointment(
        validation.data.sellerId,
        validation.data.clientName,
        new Date(validation.data.datetime),
      )
      return {
        actionSuccess: true,
      };
    } catch (error) {
      console.log(`❌ Cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      
      return {
        actionSuccess: false,
        actionError: error instanceof Error ? error.message : 'Cancellation failed',
      };
    }
  };
}
