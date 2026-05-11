# PIA — Personal Intelligent Assistant

Assistente virtual inteligente para agendamento de reuniões comerciais utilizando IA generativa, LangGraph, workflows orientados a estado e PostgreSQL.

O projeto nasceu como evolução prática do projeto apresentado por Erick Wendel no módulo 2 da formação da UNIPDS, onde o exemplo original consistia em um agendador de consultas médicas com menos nodes e sem persistência real em banco de dados.

A partir desse conceito inicial, o projeto evoluiu para uma arquitetura muito mais próxima de um cenário corporativo real:

- separação clara entre IA e domínio;
- persistência real em PostgreSQL;
- workflows escaláveis;
- validações operacionais;
- controle de agenda;
- detecção de conflitos;
- arquitetura preparada para evolução multi-agent;
- base para agentes corporativos orientados a dados.

---

# 🎯 Objetivos do Projeto

Este projeto demonstra na prática:

- LangGraph Workflows
- Structured Outputs com Zod
- Engenharia de Prompt aplicada
- Arquitetura orientada a domínio
- IA desacoplada das regras de negócio
- Controle operacional de agentes
- Persistência relacional
- Repository Pattern
- Orquestração de fluxos inteligentes
- Testes E2E reais sem mocks da LLM

---

# 🚀 Funcionalidades

- 📅 Agendamento inteligente de reuniões
- ❌ Cancelamento de reuniões
- 🔄 Estrutura preparada para atualização de reuniões
- 🧠 Extração de intenção via IA
- 👤 Busca inteligente de clientes
- 🔎 Tratamento de múltiplos clientes
- ⏰ Verificação de conflitos de agenda
- 💬 Respostas contextualizadas
- 🧪 Testes E2E integrados
- 🐳 PostgreSQL via Docker
- 🧱 Estrutura escalável para novos agentes

---

# 🏗️ Arquitetura

O projeto foi desenvolvido utilizando o princípio:

## “A IA interpreta. O domínio governa.”

A LLM NÃO toma decisões críticas.

A LLM:
- interpreta;
- extrai contexto;
- entende intenção;
- auxilia comunicação.

O backend:
- valida;
- governa;
- persiste;
- controla fluxo;
- aplica regras.

---

# 🔄 Workflow do LangGraph

```txt
START
   ↓
identifyIntent
   ↓
┌──────────────────────┬──────────────────────┬──────────────────────┐
↓                      ↓                      ↓
schedule               cancel                 message
↓                      ↓
message                message
↓
END
---

# 📁 Estrutura do Projeto

```txt
src/
├── config.ts
├── index.ts
├── server.ts
│
├── infra/
│   └── db.ts
│   └── scripts/
│       ├── schema.sql
│
├── domain/
│   └── messages/
│       ├── cancelMessages.ts
│       ├── commonMessages.ts
│       ├── scheduleMessages.ts
│       ├── updatelMessages.ts
│
│
├── modules/
│   └── appointment/
│       ├── appointment.repository.ts
│       ├── appointment.service.ts
│
│   └── client/
│       ├── client.repository.ts
│
│   └── seller/
│       ├── seller.repository.ts
│
├── repositories/
│   ├── appointment.repository.ts
│   ├── client.repository.ts
│   └── seller.repository.ts
│
├── services/
│   ├── openRouterService.ts
│   └── appointmentService.ts
│
│
├── types/
│   ├── serviceResults.ts
│
│
├── utils/
│   ├── date.ts
│   ├── normalize.ts
│
├── graph/
│   ├── graph.ts
│   ├── factory.ts
│   └── nodes/
│       ├── cancellerNode.ts
│       ├── checkAvailabityNode.ts
│       ├── identifyIntentNode.ts
│       └── messageGeneratorNode.ts
│       ├── schedulerNode.ts
│       ├── updaterNode.ts
│       ├── ValidateClientNode.ts
│
├── prompts/
│   └── v1/
│       ├── identifyIntent.ts
│       └── messageGenerator.ts
│
tests/
└── router.e2e.test.ts
```

---

# ⚙️ Tecnologias Utilizadas

## Backend

* Node.js
* TypeScript
* Fastify

## IA

* LangChain
* LangGraph
* OpenRouter

## Banco

* PostgreSQL
* pg

## Validação

* Zod

---

# 🐳 Docker

## docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    container_name: postgres
    restart: always
    image: postgres
    ports:
      - 5432:5432
    environment:
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: pia
      POSTGRES_USER: postgres
    volumes:
      - "./dbdata:/var/lib/postgresql"
```

---

# 🧠 Como o Sistema Funciona

## 1. Requisição

O vendedor envia uma mensagem:

```txt
Gostaria de agendar uma reunião de apresentação de produto com João Silva amanhã às 14h
```

---

## 2. Validação do vendedor

Antes da IA executar:

* verifica se o vendedor existe;
* evita custo desnecessário;
* impede execução inválida.

---

## 3. IdentifyIntentNode

A LLM extrai:

* intenção;
* cliente;
* data;
* horário;
* motivo.

Exemplo:

```json
{
  "intent": "schedule",
  "clientName": "João Silva",
  "datetime": "2026-05-07T14:00:00.000Z",
  "reason": "apresentação de produto"
}
```

---

## 4. SchedulerNode

Executa regras reais do domínio:

* cliente existe?
* existem múltiplos clientes?
* vendedor possui conflito?
* cliente já possui agenda?
* horário disponível?

---

## 5. Persistência

Após validações:

* grava reunião no PostgreSQL;
* retorna confirmação estruturada.

---

## 6. MessageGeneratorNode

Gera resposta amigável ao usuário.

Exemplo:

```txt
Reunião com João Silva agendada com sucesso para 07/05/2026 às 14h.
```

---

# 🧱 Conceitos Arquiteturais

## IA não controla regra de negócio

A IA:

* interpreta;
* extrai contexto;
* auxilia comunicação.

O backend:

* valida;
* persiste;
* decide;
* governa o fluxo.

Isso reduz:

* hallucinations;
* inconsistências;
* comportamento imprevisível.

---

## LangGraph como orquestrador

O LangGraph foi utilizado para:

* state management;
* conditional edges;
* workflows inteligentes;
* evolução futura para multi-agent.

---

## Repositories

O projeto utiliza Repository Pattern:

```txt
Services → Repositories → PostgreSQL
```

Benefícios:

* desacoplamento;
* testabilidade;
* manutenção;
* escalabilidade.

---

## Structured Outputs

Todas as respostas da LLM são validadas com Zod:

```typescript
export const IntentSchema = z.object({
  intent: z.enum(['schedule', 'cancel', 'unknown', 'update']),
  datetime: z.string().optional(),
  clientName: z.string().optional(),
  reason: z.string().optional(),
});
```

Isso reduz drasticamente respostas inválidas.

---

# 🗄️ Banco de Dados

## sellers

```sql
CREATE TABLE sellers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```

---

## clients

```sql
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```

---

## appointments

```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  datetime TIMESTAMP NOT NULL,
  reason TEXT,
  client_id INTEGER REFERENCES clients(id),
  seller_id INTEGER REFERENCES sellers(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

# 📦 Instalação

## Instalar dependências

```bash
npm install
```

---

# 🔐 Configuração

## Criar arquivo `.env`

```env
OPENROUTER_API_KEY=YOUR_API_KEY

DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/pia
```

---

# ▶️ Execução

## Subir PostgreSQL

```bash
docker-compose up -d
```

---

## Rodar aplicação

```bash
npm run dev
```

---

# 🧪 Testes

## Executar E2E

```bash
npm run test:e2e
```

---

# 🔄 Fluxo Completo

```txt
Fastify
   ↓
Validação vendedor
   ↓
LangGraph
   ↓
IdentifyIntentNode
   ↓
SchedulerNode
   ↓
AppointmentService
   ↓
Repositories
   ↓
PostgreSQL
   ↓
MessageGeneratorNode
   ↓
Resposta final
```

---

# 📚 Conceitos Demonstrados

Este projeto demonstra na prática:

* Engenharia de Prompt
* LangGraph State Machines
* Structured Outputs
* Clean Architecture
* Repository Pattern
* Domain-driven workflow
* IA aplicada a processos corporativos
* Controle operacional de agentes

---

# 🎯 Roadmap

## Próximos passos

* atualização de reuniões;
* memória conversacional;
* integração WhatsApp;
* Google Calendar;
* Outlook Calendar;
* multi-agent workflows;
* RAG;
* voice assistant.

---

# ⚠️ Aprendizados Importantes

Durante o desenvolvimento, alguns pontos ficaram muito claros:

## ❌ Anti-pattern

Delegar regras críticas para a LLM.

## ✅ Melhor abordagem

LLM:

* interpretação;
* contexto;
* linguagem natural.

Backend:

* governança;
* consistência;
* regras;
* persistência.

Esse é provavelmente o principal aprendizado arquitetural do projeto.

---
🔮 Evolução Futura

O projeto foi desenhado para evoluir para um cenário muito mais avançado.

Próximas evoluções
memória conversacional;
integração WhatsApp;
integração Google Calendar;
integração Outlook;
RAG;
multi-agent workflows;
voice assistant;
dashboards inteligentes;
geração dinâmica de queries SQL;
self-healing SQL agents.
🧠 Próximo Nível Arquitetural

Hoje:

a LLM entende intenção;
o backend executa funções pré-definidas.

Próxima evolução:

a LLM quebrará perguntas complexas;
gerará queries SQL dinamicamente;
validará queries;
corrigirá queries inválidas;
executará consultas;
construirá dashboards analíticos em tempo real.
👨‍💻 Autor

Vicente Pereira Pinto

Analista de Sistemas e Desenvolvedor Fullstack
Aprendiz de Engenharia de IA Aplicada

🙏 Créditos

Projeto inspirado na excelente aula de Erick Wendel no módulo 2 da formação da UNIPDS.
---

# 📄 Licença

MIT

```
```
