require("dotenv").config();
const express=require("express"),path=require("path");
const app=express(),PORT=process.env.PORT||3000;
app.use(express.static(path.join(__dirname,"public")));
app.get("/",(_,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.get("/health",(_,res)=>res.json({ok:true}));
app.listen(PORT,()=>console.log("Zvezda Drop listening on "+PORT));
if(process.env.BOT_TOKEN){
 const {Telegraf,Markup}=require("telegraf"),bot=new Telegraf(process.env.BOT_TOKEN);
 bot.start(ctx=>process.env.WEB_APP_URL
  ?ctx.reply("Добро пожаловать в Zvezda Drop! Все предметы и монеты виртуальные.",Markup.inlineKeyboard([[Markup.button.webApp("🎁 Открыть игру",process.env.WEB_APP_URL)]]))
  :ctx.reply("Бот запущен. Добавь WEB_APP_URL в Render после публикации сайта."));
 bot.launch().catch(e=>console.error("Bot error:",e.message));
 process.once("SIGINT",()=>bot.stop("SIGINT"));process.once("SIGTERM",()=>bot.stop("SIGTERM"));
}else console.log("BOT_TOKEN не задан: сайт работает без Telegram-бота.");
