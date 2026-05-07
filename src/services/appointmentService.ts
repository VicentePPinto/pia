import { ClientRepository } from '../modules/client/client.repository.ts';
import { AppointmentRepository } from '../modules/appointment/appointment.repository.ts';
import type { ServiceResult } from '../types/serviceResult.ts';

export class AppointmentService {

  private clientRepo = new ClientRepository();
  private appointmentRepository = new AppointmentRepository();

  async meetAppointment(
    sellerId: number,
    date: Date,
    clientName: string,
    reason: string
  ): Promise<ServiceResult> {

    // 🔎 1. Buscar cliente
    const clients = await this.clientRepo.findByName(clientName);

    if (clients.length === 0) {
      return { success: false, code: 'CLIENT_NOT_FOUND' };
    }

    if (clients.length > 1) {
      return {
        success: false,
        code: 'MULTIPLE_CLIENTS',
        data: clients
      };
    }

    

    // 🔎 2. Verificar conflito do vendedor
    const startsAt = new Date(date);
    const endsAt = new Date(startsAt);
    endsAt.setHours(endsAt.getHours() + 1);

    const sellerAppointmentConflict = await this.appointmentRepository.findConflict(
      sellerId,
      startsAt,
      endsAt
    );
  

    if (sellerAppointmentConflict) {
      return { success: false, code: 'TIME_CONFLICT' };
    }

    // 🔎 3. Verificar conflito do cliente
    const clientConflict = await this.appointmentRepository.findByClientAndDatetime(
      clients.id,
      startsAt
    );

    if (clientConflict) {
      return { success: false, code: 'CLIENT_ALREADY_BOOKED' };
    }

    // 💾 4. Criar agendamento
    const appointment = await this.appointmentRepository.create({
      clientId: clients.id,
      sellerId: sellerId,
      datetime: date,
      reason: reason
    });

    return {
      success: true,
      data: appointment
    };
  }

  async checkAvailability(
    sellerId: number,
    date: Date,
    clientName: string
  ): Promise<ServiceResult> {

    const clients = await this.clientRepo.findByName(clientName);

    if (clients.length === 0) {
      return { success: false, code: 'CLIENT_NOT_FOUND' };
    }

    if (clients.length > 1) {
      return {
        success: false,
        code: 'MULTIPLE_CLIENTS',
        data: clients
      };
    }

    const client = clients[0];

    const startsAt = new Date(date);
    const endsAt = new Date(startsAt);
    endsAt.setHours(endsAt.getHours() + 1);

    const sellerAppointmentConflict = await this.appointmentRepository.findConflict(
      sellerId,
      startsAt,
      endsAt
    );
  

    if (sellerAppointmentConflict) {
      return { success: false, code: 'TIME_CONFLICT' };
    }

    const clientConflict = await this.appointmentRepository.findByClientAndDatetime(
      client.id,
      date
    );

    if (clientConflict) {
      return { success: false, code: 'CLIENT_ALREADY_BOOKED' };
    }

    return { success: true };
  }
  async updateMeeting(sellerId: number,
    clientName: string,
    oldDate: Date, newDate: Date): Promise<ServiceResult> {
      const clients = await this.clientRepo.findByName(clientName);

      if (clients.length === 0) {
        return { success: false, code: 'CLIENT_NOT_FOUND' };
      }

      const clientId = clients.id;


      const oldMetting = await this.appointmentRepository.findBySellerClientAndDatetime(
        sellerId,
        clientId,
        oldDate
      );
      if (!oldMetting) {
        return { success: false, code: 'APPOINTMENT_NOT_FOUND' };
      }
      const updated = await this.appointmentRepository.update(oldMetting.id, newDate);
      if (!updated) {
        return { success: false, code: 'UPDATE_FAILED' };
      }
      return {
        success: true,
        data: updated
      };
    }

  async cancelAppointment(
    sellerId: number,
    clientName: string,
    date: Date
  ): Promise<ServiceResult> {

    const clients = await this.clientRepo.findByName(clientName);

    if (clients.length === 0) {
      return { success: false, code: 'CLIENT_NOT_FOUND' };
    }

    const client = clients[0];

    const existing = await this.appointmentRepository.findByClientAndDatetime(
      client.id,
      date
    );

    if (!existing) {
      return { success: false, code: 'APPOINTMENT_NOT_FOUND' };
    }

    await this.appointmentRepository.delete(existing.id);

    return { success: true };
  }
}