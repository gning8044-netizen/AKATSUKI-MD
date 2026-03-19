const { handleGoodbye } = require('../lib/welcome');
const { isGoodByeOn, getGoodbye } = require('../lib/index');
const fetch = require('node-fetch');

/**
 * 🤖 DEV SHADOW TECH - GOODBYE SYSTEM
 * 👋 Message d'au revoir pour les membres qui partent
 * 🕷️ Version 3.0.0
 */

async function goodbyeCommand(sock, chatId, message, match) {
    // Vérifier si c'est un groupe
    if (!chatId.endsWith('@g.us')) {
        const groupOnlyMsg = `
╔══════════════════════════════════╗
║        ⚠️ *ATTENTION* ⚠️          ║
╠══════════════════════════════════╣
║                                   ║
║  📌 Cette commande ne peut être   ║
║     utilisée que dans un groupe.  ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
        
        await sock.sendMessage(chatId, { text: groupOnlyMsg });
        return;
    }

    // Extraire le message personnalisé
    const text = message.message?.conversation || 
                message.message?.extendedTextMessage?.text || '';
    const matchText = text.split(' ').slice(1).join(' ');

    await handleGoodbye(sock, chatId, message, matchText);
}

async function handleLeaveEvent(sock, id, participants) {
    // Vérifier si goodbye est activé pour ce groupe
    const isGoodbyeEnabled = await isGoodByeOn(id);
    if (!isGoodbyeEnabled) return;

    // Récupérer le message personnalisé
    const customMessage = await getGoodbye(id);

    // Récupérer les informations du groupe
    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
    const memberCount = groupMetadata.participants.length;

    // Envoyer un message d'au revoir pour chaque membre qui part
    for (const participant of participants) {
        try {
            // Gérer le cas où participant pourrait être un objet
            const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const user = participantString.split('@')[0];
            
            // Récupérer le nom d'affichage
            let displayName = user;
            try {
                const contact = await sock.getBusinessProfile(participantString);
                if (contact && contact.name) {
                    displayName = contact.name;
                } else {
                    const groupParticipants = groupMetadata.participants;
                    const userParticipant = groupParticipants.find(p => p.id === participantString);
                    if (userParticipant && userParticipant.name) {
                        displayName = userParticipant.name;
                    }
                }
            } catch (nameError) {
                console.log('Impossible de récupérer le nom, utilisation du numéro');
            }
            
            // Traiter le message personnalisé avec les variables
            let finalMessage;
            if (customMessage) {
                finalMessage = customMessage
                    .replace(/{user}/g, `@${displayName}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{count}/g, memberCount);
            } else {
                // Message par défaut magnifique
                finalMessage = `
╔══════════════════════════════════╗
║        👋 *AU REVOIR* 👋          ║
╠══════════════════════════════════╣
║                                   ║
║  😢 @${displayName}                ║
║     a quitté le groupe.           ║
║                                   ║
║  📌 *Groupe:* ${groupName.substring(0, 20)}${groupName.length > 20 ? '...' : ''}
║  👥 *Membres restants:* ${memberCount}
║                                   ║
║  ⏱️ *Départ:* ${new Date().toLocaleString('fr-FR')}
║                                   ║
║  🌟 Bonne continuation !          ║
║                                   ║
╠══════════════════════════════════╣
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
║  🤖 *Bot WhatsApp 150+ commandes* ║
╚══════════════════════════════════╝`;
            }
            
            // Essayer d'envoyer avec une image
            try {
                // Récupérer la photo de profil
                let profilePicUrl = `https://img.pyrocdn.com/dbKUgahg.png`;
                try {
                    const profilePic = await sock.profilePictureUrl(participantString, 'image');
                    if (profilePic) {
                        profilePicUrl = profilePic;
                    }
                } catch (profileError) {
                    console.log('Impossible de récupérer la photo de profil');
                }
                
                // URL de l'API pour l'image d'au revoir
                const apiUrl = `https://api.some-random-api.com/welcome/img/2/gaming1?type=leave&textcolor=red&username=${encodeURIComponent(displayName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${memberCount}&avatar=${encodeURIComponent(profilePicUrl)}`;
                
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const imageBuffer = await response.buffer();
                    
                    await sock.sendMessage(id, {
                        image: imageBuffer,
                        caption: finalMessage,
                        mentions: [participantString]
                    });
                    continue;
                }
            } catch (imageError) {
                console.log('Génération d\'image échouée, envoi texte');
            }
            
            // Envoyer le message texte
            await sock.sendMessage(id, {
                text: finalMessage,
                mentions: [participantString]
            });
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi du message d\'au revoir:', error);
            
            // Message de secours
            const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const user = participantString.split('@')[0];
            
            const fallbackMsg = `
╔══════════════════════════════════╗
║        👋 *AU REVOIR* 👋          ║
╠══════════════════════════════════╣
║                                   ║
║  😢 @${user} a quitté le groupe.   ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
            
            await sock.sendMessage(id, {
                text: fallbackMsg,
                mentions: [participantString]
            });
        }
    }
}

module.exports = { goodbyeCommand, handleLeaveEvent };