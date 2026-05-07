import { HumanMessage } from 'langchain';
import { buildGraph } from './graph/factory.ts';
import { SellerRepository } from './modules/seller/seller.repository.ts';
import Fastify from 'fastify';

const graph = buildGraph();

export const createServer = () => {
    const app = Fastify();

    app.post('/chat', {
        schema: {
            body: {
                type: 'object',
                required: ['question'],
                properties: {
                    question: { type: 'string', minLength: 10 },
                    sellerId: { type: 'number', minimum: 1 },
                },
            }
        }
    }, async function (request, reply) {
        
        try {
            const { question, sellerId } = request.body as {
                question: string,
                sellerId: number;
            };
const sellerRepository = new SellerRepository();

const sellerExists = await sellerRepository.existsById(sellerId);

if (!sellerExists) {
  return reply.status(400).send({
    error: 'SELLER_NOT_FOUND'
  });
}
            const response = await graph.invoke({
                messages: [new HumanMessage(question)],
                sellerId: sellerExists ? sellerId : undefined,
            });

            return response

        } catch (error) {
            console.error('❌ Error processing request:', error);
            return reply.status(500).send({
                error: 'An error occurred while processing your request.',
            });
        }
    });

    return app;
};
