import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.ts';

const app = createServer();

async function makeARequest(question: string, sellerId: number) {
    return await app.inject({
        method: 'POST',
        url: '/chat',
        payload: {
            question,
            sellerId
        },
    });
}

describe('Assistente de Vendas - E2E Tests', async () => {
    //o . skip é para pular o teste
    it.skip('Schedule appointment - Success', async () => {
        const response = await makeARequest(`Agende uma reunião dia 16 de maio às 10h com Carlos Oliveira para tratarmos da compra da moto`,1)
        console.log('Schedule Success Response:', response.body);
        assert.equal(response.statusCode, 200);
         const body = JSON.parse(response.body);
         assert.equal(body.intent, 'schedule');
         assert.equal(body.actionSuccess, true);
    });

    it('Update appointment - Success', async () => {
        const response = await makeARequest(`Preciso remarcar a reunião dia 16 de maio às 10h com Carlos Oliveira, para dia 16 de maio as 14h devido a solicitação do cliente`,1)
        console.log('Update Success Response:', response.body);
        assert.equal(response.statusCode, 200);
         const body = JSON.parse(response.body);
         assert.equal(body.intent, 'update');
         assert.equal(body.actionSuccess, true);
    });
    it('Cancel appointment - Success', async () => {
        const response = await makeARequest(`Preciso cancelar a reunião dia 16 de maio às 14h com Carlos Oliveira, o cliente não poderá comparecer`,1)
        console.log('Cancel Success Response:', response.body);
        assert.equal(response.statusCode, 200);
         const body = JSON.parse(response.body);
         assert.equal(body.intent, 'cancel');
         assert.equal(body.actionSuccess, true);
    });


   /* it('Cancel appointment - Success', async () => {

         await makeARequest(
            `Sou Joao da Silva e quero agendar uma consulta com ${professionals.at(1)?.name} para hoje às 14h`
        )

        const response = await makeARequest(
            `Cancele minha consulta com ${professionals.at(1)?.name} que tenho hoje às 14h, me chamo Joao da Silva`
        );

        console.log('Cancel Success Response:', response.body);

        assert.equal(response.statusCode, 200);
         const body = JSON.parse(response.body);
         assert.equal(body.intent, 'cancel');
         assert.equal(body.actionSuccess, true);
    });*/
});
