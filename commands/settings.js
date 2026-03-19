const fs = require('fs');

/**
 * 🤖 DEV SHADOW TECH - SETTINGS COMMAND
 * ⚙️ Affiche tous les paramètres du bot
 * 🕷️ Version 3.0.0
 */

function readJsonSafe(path, fallback) {
    try {
        const txt = fs.readFileSync(path, 'utf8');
        return JSON.parse(txt);
    } catch (_) {
        return fallback;
    }
}

const isOwnerOrSudo = require('../lib/isOwner');

async function settingsCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        // Vérification si l'utilisateur est le propriétaire
        if (!message.key.fromMe && !isOwner) {
            const ownerOnlyMsg = `
╔══════════════════════════════════╗
║        ⛔ *ACCÈS REFUSÉ* ⛔        ║
╠══════════════════════════════════╣
║                                   ║
║  👑 Seul le propriétaire du bot   ║
║  peut utiliser cette commande.    ║
║                                   ║
║  🔹 Contactez : @${senderId.split('@')[0]} ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
            
            await sock.sendMessage(chatId, { 
                text: ownerOnlyMsg,
                mentions: [senderId]
            }, { quoted: message });
            return;
        }

        const isGroup = chatId.endsWith('@g.us');
        const dataDir = './data';

        // Lecture de tous les fichiers de configuration
        const mode = readJsonSafe(`${dataDir}/messageCount.json`, { isPublic: true });
        const autoStatus = readJsonSafe(`${dataDir}/autoStatus.json`, { enabled: false });
        const autoread = readJsonSafe(`${dataDir}/autoread.json`, { enabled: false });
        const autotyping = readJsonSafe(`${dataDir}/autotyping.json`, { enabled: false });
        const pmblocker = readJsonSafe(`${dataDir}/pmblocker.json`, { enabled: false });
        const anticall = readJsonSafe(`${dataDir}/anticall.json`, { enabled: false });
        const userGroupData = readJsonSafe(`${dataDir}/userGroupData.json`, {
            antilink: {}, antibadword: {}, welcome: {}, goodbye: {}, chatbot: {}, antitag: {}
        });
        const autoReaction = Boolean(userGroupData.autoReaction);

        // Paramètres spécifiques au groupe
        const groupId = isGroup ? chatId : null;
        const antilinkOn = groupId ? Boolean(userGroupData.antilink && userGroupData.antilink[groupId]) : false;
        const antibadwordOn = groupId ? Boolean(userGroupData.antibadword && userGroupData.antibadword[groupId]) : false;
        const welcomeOn = groupId ? Boolean(userGroupData.welcome && userGroupData.welcome[groupId]) : false;
        const goodbyeOn = groupId ? Boolean(userGroupData.goodbye && userGroupData.goodbye[groupId]) : false;
        const chatbotOn = groupId ? Boolean(userGroupData.chatbot && userGroupData.chatbot[groupId]) : false;
        const antitagCfg = groupId ? (userGroupData.antitag && userGroupData.antitag[groupId]) : null;

        // Construction du message avec bordures
        let settingsMsg = `
╔══════════════════════════════════╗
║     ⚙️ *DEV SHADOW TECH* ⚙️       ║
║        📋 *PARAMÈTRES*            ║
╠══════════════════════════════════╣
║                                   ║
║  ⚡ *CONFIGURATION GÉNÉRALE*       ║
║                                   ║
║  🟢 Mode        : ${mode.isPublic ? 'PUBLIC 🌍' : 'PRIVÉ 🔒'}
║  📝 Auto Status : ${autoStatus.enabled ? 'ACTIF ✅' : 'INACTIF ❌'}
║  👁️ Autoread    : ${autoread.enabled ? 'ACTIF ✅' : 'INACTIF ❌'}
║  ⌨️ Autotyping  : ${autotyping.enabled ? 'ACTIF ✅' : 'INACTIF ❌'}
║  🚫 PM Blocker  : ${pmblocker.enabled ? 'ACTIF ✅' : 'INACTIF ❌'}
║  📞 Anticall    : ${anticall.enabled ? 'ACTIF ✅' : 'INACTIF ❌'}
║  🔄 Auto Réaction: ${autoReaction ? 'ACTIF ✅' : 'INACTIF ❌'}
║                                   ║`;

        if (groupId) {
            const alAction = antilinkOn ? userGroupData.antilink[groupId]?.action || 'delete' : '';
            const abAction = antibadwordOn ? userGroupData.antibadword[groupId]?.action || 'delete' : '';
            
            settingsMsg += `
╠══════════════════════════════════╣
║  👥 *CONFIGURATION GROUPE*       ║
║                                   ║
║  📌 *Groupe ID:*                  ║
║  ${groupId.substring(0, 30)}...   ║
║                                   ║
║  🔗 Antilink    : ${antilinkOn ? 'ACTIF ✅' : 'INACTIF ❌'} ${antilinkOn ? `[⚔️ ${alAction}]` : ''}
║  🚫 Antibadword : ${antibadwordOn ? 'ACTIF ✅' : 'INACTIF ❌'} ${antibadwordOn ? `[⚔️ ${abAction}]` : ''}
║  👋 Welcome     : ${welcomeOn ? 'ACTIF ✅' : 'INACTIF ❌'}
║  👋 Goodbye     : ${goodbyeOn ? 'ACTIF ✅' : 'INACTIF ❌'}
║  🤖 Chatbot     : ${chatbotOn ? 'ACTIF ✅' : 'INACTIF ❌'}
║  🚫 Antitag     : ${(antitagCfg && antitagCfg.enabled) ? 'ACTIF ✅' : 'INACTIF ❌'} ${(antitagCfg && antitagCfg.enabled) ? `[⚔️ ${antitagCfg.action || 'delete'}]` : ''}
║                                   ║`;
        } else {
            settingsMsg += `
╠══════════════════════════════════╣
║  ℹ️ *NOTE*                        ║
║                                   ║
║  Les paramètres de groupe         ║
║  sont visibles uniquement         ║
║  depuis un groupe.                ║
║                                   ║
║  🔹 Utilisez cette commande        ║
║     dans un groupe pour voir       ║
║     les options spécifiques.       ║
║                                   ║`;
        }

        settingsMsg += `
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
║  🤖 *Bot WhatsApp 150+ commandes* ║
║  ⚙️ Version 3.0.0                 ║
╚══════════════════════════════════╝`;

        await sock.sendMessage(chatId, { text: settingsMsg }, { quoted: message });

    } catch (error) {
        console.error('❌ Erreur dans settings command:', error);
        
        const errorMsg = `
╔══════════════════════════════════╗
║        ❌ *ERREUR* ❌              ║
╠══════════════════════════════════╣
║                                   ║
║  Impossible de lire les           ║
║  paramètres du bot.               ║
║                                   ║
║  Veuillez réessayer plus tard.    ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
        
        await sock.sendMessage(chatId, { text: errorMsg }, { quoted: message });
    }
}

module.exports = settingsCommand;