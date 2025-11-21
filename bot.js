import { Client, GatewayIntentBits, Partials } from "discord.js";
import OpenAI from "openai";
import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// --- OpenAI client ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// When bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// When a message is sent in the server
client.on("messageCreate", async (msg) => {
  console.log(`Received message in #${msg.channel?.name}: ${msg.content}`);

  // Don't reply to itself or other bots
  if (msg.author.bot) return;


  // Only reply in forum posts or channels you choose
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are an academic AI assistant participating in classroom forum discussions. Keep responses thoughtful, structured, and concise." },
        { role: "user", content: msg.content }
      ]
    });

    const reply = completion.choices[0].message.content;
    msg.reply(reply);

  } catch (err) {
    console.error(err);
    msg.reply("IÕm temporarily offline (API quota issue). Please tell Cornel to check the OpenAI billing settings.");
  }

});

// Login bot
client.login(process.env.BOT_TOKEN);
