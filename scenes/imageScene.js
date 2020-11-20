const WizardScene = require('telegraf/scenes/wizard');
const Composer = require('telegraf/composer');

const fileManager = require('../fileManager');
const OCR = require('../ocr');

const step1 = (ctx) => {
    ctx.reply('Send me the image');
    return ctx.wizard.next();
}

const step2 = new Composer();

step2.on('photo', async (ctx) => {
    ctx.reply('I have received the image please wait while i extract the text');
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

    let photos = ctx.update.message.photo;
    const { file_id: fileId } = photos[photos.length - 1];
    const fileUrl = await ctx.telegram.getFileLink(fileId);

    let buffer = await fileManager.getBuffer(fileUrl);

    let text = await OCR.extractText(buffer);

    ctx.replyWithHTML(isEmpty(text));

    ctx.reply('Lets try this again, please send me another image');
    const currentStepIndex = ctx.wizard.cursor;
    return ctx.wizard.selectStep(currentStepIndex);
});

step2.command('cancel', (ctx) => {
    ctx.reply('Bye bye');
    return ctx.scene.leave();
});

const imageScene = new WizardScene('imageScene',
    (ctx) => step1(ctx),
    step2,
)

const isEmpty = text => {
    if (text != 'Empty') {
        return `The extracted text is: \n <b>${text}</b>`;
    } else
        return 'Sorry we couldn\'t extract any text from the image';
}

module.exports = { imageScene }