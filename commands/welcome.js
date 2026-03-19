const { handleWelcome } = require('../lib/welcome');
const { isWelcomeOn, getWelcome } = require('../lib/index');
const { channelInfo } = require('../lib/messageConfig');
const fetch = require('node-fetch');

/**
 * 🤖 DEV SHADOW TECH - WELCOME SYSTEM
 * 👋 Message de bienvenue pour les nouveaux membres
 * 🕷️ Version 3.0.0
 */

async function welcomeCommand(sock, chatId, message, match) {
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

    await handleWelcome(sock, chatId, message, matchText);
}

async function handleJoinEvent(sock, id, participants) {
    // Vérifier si welcome est activé pour ce groupe
    const isWelcomeEnabled = await isWelcomeOn(id);
    if (!isWelcomeEnabled) return;

    // Récupérer le message personnalisé
    const customMessage = await getWelcome(id);

    // Récupérer les informations du groupe
    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || 'Aucune description disponible';
    const memberCount = groupMetadata.participants.length;

    // Envoyer un message de bienvenue pour chaque nouveau membre
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
                    .replace(/{description}/g, groupDesc)
                    .replace(/{count}/g, memberCount);
            } else {
                // Message par défaut magnifique
                finalMessage = `
╔══════════════════════════════════╗
║     🎉 *BIENVENUE* 🎉             ║
╠══════════════════════════════════╣
║                                   ║
║  👋 @${displayName}                ║
║                                   ║
║  📌 *Groupe:* ${groupName.substring(0, 20)}${groupName.length > 20 ? '...' : ''}
║  👥 *Membres:* ${memberCount}
║                                   ║
║  📝 *Description:*                ║
║  ${groupDesc.substring(0, 30)}${groupDesc.length > 30 ? '...' : ''}
║                                   ║
║  ⏱️ *Arrivée:* ${new Date().toLocaleString('fr-FR')}
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
                
                // URL de l'API pour l'image de bienvenue
                const apiUrl = `https://api.some-random-api.com/welcome/img/2/gaming3?type=join&textcolor=green&username=${encodeURIComponent(displayName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${memberCount}&avatar=${encodeURIComponent(profilePicUrl)}`;
                
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const imageBuffer = await response.buffer();
                    
                    await sock.sendMessage(id, {
                        image: imageBuffer,
                        caption: finalMessage,
                        mentions: [participantString],
                        ...channelInfo
                    });
                    continue;
                }
            } catch (imageError) {
                console.log('Génération d\'image échouée, envoi texte');
            }
            
            // Envoyer le message texte
            await sock.sendMessage(id, {
                text: finalMessage,
                mentions: [participantString],
                ...channelInfo
            });
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi du message de bienvenue:', error);
            
            // Message de secours
            const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const user = participantString.split('@')[0];
            
            const fallbackMsg = `
╔══════════════════════════════════╗
║     🎉 *BIENVENUE* 🎉             ║
╠══════════════════════════════════╣
║                                   ║
║  👋 @${user}                       ║
║                                   ║
║  📌 Bienvenue dans le groupe !    ║
║                                   ║
╚══════════════════════════════════╝
╔══════════════════════════════════╗
║  🕷️ *DEV SHADOW TECH* 🕷️         ║
╚══════════════════════════════════╝`;
            
            await sock.sendMessage(id, {
                text: fallbackMsg,
                mentions: [participantString],
                ...channelInfo
            });
        }
    }
}

module.exports = { welcomeCommand, handleJoinEvent };