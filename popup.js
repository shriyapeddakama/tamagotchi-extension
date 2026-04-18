// BuddyTime Popup

const ANIMALS = {
  cat:   { normal:'🐱', work:'🐱', happy:'😸', sad:'🙀', angry:'😾', name:'Whiskers' },
  dog:   { normal:'🐶', work:'🐶', happy:'🐶', sad:'🐶', angry:'🐶', name:'Biscuit'  },
  bunny: { normal:'🐰', work:'🐰', happy:'🐰', sad:'🐰', angry:'🐰', name:'Fluffles' },
  bear:  { normal:'🐻', work:'🐻', happy:'🐻', sad:'🐻', angry:'🐻', name:'Boba'     },
  fox:   { normal:'🦊', work:'🦊', happy:'🦊', sad:'🦊', angry:'🦊', name:'Rusty'    },
  panda: { normal:'🐼', work:'🐼', happy:'🐼', sad:'🐼', angry:'🐼', name:'Mochi'    },
  duck:  { normal:'🐥', work:'🐥', happy:'🐥', sad:'🐥', angry:'🐥', name:'Quacky'   },
  frog:  { normal:'🐸', work:'🐸', happy:'🐸', sad:'🐸', angry:'🐸', name:'Lily'     },
};

const MESSAGES = {
  motivational: {
    idle:     ["Let's crush some goals today! 💪","You've got this!","Another day, another W!","I believe in you SO much! 🌟"],
    work:     ["YESSS you're in the zone! 🔥","Look at you GOOO!","This focus is IMMACULATE 👏","Legend behavior right here!"],
    social:   ["Taking a lil scroll break? 😏","Social media time! 🫶","Just checking the vibes?"],
    warning:  ["That's been a while on social 👀","Maybe time to switch back?","Your goals are waiting! 💫"],
    over:     ["We really gotta get back to work 😤","Future-you is worried rn","Every minute counts! 💪"],
    pet:      ["Teehee! 🌟","*purrs productively*","Okay I'm cute, now focus! 😤"],
    taskdone: ["YESSSSS! Task crushed! 🏆","That's what I'm talking about! 🔥","GOAT behavior 🐐"],
  },
  gentle: {
    idle:     ["Hi there 💕 How are you?","Take your time 🌸","I'm here whenever you're ready~","Sending warm vibes ✨"],
    work:     ["You're doing wonderfully 🌸","Soft work hours activated 🕯️","Proud of you 💕"],
    social:   ["A little scroll? That's okay 🌿","Rest is important~","A soft break 🍵"],
    warning:  ["Just a gentle nudge… 🌸","Whenever you're ready~","Your tasks are waiting 💌"],
    over:     ["Maybe time to come back? 🥺","Your goals miss you 🌷","I believe in you 💫"],
    pet:      ["Oh! 🌸 *nuzzles softly*","Heehee~ 🌿","You're so sweet 💕"],
    taskdone: ["Beautiful work 🌸","So proud of you~","One step at a time 💕"],
  },
  dramatic: {
    idle:     ["Oh! You're here! I was SO worried 😭","I've been waiting and HOPING 🥹","Finally... my heart can rest 😮‍💨"],
    work:     ["You're WORKING?! *happy tears* 😭💕","This is the BEST DAY!","My faith grows STRONGER 💪😭"],
    social:   ["Oh no… social media again? 😬","This is fine. I'm fine. 😶","My anxiety is SPIKING 😰"],
    warning:  ["That's been a WHILE 😰","I am BEGGING you to work 🥺","My heart CANNOT take this 😭"],
    over:     ["NO NO NO please come back 😭","I'm SPIRALING 😭","PLEASE. I'm on my KNEES. 😭"],
    pet:      ["OH! A PET! *faints from joy* 😭","The highlight of my LIFE 🥹","I will treasure this FOREVER 😭💕"],
    taskdone: ["I'M SOBBING. Of JOY! 😭🎉","THE MOST INCREDIBLE THING!","I KNEW YOU COULD! 😭💕"],
  },
  sassy: {
    idle:     ["Oh, you're finally here 💅","Took your time 😏","Well well well.","I was NOT worried. 😒"],
    work:     ["Okay fine, you're working 💅","Look who's being productive","I guess you DO have it together 😌"],
    social:   ["Mhm. Social media. Shocking. 💀","Oh wow, Instagram. Never seen that 😏","Doom-scrolling again? Iconic."],
    warning:  ["Bestie… that's a lot of social time 💅","I'm not mad. Okay I'm a little mad 😒","Your goals filed a missing persons report."],
    over:     ["BESTIE. W H A T 💀","Your future self would like a word 🙄","SO over the limit rn, not cute"],
    pet:      ["Did you just— okay fine 😒","I don't even like that 💅 (I loved it)","Ugh fine, I'll allow it 😤"],
    taskdone: ["Took long enough 💅 (proud of you)","Okay FINE that was impressive 😤","Don't let it go to your head… nice work"],
  },
};

const SOCIAL_DOMAINS = ['twitter.com','x.com','facebook.com','instagram.com','tiktok.com',
  'reddit.com','youtube.com','snapchat.com','pinterest.com','tumblr.com','linkedin.com','twitch.tv'];

const SITE_ICONS = {
  'youtube.com':'▶️','twitter.com':'🐦','x.com':'🐦','instagram.com':'📸',
  'facebook.com':'👤','reddit.com':'🤖','tiktok.com':'🎵','twitch.tv':'🎮',
  'linkedin.com':'💼','pinterest.com':'📌','snapchat.com':'👻','tumblr.com':'📝',
  'github.com':'🐙','google.com':'🔍','notion.so':'📓','slack.com':'💬',
  'discord.com':'🎧','spotify.com':'🎵','netflix.com':'🎬','docs.google.com':'📄'
};

const SITE_COLORS = ['#FF8B6A','#5DCB7A','#C8B8F0','#FFD4B2','#B8E4F0','#FFB347','#A8D8EA','#F4A7B9'];

const state = {
  animal: 'cat', personality: 'motivational', isWorkMode: false,
  totalOnlineTime: 0, productiveTime: 0, socialTime: 0,
  socialLimit: 30, tasks: [], currentTab: '', siteTime: {}
};
let currentMood = '';

// ── helpers ──────────────────────────────────────────────
function fmtTime(s) {
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
  if (h > 0) return h+'h '+m+'m';
  if (m > 0) return m+'m';
  return sec+'s';
}
function fmtHours(s) {
  const h = s/3600;
  if (h >= 1) return h.toFixed(1).replace(/\.0$/,'')+'h';
  return Math.floor(s/60)+'m';
}
function isSocial(url) {
  if (!url) return false;
  try { const d = new URL(url).hostname.replace('www.',''); return SOCIAL_DOMAINS.some(s => d.includes(s)); }
  catch { return false; }
}
function rand(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ── init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  wireNav();
  wireHome();
  wireTasks();
  wireSettings();
  renderBuddy();
  renderTasks();
  updateStats();
  startTicking();
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SOCIAL_OVER_LIMIT') triggerAngry();
    if (msg.type === 'TAB_CHANGED') { state.currentTab = msg.url; }
  });
});

function loadState() {
  return new Promise(resolve => {
    chrome.storage.local.get(null, data => {
      if (data.animal)          state.animal          = data.animal;
      if (data.personality)     state.personality     = data.personality;
      if (data.isWorkMode!=null) state.isWorkMode     = data.isWorkMode;
      if (data.totalOnlineTime) state.totalOnlineTime = data.totalOnlineTime;
      if (data.productiveTime)  state.productiveTime  = data.productiveTime;
      if (data.socialTime)      state.socialTime      = data.socialTime;
      if (data.socialLimit)     state.socialLimit     = data.socialLimit;
      if (data.tasks)           state.tasks           = data.tasks;
      if (data.currentTab)      state.currentTab      = data.currentTab;
      if (data.siteTime)        state.siteTime        = data.siteTime;
      // sync settings UI
      document.querySelectorAll('.animal-option').forEach(el =>
        el.classList.toggle('selected', el.dataset.animal === state.animal));
      document.querySelectorAll('.personality-option').forEach(el =>
        el.classList.toggle('selected', el.dataset.p === state.personality));
      document.getElementById('social-limit-input').value = state.socialLimit;
      document.getElementById('social-limit-label').textContent = state.socialLimit;
      resolve();
    });
  });
}

function startTicking() {
  setInterval(() => {
    chrome.storage.local.get(
      ['totalOnlineTime','productiveTime','socialTime','currentTab','siteTime'],
      data => {
        state.totalOnlineTime = data.totalOnlineTime || 0;
        state.productiveTime  = data.productiveTime  || 0;
        state.socialTime      = data.socialTime      || 0;
        state.currentTab      = data.currentTab      || '';
        state.siteTime        = data.siteTime        || {};
        updateStats();
        updateMood();
      }
    );
  }, 1000);
}

// ── nav ───────────────────────────────────────────────────
function wireNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('page-'+page).classList.add('active');
      btn.classList.add('active');
      if (page === 'stats') renderStats();
    });
  });
}

// ── buddy ─────────────────────────────────────────────────
function renderBuddy() {
  const a = ANIMALS[state.animal];
  document.getElementById('buddy-name').textContent = a.name;
  document.getElementById('buddy-emoji').textContent = a.normal;
  showMessage('idle');
}

function showMessage(key) {
  const msgs = MESSAGES[state.personality][key];
  if (!msgs) return;
  const bubble = document.getElementById('speech-bubble');
  bubble.style.opacity = '0';
  setTimeout(() => { bubble.textContent = rand(msgs); bubble.style.opacity = '1'; }, 150);
}

function setBuddyMood(mood, msgKey) {
  const el = document.getElementById('buddy-emoji');
  el.className = 'buddy-emoji ' + mood;
  const a = ANIMALS[state.animal];
  el.textContent = a[mood] || a.normal;
  if (msgKey) showMessage(msgKey);
}

function updateMood() {
  const socialMin = state.socialTime / 60;
  const over   = socialMin > state.socialLimit;
  const near   = socialMin > state.socialLimit * 0.75;
  const onSocial = isSocial(state.currentTab);
  let mood, msgKey;
  if (state.isWorkMode)        { mood='work';   msgKey='work';    }
  else if (over && onSocial)   { mood='angry';  msgKey='over';    }
  else if (near && onSocial)   { mood='sad';    msgKey='warning'; }
  else if (onSocial)           { mood='normal'; msgKey='social';  }
  else                         { mood='normal'; msgKey=null;      }
  if (mood !== currentMood) { currentMood=mood; setBuddyMood(mood, msgKey); }
}

function triggerAngry() { setBuddyMood('angry','over'); }

function petBuddy() {
  const el = document.getElementById('buddy-emoji');
  const a = ANIMALS[state.animal];
  const old = el.textContent;
  el.textContent = a.happy;
  el.style.transform = 'scale(1.25) rotate(8deg)';
  setTimeout(() => { el.style.transform = 'scale(1) rotate(-5deg)'; }, 120);
  setTimeout(() => { el.style.transform = ''; }, 240);
  showMessage('pet');
  setTimeout(() => { if (!state.isWorkMode) el.textContent = old; }, 2000);
}

// ── home wiring ───────────────────────────────────────────
function wireHome() {
  document.getElementById('buddy-emoji').addEventListener('click', petBuddy);
  document.getElementById('work-btn').addEventListener('click', toggleWorkMode);
}

function toggleWorkMode() {
  state.isWorkMode = !state.isWorkMode;
  chrome.storage.local.set({ isWorkMode: state.isWorkMode });
  if (state.isWorkMode) {
    setBuddyMood('work','work');
    document.getElementById('work-badge').style.display = 'flex';
  } else {
    currentMood = '';
    updateMood();
    document.getElementById('work-badge').style.display = 'none';
  }
  updateStats();
}

function updateStats() {
  document.getElementById('stat-total-val').textContent  = fmtTime(state.totalOnlineTime);
  document.getElementById('stat-work-val').textContent   = fmtTime(state.productiveTime);
  document.getElementById('stat-social-val').textContent = fmtTime(state.socialTime);
  document.getElementById('session-time').textContent    = fmtTime(state.totalOnlineTime);

  const pct = Math.min((state.socialTime/60 / state.socialLimit)*100, 100);
  const fill = document.getElementById('social-bar-fill');
  const bar  = document.getElementById('social-bar');
  fill.style.width = pct+'%';
  if (pct >= 100) { fill.style.background='#FF5050'; bar.className='social-bar danger'; document.getElementById('stat-social').classList.add('social-over'); }
  else if (pct>=75) { fill.style.background='#FFB347'; bar.className='social-bar warning'; document.getElementById('stat-social').classList.remove('social-over'); }
  else { fill.style.background='var(--mint-dark)'; bar.className='social-bar'; document.getElementById('stat-social').classList.remove('social-over'); }

  document.getElementById('social-bar-label').textContent = Math.floor(state.socialTime/60)+'m / '+state.socialLimit+'m';
  document.getElementById('work-btn-icon').textContent = state.isWorkMode ? '🛑' : '🎽';
  document.getElementById('work-btn-text').textContent = state.isWorkMode ? 'Stop Focus Mode' : 'Start Focus Mode';
  document.getElementById('work-btn').classList.toggle('active', state.isWorkMode);
}

// ── settings ──────────────────────────────────────────────
function wireSettings() {
  document.querySelectorAll('.animal-option').forEach(el => {
    el.addEventListener('click', () => {
      state.animal = el.dataset.animal;
      document.querySelectorAll('.animal-option').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      renderBuddy();
    });
  });
  document.querySelectorAll('.personality-option').forEach(el => {
    el.addEventListener('click', () => {
      state.personality = el.dataset.p;
      document.querySelectorAll('.personality-option').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      showMessage('idle');
    });
  });
  document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
}

function saveSettings() {
  const limit = parseInt(document.getElementById('social-limit-input').value,10) || 30;
  state.socialLimit = limit;
  chrome.storage.local.set({ animal:state.animal, personality:state.personality, socialLimit:limit }, () => {
    const btn = document.getElementById('save-settings-btn');
    btn.textContent = '✅ Saved!';
    btn.style.background = btn.style.borderColor = '#5DCB7A';
    setTimeout(() => { btn.textContent='💾 Save Settings'; btn.style.background=btn.style.borderColor=''; }, 1500);
  });
  document.getElementById('social-limit-label').textContent = limit;
}

// ── tasks ─────────────────────────────────────────────────
function wireTasks() {
  document.getElementById('add-task-btn').addEventListener('click', addTask);
  document.getElementById('task-input').addEventListener('keydown', e => { if(e.key==='Enter') addTask(); });
  document.getElementById('clear-done-btn').addEventListener('click', clearDone);
}

function renderTasks() {
  const list    = document.getElementById('tasks-list');
  const statsEl = document.getElementById('tasks-stats');
  if (state.tasks.length === 0) {
    list.innerHTML = '<div class="tasks-empty"><span class="em">📋</span>No tasks yet! Add something to work on.</div>';
    statsEl.style.display = 'none';
    return;
  }
  const done = state.tasks.filter(t=>t.done).length;
  document.getElementById('tasks-done-count').textContent  = done;
  document.getElementById('tasks-total-count').textContent = state.tasks.length;
  statsEl.style.display = 'flex';
  list.innerHTML = state.tasks.map((task,i) => `
    <div class="task-item ${task.done?'done':''}">
      <div class="task-check ${task.done?'checked':''}" data-action="toggle" data-idx="${i}">${task.done?'✓':''}</div>
      <div class="task-text" data-action="toggle" data-idx="${i}">${escHtml(task.text)}</div>
      <button class="task-delete" data-action="delete" data-idx="${i}">✕</button>
    </div>`).join('');
  list.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.idx,10);
      if (el.dataset.action==='toggle') toggleTask(idx);
      if (el.dataset.action==='delete') deleteTask(idx);
    });
  });
}

function addTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();
  if (!text) return;
  state.tasks.unshift({ id:Date.now(), text, done:false });
  saveTasks(); renderTasks();
  input.value = ''; input.focus();
}

function toggleTask(i) {
  state.tasks[i].done = !state.tasks[i].done;
  if (state.tasks[i].done) {
    showMessage('taskdone');
    setBuddyMood('happy',null);
    setTimeout(() => { currentMood=''; updateMood(); }, 2000);
  }
  saveTasks(); renderTasks();
}

function deleteTask(i) { state.tasks.splice(i,1); saveTasks(); renderTasks(); }
function clearDone()   { state.tasks = state.tasks.filter(t=>!t.done); saveTasks(); renderTasks(); }
function saveTasks()   { chrome.storage.local.set({ tasks:state.tasks }); }

// ── stats page ────────────────────────────────────────────
function renderStats() {
  const siteTime = state.siteTime || {};
  const sorted = Object.entries(siteTime)
    .filter(([,t]) => t >= 5)
    .sort((a,b) => b[1]-a[1])
    .slice(0,15);

  // Totals
  document.getElementById('st-total').textContent   = fmtHours(state.totalOnlineTime);
  document.getElementById('st-focus').textContent   = fmtHours(state.productiveTime);
  document.getElementById('st-social').textContent  = fmtHours(state.socialTime);
  const score = state.totalOnlineTime > 0 ? Math.round(state.productiveTime/state.totalOnlineTime*100) : null;
  document.getElementById('st-score').textContent   = score !== null ? score+'%' : '—';

  // Bar chart — hourly breakdown (last 8 hours buckets)
  renderTimeChart();

  // Site list
  const siteEl = document.getElementById('site-list');
  siteEl.innerHTML = '';
  if (sorted.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'site-empty';
    empty.textContent = 'No site data yet — browse around and come back!';
    siteEl.appendChild(empty);
    return;
  }
  const maxT = sorted[0][1];
  sorted.forEach(([site, t], i) => {
    const isSocialSite = SOCIAL_DOMAINS.some(d => site.includes(d));
    const color = isSocialSite ? 'var(--coral)' : SITE_COLORS[i % SITE_COLORS.length];
    const icon = Object.entries(SITE_ICONS).find(([d]) => site.includes(d));

    const row      = document.createElement('div');    row.className = 'site-row';
    const favWrap  = document.createElement('div');    favWrap.className = 'site-favicon';
    favWrap.textContent = icon ? icon[1] : '🌐';
    const info     = document.createElement('div');    info.className = 'site-info';
    const name     = document.createElement('div');    name.className = 'site-name'; name.textContent = site;
    const barWrap  = document.createElement('div');    barWrap.className = 'site-bar-wrap';
    const barInner = document.createElement('div');    barInner.className = 'site-bar-inner';
    barInner.style.width = (t/maxT*100).toFixed(1)+'%';
    barInner.style.background = color;
    barWrap.appendChild(barInner);
    info.appendChild(name); info.appendChild(barWrap);
    const timeEl   = document.createElement('div');    timeEl.className = 'site-time'; timeEl.textContent = fmtHours(t);
    row.appendChild(favWrap); row.appendChild(info); row.appendChild(timeEl);
    siteEl.appendChild(row);
  });
}

function renderTimeChart() {
  const chartEl = document.getElementById('time-chart');
  if (!chartEl) return;
  chartEl.innerHTML = '';

  // Simple 3-bar chart: total, focused, social
  const bars = [
    { label:'Total',   val: state.totalOnlineTime, color:'var(--coral)'     },
    { label:'Focused', val: state.productiveTime,  color:'var(--mint-dark)' },
    { label:'Social',  val: state.socialTime,      color:'var(--lavender)'  },
  ];
  const maxVal = Math.max(...bars.map(b=>b.val), 1);
  bars.forEach(b => {
    const pct = (b.val/maxVal*100).toFixed(1);
    const col = document.createElement('div'); col.className='tchart-col';
    const bar = document.createElement('div'); bar.className='tchart-bar';
    bar.style.height = pct+'%'; bar.style.background = b.color;
    bar.title = fmtHours(b.val);
    const lbl = document.createElement('div'); lbl.className='tchart-lbl'; lbl.textContent = b.label;
    const val = document.createElement('div'); val.className='tchart-val'; val.textContent = fmtHours(b.val);
    col.appendChild(bar); col.appendChild(lbl); col.appendChild(val);
    chartEl.appendChild(col);
  });
}
