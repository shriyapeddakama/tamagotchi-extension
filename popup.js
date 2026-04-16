// BuddyTime Popup — CSP-compliant, all listeners via addEventListener

// ===== DATA =====
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
    idle:     ["Let's crush some goals today! 💪","You've got this! What are we working on?","Another day, another W! Ready?","I believe in you SO much! 🌟"],
    work:     ["YESSS you're in the zone! 🔥","Look at you GOOO! Crushing it!","This focus is IMMACULATE 👏","Legend behavior right here!","Work work work, let's GOOO 🚀"],
    social:   ["Taking a lil scroll break, hm? 😏","Social media time! Enjoy it 🫶","Just checking in on the vibes?"],
    warning:  ["Heyyyy that's been a while on social 👀","Okay bestie, maybe time to switch back?","Your goals are waiting for you! 💫"],
    over:     ["OKAY we really gotta go back to work 😤","Future-you is sending worried looks rn","Every minute counts! Let's pivot! 💪"],
    pet:      ["Teehee! Focus time! 🌟","*purrs productively*","Hehe, now let's GET BACK TO IT!","Okay okay I'm cute, now focus! 😤"],
    taskdone: ["YESSSSS! Task crushed! 🏆","That's what I'm talking about!!! 🔥","GOAT behavior, truly 🐐"],
  },
  gentle: {
    idle:     ["Hi there 💕 How are you feeling?","Take your time, no rush 🌸","I'm here whenever you're ready~","Sending warm vibes your way ✨"],
    work:     ["You're doing wonderfully 🌸","Gently staying focused, love it~","Soft work hours activated 🕯️","Proud of you, every little bit counts 💕"],
    social:   ["Enjoying a little scroll? That's okay 🌿","Rest is important too~","Taking a soft break, I see you 🍵"],
    warning:  ["Just a gentle nudge… maybe soon? 🌸","Whenever you're ready to refocus~","Your tasks are patiently waiting 💌"],
    over:     ["Hey… maybe it's time to come back? 🥺","No pressure, but… your goals miss you 🌷","I believe you can do this 💫"],
    pet:      ["Oh! 🌸 *nuzzles softly*","Heehee~ that tickles 🌿","You're so sweet 💕"],
    taskdone: ["Beautiful work 🌸","So proud of you~","One step at a time 💕"],
  },
  dramatic: {
    idle:     ["Oh! You're here! I was SO worried 😭","I've been waiting... and HOPING 🥹","Finally... my heart can rest 😮‍💨"],
    work:     ["You're WORKING?! *happy tears* 😭💕","This is the BEST DAY!","I'm not crying, YOU'RE crying 🥹","My faith in you grows STRONGER 💪😭"],
    social:   ["Oh no… are we on social media again? 😬","This is fine. I'm fine. Really. 😶","My anxiety is SPIKING but I trust you!"],
    warning:  ["*clutches pearls* That's been a WHILE 😰","I am BEGGING you to go back to work 🥺","My heart CANNOT take this 😭"],
    over:     ["NO NO NO please come back 😭😭😭","I'm SPIRALING. Your goals are SUFFERING!","PLEASE. I'm on my KNEES. 😭"],
    pet:      ["OH! A PET! *faints from joy* 😭✨","This is the highlight of my LIFE 🥹","I will treasure this FOREVER 😭💕"],
    taskdone: ["I'M SOBBING. Of JOY! 😭🎉","THE MOST INCREDIBLE THING!","I KNEW YOU COULD DO IT 😭💕"],
  },
  sassy: {
    idle:     ["Oh, you're finally here 💅","Took your time, didn't you 😏","Well well well, look who showed up","I was NOT worried. I was NOT. 😒"],
    work:     ["Okay fine, you're actually working 💅","Look who decided to be productive, love that","I guess you DO have it together sometimes 😌","Work era, we love to see it 💁"],
    social:   ["Mhm. Social media. Shocking. 💀","Oh wow, Instagram. Never seen that before 😏","Are we doom-scrolling again? Iconic."],
    warning:  ["Bestie… that's kind of a lot of social time 💅","I'm not mad, I'm just… okay I'm a little mad 😒","Your goals called. They're filing a missing persons report."],
    over:     ["BESTIE. W H A T are you doing 💀","Your future self would like a word 🙄","Oh we are SO over the limit rn, not cute"],
    pet:      ["Did you just— okay fine that was cute 😒","Stop, I don't even like that 💅 (I loved it)","Ugh fine, I'll allow it 😤"],
    taskdone: ["Took you long enough 💅 (I'm proud of you)","Okay FINE that was impressive 😤","Don't let it go to your head… nice work"],
  },
};

const SOCIAL_DOMAINS = ['twitter.com','x.com','facebook.com','instagram.com','tiktok.com',
  'reddit.com','youtube.com','snapchat.com','pinterest.com','tumblr.com','linkedin.com','twitch.tv'];

// ===== STATE =====
const state = {
  animal: 'cat', personality: 'motivational', isWorkMode: false,
  totalOnlineTime: 0, productiveTime: 0, socialTime: 0,
  socialLimit: 30, tasks: [], currentTab: '',
};
let currentMood = '';

// ===== HELPERS =====
function fmtTime(s) {
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
  if (h > 0) return h+'h '+m+'m';
  if (m > 0) return m+'m';
  return sec+'s';
}

function isSocialDomain(url) {
  if (!url) return false;
  try {
    const d = new URL(url).hostname.replace('www.','');
    return SOCIAL_DOMAINS.some(s => d.includes(s));
  } catch { return false; }
}

function rand(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  wireNavTabs();
  wireHome();
  wireTasks();
  wireSettings();
  renderBuddy();
  renderTasks();
  updateStats();
  startTicking();

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SOCIAL_OVER_LIMIT') triggerOverLimitReaction();
    if (msg.type === 'TAB_CHANGED') { state.currentTab = msg.url; state.isSocial = msg.isSocial; }
  });
});

async function loadState() {
  return new Promise(resolve => {
    chrome.storage.local.get(null, data => {
      if (data.animal)            state.animal          = data.animal;
      if (data.personality)       state.personality     = data.personality;
      if (data.isWorkMode != null) state.isWorkMode     = data.isWorkMode;
      if (data.totalOnlineTime)   state.totalOnlineTime = data.totalOnlineTime;
      if (data.productiveTime)    state.productiveTime  = data.productiveTime;
      if (data.socialTime)        state.socialTime      = data.socialTime;
      if (data.socialLimit)       state.socialLimit     = data.socialLimit;
      if (data.tasks)             state.tasks           = data.tasks;
      if (data.currentTab)        state.currentTab      = data.currentTab;

      // Sync settings UI to loaded state
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
      ['totalOnlineTime','productiveTime','socialTime','currentTab'],
      data => {
        state.totalOnlineTime = data.totalOnlineTime || 0;
        state.productiveTime  = data.productiveTime  || 0;
        state.socialTime      = data.socialTime      || 0;
        state.currentTab      = data.currentTab      || '';
        updateStats();
        updateMood();
      }
    );
  }, 1000);
}

// ===== WIRE NAV TABS =====
function wireNavTabs() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('page-' + page).classList.add('active');
      btn.classList.add('active');
    });
  });
}

// ===== WIRE HOME =====
function wireHome() {
  document.getElementById('buddy-emoji').addEventListener('click', petBuddy);
  document.getElementById('work-btn').addEventListener('click', toggleWorkMode);
}

// ===== WIRE TASKS =====
function wireTasks() {
  document.getElementById('add-task-btn').addEventListener('click', addTask);
  document.getElementById('task-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });
  document.getElementById('clear-done-btn').addEventListener('click', clearDone);
}

// ===== WIRE SETTINGS =====
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

// ===== BUDDY =====
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
  bubble.style.transform = 'translateY(4px)';
  setTimeout(() => {
    bubble.textContent = rand(msgs);
    bubble.style.opacity = '1';
    bubble.style.transform = 'translateY(0)';
  }, 150);
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
  const over      = socialMin > state.socialLimit;
  const near      = socialMin > state.socialLimit * 0.75;
  const social    = isSocialDomain(state.currentTab);

  let mood, msgKey;
  if (state.isWorkMode)      { mood = 'work';   msgKey = 'work';    }
  else if (over && social)   { mood = 'angry';  msgKey = 'over';    }
  else if (near && social)   { mood = 'sad';    msgKey = 'warning'; }
  else if (social)           { mood = 'normal'; msgKey = 'social';  }
  else                       { mood = 'normal'; msgKey = null;       }

  if (mood !== currentMood) {
    currentMood = mood;
    setBuddyMood(mood, msgKey);
  }
}

function triggerOverLimitReaction() {
  setBuddyMood('angry', 'over');
}

function petBuddy() {
  const el = document.getElementById('buddy-emoji');
  const a = ANIMALS[state.animal];
  const old = el.textContent;
  el.textContent = a.happy;
  el.style.transition = 'transform 0.15s';
  el.style.transform = 'scale(1.25) rotate(8deg)';
  setTimeout(() => { el.style.transform = 'scale(1) rotate(-5deg)'; }, 120);
  setTimeout(() => { el.style.transform = ''; }, 240);
  showMessage('pet');
  setTimeout(() => { if (!state.isWorkMode) el.textContent = old; }, 2000);
}

// ===== WORK MODE =====
function toggleWorkMode() {
  state.isWorkMode = !state.isWorkMode;
  chrome.storage.local.set({ isWorkMode: state.isWorkMode });
  if (state.isWorkMode) {
    setBuddyMood('work', 'work');
    document.getElementById('work-badge').style.display = 'flex';
  } else {
    currentMood = '';
    updateMood();
    document.getElementById('work-badge').style.display = 'none';
  }
  updateStats();
}

// ===== STATS =====
function updateStats() {
  document.getElementById('stat-total-val').textContent  = fmtTime(state.totalOnlineTime);
  document.getElementById('stat-work-val').textContent   = fmtTime(state.productiveTime);
  document.getElementById('stat-social-val').textContent = fmtTime(state.socialTime);
  document.getElementById('session-time').textContent    = fmtTime(state.totalOnlineTime);

  const socialMin = state.socialTime / 60;
  const pct = Math.min((socialMin / state.socialLimit) * 100, 100);
  const fill = document.getElementById('social-bar-fill');
  const bar  = document.getElementById('social-bar');

  fill.style.width = pct + '%';
  if (pct >= 100) {
    fill.style.background = '#FF5050';
    bar.className = 'social-bar danger';
    document.getElementById('stat-social').classList.add('social-over');
  } else if (pct >= 75) {
    fill.style.background = '#FFB347';
    bar.className = 'social-bar warning';
    document.getElementById('stat-social').classList.remove('social-over');
  } else {
    fill.style.background = 'var(--mint-dark)';
    bar.className = 'social-bar';
    document.getElementById('stat-social').classList.remove('social-over');
  }

  document.getElementById('social-bar-label').innerHTML =
    Math.floor(socialMin) + 'm / <span id="social-limit-label">' + state.socialLimit + '</span>m';

  const btn = document.getElementById('work-btn');
  document.getElementById('work-btn-icon').textContent = state.isWorkMode ? '🛑' : '🎽';
  document.getElementById('work-btn-text').textContent = state.isWorkMode ? 'Stop Focus Mode' : 'Start Focus Mode';
  btn.classList.toggle('active', state.isWorkMode);
}

// ===== SETTINGS =====
function saveSettings() {
  const limit = parseInt(document.getElementById('social-limit-input').value, 10) || 30;
  state.socialLimit = limit;
  chrome.storage.local.set({ animal: state.animal, personality: state.personality, socialLimit: limit }, () => {
    const btn = document.getElementById('save-settings-btn');
    btn.textContent = '✅ Saved!';
    btn.style.background = btn.style.borderColor = 'var(--mint-dark)';
    setTimeout(() => {
      btn.textContent = '💾 Save Settings';
      btn.style.background = btn.style.borderColor = 'var(--coral)';
    }, 1500);
  });
}

// ===== TASKS =====
function renderTasks() {
  const list     = document.getElementById('tasks-list');
  const statsEl  = document.getElementById('tasks-stats');

  if (state.tasks.length === 0) {
    list.innerHTML = `<div class="tasks-empty"><span class="em">📋</span>No tasks yet! Add something to work on.</div>`;
    statsEl.style.display = 'none';
    return;
  }

  const done = state.tasks.filter(t => t.done).length;
  document.getElementById('tasks-done-count').textContent  = done;
  document.getElementById('tasks-total-count').textContent = state.tasks.length;
  statsEl.style.display = 'flex';

  list.innerHTML = state.tasks.map((task, i) => `
    <div class="task-item ${task.done ? 'done' : ''}" data-idx="${i}">
      <div class="task-check ${task.done ? 'checked' : ''}" data-action="toggle" data-idx="${i}">
        ${task.done ? '✓' : ''}
      </div>
      <div class="task-text" data-action="toggle" data-idx="${i}">${escHtml(task.text)}</div>
      <button class="task-delete" data-action="delete" data-idx="${i}" title="Delete">✕</button>
    </div>
  `).join('');

  // Wire task item clicks via delegation
  list.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', e => {
      const action = el.dataset.action;
      const idx    = parseInt(el.dataset.idx, 10);
      if (action === 'toggle') toggleTask(idx);
      if (action === 'delete') deleteTask(idx);
    });
  });
}

function addTask() {
  const input = document.getElementById('task-input');
  const text  = input.value.trim();
  if (!text) return;
  state.tasks.unshift({ id: Date.now(), text, done: false, createdAt: Date.now() });
  saveTasks();
  renderTasks();
  input.value = '';
  input.focus();
}

function toggleTask(i) {
  state.tasks[i].done = !state.tasks[i].done;
  if (state.tasks[i].done) {
    showMessage('taskdone');
    setBuddyMood('happy', null);
    setTimeout(() => { currentMood = ''; updateMood(); }, 2000);
  }
  saveTasks();
  renderTasks();
}

function deleteTask(i) {
  state.tasks.splice(i, 1);
  saveTasks();
  renderTasks();
}

function clearDone() {
  state.tasks = state.tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  chrome.storage.local.set({ tasks: state.tasks });
}
