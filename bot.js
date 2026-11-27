require("dotenv").config();
const express = require("express");
const path = require("path");
const { Telegraf, Markup } = require("telegraf");

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEB_APP_URL;
const port = process.env.PORT || 3000;

if (!token || !webAppUrl) {
  console.error("Set BOT_TOKEN and WEB_APP_URL in environment variables.");
  process.exit(1);
}

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => res.send("Gift Case Simulator is running."));
app.listen(port, () => console.log(`Web app listening on ${port}`));

const bot = new Telegraf(token);
bot.start((ctx) => ctx.reply(
  "🎁 Добро пожаловать в Gift Case Simulator! Все подарки и монеты виртуальные.",
  Markup.inlineKeyboard([Markup.button.webApp("🎁 Открыть симулятор", webAppUrl)])
));
bot.command("help", (ctx) => ctx.reply("Нажми /start, чтобы открыть симулятор."));
bot.launch();
console.log("Gift Case Simulator bot is running.");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
