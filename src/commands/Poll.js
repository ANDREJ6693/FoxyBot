import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "djs-handlers";
import { config } from "../config/config.js";
import { ExtendedEmbedBuilder } from "../struct/ExtendedEmbedBuilder.js";
import { getEmojis } from "../util/helpers.js";

export default new Command({
  name: "poll",
  description: "Create a poll.",
  options: [
    {
      name: "question",
      description: "The question to ask.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "type",
      description: "The type of poll to create.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Yes/No",
          value: "yesno",
        },
        {
          name: "Multiple Choice",
          value: "multiplechoice",
        },
      ],
    },
    {
      name: "answers",
      description:
        "The answers to the question. Separate each answer with a comma. Maxiumum of 10 answers.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async ({ interaction, args }) => {
    try {
      let question = args.getString("question");
      const answerType = args.getString("type");

      if (!question || !answerType) {
        return interaction.reply({
          content: "Please specify a question and an answer type!",
          ephemeral: true,
        });
      }

      const messageLength = question.length;

      if (messageLength >= 4092) {
        return interaction.reply({
          content:
            "The question is too long! It must be under 4092 characters.",
          ephemeral: true,
        });
      }

      question = !question.endsWith("?") ? question + "?" : question;

      if (answerType === "yesno") {
        const emotes = getEmojis(config.pollYesNo, interaction.client);

        const content =
          messageLength > 256
            ? { description: `**${question}**` }
            : { title: question };

        const pollEmbed = new ExtendedEmbedBuilder(interaction.user, content);

        for (const emoji of emotes) {
          if (!emoji) {
            interaction.reply({
              content: "Cannot find emojis!",
              ephemeral: true,
            });

            return;
          }
        }

        const message = await interaction.reply({
          embeds: [pollEmbed],
          fetchReply: true,
        });

        for (const emoji of emotes) {
          message.react(emoji);
        }
      } else {
        const answers = args.getString("answers");

        if (!answers) {
          return interaction.reply({
            content: "Please specify answers!",
            ephemeral: true,
          });
        }

        const emotes = getEmojis(config.pollNumbers, interaction.client);

        const fields = answers.split(",").map((answer, index) => {
          return {
            name: `${emotes[index]}  ${answer.trim()}`,
            value: "\u200b",
          };
        });

        if (fields.length > 10) {
          return interaction.reply({
            content: "You can only have 10 answers max!",
            ephemeral: true,
          });
        }

        const content =
          messageLength > 256
            ? { description: `**${question}**`, fields }
            : { title: question, fields };

        const pollEmbed = new ExtendedEmbedBuilder(interaction.user, content);

        const message = await interaction.reply({
          embeds: [pollEmbed],
          fetchReply: true,
        });

        for (let i = 0; i < fields.length; i++) {
          message.react(emotes[i]);
        }

        return;
      }
    } catch (err) {
      console.error(`Something went wrong trying to make a poll: ${err}`);
    }
  },
});
