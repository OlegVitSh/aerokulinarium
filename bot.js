const { Telegraf } = require('telegraf');

const bot = new Telegraf('7036781213:AAH_5TNSJJXTYiEH9DtLXt5bT4_KHPjclOA');

// Команда /start
bot.command('start', (ctx) => {
    ctx.reply('Добро пожаловать в 🍳 АэроКулинариум!', {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: "📱 Открыть приложение",
                    web_app: { url: "https://github.com/OlegVitSh/aerokulinarium" }
                }
            ]]
        }
    });
});

// Обработка данных из Web App
bot.on('message', (ctx) => {
    if (ctx.message?.web_app_data?.data) {
        const data = JSON.parse(ctx.message.web_app_data.data);
        
        if (data.action === 'open_recipe') {
            ctx.replyWithVideo(data.video_url, {
                caption: `🎬 ${data.recipe_title}\n\nПриятного аппетита! 🍽️`,
                reply_markup: {
                    inline_keyboard: [[
                        { text: "📖 Все рецепты", web_app: { url: "https://github.com/OlegVitSh/aerokulinarium" } }
                    ]]
                }
            });
        }
    }
});

bot.launch();
