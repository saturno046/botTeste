const { ActivityTypes, TurnContext, MemoryStorage, ConversationState, UserState } = require('botbuilder');
const { BotFrameworkAdapter } = require('botbuilder');

const restify = require('restify');

// Configuração do servidor
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`Servidor online em http://localhost:${process.env.port || process.env.PORT || 3978}`);
});

// Configuração do Bot Framework
const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD,
    // Atualize a URL do ponto de extremo aqui
    serviceUrl: 'https://5bec-2804-7f3-868f-ba54-e014-f9d8-e429-f450.ngrok.io'
});

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Middleware para processar mensagens
adapter.use(conversationState);
adapter.use(userState);

// Lógica do bot
const bot = new TurnContext(adapter, async (context) => {
    if (context.activity.type === ActivityTypes.Message) {
        // Lógica de processamento de mensagens aqui
        await context.sendActivity(`Você disse: ${context.activity.text}`);
    }
});

// Rota para lidar com mensagens
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
