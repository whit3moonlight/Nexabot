//debes tener instalado npm
//npm install whatsapp-web.js qrcode-terminal
//npm install openai
//npm install axios
//node Nexa.js
// Importa los modulos necesarios
//--------------------------------------------------------------------------------------//
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');

// Crea una instancia del cliente de WhatsApp de autenticación local
const client = new Client({
    authStrategy: new LocalAuth()
});

// Clave de la API de OpenAI para GPT-3
const openaiApiKey = 'tu_Api-key de Openai chatGPT';

// Evento que envia al recibir el codigo QR para la autenticacio
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Evento que envia cuando el cliente esta listo
client.on('ready', () => {
    console.log('Autenticado');
});

// Evento que envia al recibir un mensaje
client.on('message', async (message) => {
    // Prefijo para comandos
    const commandPrefix = '/';
    const commandText = message.body.substring(commandPrefix.length).trim();
//--------------------------------------------------------------------------------------//
    // Maneja diferentes comandos segun el mensaje recibido
    switch (true) {
        //aca uso startsWith para definir el comienzo de un comando para el uso de chatGPT
        //por ejemplo seria, /gpt ¿cuanto es 2 + 2?..
        case message.body.startsWith('/gpt'):
            await handleGPTCommand(message, commandText);
            break;
        //aqui no necesito usar startsWith, por que solo es un mensaje ya definido 
        //y necesito que el comando sea exactamente el mismo 
        //y se lo envio directamente a la funcion correspondiente
        case message.body === '/comando1':
            await handleComando1Command(message);
            break;

        case message.body === '/comando2':
            await handleComando2Command(message);
            break;

        case message.body === '/comando3':
            await handleComando3Command(message);
            break;
        //podes añadir los comandos que tu desees de la misma manera como los anteriores

        case message.body === '/textoimagen':
            await handleTextoImagenCommand(message);
            break;
        default:
            break;
    }
});
//--------------------------------------------------------------------------------------//
// Funcion para manejar el comando /gpt y enviar la solicitud a la API de OpenAI
async function handleGPTCommand(message, commandText) {
    const openaiData = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: commandText },
        ],
    };
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', openaiData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${openaiApiKey}`,
            },
        });
        const responseData = response.data;
        console.log(JSON.stringify(responseData));
        await message.reply(responseData.choices[0].message.content);
    } catch (error) {
        console.error(error);
    }
}
//--------------------------------------------------------------------------------------//
// Funciones para manejar los comandos /comando1, /comando2, y /comando3
async function handleComando1Command(message) {
    const comando1 = "hola, soy el comando 1";
    await message.reply(comando1);
}

async function handleComando2Command(message) {
    const comando2 = "hola, soy el comando 2";
    await message.reply(comando2);
}

async function handleComando3Command(message) {
    const comando3 = "hola, soy el comando 3";
    await message.reply(comando3);
}
//--------------------------------------------------------------------------------------//
// Funcion para manejar el comando /textoimagen y enviar un mensaje con una imagen
async function handleTextoImagenCommand(message) {
    const textoMensaje = "hola, soy el texto con imagen";
    const imagePath = 'ruta/imagen.jpg';
    const media = MessageMedia.fromFilePath(imagePath);
    await client.sendMessage(message.from, textoMensaje, { media });
}

// Inicializa el cliente de WhatsApp
client.initialize();
