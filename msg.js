const fs = require("fs");
let settings = JSON.parse(fs.readFileSync("./settings.json"));

module.exports = async (msg, sock) => {
  const body = msg.body?.toLowerCase();

  function save() {
    fs.writeFileSync("./settings.json", JSON.stringify(settings, null, 2));
  }

  function reply(text) {
    return sock.sendMessage(msg.from, { text });
  }

  const toggles = {
    "autoreply": "Auto Reply",
    "autoreact": "Auto React",
    "autotype": "Auto Typing",
    "autoread": "Auto Read",
    "autostatus": "Auto Status",
    "welcome": "Welcome System",
    "ai": "AI Chat",
    "antilink": "Anti Link"
  };

  for (const key in toggles) {
    if (body === `.${key} on`) {
      settings[key] = true;
      save();
      return reply(`✅ ${toggles[key]} *ON*`);
    }
    if (body === `.${key} off`) {
      settings[key] = false;
      save();
      return reply(`❌ ${toggles[key]} *OFF*`);
    }
  }

  if (settings.autoreply) {
    await sock.sendMessage(msg.from, { text: "🤖 Auto Reply Active!" });
  }

  if (settings.autoreact) {
    await sock.sendMessage(msg.from, { react: { text: "❤️", key: msg.key } });
  }

  if (settings.autotype) {
    await sock.sendPresenceUpdate("composing", msg.from);
  }

  if (settings.autoread) {
    await sock.readMessages([msg.key]);
  }

  if (settings.autostatus) {
    await sock.sendPresenceUpdate("recording", msg.from);
  }
};
