import { z } from 'zod';

export const MessageSchema = z.object({
  message: z.string().min(10).describe('Clear, friendly message for the user')
});

export type MessageResponse = z.infer<typeof MessageSchema>;

export const getSystemPrompt = () => {
  return JSON.stringify({
    role: 'Assistente virtual para agendamento de reuniões comerciais',
    task: 'Gerar mensagens claras, objetivas e profissionais com base no resultado de operações de agendamento.',
    tone: 'Profissional, direto, educado e empático',
    guidelines: {
      language: 'Português claro e simples',
      format: 'Respostas curtas e objetivas',
      personalization: 'Sempre incluir nome do cliente e data/hora quando disponível',
      accuracy: 'Nunca inventar dados ausentes',
      consistency: 'Basear a resposta EXCLUSIVAMENTE no cenário fornecido'
    },
    scenarios: {
      SUCCESS: 'Confirmar o agendamento com cliente, data e hora',
      CLIENT_NOT_FOUND: 'Informar que o cliente não foi encontrado e pedir confirmação ou cadastro',
      MULTIPLE_CLIENTS: 'Informar que existem múltiplos clientes com esse nome e pedir mais detalhes',
      TIME_CONFLICT: 'Informar que o vendedor já possui compromisso nesse horário',
      CLIENT_ALREADY_BOOKED: 'Informar que o cliente já possui compromisso nesse horário',
      VALIDATION_ERROR: 'Informar que dados obrigatórios estão faltando ou inválidos',
      INTERNAL_ERROR: 'Informar erro interno de forma genérica',
      APPOINTMENT_NOT_FOUND: 'Informar que não foi encontrado agendamento para cancelamento',
      UNKNOWN: 'Informar que só pode ajudar com agendamentos ou cancelamentos',
      DATETIME_MISSING: 'Informar que a data/hora não foi compreendida e pedir para o usuário informar novamente',
      CLIENT_NAME_MISSING: 'Solicitar o nome do cliente'
    }
  });
};

export const getUserPromptTemplate = (state: any) => {

  // 🔴 DERIVAÇÃO DO CENÁRIO (CRÍTICO)
  let scenario = 'UNKNOWN';

  if (state.intent === 'schedule' && state.actionSuccess) {
  scenario = 'SCHEDULE_SUCCESS';
}

else if (state.intent === 'cancel' && state.actionSuccess) {
  scenario = 'CANCEL_SUCCESS';
}

else if (state.intent === 'update' && state.actionSuccess) {
  scenario = 'UPDATE_SUCCESS';
}

else if (state.actionError) {
  scenario = state.actionError;
}

  return JSON.stringify({
    scenario,

    context: {
      clientName: state.clientName,
      sellerId: state.sellerId,
      datetime: state.datetime,
      reason: state.reason,
      appointment: state.appointmentData
  ? {
      datetime: state.appointmentData.datetime
    }
  : undefined
    },

    instructions: [
      'Gere uma mensagem apropriada para o cenário',
      'Use apenas os dados disponíveis no contexto',
      'Não invente informações',
      'Se faltar informação, peça ao usuário',
      'Se houver erro, explique claramente e sugira próxima ação',
      'Se sucesso, confirme todos os detalhes',
      'Se múltiplos clientes, peça o nome completo',
      'Responder em português'
    ],

    examples: {
      SCHEDULE_SUCCESS: 'Reunião com João da Silva agendada para 12 de maio às 14h com sucesso.',
      CLIENT_NOT_FOUND: 'Não encontrei o cliente informado. Deseja cadastrá-lo?',
      MULTIPLE_CLIENTS: 'Encontrei mais de um cliente com esse nome. Pode informar o nome completo?',
      TIME_CONFLICT: 'Você já possui um compromisso nesse horário. Deseja escolher outro?',
      CLIENT_ALREADY_BOOKED: 'O cliente já possui um compromisso nesse horário. Deseja sugerir outro?',
      VALIDATION_ERROR: 'Algumas informações estão faltando. Pode revisar os dados?',
      INTERNAL_ERROR: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
      APPOINTMENT_NOT_FOUND: 'Não encontrei esse agendamento para cancelamento.',
      UNKNOWN: 'Posso ajudar com agendamentos ou cancelamentos. O que deseja fazer?'
    }
  });
};
