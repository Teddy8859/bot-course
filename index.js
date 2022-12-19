const TelegramApi = require('node-telegram-bot-api')

const token = '5175440458:AAHE5khHsyqMnQsHW13PFCvS_QNznOnlkok'

const {gameOptions, againOptions} = require('./options.js');

const bot = new TelegramApi(token, {polling:true})

const chats = {}


const startGame = async (chatID) => {
    bot.sendMessage(chatID, `Сейчас я загадю цифру от 0 до 9,а ты должен ее угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatID] = randomNumber;
    await bot.sendMessage(chatID, `Отгадывай`,gameOptions)
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Поиграть в игру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatID = msg.chat.id;
        const userName = msg.from.username;
    
        if (text === '/start')
        {
            await bot.sendSticker(chatID,'https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/1.webp');
            return bot.sendMessage(chatID, `Доброе пожаловать в чат-бота RTE-Conuslt. Вас зовут ${userName}`)
        }
        if (text === '/info')
        {
            return bot.sendMessage(chatID, `Тебя зовут ${userName}`)
        }
        if (text === '/game')
        {
            return startGame(chatID);
        }
        return bot.sendMessage(chatID,'Я тебя не понимаю, попробуй еще раз');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId);
        }
        if(data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Ты не отгадал цифру, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
        
    })
    
}

start()