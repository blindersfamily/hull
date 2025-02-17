const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, TextInputComponent, Modal } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const token = 'MTMzODY2MzAwMDM1MzAxNzkzNg.GvJ61_.dU8Vx0kme0ILL4P0V6dxV6PfQ4SEPQ-ISdsxfo';
const archivedInteractions = {};

client.once('ready', () => {
    console.log('Bot is online!');
    const channelId = '1323784423862173706';
    const channel = client.channels.cache.get(channelId);
    
    if (channel) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rules')
                    .setLabel('القوانين')
                    .setStyle('DANGER'), // الزر باللون الأحمر
                new MessageButton()
                    .setCustomId('verify')
                    .setLabel('إثبات التفاعل')
                    .setStyle('SUCCESS'), // الزر باللون الأخضر
            );

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('اثبات تفاعل الادارة')
            .setDescription('by : i0i2 MTA HELL');

        channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'rules') {
            const rulesEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('القوانين')
                .setDescription('1. احترام الإدارة\n2. عدم كتابة ألفاظ بذيئة\n3. معرفة كافة قوانين السيرفر الإدارية\n4. تفاعلك مهم بشكل يومي\n5. الحفاظ على إثبات التفاعل للحفاظ على منصبك الإداري\n6. إرفاق الصور وروابط مهم وضروري\n7. أي استفسار أو شكوى قم بتقديم فتح تذكرة خاصة بمشكلتك\n8. عدم الاستهبال داخل نموذج التفاعل');
            
            await interaction.reply({ embeds: [rulesEmbed], ephemeral: true });
        } else if (interaction.customId === 'verify') {
            const modal = new Modal()
                .setCustomId('verificationModal')
                .setTitle('نموذج إثبات التفاعل')
                .addComponents(
                    new MessageActionRow()
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('discordUser')
                                .setLabel('يوزر الديسكورد')
                                .setStyle('SHORT')
                                .setPlaceholder('أدخل يوزر الديسكورد هنا')
                                .setRequired(true),
                        ),
                    new MessageActionRow()
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('discordIP')
                                .setLabel('آي بي الديسكورد')
                                .setStyle('SHORT')
                                .setPlaceholder('أدخل آي بي الديسكورد هنا')
                                .setRequired(true),
                        ),
                    new MessageActionRow()
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('interactionType')
                                .setLabel('نوع التفاعل')
                                .setStyle('SHORT')
                                .setPlaceholder('أدخل نوع التفاعل هنا')
                                .setRequired(true),
                        ),
                    new MessageActionRow()
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('interactionLink')
                                .setLabel('إرفاق رابط')
                                .setStyle('SHORT')
                                .setPlaceholder('أرفق الرابط هنا')
                                .setRequired(true),
                        ),
                );

            await interaction.showModal(modal);
        } else if (interaction.customId.startsWith('archive_')) {
            const interactionId = interaction.customId.split('_')[1];
            const archiveEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('الأرشيف')
                .setDescription(archivedInteractions[interactionId] || 'لا توجد تفاعلات مؤرشفة.');

            await interaction.reply({ embeds: [archiveEmbed], ephemeral: true });
        } else if (interaction.customId === 'accept' || interaction.customId === 'reject') {
            const action = interaction.customId === 'accept' ? 'قبول' : 'رفض';
            const archivedEmbed = interaction.message.embeds[0];
            archivedEmbed.setFooter(`تم ${action} النموذج من قبل ${interaction.user.tag}`);

            const interactionId = Date.now().toString();
            archivedInteractions[interactionId] = archivedEmbed.description;

            await interaction.update({ content: `تم ${action} النموذج من قبل ${interaction.user.tag}`, components: [], embeds: [] });
            
            const archiveChannel = client.channels.cache.get('1336839494812569600');
            if (archiveChannel) {
                const archiveRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`archive_${interactionId}`)
                            .setLabel('عرض الأرشيف')
                            .setStyle('PRIMARY'),
                    );

                const archivePrompt = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('عرض الأرشيف')
                    .setDescription('اضغط على الزر أدناه لعرض التفاعل المؤرشف.');

                archiveChannel.send({ embeds: [archivePrompt], components: [archiveRow] });
            }
            
            const notificationChannel = client.channels.cache.get('1323784262750572645');
            if (notificationChannel) {
                notificationChannel.send(`تم ${action} تفاعلك من قبل ${interaction.user.tag}`);
            }
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'verificationModal') {
            const discordUser = interaction.fields.getTextInputValue('discordUser');
            const discordIP = interaction.fields.getTextInputValue('discordIP');
            const interactionType = interaction.fields.getTextInputValue('interactionType');
            const interactionLink = interaction.fields.getTextInputValue('interactionLink');

            const channelId = '1339021402228920472';
            const channel = client.channels.cache.get(channelId);

            if (channel) {
                const verificationEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('نموذج إثبات التفاعل')
                    .setDescription(`**يوزر الديسكورد:** ${discordUser}\n**آي بي الديسكورد:** ${discordIP}\n**نوع التفاعل:** ${interactionType}\n**إرفاق رابط:** ${interactionLink}`);
                
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('accept')
                            .setLabel('قبول')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('reject')
                            .setLabel('رفض')
                            .setStyle('DANGER'),
                    );

                channel.send({ embeds: [verificationEmbed], components: [row] });
            }

            await interaction.reply({ content: 'تم إرسال نموذج إثبات التفاعل بنجاح!', ephemeral: true });
        }
    }
});

client.login(token);
