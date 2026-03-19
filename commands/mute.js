const isAdmin = require('../lib/isAdmin');

/**
 * 🤖 DEV SHADOW TECH - MUTE COMMAND
 * 🔇 Commande pour fermer/ouvrir le groupe
 * 🕷️ Version 3.0.0
 */

async function muteCommand(sock, chatId, senderId, message, durationInMinutes) {
    
    const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
    
    // Vérification si le bot est admin
    if (!isBotAdmin) {
        const botAdminMsg = `
╔══════════════════════════════════╗
║        ⚠️ *ATTENTION* ⚠️          ║
╠══════════════════════════════════╣
║                                   ║
║  🤖 Le bot doit être admin        ║
║  pour utiliser cette commande.    ║
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
║  cette commande.                  ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
        await sock.sendMessage(chatId, { text: adminOnlyMsg }, { quoted: message });
        return;
    }

    try {
        // Fermer le groupe (mute)
        await sock.groupSettingUpdate(chatId, 'announcement');
        
        if (durationInMinutes !== undefined && durationInMinutes > 0) {
            const durationInMilliseconds = durationInMinutes * 60 * 1000;
            
            const muteMsg = `
╔══════════════════════════════════╗
║        🔇 *GROUPE FERMÉ* 🔇       ║
╠══════════════════════════════════╣
║                                   ║
║  🕷️ *DEV SHADOW TECH* a fermé     ║
║  le groupe pour *${durationInMinutes} minutes*. ║
║                                   ║
║  Seuls les admins peuvent         ║
║  envoyer des messages.            ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  ⏱️ Réouverture automatique dans  ║
║     ${durationInMinutes} minutes     ║
╚══════════════════════════════════╝`;
            
            await sock.sendMessage(chatId, { text: muteMsg }, { quoted: message });
            
            // Programmer la réouverture automatique
            setTimeout(async () => {
                try {
                    await sock.groupSettingUpdate(chatId, 'not_announcement');
                    
                    const unmuteMsg = `
╔══════════════════════════════════╗
║        🔊 *GROUPE OUVERT* 🔊       ║
╠══════════════════════════════════╣
║                                   ║
║  🕷️ *DEV SHADOW TECH* a rouvert   ║
║  le groupe.                       ║
║                                   ║
║  Tous les membres peuvent         ║
║  à nouveau envoyer des messages.  ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
                    
                    await sock.sendMessage(chatId, { text: unmuteMsg });
                } catch (unmuteError) {
                    console.error('❌ Erreur lors de la réouverture:', unmuteError);
                }
            }, durationInMilliseconds);
            
        } else {
            // Fermeture permanente (jusqu'à réouverture manuelle)
            const mutePermanentMsg = `
╔══════════════════════════════════╗
║        🔇 *GROUPE FERMÉ* 🔇       ║
╠══════════════════════════════════╣
║                                   ║
║  🕷️ *DEV SHADOW TECH* a fermé     ║
║  le groupe.                       ║
║                                   ║
║  Seuls les admins peuvent         ║
║  envoyer des messages.            ║
║                                   ║
║  🔹 Pour rouvrir : .unmute        ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
            
            await sock.sendMessage(chatId, { text: mutePermanentMsg }, { quoted: message });
        }
    } catch (error) {
        console.error('❌ Erreur lors de la fermeture/ouverture:', error);
        
        const errorMsg = `
╔══════════════════════════════════╗
║        ❌ *ERREUR* ❌              ║
╠══════════════════════════════════╣
║                                   ║
║  Une erreur est survenue lors     ║
║  de l'exécution de la commande.   ║
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

module.exports = muteCommand;