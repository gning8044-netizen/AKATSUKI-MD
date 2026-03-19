const os = require('os');
const settings = require('../settings.js');

/**
 * 🤖 DEV SHADOW TECH - PING COMMAND
 * ⚡ Vérification de l'état du bot
 * 🕷️ Version 3.0.0
 */

function formatTime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d}j ${h}h ${m}m ${s}s`;
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();

        const uptime = formatTime(process.uptime());
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
        const usedMem = (totalMem - freeMem).toFixed(0);

        const end = Date.now();
        const speed = end - start;

        // Créer une barre de progression pour la RAM
        const memPercent = ((usedMem / totalMem) * 100).toFixed(1);
        const barLength = 10;
        const filledBars = Math.round((memPercent / 100) * barLength);
        const emptyBars = barLength - filledBars;
        const memBar = '█'.repeat(filledBars) + '░'.repeat(emptyBars);

        const response = `
╔══════════════════════════════════╗
║     ⚡ *DEV SHADOW TECH* ⚡       ║
║        📊 *SYSTEM STATUS*        ║
╠══════════════════════════════════╣
║                                   
║  🕷️ *Vitesse*    : ${speed} ms
║  ⏱️ *Uptime*     : ${uptime}
║                                   
║  💾 *RAM*        : ${usedMem}MB / ${totalMem}MB
║  📊 *Utilisation*: [${memBar}] ${memPercent}%
║                                   
║  💻 *Plateforme* : ${os.platform()}
║  🖥️ *Architecture*: ${os.arch()}
║  👑 *Propriétaire*: ${settings.botOwner || 'Dev SHADOW'}
║  📌 *Version*    : v${settings.version || '3.0.0'}
║                                   
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
║  🤖 *Bot WhatsApp 150+ commandes* ║
╚══════════════════════════════════╝
`.trim();

        await sock.sendMessage(chatId, {
            text: response
        }, { quoted: message });

    } catch (err) {
        console.error('❌ Erreur dans pingCommand:', err);
        
        const errorResponse = `
╔══════════════════════════════════╗
║        ❌ *ERREUR SYSTÈME* ❌      ║
╠══════════════════════════════════╣
║                                   
║  Une erreur est survenue lors     ║
║  de la vérification du statut.    ║
║                                   
║  Veuillez réessayer plus tard.    ║
║                                   
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝
`.trim();

        await sock.sendMessage(chatId, {
            text: errorResponse
        }, { quoted: message });
    }
}

module.exports = pingCommand;