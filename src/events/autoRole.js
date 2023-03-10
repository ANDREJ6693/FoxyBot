import { Event } from "djs-handlers";
import { config } from "../config/config.js";

export default new Event("guildMemberAdd", (member) => {
  if (!config.autoJoinRole) return;

  const autorole = member.guild.roles.cache.get(config.autoJoinRole);

  if (!autorole) {
    return console.log(`Auto role not found: ${config.autoJoinRole}.`);
  }

  try {
    member.roles.add(autorole);

    console.log(
      `Automatically assigned role ${autorole.name} to ${member.user.username}.`
    );
  } catch (err) {
    console.error(err);
  }
});
