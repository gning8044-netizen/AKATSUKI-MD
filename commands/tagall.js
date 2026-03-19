const isAdmin = require('../lib/isAdmin');

/**
 * 🤖 DEV SHADOW TECH - TAGALL COMMAND
 * 📢 Mentionne tous les membres du groupe
 * 🕷️ Version 3.0.0
 */

async function tagAllCommand(sock, chatId, senderId, message) {
    try {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
        
        // Vérification si le bot est admin
        if (!isBotAdmin) {
            const botAdminMsg = `
╔══════════════════════════════════╗
║        ⚠️ *ATTENTION* ⚠️          ║
╠══════════════════════════════════╣
║                                   ║
║  🤖 Le bot doit être admin        ║
║  pour utiliser .tagall.           ║
║                                   ║
║  🔹 Faites .promote @bot           ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
            
            await sock.sendMessage(chatId, { text: botAdminMsg }, { quoted: message });
            return;
        }

        // Vérification si l'utilisateur est admin
        if (!isSenderAdmin) {
            const adminOnlyMsg = `
╔══════════════════════════════════╗
║        ⛔ *ACCÈS REFUSÉ* ⛔        ║
╠══════════════════════════════════╣
║                                   ║
║  👑 Seuls les administrateurs     ║
║  du groupe peuvent utiliser       ║
║  la commande .tagall.             ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
            
            await sock.sendMessage(chatId, { text: adminOnlyMsg }, { quoted: message });
            return;
        }

        // Récupérer les informations du groupe
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;
        const groupName = groupMetadata.subject || 'Groupe';
        const memberCount = participants.length;

        if (!participants || participants.length === 0) {
            const noMembersMsg = `
╔══════════════════════════════════╗
║        ❌ *ERREUR* ❌              ║
╠══════════════════════════════════╣
║                                   ║
║  Aucun membre trouvé dans         ║
║  ce groupe.                       ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
            
            await sock.sendMessage(chatId, { text: noMembersMsg });
            return;
        }

        // Créer un message magnifique avec tous les membres
        let headerMessage = `
╔══════════════════════════════════╗
║     📢 *DEV SHADOW TECH* 📢       ║
║        👥 *MENTION DE TOUS*       ║
╠══════════════════════════════════╣
║                                   ║
║  📌 *Groupe:* ${groupName.substring(0, 20)}${groupName.length > 20 ? '...' : ''}
║  👤 *Total membres:* ${memberCount}
║  👑 *Admin:* @${senderId.split('@')[0]}
║                                   ║
╠══════════════════════════════════╣
║  📋 *LISTE DES MEMBRES:*          ║
║                                   ║
`;

        let membersList = '';
        participants.forEach((participant, index) => {
            const isAdmin = participant.admin ? '👑' : '👤';
            membersList += `  ${isAdmin} @${participant.id.split('@')[0]}\n`;
        });

        let footerMessage = `
║                                   ║
╠══════════════════════════════════╣
║  ⚡ Message envoyé par            ║
║  🕷️ *DEV SHADOW TECH*             ║
╚══════════════════════════════════╝`;

        const fullMessage = headerMessage + membersList + footerMessage;

        // Envoyer le message avec toutes les mentions
        await sock.sendMessage(chatId, {
            text: fullMessage,
            mentions: participants.map(p => p.id)
        });

    } catch (error) {
        console.error('❌ Erreur dans tagall command:', error);
        
        const errorMsg = `
╔══════════════════════════════════╗
║        ❌ *ERREUR* ❌              ║
╠══════════════════════════════════╣
║                                   ║
║  Impossible de mentionner         ║
║  tous les membres.                ║
║                                   ║
║  Veuillez réessayer plus tard.    ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
        
        await sock.sendMessage(chatId, { text: errorMsg });
    }
}

module.exports = tagAllCommand;