import { getSystemPrompt, getUserPromptTemplate, IntentSchema } from '../../prompts/v1/identifyIntent.ts';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../graph.ts';

export function createIdentifyIntentNode(llmClient: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`🔍 Identifying intent...`);

    try {
      // 🔴 1. EXTRAÇÃO SEGURA DA MENSAGEM
      const lastMessage = state.messages.at(-1);
      const input = typeof lastMessage?.content === 'string'
        ? lastMessage.content
        : JSON.stringify(lastMessage?.content);

      // 🔴 2. VALIDAÇÃO DO SELLER (já deveria existir, mas garantimos)
      if (!state.sellerId) {
        return {
          ...state,
          intent: 'unknown',
          error: 'SELLER_ID_MISSING'
        };
      }

      const systemPrompt = getSystemPrompt();
      const userPrompt = getUserPromptTemplate(input, state.sellerId);

      const result = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        IntentSchema
      );
      console.log('🧠 LLM RAW OUTPUT:', result.data);
      // 🔴 3. ERRO DA LLM
      if (!result.success) {
        console.log(`⚠️ LLM failed: ${result.error}`);

        return {
          ...state,
          intent: 'unknown',
          error: 'LLM_PARSING_ERROR'
        };
      }

      const intentData = result.data!;
      console.log(`✅ Intent identified: ${intentData.intent}`);

      // 🔴 4. VALIDAÇÃO DE CAMPOS POR INTENÇÃO
      if (intentData.intent === 'schedule' || intentData.intent === 'cancel') {

        if (!intentData.clientName) {
          return {
            ...state,
            intent: intentData.intent,
            error: 'CLIENT_NAME_MISSING'
          };
        }

        if (!intentData.datetime) {
          return {
            ...state,
            intent: intentData.intent,
            error: 'DATETIME_MISSING'
          };
        }
      }

      // 🔴 5. RETORNO CONTROLADO
      return {
        ...state,
        intent: intentData.intent,
        clientName: intentData.clientName,
        datetime: intentData.datetime,
        reason: intentData.reason
      };

    } catch (error) {
      console.error('❌ Error in identifyIntent node:', error);

      return {
        ...state,
        intent: 'unknown',
        error: error instanceof Error ? error.message : 'INTENT_IDENTIFICATION_FAILED'
      };
    }
  };
}