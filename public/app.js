const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const gifts = [
  {name:"Plush Pepe",emoji:"🐸",rarity:"Легендарный",weight:3},
  {name:"Precious Ring",emoji:"💍",rarity:"Легендарный",weight:4},
  {name:"Heart",emoji:"❤️",rarity:"Эпический",weight:10},
  {name:"Toy Bear",emoji:"🧸",rarity:"Редкий",weight:18},
  {name:"Bunny",emoji:"🐰",rarity:"Редкий",weight:25},
  {name:"Rose",emoji:"🌹",rarity:"Обычный",weight:40}
];
const cases = [
  {id:"bear",name:"Bear Case",desc:"Подарки с милыми персонажами",emoji:"🧸",price:80,pool:["Toy Bear","Bunny","Rose","Heart"]},
  {id:"luxury",name:"Luxury Case",desc:"Редкие и ценные находки",emoji:"💍",price:180,pool:["Precious Ring","Heart","Plush Pepe"]},
  {id:"heart",name:"Heart Case",desc:"Коллекция сердечек",emoji:"❤️",price:100,pool:["Heart","Rose","Precious Ring"]},
  {id:"pepe",name:"Pepe Case",desc:"Кейс с лягушкой Pepe",emoji:"🐸",price:220,pool:["Plush Pepe","Toy Bear","Heart"]},
  {id:"mystery",name:"Mystery Case",desc:"Сюрприз из разных коллекций",emoji:"🎁",price:140,pool:gifts.map(g=>g.name)}
];
let balance = Number(localStorage.getItem("gcs_balance") || 500);
let inventory = JSON.parse(localStorage.getItem("gcs_inventory") || "[]");
let currentCase = null;
const $ = id => document.getElementById(id);
const giftByName = name => gifts.find(g=>g.name===name);
function save(){localStorage.setItem("gcs_balance",balance);localStorage.setItem("gcs_inventory",JSON.stringify(inventory));}
function render(){
  $("balance").textContent=balance;
  $("cases").innerHTML=cases.map(c=>`<article class="case-card"><div class="case-art">${c.emoji}</div><h3>${c.name}</h3><p>${c.desc}</p><div class="case-bottom"><span class="price">🪙 ${c.price}</span><button class="open-btn" data-case="${c.id}" ${balance<c.price?"disabled":""}>Открыть</button></div></article>`).join("");
  $("inventoryCount").textContent=`${inventory.length} GIFTS`;
  $("inventory").className=inventory.length?"inventory":"inventory empty";
  $("inventory").innerHTML=inventory.length?`<div class="inventory-items">${inventory.slice().reverse().map(g=>`<div class="gift-item"><div class="emoji">${g.emoji}</div><b>${g.name}</b><small>${g.rarity}</small></div>`).join("")}</div>`:"Пока пусто. Открой первый кейс!";
}
function weightedPick(pool){
  const list=pool.map(giftByName).filter(Boolean);const total=list.reduce((s,g)=>s+g.weight,0);let r=Math.random()*total;
  for(const g of list){r-=g.weight;if(r<=0)return g;}return list[list.length-1];
}
function openCase(c){
  if(balance<c.price)return;
  currentCase=c;balance-=c.price;save();render();
  $("opening").classList.remove("hidden");$("openingTitle").textContent=c.name;
  $("result").classList.add("hidden");$("openAgain").classList.add("hidden");
  const winner=weightedPick(c.pool);
  const reel=$("reel");reel.style.transition="none";reel.style.transform="translateX(0)";
  const items=Array.from({length:35},(_,i)=>i===29?winner:weightedPick(c.pool));
  reel.innerHTML=items.map(g=>`<div class="reel-item">${g.emoji}</div>`).join("");
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    reel.style.transition="transform 3.5s cubic-bezier(.08,.72,.08,1)";
    const itemWidth=93;const offset=29*itemWidth+42-($("reel").parentElement.clientWidth/2);
    reel.style.transform=`translateX(-${offset}px)`;
  }));
  setTimeout(()=>{
    inventory.push(winner);save();render();
    $("result").innerHTML=`<div class="gift-big">${winner.emoji}</div><h3>${winner.name}</h3><div>${winner.rarity}</div><small>Добавлено в коллекцию</small>`;
    $("result").classList.remove("hidden");$("openAgain").classList.remove("hidden");
  },3650);
}
$("cases").addEventListener("click",e=>{const btn=e.target.closest("[data-case]");if(btn){const c=cases.find(x=>x.id===btn.dataset.case);if(c)openCase(c);}});
$("closeOpening").addEventListener("click",()=>$("opening").classList.add("hidden"));
$("openAgain").addEventListener("click",()=>{if(currentCase)openCase(currentCase);});
render();
