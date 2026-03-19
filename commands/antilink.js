const { bots } = require('../lib/antilink');
const { setAntilink, getAntilink, removeAntilink } = require('../lib/index');
const isAdmin = require('../lib/isAdmin');

/**
 * 🤖 DEV SHADOW TECH - ANTI-LINK SYSTEM
 * ⚔️ Protection contre les liens indésirables
 * 🕷️ Version 3.0.0
 */

async function handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message) {
    try {
        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { 
                text: '```⛔ ACCÈS RESTREINT```\n\n👑 *Seuls les administrateurs du groupe peuvent utiliser cette commande.*\n\n_Powered by DEV SHADOW TECH_' 
            }, { quoted: message });
            return;
        }

        const prefix = '.';
        const args = userMessage.slice(9).toLowerCase().trim().split(' ');
        const action = args[0];

        if (!action) {
            const usage = `
╔══════════════════════════════════╗
║    🕷️ *DEV SHADOW TECH* 🕷️       ║
║      ⚙️ *ANTI-LINK SETUP* ⚙️      ║
╠══════════════════════════════════╣
║                                   ║
║  📌 *Commandes disponibles :*     ║
║                                   ║
║  🔹 ${prefix}antilink on          ║
║      → Activer la protection      ║
║                                   ║
║  🔹 ${prefix}antilink off         ║
║      → Désactiver la protection   ║
║                                   ║
║  🔹 ${prefix}antilink set delete  ║
║      → Supprimer les messages     ║
║                                   ║
║  🔹 ${prefix}antilink set kick    ║
║      → Expulser l'utilisateur     ║
║                                   ║
║  🔹 ${prefix}antilink set warn    ║
║      → Avertir l'utilisateur      ║
║                                   ║
║  🔹 ${prefix}antilink get         ║
║      → Voir la configuration      ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
║  🤖 *Bot WhatsApp 150+ commandes* ║
╚══════════════════════════════════╝`;
            await sock.sendMessage(chatId, { text: usage }, { quoted: message });
            return;
        }

        switch (action) {
            case 'on':
                const existingConfig = await getAntilink(chatId, 'on');
                if (existingConfig?.enabled) {
                    await sock.sendMessage(chatId, { 
                        text: '```✅ ANTI-LINK DÉJÀ ACTIF```\n\nLa protection anti-liens est déjà activée dans ce groupe.' 
                    }, { quoted: message });
                    return;
                }
                const result = await setAntilink(chatId, 'on', 'delete');
                await sock.sendMessage(chatId, { 
                    text: result 
                        ? '╔════════════════════════════╗\n║  ✅ *ANTI-LINK ACTIVÉ*   ║\n╠════════════════════════════╣\n║  🕷️ *DEV SHADOW TECH*     ║\n║  ⚔️ Protection : SUPPRESSION ║\n╚════════════════════════════╝'
                        : '```❌ ERREUR```\n\nImpossible d'activer la protection anti-liens.' 
                }, { quoted: message });
                break;

            case 'off':
                await removeAntilink(chatId, 'on');
                await sock.sendMessage(chatId, { 
                    text: '╔════════════════════════════╗\n║  ❌ *ANTI-LINK DÉSACTIVÉ* ║\n╠════════════════════════════╣\n║  🕷️ *DEV SHADOW TECH*     ║\n║  🔓 Protection désactivée  ║\n╚════════════════════════════╝' 
                }, { quoted: message });
                break;

            case 'set':
                if (args.length < 2) {
                    await sock.sendMessage(chatId, { 
                        text: `╔════════════════════════════╗\n║  ⚠️ *ACTION REQUISE*      ║\n╠════════════════════════════╣\n║  📌 Utilisez :            ║\n║  ${prefix}antilink set delete ║\n║  ${prefix}antilink set kick    ║\n║  ${prefix}antilink set warn    ║\n╚════════════════════════════╝` 
                    }, { quoted: message });
                    return;
                }
                const setAction = args[1];
                if (!['delete', 'kick', 'warn'].includes(setAction)) {
                    await sock.sendMessage(chatId, { 
                        text: '```❌ ACTION INVALIDE```\n\nChoisissez parmi : delete, kick, ou warn.' 
                    }, { quoted: message });
                    return;
                }
                const setResult = await setAntilink(chatId, 'on', setAction);
                
                const actionEmoji = setAction === 'delete' ? '🗑️' : setAction === 'kick' ? '👢' : '⚠️';
                const actionText = setAction === 'delete' ? 'SUPPRESSION' : setAction === 'kick' ? 'EXPULSION' : 'AVERTISSEMENT';
                
                await sock.sendMessage(chatId, { 
                    text: setResult 
                        ? `╔════════════════════════════╗\n║  ✅ *ACTION CONFIGURÉE*   ║\n╠════════════════════════════╣\n║  ${actionEmoji} Action : ${actionText}  ║\n║  🕷️ *DEV SHADOW TECH*     ║\n╚════════════════════════════╝`
                        : '```❌ ERREUR```\n\nImpossible de configurer l\'action.' 
                }, { quoted: message });
                break;

            case 'get':
                const status = await getAntilink(chatId, 'on');
                const actionConfig = await getAntilink(chatId, 'on');
                const statusText = status ? 'ACTIF ✅' : 'INACTIF ❌';
                const actionDisplay = actionConfig ? actionConfig.action : 'Non configuré';
                
                await sock.sendMessage(chatId, { 
                    text: `╔════════════════════════════╗
║  📊 *CONFIGURATION ANTI-LINK* ║
╠════════════════════════════════╣
║                              ║
║  🟢 Statut : ${statusText}     ║
║  ⚙️ Action : ${actionDisplay}   ║
║                              ║
║  🕷️ *DEV SHADOW TECH*        ║
╚════════════════════════════════╝` 
                }, { quoted: message });
                break;

            default:
                await sock.sendMessage(chatId, { 
                    text: ````❌ COMMANDE INCONNUE```\n\nUtilise ${prefix}antilink pour voir les options disponibles.` 
                });
        }
    } catch (error) {
        console.error('❌ Erreur dans la commande antilink:', error);
        await sock.sendMessage(chatId, { 
            text: '```❌ ERREUR SYSTEME```\n\nUne erreur est survenue. Veuillez réessayer.\n\n_Powered by DEV SHADOW TECH_' 
        });
    }
}

async function handleLinkDetection(sock, chatId, message, userMessage, senderId) {
    const antilinkSetting = getAntilinkSetting(chatId);
    if (antilinkSetting === 'off') return;

    console.log(`🕷️ [DEV SHADOW TECH] Anti-link config pour ${chatId}: ${antilinkSetting}`);
    console.log(`📝 Vérification du message: ${userMessage}`);

    let shouldDelete = false;

    const linkPatterns = {
        whatsappGroup: /chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/i,
        whatsappChannel: /wa\.me\/channel\/[A-Za-z0-9]{20,}/i,
        telegram: /t\.me\/[A-Za-z0-9_]+/i,
        allLinks: /https?:\/\/\S+|www\.\S+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?/i,
    };

    // Détection des liens WhatsApp
    if (antilinkSetting === 'whatsappGroup') {
        if (linkPatterns.whatsappGroup.test(userMessage)) {
            console.log('🔴 Lien WhatsApp détecté !');
            shouldDelete = true;
        }
    } else if (antilinkSetting === 'whatsappChannel' && linkPatterns.whatsappChannel.test(userMessage)) {
        shouldDelete = true;
    } else if (antilinkSetting === 'telegram' && linkPatterns.telegram.test(userMessage)) {
        shouldDelete = true;
    } else if (antilinkSetting === 'allLinks' && linkPatterns.allLinks.test(userMessage)) {
        shouldDelete = true;
    }

    if (shouldDelete) {
        const quotedMessageId = message.key.id;
        const quotedParticipant = message.key.participant || senderId;

        console.log(`🗑️ Suppression du message ${quotedMessageId}`);

        try {
            await sock.sendMessage(chatId, {
                delete: { remoteJid: chatId, fromMe: false, id: quotedMessageId, participant: quotedParticipant },
            });
            console.log(`✅ Message supprimé avec succès`);
        } catch (error) {
            console.error('❌ Échec de suppression:', error);
        }

        const mentionedJidList = [senderId];
        await sock.sendMessage(chatId, { 
            text: `╔════════════════════════════╗
║  ⚠️ *ATTENTION* ⚠️           ║
╠════════════════════════════╣
║  @${senderId.split('@')[0]}               ║
║  Les liens ne sont pas     ║
║  autorisés dans ce groupe !║
╠════════════════════════════╣
║  🕷️ *DEV SHADOW TECH*      ║
╚════════════════════════════╝`,
            mentions: mentionedJidList 
        });
    }
}

module.exports = {
    handleAntilinkCommand,
    handleLinkDetection,
};