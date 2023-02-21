import dotenv from "dotenv";

dotenv.config();

/**
 * you can change the emojis in the array to whatever you want (unicode or custom ID)
 */
const envVariables = {
  botToken: process.env.BOT_TOKEN,
  clientID: process.env.CLIENT_ID,
  guildID: process.env.GUILD_ID,
  eventsPath: process.env.EVENTS_PATH,
  commandsPath: process.env.COMMANDS_PATH,
  mainEmbedColour: 0x000000, //default Embed colour (note! only change what comes after 0x)
  joinLeaveLog: false, //log chanel id (make sure it's a string) [false = off]
  autoJoinRole: false, //join role id [false = off]
  activityStatus: [3, "your mom!"], //custom activity status (Playing [0], Streaming[1], Listening[2], Watching[3], Competing[5]) [false = off]
  pollYesNo: ["⭕", "❌"],
  pollNumbers: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"],
};

function hasAllProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
      throw new Error(`Object is missing property: ${key}`);
    }

    if (Array.isArray(obj[key])) {
      for (const item of obj[key]) {
        if (item === undefined || item === null || item === "") {
          throw new Error(`Array is missing property: ${key}`);
        }
      }
    }
  }
  return obj;
}

export const config = hasAllProperties(envVariables);
