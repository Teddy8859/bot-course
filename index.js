const TelegramApi = require('node-telegram-bot-api')

const token = '5175440458:AAHE5khHsyqMnQsHW13PFCvS_QNznOnlkok'

const {gameOptions, againOptions} = require('./options.js');
const sequelize = require('./db.js');
const UserModel = require('./model.js');
const bot = new TelegramApi(token, {polling:true})

const chats = {}


const startGame = async (chatID) => {
    bot.sendMessage(chatID, `Сейчас я загадю цифру от 0 до 9,а ты должен ее угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatID] = randomNumber;
    await bot.sendMessage(chatID, `Отгадывай`,gameOptions)
}

const start = async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
    } catch(e) {
        console.log('Подключение к БД сломалось',e)
    }
    bot.setMyCommands( [
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Поиграть в игру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatID = msg.chat.id;
        const userName = msg.from.username;

        try {

            if (text === '/start')
        {
            await UserModel.create({chatID})
            await bot.sendSticker(chatID,'https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/1.webp');
            return bot.sendMessage(chatID, `Доброе пожаловать в чат-бота RTE-Conuslt. Вас зовут ${userName}`)
        }
        if (text === '/info')
        {
            const user = await UserModel.findOne({chatID})
            return bot.sendMessage(chatID, `Тебя зовут ${userName}. В игре у тебя правильных ответов ${user.right}, <b>неправильных<b> ${user.wrong}`)
        }
        if (text === '/game')
        {
            return startGame(chatID);
        }
        return bot.sendMessage(chatID,'Я тебя не понимаю, попробуй еще раз');

        } catch(e)
        {
            return bot.sendMessage(chatId, 'Произошла какая-то непредвиденная ошибка. Запись не удалась');
        }
    
        
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId);
        }
        const user = await UserModel.findOne({chatId});
        if(data == chats[chatId]) {
            user.right += 1;
             await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);

        } else {
            user.wrong += 1;
             await bot.sendMessage(chatId, `Ты не отгадал цифру, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
        await user.save();
    })
    
}

start()