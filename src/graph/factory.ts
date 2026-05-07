//Fábrica de instancias
import { config } from '../config.ts';
import { AppointmentService } from '../services/appointmentService.ts';
import { OpenRouterService } from '../services/openRouterService.ts';
import { buildAppointmentGraph } from './graph.ts';

export function buildGraph() {
  const llmClient = new OpenRouterService(config)
  const oppointmmentService = new AppointmentService()
  return buildAppointmentGraph(
    llmClient,
    oppointmmentService
  );
}

export const graph = async () => {
  return buildGraph();
};

