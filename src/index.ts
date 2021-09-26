const Markov = require('js-markov');
import { ApplicationCommandData, Client, Intents, MessageReaction } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const markov = new Markov();

const guild = client.guilds.fetch('829798084207706152');

const commands = <ApplicationCommandData[]>[
    {
        name: 'generate',
        description: 'Makes a sentence out of the current Markov chain.',
    },
    {
        name: 'resetchain',
        description: 'Resets the Markov chain.',
    },
];

client.once('ready', async() => {
    console.log('Ready!')

    if (!client.application?.owner) client.application?.fetch();

    (await guild).commands.set(commands);

    client.on('interactionCreate', async(interaction) => {
        if (!interaction.isCommand()) return;

        await interaction.deferReply();

        switch(interaction.commandName) {
            case 'generate':
                markov.train();
    
                let text = markov.generateRandom(2000);
    
                await interaction.editReply('\u200B' + text);
            break
            case 'resetchain':
                markov.clearChain();

                await interaction.editReply('Successfully reset the Markov chain!');
            break
        }
    });

    client.on('messageCreate', async(message) => {
        if (message.guild?.id !== (await guild).id) return;
        if (message.author.id === client.user!.id) return;

        markov.addStates(message.content.toString());
        console.log(`Added "${message.content}" to the Markov chain.`);
    });
});

client.login('');