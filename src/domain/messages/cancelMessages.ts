export class CancelMessages {

  static success(clientName: string, datetime: string) {

    const formattedDate = new Date(datetime)
      .toLocaleString('pt-BR');

    return `A reunião com ${clientName} em ${formattedDate} foi cancelada com sucesso.`;
  }

  static notFound() {
    return 'Não encontrei este agendamento para cancelamento.';
  }
}