const fs = require("fs");
const axios = require("axios");
let settings = JSON.parse(fs.readFileSync("./settings.json"));

module.exports = async (msg, sock) => {
  const body = msg.body?.toLowerCase();
  const from = msg.from;

  function save() {
    fs.writeFileSync("./settings.json", JSON.stringify(settings, null, 2));
  }

  function reply(text) {
    return sock.sendMessage(from, { text });
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

  if (settings.autoreply)
    await sock.sendMessage(from, { text: "🤖 Auto Reply Active!" });

  if (settings.autoreact)
    await sock.sendMessage(from, { react: { text: "❤️", key: msg.key } });

  if (settings.autotype)
    await sock.sendPresenceUpdate("composing", from);

  if (settings.autoread)
    await sock.readMessages([msg.key]);

  if (settings.autostatus)
    await sock.sendPresenceUpdate("recording", from);

  if (body === ".menu") {
    return reply(
`✨ *SANNU MD MINI BOT MENU* ✨

🛠 SYSTEM
• .ping
• .setting

🎵 DOWNLOADERS
• .song <name>
• .video <name>
• .tiktok <link>
• .fb <link>

⚡ Powered by SANNU MD`
    );
  }

  if (body === ".ping") {
    let start = Date.now();
    await reply("🏓 Checking speed…");
    let end = Date.now();
    return reply(`⚡ Ping: *${end - start}ms*`);
  }

  const API = "https://api-sannu-md.vercel.app";

  if (body.startsWith(".song")) {
    let name = body.replace(".song", "").trim();
    if (!name) return reply("🎵 Give song name.
Example: *.song shape of you*");

    reply("⏳ Downloading song...");

    try {
      const res = await axios.get(`${API}/song?query=${encodeURIComponent(name)}`);
      await sock.sendMessage(from, { audio: { url: res.data.url }, mimetype: "audio/mp4" });
    } catch (e) {
      reply("❌ Song download error!");
    }
  }

  if (body.startsWith(".video")) {
    let name = body.replace(".video", "").trim();
    if (!name)
      return reply("🎬 Video name.
Example: *.video faded alan walker*");

    reply("⏳ Downloading video...");

    try {
      const res = await axios.get(`${API}/video?query=${encodeURIComponent(name)}`);
      await sock.sendMessage(from, { video: { url: res.data.url }, caption: "🎬 Video Ready!" });
    } catch (e) {
      reply("❌ Video download error!");
    }
  }

  if (body.startsWith(".tiktok")) {
    let link = body.replace(".tiktok", "").trim();
    if (!link) return reply("🔗 TikTok link.");

    reply("⏳ Downloading TikTok...");

    try {
      const res = await axios.get(`${API}/tiktok?url=${encodeURIComponent(link)}`);
      await sock.sendMessage(from, { video: { url: res.data.nowm }, caption: "✅ TikTok No-WM!" });
    } catch (e) {
      reply("❌ TikTok download error!");
    }
  }

  if (body.startsWith(".fb")) {
    let link = body.replace(".fb", "").trim();
    if (!link) return reply("🔗 Facebook link.");

    reply("⏳ Downloading Facebook video...");

    try {
      const res = await axios.get(`${API}/fb?url=${encodeURIComponent(link)}`);
      await sock.sendMessage(from, { video: { url: res.data.hd }, caption: "📘 Facebook HD!" });
    } catch (e) {
      reply("❌ Facebook download error!");
    }
  }

};
