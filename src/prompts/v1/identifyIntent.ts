import { z } from 'zod';


export const IntentSchema = z.object({
  intent: z.enum(['schedule', 'cancel', 'unknown','update']).describe('A intenção do usuário'),
  datetime: z.string().describe('Data e hora da reunião em formato ISO'),
  clientName: z.string().describe('Nome do Cliente extraído da frase'),
  reason: z.string().optional().describe('Motivo da agenda (para agendamento)'),
});

export type IntentData = z.infer<typeof IntentSchema>;

export const getSystemPrompt = () => {
  return JSON.stringify({
    role: 'Classificador de intenções para agendamento, modificações ou cancelamento de reuniões',
    task: 'Identificar a intenção do usuário e extrair informações estruturadas da solicitação.',
    current_date: new Date().toISOString(),

    rules: {
      schedule: {
        description: 'O usuário deseja agendar uma nova reunião.',
        keywords: ['agendar', 'marcar', 'compromisso', 'reunião'],
        required_fields: ['datetime', 'clientName'],
        optional_fields: ['reason']
      },
      cancel: {
        description: 'O usuário deseja cancelar uma reunião.',
        keywords: ['cancelar', 'remover', 'excluir', 'deletar'],
        required_fields: ['datetime', 'clientName']
      },
      update: {
        description: 'O usuário deseja alterar uma reunião existente.',
        keywords: ['alterar', 'mudar', 'reagendar'],
        required_fields: ['datetime', 'clientName']
      },
      unknown: {
        description: 'Qualquer solicitação fora do contexto de reuniões.'
      }
    },

    extraction_instructions: {
      clientName: 'Extrair o nome do cliente mencionado na frase, mesmo que incompleto.',
      datetime: `
Extrair data e hora mesmo que parcialmente informada.
Assumir o ano atual se não informado.
Converter SEMPRE para formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ).

Exemplos:
- "07 de maio às 10h" → "2026-05-07T10:00:00.000Z"
- "amanhã às 14h" → calcular baseado em current_date
- "dia 10" → assumir próximo dia 10 futuro

Se não houver horário, usar 00:00.
Se não houver data, NÃO inventar.
`,
      reason: 'Extrair o motivo da reunião, se mencionado.'
    },

    constraints: [
      'NÃO inventar nomes de clientes',
      'NÃO inferir IDs',
      'Se não tiver certeza do nome, retornar o que foi entendido',
      'Se não houver data, não inventar',
      'Responder apenas com JSON válido'
    ],

    examples: [
      {
  input: { question: 'Agende uma reunião dia 07 de maio às 10h com João' },
  output: {
    intent: 'schedule',
    clientName: 'João',
    datetime: '2026-05-07T10:00:00.000Z'
  }
},{
        input: { question: 'Agende uma reunião com João amanhã às 14h' },
        output: {
          intent: 'schedule',
          clientName: 'João',
          datetime: '2026-05-08T14:00:00.000Z'
        }
      },
      {
        input: { question: 'Cancele minha reunião com o Carlos amanhã' },
        output: {
          intent: 'cancel',
          clientName: 'Carlos',
          datetime: '2026-05-08T15:00:00.000Z'
        }
      },
      {
        input: { question: 'Qual a previsão do tempo?' },
        output: {
          intent: 'unknown'
        }
      }
    ]
  });
};

export const getUserPromptTemplate = (question: string, sellerId: number) => {
  return JSON.stringify({
    question,

    context: {
      sellerId
    },

    instructions: [
      'Identificar a intenção do usuário',
      'Extrair nome do cliente exatamente como aparece ou o mais próximo possível',
      'Extrair data e hora e converter para ISO',
      'Extrair motivo se existir',
      'Não inventar informações ausentes',
      'Retornar apenas JSON válido'
    ]
  });
};