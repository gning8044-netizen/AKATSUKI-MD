const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
🌹 *BIENVENU DANS ${settings.botName || '∘̥⃟☠️𝑬𝑴𝑷𝑰𝑹𝑬 𝑨𝑲𝑨𝑻𝑺𝑼𝑲𝑰☠️∘̥⃟'}* 🌹
🛠 Version: *${settings.version || '3.0.0'}*
👑 Owner: *${settings.botOwner || 'Dev SHADOW'}*
📺 YouTube: ${global.ytch}

🦄𝑴𝑬𝑵𝑼 𝑬𝑴𝑷𝑰𝑹𝑬 𝑨𝑲𝑨𝑻𝑺𝑼𝑲𝑰🥷
╔═══════════════════════════╗
🦋 *GENERAL AKATSUKI* 🦋
🎯 .help | .menu
🎯 .ping | .alive
🎯 .tts <text> | .owner
🎯 .joke | .quote | .fact
🎯 .weather | .news
🎯 .attp | .lyrics
🎯 .8ball | .groupinfo
🎯 .staff | .vv
🎯 .trt | .ss | .jid | .url
╚═══════════════════════════╝
╔═══════════════════════════╗
🦄 *ADMIN AKATSUKI* 🦄
⚔️ .ban | .kick | .warn
⚔️ .promote | .demote
⚔️ .mute | .unmute
⚔️ .delete | .clear
⚔️ .tagall | .hidetag
⚔️ .antilink | .antibadword
⚔️ .welcome | .goodbye
⚔️ .setgname | .setgpp
╚═══════════════════════════╝
╔═══════════════════════════╗
🔒 *OWNER AKATSUKI* 🔒
👑 .mode <public/private>
👑 .clearsession | .cleartmp
👑 .update | .settings
👑 .autostatus | .autoread
👑 .anticall | .pmblocker
👑 .setpp | .setmention
╚═══════════════════════════╝
╔═══════════════════════════╗
🎨 *EDITING* 🎨
🖌️ .sticker | .simage
🖌️ .remini | .removebg
🖌️ .blur | .crop | .meme
🖌️ .take | .emojimix
🖌️ .igs | .igsc
╚═══════════════════════════╝
╔═══════════════════════════╗
🧠 *AI & GAMES* 🧠
🤖 .gpt | .gemini
🖼️ .imagine | .flux | .sora
🎮 .tictactoe | .hangman
🎮 .trivia | .truth | .dare
╚═══════════════════════════╝
╔═══════════════════════════╗
📥 *DOWNLOADER* 📥
⬇️ .play | .song | .video
⬇️ .spotify | .ytmp4
⬇️ .instagram | .facebook
⬇️ .tiktok
╚═══════════════════════════╝
╔═══════════════════════════╗
🔤 *TEXTMAKER* 🔤
✏️ .neon | .glitch | .fire
✏️ .ice | .snow | .matrix
✏️ .hacker | .devil | .sand
╚═══════════════════════════╝
╔═══════════════════════════╗
💻 *SYSTEM* 💻
💾 .git | .github
💾 .sc | .repo | .script
╚═══════════════════════════╝
🌹 *rejoindre notre clan akatsuki!* 🥷
🌹𝑩𝑶𝑻 𝑪𝑹É𝑬 𝑷𝑨𝑹 𝑺𝑯𝑨𝑫𝑶𝑾 𝑷𝑹𝑰𝑴𝑬 𝑻𝑬𝑪𝑯🌹
`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        const contextInfo = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363423792937578@newsletter',
                newsletterName: 'AKATSUKI MD',
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