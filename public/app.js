(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const STORAGE = 'zvezdaDropState_v3';
  const defaults = { balance: 500, inventory: [], opened: 0, lastDaily: '', games: 0, score: 0 };
  let state;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || 'null');
    state = saved && typeof saved === 'object' ? { ...defaults, ...saved } : { ...defaults };
    if (!Array.isArray(state.inventory)) state.inventory = [];
    if (!Number.isFinite(state.balance)) state.balance = defaults.balance;
  } catch { state = { ...defaults }; }
  const gifts = [
    { name: 'Звёздная открытка', emoji: '🌟', rarity: 'Обычный', value: 25, weight: 42 },
    { name: 'Лунный брелок', emoji: '🌙', rarity: 'Обычный', value: 35, weight: 30 },
    { name: 'Космический шар', emoji: '🔮', rarity: 'Редкий', value: 65, weight: 17 },
    { name: 'Золотая звезда', emoji: '⭐', rarity: 'Эпический', value: 120, weight: 8 },
    { name: 'Корона галактики', emoji: '👑', rarity: 'Легендарный', value: 250, weight: 3 }
  ];
  const cases = [
    { id: 'starter', name: 'Стартовый', emoji: '🎁', price: 100, desc: 'Первые подарки коллекционера' },
    { id: 'premium', name: 'Премиум', emoji: '💎', price: 250, desc: 'Больше редких находок' },
    { id: 'royal', name: 'Королевский', emoji: '👑', price: 400, desc: 'Подарки высокой редкости' }
  ];
  let pendingGift = null;
  let timer = null;
  let gameCleanups = [];
  const save = () => { try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch {} };
  const rarityClass = (r) => ({ 'Обычный':'common', 'Редкий':'rare', 'Эпический':'epic', 'Легендарный':'legendary' }[r] || 'common');
  function update() {
    $('#balance').textContent = Math.floor(state.balance);
    $('#count').textContent = state.inventory.length;
    $('#opened').textContent = state.opened;
    $('#level').textContent = Math.max(1, Math.floor(state.score / 250) + 1);
    $('#profileInfo').innerHTML = `<p>Баланс: <b>${Math.floor(state.balance)} ✦</b></p><p>Открыто кейсов: <b>${state.opened}</b></p><p>Сыграно мини-игр: <b>${state.games}</b></p><p>Очки: <b>${state.score}</b></p>`;
    renderCases(); renderInventory(); save();
  }
  function renderCases() {
    $('#caseGrid').innerHTML = cases.map(c => `<article class="caseCard"><div class="caseArt">${c.emoji}</div><div><b>${c.name}</b><p>${c.desc}</p><small>Цена: ${c.price} ✦</small><button class="openCase" data-case="${c.id}">Открыть</button></div></article>`).join('');
  }
  function renderInventory() {
    const root = $('#items');
    if (!state.inventory.length) { root.innerHTML = '<div class="empty">Пока пусто. Открой первый кейс.</div>'; return; }
    root.innerHTML = state.inventory.map((g, i) => `<article class="giftItem"><div class="giftEmoji">${g.emoji}</div><b>${g.name}</b><small>${g.rarity}</small><p>Ценность: ${g.value} ✦</p><button class="sellGift" data-index="${i}">Обменять за ${g.value} ✦</button></article>`).join('');
  }
  function drawGift(caseId) {
    const bonus = caseId === 'royal' ? 1.7 : caseId === 'premium' ? 1.25 : 1;
    const pool = gifts.map(g => ({ ...g, weight: g.weight / (g.value > 100 ? bonus : 1) }));
    const total = pool.reduce((a,g) => a + g.weight, 0); let n = Math.random() * total;
    for (const g of pool) { n -= g.weight; if (n <= 0) return g; }
    return pool[0];
  }
  function openCase(id) {
    const c = cases.find(x => x.id === id); if (!c) return;
    if (state.balance < c.price) { alert('Не хватает виртуальных звёзд. Забери ежедневный бонус или обменяй подарок.'); return; }
    state.balance -= c.price; state.opened++; pendingGift = drawGift(id); update();
    $('#dropEmoji').textContent = pendingGift.emoji;
    $('#dropName').textContent = pendingGift.name;
    $('#dropRarity').textContent = pendingGift.rarity;
    $('#dropValue').textContent = `Ценность: ${pendingGift.value} ✦`;
    $('#modal').classList.remove('hidden');
  }
  function closeModal() { $('#modal').classList.add('hidden'); }
  $('#caseGrid').addEventListener('click', e => { const b = e.target.closest('[data-case]'); if (b) openCase(b.dataset.case); });
  $('#items').addEventListener('click', e => { const b = e.target.closest('[data-index]'); if (!b) return; const i = Number(b.dataset.index); const [g] = state.inventory.splice(i,1); if (g) { state.balance += g.value; update(); } });
  $('#claim').addEventListener('click', () => { if (pendingGift) state.inventory.unshift({ ...pendingGift, uid: Date.now() + Math.random() }); pendingGift = null; closeModal(); update(); });
  $('#close').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', e => { if (e.target === $('#modal')) closeModal(); });
  function showTab(tab) {
    $$('.view').forEach(v => v.classList.toggle('active', v.id === tab));
    $$('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    stopGames();
  }
  $$('[data-tab]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  $$('[data-go]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.go)));
  $('#daily').addEventListener('click', () => {
    const today = new Date().toISOString().slice(0,10);
    if (state.lastDaily === today) { alert('Ежедневный бонус уже получен.'); return; }
    state.lastDaily = today; state.balance += 100; update(); alert('Получено +100 виртуальных звёзд!');
  });
  function stopGames() { gameCleanups.forEach(fn => { try { fn(); } catch {} }); gameCleanups = []; if (timer) { clearTimeout(timer); timer = null; } }
  function stage(html) { stopGames(); const s = $('#stage'); s.classList.remove('hidden'); s.innerHTML = html; s.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
  function reward(points, message) { state.games++; state.score += points; state.balance += points; update(); const m = $('#gameMessage'); if (m) m.textContent = `${message} +${points} ✦`; }
  $('#tapStart').addEventListener('click', () => {
