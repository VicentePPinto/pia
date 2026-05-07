export class ScheduleMessages {

  static success(clientName: string, datetime: string) {

    const formattedDate = new Date(datetime)
      .toLocaleString('pt-BR', { timeZone: 'UTC' });

    return `Prontinho, a reunião que você solicitou com ${clientName} foi agendada com sucesso para ${formattedDate}.`;
  }

  static clientNotFound(clientName: string) {
    return `Ahh... Desculpe mas eu não encontrei o cliente "${clientName}". Podemos cadastrá-lo?`;
  }

  static multipleClients(clientName: string) {
    return `Olha eu encontrei mais de um cliente com o nome "${clientName}". Pode informar o nome completo?`;
  }

  static sellerConflict(datetime: string) {

    const formattedDate = new Date(datetime)
      .toLocaleString('pt-BR');

    return `Olha estou vendo aqui que você já possui um compromisso em ${formattedDate}. Deseja escolher outro horário?`;
  }

  static clientConflict(clientName: string, datetime: string) {

    const formattedDate = new Date(datetime)
      .toLocaleString('pt-BR');

    return `Verifiquei que temos um conflito de agenda, o cliente ${clientName} já possui um compromisso em ${formattedDate}. Deseja sugerir outro horário?`;
  }

  static datetimeMissing() {
    return 'Não consegui identificar a data e hora da reunião. Pode informar novamente?';
  }

  static clientNameMissing() {
    return 'Qual o nome do cliente?';
  }

  static validationError() {
    return 'Algumas informações obrigatórias estão faltando.';
  }

  static internalError() {
    return 'Ocorreu um erro interno. Tente novamente.';
  }
}