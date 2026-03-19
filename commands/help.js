const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╔══════════════════════════════════╗
║     🕷️ *DEV SHADOW TECH* 🕷️      ║
╠══════════════════════════════════╣
║  🤖 *BIENVENU DANS ${settings.botName || 'BOT DEV SHADOW TECH'}*  
║  🛠 Version: *${settings.version || '3.0.0'}*
║  👑 Owner: *${settings.botOwner || 'Dev SHADOW'}*
║  📺 YouTube: ${global.ytch}
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║     🎯 *MENU DEV SHADOW TECH* 🎯  ║
╠══════════════════════════════════╣
║
║  🎯 .help
║  📋 .menu
║  📶 .ping
║  💚 .alive
║  🔊 .tts <text>
║  👑 .owner
║  😄 .joke 
║  💬 .quote
║  📚 .fact
║  🌤️ .weather
║  📰 .news
║  🎨 .attp
║  🎵 .lyrics
║  🎱 .8ball
║  ℹ️ .groupinfo
║  👥 .staff
║  📸 .vv
║  🌍 .trt
║  📱 .ss
║  🆔 .jid
║  🔗 .url
║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║     ⚔️ *GROUPES DEV SHADOW* ⚔️    ║
╠══════════════════════════════════╣
║
║  ⚔️ .ban
║  👢 .kick
║  ⚠️ .warn
║  ⭐ .promote
║  📉 .demote
║  🔇 .mute
║  🔊 .unmute
║  🗑️ .delete
║  🧹 .clear
║  📢 .tagall 
║  🤫 .hidetag
║  🔗 .antilink 
║  🚫 .antibadword
║  👋 .welcome 
║  👋 .goodbye
║  ✏️ .setgname
║  🖼️ .setgpp
║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║     👑 *OWNER DEV SHADOW* 👑      ║
╠══════════════════════════════════╣
║
║  👑 .mode <public/private>
║  🧹 .clearsession 
║  🗑️ .cleartmp
║  🔄 .update
║  ⚙️ .settings
║  📝 .autostatus 
║  👁️ .autoread
║  📞 .anticall 
║  🚫 .pmblocker
║  🖼️ .setpp 
║  📌 .setmention
║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║     🎨 *STICKERS DEV SHADOW* 🎨   ║
╠══════════════════════════════════╣
║
║  🎨 .sticker 
║  🖼️ .simage
║  ✨ .remini 
║  🔍 .removebg
║  🌫️ .blur 
║  ✂️ .crop
║  😂 .meme
║  📝 .take 
║  😊 .emojimix
║  📷 .igs
║  📸 .igsc
║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║     🤖 *IA DEV SHADOW* 🤖         ║
╠══════════════════════════════════╣
║
║  🧠 .gpt 
║  ✨ .gemini
║  🎨 .imagine
║  🔥 .flux
║  🎬 .sora
║  🎮 .tictactoe
║  😵 .hangman
║  ❓ .trivia 
║  🤫 .truth
║  😈 .dare
║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║     📥 *TÉLÉCHARGEMENTS* 📥       ║
╠══════════════════════════════════╣
║
║  ▶️ .play 
║  🎵 .song
║  🎬 .video
║  🎧 .spotify
║  📹 .ytmp4
║  📷 .instagram 
║  📘 .facebook
║  🎵 .tiktok
║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║     ✨ *EFFETS TEXTES* ✨          ║
╠══════════════════════════════════╣
║
║  💡 .neon
║  📺 .glitch
║  🔥 .fire
║  ❄️ .ice 
║  ☃️ .snow
║  💻 .matrix
║  👨‍💻 .hacker 
║  😈 .devil
║  🏖️ .sand
║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║     💻 *DEV COMMANDES* 💻         ║
╠══════════════════════════════════╣
║
║  🐙 .git 
║  🐱 .github
║  📜 .sc 
║  📦 .repo
║  📝 .script
║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
║  *BOT CRÉÉ PAR SHADOW PRIME*     ║
║     🕷️ 150+ COMMANDES 🕷️         ║
╚══════════════════════════════════╝
`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        const contextInfo = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363423792937578@newsletter',
                newsletterName: 'DEV SHADOW TECH',
                serverMessageId: -1
            }
        };

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;