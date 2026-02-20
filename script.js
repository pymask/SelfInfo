const tracks = [
  { title: "专注时刻 · SoundHelix 1", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "放松片刻 · SoundHelix 2", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "夜晚灵感 · SoundHelix 3", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

const defaultModules = [
  {
    id: "study",
    navLabel: "学习经历",
    title: "📚 学习经历",
    type: "timeline",
    description: "学习是持续迭代的过程。",
    items: [
      { id: crypto.randomUUID(), title: "2020 - 2024 · 计算机科学本科", meta: "", content: "系统学习算法、操作系统、数据库与软件工程。", done: false },
      { id: crypto.randomUUID(), title: "2024 - 至今 · AI + 全栈方向深耕", meta: "", content: "聚焦 AI 应用落地、前后端工程实践与产品体验。", done: false },
    ],
  },
  {
    id: "work",
    navLabel: "工作经历",
    title: "💼 工作经历",
    type: "cards",
    description: "专注交付有价值的产品。",
    items: [
      { id: crypto.randomUUID(), title: "全栈开发工程师", meta: "2024.01 - 至今", content: "负责需求、研发到上线全流程。", done: false },
    ],
  },
  {
    id: "thoughts",
    navLabel: "个人感想",
    title: "💭 个人感想",
    type: "quote",
    description: "记录思考，沉淀表达。",
    items: [
      { id: crypto.randomUUID(), title: "一句话", meta: "", content: "真正的成长，是把每个平凡日子都过成自己愿意回看的样子。", done: false },
    ],
  },
];

const defaultHero = {
  title: "你好，我是一个在代码与生活之间写诗的人。",
  description: "我把学习、工作、生活的片段都收藏在这里。希望你看见的，不只是履历，而是一个持续生长的人。",
};

const defaultAppearance = { theme: "default", background: "aurora", imageUrl: "" };

const articleStoreKey = "personal_site_articles";
const fileStoreKey = "personal_site_files";
const appearanceStoreKey = "personal_site_appearance";
const moduleStoreKey = "personal_site_modules";
const heroStoreKey = "personal_site_hero";

const audio = document.getElementById("audio");
const playlist = document.getElementById("playlist");
const navLinks = document.getElementById("nav-links");
const modulesContainer = document.getElementById("modules-container");
const statModuleCount = document.getElementById("stat-module-count");
const statItemCount = document.getElementById("stat-item-count");
const statArticleCount = document.getElementById("stat-article-count");

const heroTitle = document.getElementById("hero-title");
const heroDescription = document.getElementById("hero-description");
const heroForm = document.getElementById("hero-form");
const heroTitleInput = document.getElementById("hero-title-input");
const heroDescriptionInput = document.getElementById("hero-description-input");

const moduleForm = document.getElementById("module-form");
const moduleIdInput = document.getElementById("module-id");
const moduleNavLabelInput = document.getElementById("module-nav-label");
const moduleTitleInput = document.getElementById("module-title");
const moduleTypeInput = document.getElementById("module-type");
const moduleDescriptionInput = document.getElementById("module-description");
const moduleList = document.getElementById("module-list");
const cancelModuleEditBtn = document.getElementById("cancel-module-edit");

const itemForm = document.getElementById("item-form");
const itemIdInput = document.getElementById("item-id");
const itemModuleSelect = document.getElementById("item-module-select");
const itemTitleInput = document.getElementById("item-title");
const itemMetaInput = document.getElementById("item-meta");
const itemContentInput = document.getElementById("item-content");
const itemDoneInput = document.getElementById("item-done");
const itemList = document.getElementById("item-list");
const cancelItemEditBtn = document.getElementById("cancel-item-edit");

const articleForm = document.getElementById("article-form");
const titleInput = document.getElementById("article-title");
const contentInput = document.getElementById("article-content");
const articleList = document.getElementById("article-list");
const cancelEditBtn = document.getElementById("cancel-edit");

const fileInput = document.getElementById("file-input");
const fileList = document.getElementById("file-list");

const themeSelect = document.getElementById("theme-select");
const bgSelect = document.getElementById("bg-select");
const bgImageInput = document.getElementById("bg-image-url");
const applyThemeBtn = document.getElementById("apply-theme");
const resetThemeBtn = document.getElementById("reset-theme");

// --- Storage helpers ---
function readStorageJSON(key, fallbackValue) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallbackValue;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(key);
    return fallbackValue;
  }
}

let currentEditingId = null;
let currentModuleEditingId = null;
let currentItemEditingId = null;
let articles = readStorageJSON(articleStoreKey, []);
let files = readStorageJSON(fileStoreKey, []);
let modules = readStorageJSON(moduleStoreKey, null);
let heroData = readStorageJSON(heroStoreKey, null);
let appearance = readStorageJSON(appearanceStoreKey, null);

if (!Array.isArray(articles)) articles = [];
if (!Array.isArray(files)) files = [];
if (!Array.isArray(modules) || !modules.length) modules = structuredClone(defaultModules);
if (!heroData || typeof heroData !== "object") heroData = { ...defaultHero };
if (!appearance || typeof appearance !== "object") appearance = { ...defaultAppearance };
appearance = { ...defaultAppearance, ...appearance };

function saveModules() {
  localStorage.setItem(moduleStoreKey, JSON.stringify(modules));
}
function saveHero() {
  localStorage.setItem(heroStoreKey, JSON.stringify(heroData));
}
function saveArticles() {
  localStorage.setItem(articleStoreKey, JSON.stringify(articles));
}
function saveFiles() {
  localStorage.setItem(fileStoreKey, JSON.stringify(files));
}
function saveAppearance() {
  localStorage.setItem(appearanceStoreKey, JSON.stringify(appearance));
}


// --- Renderers ---
function renderPlaylist() {
  playlist.innerHTML = "";
  tracks.forEach((track, index) => {
    const button = document.createElement("button");
    button.className = "track";
    button.type = "button";
    button.textContent = track.title;
    button.addEventListener("click", () => {
      audio.src = track.src;
      audio.play();
      [...document.querySelectorAll(".track")].forEach((item, i) => item.classList.toggle("active", i === index));
    });
    playlist.appendChild(button);
  });
  const first = playlist.querySelector(".track");
  if (first) first.classList.add("active");
}

function renderHero() {
  heroTitle.textContent = heroData.title;
  heroDescription.textContent = heroData.description;
  heroTitleInput.value = heroData.title;
  heroDescriptionInput.value = heroData.description;
}

function renderDynamicNav() {
  [...navLinks.querySelectorAll(".dynamic-nav")].forEach((item) => item.remove());
  const anchorMusic = navLinks.querySelector('a[href="#music"]')?.parentElement;
  modules.forEach((module) => {
    const li = document.createElement("li");
    li.className = "dynamic-nav";
    const a = document.createElement("a");
    a.href = `#${module.id}`;
    a.textContent = module.navLabel;
    li.appendChild(a);
    navLinks.insertBefore(li, anchorMusic);
  });
}

function createModuleItem(module, item) {
  const article = document.createElement("article");
  article.className = module.type === "cards" ? "card glass" : "glass";

  const h4 = document.createElement("h4");
  h4.textContent = item.title;
  article.appendChild(h4);

  if (item.meta) {
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = item.meta;
    article.appendChild(meta);
  }

  if (module.type === "quote") {
    const quote = document.createElement("blockquote");
    quote.textContent = `“${item.content}”`;
    article.appendChild(quote);
  } else {
    const p = document.createElement(module.type === "list" ? "li" : "p");
    p.textContent = item.content;
    if (module.type === "checklist") {
      p.textContent = `${item.done ? "✅" : "⬜"} ${item.content}`;
    }
    article.appendChild(p);
  }

  return article;
}

function renderModules() {
  modulesContainer.innerHTML = "";

  modules.forEach((module, index) => {
    const section = document.createElement("section");
    section.className = index % 2 === 0 ? "section" : "section alt";
    section.id = module.id;

    const h3 = document.createElement("h3");
    h3.textContent = module.title;
    section.appendChild(h3);

    if (module.description) {
      const desc = document.createElement("p");
      desc.textContent = module.description;
      section.appendChild(desc);
    }

    if (module.type === "list") {
      const ul = document.createElement("ul");
      ul.className = "list glass";
      module.items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.content;
        ul.appendChild(li);
      });
      section.appendChild(ul);
    } else if (module.type === "cards") {
      const cards = document.createElement("div");
      cards.className = "cards";
      module.items.forEach((item) => cards.appendChild(createModuleItem(module, item)));
      section.appendChild(cards);
    } else {
      const container = document.createElement("div");
      container.className = module.type === "timeline" ? "timeline" : "achievement-list";
      module.items.forEach((item) => container.appendChild(createModuleItem(module, item)));
      section.appendChild(container);
    }

    modulesContainer.appendChild(section);
  });

  statModuleCount.textContent = String(modules.length);
  statItemCount.textContent = String(modules.reduce((sum, module) => sum + module.items.length, 0));
}

function renderModuleManager() {
  moduleList.innerHTML = "";
  itemModuleSelect.innerHTML = "";

  modules.forEach((module) => {
    const card = document.createElement("article");
    card.className = "article-item";
    card.innerHTML = `<strong>${module.navLabel} · ${module.title}</strong><p class="file-meta">样式：${module.type} · ${module.items.length} 条内容</p>`;
    const actions = document.createElement("div");
    actions.className = "article-actions";

    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "编辑模块";
    edit.dataset.editModule = module.id;

    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "删除模块";
    del.dataset.deleteModule = module.id;

    actions.appendChild(edit);
    actions.appendChild(del);
    card.appendChild(actions);
    moduleList.appendChild(card);

    const option = document.createElement("option");
    option.value = module.id;
    option.textContent = `${module.navLabel} (${module.title})`;
    itemModuleSelect.appendChild(option);
  });

  if (modules.length && !itemModuleSelect.value) {
    itemModuleSelect.value = modules[0].id;
  }

  renderItemManager();
}

function renderItemManager() {
  itemList.innerHTML = "";
  const selectedId = itemModuleSelect.value;
  const module = modules.find((entry) => entry.id === selectedId);
  if (!module) return;

  module.items.forEach((item) => {
    const row = document.createElement("article");
    row.className = "article-item";
    row.innerHTML = `<strong>${item.title}</strong><p class="file-meta">${item.meta || "无补充信息"}</p><p class="article-content">${item.content}</p>`;
    const actions = document.createElement("div");
    actions.className = "article-actions";

    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "编辑";
    edit.dataset.editItem = item.id;

    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "删除";
    del.dataset.deleteItem = item.id;

    actions.appendChild(edit);
    actions.appendChild(del);
    row.appendChild(actions);
    itemList.appendChild(row);
  });
}

function renderArticles() {
  articleList.innerHTML = "";
  statArticleCount.textContent = String(articles.length);
  if (!articles.length) {
    articleList.innerHTML = '<p class="tip">还没有文章，开始发布第一篇吧。</p>';
    return;
  }
  [...articles]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((article) => {
      const item = document.createElement("article");
      item.className = "article-item";
      const date = new Date(article.updatedAt).toLocaleString("zh-CN");
      item.innerHTML = `<div class="article-head"><strong>${article.title}</strong><span class="file-meta">${date}</span></div><p class="article-content">${article.content}</p>`;
      const actions = document.createElement("div");
      actions.className = "article-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "编辑";
      edit.dataset.edit = article.id;
      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "删除";
      del.dataset.delete = article.id;
      actions.append(edit, del);
      item.appendChild(actions);
      articleList.appendChild(item);
    });
}

function renderFiles() {
  fileList.innerHTML = "";
  if (!files.length) {
    fileList.innerHTML = '<li class="tip">暂未上传文件。</li>';
    return;
  }
  files.forEach((file) => {
    const li = document.createElement("li");
    li.className = "file-item";
    li.innerHTML = `<div class="file-row"><div><strong>${file.name}</strong><p class="file-meta">${(file.size / 1024).toFixed(1)} KB · ${file.type || "未知类型"}</p></div><button class="file-remove" data-file-id="${file.id}" type="button">移除</button></div>`;
    fileList.appendChild(li);
  });
}

function applyAppearance() {
  document.body.dataset.theme = appearance.theme;
  document.body.dataset.bg = appearance.background;
  document.body.style.setProperty("--bg-image", appearance.imageUrl ? `url("${appearance.imageUrl}")` : "none");
}

function syncAppearanceControls() {
  themeSelect.value = appearance.theme;
  bgSelect.value = appearance.background;
  bgImageInput.value = appearance.imageUrl;
}


// --- Event bindings ---
heroForm.addEventListener("submit", (event) => {
  event.preventDefault();
  heroData = { title: heroTitleInput.value.trim(), description: heroDescriptionInput.value.trim() };
  saveHero();
  renderHero();
});

moduleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = {
    id: moduleIdInput.value || `module-${crypto.randomUUID().slice(0, 8)}`,
    navLabel: moduleNavLabelInput.value.trim(),
    title: moduleTitleInput.value.trim(),
    type: moduleTypeInput.value,
    description: moduleDescriptionInput.value.trim(),
    items: [],
  };

  if (currentModuleEditingId) {
    modules = modules.map((module) => (module.id === currentModuleEditingId ? { ...module, ...payload, items: module.items } : module));
  } else {
    modules.push(payload);
  }

  saveModules();
  moduleForm.reset();
  moduleTypeInput.value = "timeline";
  moduleIdInput.value = "";
  currentModuleEditingId = null;
  cancelModuleEditBtn.classList.add("hidden");
  renderAll();
});

moduleList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const editId = target.dataset.editModule;
  const deleteId = target.dataset.deleteModule;

  if (editId) {
    const module = modules.find((entry) => entry.id === editId);
    if (!module) return;
    currentModuleEditingId = editId;
    moduleIdInput.value = module.id;
    moduleNavLabelInput.value = module.navLabel;
    moduleTitleInput.value = module.title;
    moduleTypeInput.value = module.type;
    moduleDescriptionInput.value = module.description;
    cancelModuleEditBtn.classList.remove("hidden");
  }

  if (deleteId) {
    modules = modules.filter((entry) => entry.id !== deleteId);
    saveModules();
    renderAll();
  }
});

cancelModuleEditBtn.addEventListener("click", () => {
  currentModuleEditingId = null;
  moduleIdInput.value = "";
  moduleForm.reset();
  moduleTypeInput.value = "timeline";
  cancelModuleEditBtn.classList.add("hidden");
});

itemModuleSelect.addEventListener("change", renderItemManager);

itemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const module = modules.find((entry) => entry.id === itemModuleSelect.value);
  if (!module) return;

  const payload = {
    id: itemIdInput.value || crypto.randomUUID(),
    title: itemTitleInput.value.trim(),
    meta: itemMetaInput.value.trim(),
    content: itemContentInput.value.trim(),
    done: itemDoneInput.checked,
  };

  if (currentItemEditingId) {
    module.items = module.items.map((item) => (item.id === currentItemEditingId ? payload : item));
  } else {
    module.items.push(payload);
  }

  saveModules();
  itemForm.reset();
  itemIdInput.value = "";
  currentItemEditingId = null;
  cancelItemEditBtn.classList.add("hidden");
  renderAll();
});

itemList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const module = modules.find((entry) => entry.id === itemModuleSelect.value);
  if (!module) return;

  const editId = target.dataset.editItem;
  const deleteId = target.dataset.deleteItem;

  if (editId) {
    const item = module.items.find((entry) => entry.id === editId);
    if (!item) return;
    currentItemEditingId = editId;
    itemIdInput.value = item.id;
    itemTitleInput.value = item.title;
    itemMetaInput.value = item.meta;
    itemContentInput.value = item.content;
    itemDoneInput.checked = Boolean(item.done);
    cancelItemEditBtn.classList.remove("hidden");
  }

  if (deleteId) {
    module.items = module.items.filter((entry) => entry.id !== deleteId);
    saveModules();
    renderAll();
  }
});

cancelItemEditBtn.addEventListener("click", () => {
  currentItemEditingId = null;
  itemIdInput.value = "";
  itemForm.reset();
  cancelItemEditBtn.classList.add("hidden");
});

articleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) return;

  if (currentEditingId) {
    articles = articles.map((article) =>
      article.id === currentEditingId ? { ...article, title, content, updatedAt: Date.now() } : article,
    );
  } else {
    articles.push({ id: crypto.randomUUID(), title, content, updatedAt: Date.now() });
  }

  saveArticles();
  articleForm.reset();
  currentEditingId = null;
  cancelEditBtn.classList.add("hidden");
  renderArticles();
});

cancelEditBtn.addEventListener("click", () => {
  currentEditingId = null;
  articleForm.reset();
  cancelEditBtn.classList.add("hidden");
});

articleList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const editId = target.dataset.edit;
  const deleteId = target.dataset.delete;

  if (editId) {
    const article = articles.find((item) => item.id === editId);
    if (!article) return;
    currentEditingId = editId;
    titleInput.value = article.title;
    contentInput.value = article.content;
    cancelEditBtn.classList.remove("hidden");
  }

  if (deleteId) {
    articles = articles.filter((item) => item.id !== deleteId);
    saveArticles();
    renderArticles();
  }
});

fileInput.addEventListener("change", (event) => {
  const selectedFiles = [...(event.target.files || [])];
  if (!selectedFiles.length) return;
  files = [
    ...selectedFiles.map((file) => ({ id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type })),
    ...files,
  ];
  saveFiles();
  renderFiles();
  fileInput.value = "";
});

fileList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const fileId = target.getAttribute("data-file-id");
  if (!fileId) return;
  files = files.filter((file) => file.id !== fileId);
  saveFiles();
  renderFiles();
});

applyThemeBtn.addEventListener("click", () => {
  appearance = { theme: themeSelect.value, background: bgSelect.value, imageUrl: bgImageInput.value.trim() };
  saveAppearance();
  applyAppearance();
});

resetThemeBtn.addEventListener("click", () => {
  appearance = { ...defaultAppearance };
  saveAppearance();
  syncAppearanceControls();
  applyAppearance();
});


// --- Bootstrap ---
function renderAll() {
  renderHero();
  renderDynamicNav();
  renderModules();
  renderModuleManager();
  renderArticles();
}

syncAppearanceControls();
applyAppearance();
renderPlaylist();
renderFiles();
renderAll();
