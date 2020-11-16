const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
require('dotenv').config();

const imageScene = require('./scenes/imageScene').imageScene;

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Stage(imageScene);
bot.use(session());
bot.use(stage.middleware());

bot.start(ctx => {
    let userFirstName = ctx.message.from.first_name;
    let message = ` Hello master ${userFirstName},\n
    Where would you like to extract text from ?`;

    let options = Markup.inlineKeyboard([
        Markup.callbackButton('extractFromImage'),
    ]).extra();
    ctx.reply(message, options);
});

bot.action('extractFromImage', Stage.enter('imageScene'));

bot.launch(console.log('Bot launched'));