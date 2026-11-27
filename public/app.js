=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const base={balance:500,inventory:[],opened:0,lastDaily:"",games:0};let state;try{state={...base,...JSON.parse(localStorage.zd2||"{}")}}catch{state={...base}}
const gifts=[
{name:"Плюшевый мишка",emoji:"🧸",rarity:"Обычный",value:45,w:38},
{name:"Сияющее сердце",emoji:"💝",rarity:"Обычный",value:55,w:30},
{name:"Букет цветов",emoji:"💐",rarity:"Редкий",value:95,w:15},
{name:"Золотое кольцо",emoji:"💍",rarity:"Редкий",value:150,w:9},
{name:"Счастливая звезда",emoji:"🌠",rarity:"Редкий",value:180,w:7},
{name:"Праздничный торт",emoji:"🎂",rarity:"Эпический",value:280,w:4},
{name:"Алмазный кубок",emoji:"🏆",rarity:"Эпический",value:360,w:3},
{name:"Лунный кот",emoji:"🐈‍⬛",rarity:"Эпический",value:420,w:2.5},
{name:"Космическая ракета",emoji:"🚀",rarity:"Легендарный",value:650,w:1.3},
{name:"Звёздная корона",emoji:"👑",rarity:"Легендарный",value:900,w:.8},
{name:"Золотой дракон",emoji:"🐉",rarity:"Легендарный",value:1300,w:.45},
{name:"Галактический феникс",emoji:"🦅",rarity:"Мифический",value:2200,w:.18},
{name:"Сердце галактики",emoji:"💫",rarity:"Мифический",value:3500,w:.08}
];
const cases=[{id:"start",name:"Стартовый",desc:"Первый шаг в коллекцию",price:100,emoji:"🎁",tag:"ДЛЯ НОВИЧКОВ"},{id:"pro",name:"Премиум",desc:"Больше шансов на редкие подарки",price:250,emoji:"💎",tag:"ПОПУЛЯРНЫЙ"},{id:"royal",name:"Королевский",desc:"Повышенный шанс легендарных",price:500,emoji:"👑",tag:"ВЫСОКАЯ РЕДКОСТЬ"}];
function save(){localStorage.zd2=JSON.stringify(state);render()}function lvl(){return 1+Math.floor(state.opened/5)+Math.floor(state.games/10)}
function render(){$("#balance").textContent=state.balance.toLocaleString("ru");$("#count").textContent=state.inventory.length;$("#opened").textContent=state.opened;$("#level").textContent=lvl();$("#profileInfo").innerHTML=`<div>Баланс: <b>✦ ${state.balance}</b><br>Подарков: ${state.inventory.length}<br>Открытий: ${state.opened}<br>Уровень: ${lvl()}</div>`;
$("#caseGrid").innerHTML=cases.map(c=>`<article class="case"><small>${c.tag}</small><div class="art">${c.emoji}</div><h3>${c.name}</h3><p>${c.desc}</p><div class="bottom">✦ ${c.price}<button data-case="${c.id}">Открыть</button></div></article>`).join("");
$("#items").innerHTML=state.inventory.length?state.inventory.slice().reverse().map((g,j)=>`<article class="item"><div class="emoji">${g.emoji}</div><h3>${g.name}</h3><p>${g.rarity} · ✦ ${g.value}</p><button data-sell="${state.inventory.length-1-j}">Продать за ✦ ${Math.floor(g.value*.7)}</button></article>`).join(""):`<div class="empty">Инвентарь пуст. Открой первый кейс!</div>`}
function draw(id){let pool=gifts.map(g=>({...g}));const boost=id==="pro"?{"Обычный":.65,"Редкий":1.5,"Эпический":2,"Легендарный":2.8,"Мифический":3}:id==="royal"?{"Обычный":.3,"Редкий":.9,"Эпический":2,"Легендарный":4.5,"Мифический":6}:{};pool.forEach(g=>g.w*=boost[g.rarity]||1);let n=Math.random()*pool.reduce((s,g)=>s+g.w,0);for(let g of pool){n-=g.w;if(n<=0)return g}return pool[0]}
let pending=null;
$("#caseGrid").onclick=e=>{let b=e.target.closest("[data-case]");if(!b)return;let c=cases.find(x=>x.id===b.dataset.case);if(state.balance<c.price)return alert("Не хватает виртуальных звёзд. Сыграй в мини-игру или забери бонус.");state.balance-=c.price;state.opened++;pending=draw(c.id);save();const reel=[...Array.from({length:24},()=>gifts[Math.floor(Math.random()*gifts.length)]),pending];$("#dropEmoji").textContent="🎁";$("#dropName").textContent="Прокрутка подарков…";$("#dropRarity").textContent="";$("#dropValue").textContent="";$("#modal").classList.remove("hidden");const box=$("#dropEmoji");box.classList.add("spinning");let i=0,delay=55;function tick(){box.textContent=reel[Math.min(i,reel.length-1)].emoji;i++;if(i<reel.length){delay+=7;setTimeout(tick,delay)}else{box.classList.remove("spinning");$("#dropName").textContent=pending.name;$("#dropRarity").textContent=pending.rarity.toUpperCase();$("#dropValue").textContent="Ценность: ✦ "+pending.value;box.classList.add("landed")}}tick()};
function close(){if(pending){state.inventory.push(pending);pending=null;save()}$("#modal").classList.add("hidden");$("#dropEmoji").classList.remove("landed","spinning")}$("#claim").onclick=close;$("#close").onclick=()=>$("#modal").classList.add("hidden");
$("#items").onclick=e=>{let b=e.target.closest("[data-sell]");if(!b)return;let i=+b.dataset.sell,g=state.inventory[i];state.balance+=Math.floor(g.value*.7);state.inventory.splice(i,1);save()};
$$("nav button").forEach(b=>b.onclick=()=>{$$("nav button").forEach(x=>x.classList.toggle("active",x===b));$$(".view").forEach(x=>x.classList.toggle("active",x.id===b.dataset.tab))});$$("[data-go]").forEach(b=>b.onclick=()=>{const t=b.dataset.go;$$("nav button").forEach(x=>x.classList.toggle("active",x.dataset.tab===t));$$(".view").forEach(x=>x.classList.toggle("active",x.id===t))});
$("#daily").onclick=()=>{let d=new Date().toLocaleDateString();if(state.lastDaily===d)return alert("Бонус уже получен сегодня.");state.lastDaily=d;state.balance+=100;save();alert("Получено 100 виртуальных звёзд!")};
function stage(html){$("#stage").innerHTML=html;$("#stage").classList.remove("hidden");$("#stage").scrollIntoView({behavior:"smooth",block:"center"})}
$("#tapStart").onclick=()=>{let n=0,t=15;stage(`<h3>Звёздный тап</h3><p>Осталось <b id="tt">15</b> сек.</p><button class="tap" id="tap">✦</button><p>Нажатий: <b id="tn">0</b></p>`);let timer=setInterval(()=>{$("#tt").textContent=--t;if(t<=0){clearInterval(timer);let r=Math.min(100,n*2);state.balance+=r;state.games++;save();$("#stage").insertAdjacentHTML("beforeend",`<p>Раунд окончен: +${r} ✦</p>`)}},1000);$("#tap").onclick=()=>{$("#tn").textContent=++n}}
$("#memoryStart").onclick=()=>{let sy=["🍀","🎁","⭐","💎","🌙","🧸","🎈","💜"],deck=[...sy,...sy].sort(()=>Math.random()-.5),first=null,lock=false,matched=0,tries=0;stage(`<h3>Найди пары</h3><div class="board">${deck.map((_,i)=>`<button class="cell" data-i="${i}">?</button>`).join("")}</div><p>Попытки: <b id="tries">0</b></p>`);$$(".cell").forEach(b=>b.onclick=()=>{if(lock||b.disabled||b.textContent!=="?")return;let i=+b.dataset.i;b.textContent=deck[i];if(!first){first=b;return}tries++;$("#tries").textContent=tries;if(first.textContent===b.textContent){first.disabled=b.disabled=true;first=null;if(++matched===8){let r=Math.max(20,100-tries*3);state.balance+=r;state.games++;save();$("#stage").insertAdjacentHTML("beforeend",`<p>Победа! +${r} ✦</p>`)}}else{lock=true;let old=first;first=null;setTimeout(()=>{old.textContent="?";b.textContent="?";lock=false},650)}})};
$("#reactionStart").onclick=()=>{stage(`<h3>Проверка реакции</h3><p>Нажми, когда поле станет зелёным.</p><button class="reaction" id="react">ЖДИ СИГНАЛА…</button>`);let ready=false,done=false,tm=setTimeout(()=>{ready=true;$("#react").classList.add("ready");$("#react").textContent="ЖМИ СЕЙЧАС!"},1200+Math.random()*3500);$("#react").onclick=()=>{if(done)return;done=true;clearTimeout(tm);if(!ready){$("#react").textContent="Слишком рано. Запусти ещё раз.";return}state.balance+=35;state.games++;save();$("#react").textContent="Отлично! +35 ✦"}};
// Skill arcade: the selected base amount is a reward calculator, not a stake.
function amountInput(id,label='Базовая награда'){
 return `<label class="amount-label">${label} <input id="${id}" type="number" min="10" max="1000" step="10" value="100"></label><p class="hint">Это только размер расчёта награды: звёзды с баланса не списываются.</p>`;
}
function readAmount(id){const n=Math.floor(Number($("#"+id).value));return Math.max(10,Math.min(1000,Number.isFinite(n)?n:100));}
$("#minesStart").onclick=()=>{
 const total=25,mines=4,mineSet=new Set();while(mineSet.size<mines)mineSet.add(Math.floor(Math.random()*total));
 let opened=0,finished=false,multiplier=1,reward=0;
 stage(`<h3>💣 Сапёр звёзд</h3><p>Открывай безопасные клетки и увеличивай множитель.</p>${amountInput('mineBase')}<div class="mines-grid">${Array.from({length:total},(_,i)=>`<button class="mine-cell" data-mine="${i}">✦</button>`).join("")}</div><p>Безопасных клеток: <b id="safeCount">0</b> / 21 · Множитель: <b id="mineMult">x1.00</b></p><p>Виртуальная награда: <b id="mineReward">0</b> ✦</p><button id="mineCollect" disabled>Забрать награду</button><p id="mineMsg"></p>`);
 const cells=$$(".mine-cell");
 cells.forEach(btn=>btn.onclick=()=>{if(finished||btn.disabled)return;const i=+btn.dataset.mine;btn.disabled=true;
  if(mineSet.has(i)){btn.textContent="💣";btn.classList.add("boom");finished=true;cells.forEach((c,j)=>{if(mineSet.has(j))c.textContent="💣";c.disabled=true});$("#mineCollect").disabled=true;$("#mineMsg").textContent="Ловушка! Раунд окончен. Базовая награда не списывалась.";return}
  opened++;multiplier=1+opened*.22+opened*opened*.018;reward=Math.floor(readAmount('mineBase')*multiplier);btn.textContent="⭐";btn.classList.add("safe");$("#safeCount").textContent=opened;$("#mineMult").textContent="x"+multiplier.toFixed(2);$("#mineReward").textContent=reward;$("#mineCollect").disabled=false;
  if(opened===total-mines)collect();
 });
 function collect(){if(!reward||finished)return;finished=true;state.balance+=reward;state.games++;save();$("#mineCollect").disabled=true;cells.forEach(c=>c.disabled=true);$("#mineMsg").textContent=`Забрано +${reward} виртуальных звёзд!`;}
 $("#mineCollect").onclick=collect;
};
$("#planeStart").onclick=()=>{
 let height=0,mult=1,active=false,ended=false,timer=null;
