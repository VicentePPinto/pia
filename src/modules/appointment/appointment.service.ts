import { ClientRepository } from '../client/client.repository.ts';
import { AppointmentRepository } from './appointment.repository.ts';

export class AppointmentDomainService {

  private clientRepo = new ClientRepository();
  private appointmentRepo = new AppointmentRepository();

  async schedule(input: {
    clientName: string;
    sellerId: number;
    datetime: Date;
    reason?: string;
  }) {

    const clients = await this.clientRepo.findByName(input.clientName);

    if (clients.length === 0) {
      return { success: false, code: 'CLIENT_NOT_FOUND' };
    }

    if (clients.length > 1) {
      return { success: false, code: 'MULTIPLE_CLIENTS', data: clients };
    }

    const client = clients[0];

    const conflict = await this.appointmentRepo.findConflict(
      input.sellerId,
      input.datetime
    );

    if (conflict) {
      return { success: false, code: 'TIME_CONFLICT' };
    }

    const existing = await this.appointmentRepo.findByClientAndDatetime(
      client.id,
      input.datetime
    );

    if (existing) {
      return { success: false, code: 'CLIENT_ALREADY_BOOKED' };
    }

    const appointment = await this.appointmentRepo.create({
      clientId: client.id,
      sellerId: input.sellerId,
      datetime: input.datetime,
      reason: input.reason
    });

    return { success: true, data: appointment };
  }

  async createClient(name: string) {
    return this.clientRepo.create(name);
  }
}