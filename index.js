const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
require('dotenv').config();

const imageScene = require('./scenes/imageScene').imageScene;

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Stage([imageScene]);
bot.use(session());
bot.use(stage.middleware());

bot.start(ctx => {
    let userFirstName = ctx.message.from.first_name;
    let message = ` Hello ${userFirstName},\n
    Where would you like to extract text from ?`;

    let options = Markup.inlineKeyboard([
        Markup.callbackButton('Extract from 🖼️', 'extractFromImage'),
    ]).extra();
    ctx.reply(message, options);
});

bot.action('extractFromImage', Stage.enter('imageScene'));

const PRODUCTION = true;
if (PRODUCTION) {
    bot.telegram.setWebhook(`https://amharic-ocr-bot.herokuapp.com/${process.env.BOT_TOKEN}`).then(console.log);
    bot.startWebhook(`/${process.env.BOT_TOKEN}`, null, process.env.PORT);
} else {
    bot.launch(console.log('Bot launched'));
}