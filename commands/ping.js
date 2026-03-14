
const os = require('os');
const settings = require('../settings.js');

function formatTime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d}d ${h}h ${m}m ${s}s`;
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();

        const uptime = formatTime(process.uptime());
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);

        const end = Date.now();
        const speed = end - start;

        const response = `
╭━━━〔 ⚡ AKATSUKI MD STATUS 〕━━━╮
┃ 🏓 Speed     : ${speed} ms
┃ ⏳ Uptime    : ${uptime}
┃ 🧠 RAM       : ${freeMem}MB / ${totalMem}MB
┃ 💻 Platform  : ${os.platform()}
┃ 🔖 Version   : v${settings.version}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

        await sock.sendMessage(chatId, {
            text: response
        }, { quoted: message });

    } catch (err) {
        console.error(err);
        await sock.sendMessage(chatId, {
            text: '❌ Error while checking bot status.'
        }, { quoted: message });
    }
}

module.exports = pingCommand;
