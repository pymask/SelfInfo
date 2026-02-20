const tracks = [
  {
    title: "专注时刻 · SoundHelix 1",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "放松片刻 · SoundHelix 2",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "夜晚灵感 · SoundHelix 3",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

const defaultAchievements = [
  { id: "a1", title: "连续 30 天记录日常", note: "保持稳定写作节奏", done: false },
  { id: "a2", title: "完成 12 篇高质量文章", note: "每月至少 1 篇深度复盘", done: false },
  { id: "a3", title: "跑步累计 100 公里", note: "健康与成长并行", done: false },
  { id: "a4", title: "完成 3 个个人项目发布", note: "让想法真正落地", done: false },
];

const audio = document.getElementById("audio");
const playlist = document.getElementById("playlist");
const articleForm = document.getElementById("article-form");
const titleInput = document.getElementById("article-title");
const contentInput = document.getElementById("article-content");
const articleList = document.getElementById("article-list");
const cancelEditBtn = document.getElementById("cancel-edit");
const fileInput = document.getElementById("file-input");
const fileList = document.getElementById("file-list");
const achievementList = document.getElementById("achievement-list");
const achievementProgress = document.getElementById("achievement-progress");
const themeSelect = document.getElementById("theme-select");
const bgSelect = document.getElementById("bg-select");
const bgImageInput = document.getElementById("bg-image-url");
const applyThemeBtn = document.getElementById("apply-theme");
const resetThemeBtn = document.getElementById("reset-theme");

const articleStoreKey = "personal_site_articles";
const fileStoreKey = "personal_site_files";
const achievementStoreKey = "personal_site_achievements";
const appearanceStoreKey = "personal_site_appearance";

const defaultAppearance = {
  theme: "default",
  background: "aurora",
  imageUrl: "",
};

let currentEditingId = null;
let articles = JSON.parse(localStorage.getItem(articleStoreKey) || "[]");
let files = JSON.parse(localStorage.getItem(fileStoreKey) || "[]");
let achievements = JSON.parse(localStorage.getItem(achievementStoreKey) || "null") || defaultAchievements;
let appearance = JSON.parse(localStorage.getItem(appearanceStoreKey) || "null") || defaultAppearance;

function renderPlaylist() {
  playlist.innerHTML = "";

  tracks.forEach((track, index) => {
    const button = document.createElement("button");
    button.className = "track";
    button.textContent = track.title;
    button.type = "button";

    button.addEventListener("click", () => {
      audio.src = track.src;
      audio.play();
      setActive(index);
    });

    playlist.appendChild(button);
  });

  setActive(0);
}

function setActive(activeIndex) {
  const trackButtons = [...document.querySelectorAll(".track")];
  trackButtons.forEach((button, index) => {
    button.classList.toggle("active", index === activeIndex);
  });
}

function saveAppearance() {
  localStorage.setItem(appearanceStoreKey, JSON.stringify(appearance));
}

function applyAppearance() {
  document.body.dataset.theme = appearance.theme;
  document.body.dataset.bg = appearance.background;

  if (appearance.imageUrl) {
    document.body.style.setProperty("--bg-image", `url(\"${appearance.imageUrl}\")`);
  } else {
    document.body.style.setProperty("--bg-image", "none");
  }
}

function syncAppearanceControls() {
  themeSelect.value = appearance.theme;
  bgSelect.value = appearance.background;
  bgImageInput.value = appearance.imageUrl;
}

applyThemeBtn.addEventListener("click", () => {
  appearance = {
    theme: themeSelect.value,
    background: bgSelect.value,
    imageUrl: bgImageInput.value.trim(),
  };

  saveAppearance();
  applyAppearance();
});

resetThemeBtn.addEventListener("click", () => {
  appearance = { ...defaultAppearance };
  saveAppearance();
  syncAppearanceControls();
  applyAppearance();
});

function saveArticles() {
  localStorage.setItem(articleStoreKey, JSON.stringify(articles));
}

function renderArticles() {
  articleList.innerHTML = "";

  if (!articles.length) {
    articleList.innerHTML = '<p class="tip">还没有文章，开始发布第一篇吧。</p>';
    return;
  }

  articles
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((article) => {
      const item = document.createElement("article");
      item.className = "article-item";

      const date = new Date(article.updatedAt).toLocaleString("zh-CN");

      const head = document.createElement("div");
      head.className = "article-head";

      const title = document.createElement("strong");
      title.textContent = article.title;

      const dateEl = document.createElement("span");
      dateEl.className = "file-meta";
      dateEl.textContent = date;

      head.appendChild(title);
      head.appendChild(dateEl);

      const content = document.createElement("p");
      content.className = "article-content";
      content.textContent = article.content;

      const actions = document.createElement("div");
      actions.className = "article-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.textContent = "编辑";
      editBtn.setAttribute("data-edit", article.id);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "删除";
      deleteBtn.setAttribute("data-delete", article.id);

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(head);
      item.appendChild(content);
      item.appendChild(actions);

      articleList.appendChild(item);
    });
}

function resetEditor() {
  currentEditingId = null;
  articleForm.reset();
  cancelEditBtn.classList.add("hidden");
}

articleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) return;

  if (currentEditingId) {
    articles = articles.map((article) =>
      article.id === currentEditingId
        ? { ...article, title, content, updatedAt: Date.now() }
        : article,
    );
  } else {
    articles.push({
      id: crypto.randomUUID(),
      title,
      content,
      updatedAt: Date.now(),
    });
  }

  saveArticles();
  renderArticles();
  resetEditor();
});

cancelEditBtn.addEventListener("click", resetEditor);

articleList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const editId = target.getAttribute("data-edit");
  const deleteId = target.getAttribute("data-delete");

  if (editId) {
    const article = articles.find((item) => item.id === editId);
    if (!article) return;

    currentEditingId = article.id;
    titleInput.value = article.title;
    contentInput.value = article.content;
    cancelEditBtn.classList.remove("hidden");
    titleInput.focus();
  }

  if (deleteId) {
    articles = articles.filter((item) => item.id !== deleteId);
    saveArticles();
    renderArticles();

    if (currentEditingId === deleteId) {
      resetEditor();
    }
  }
});

function saveAchievements() {
  localStorage.setItem(achievementStoreKey, JSON.stringify(achievements));
}

function renderAchievements() {
  achievementList.innerHTML = "";

  achievements.forEach((achievement) => {
    const item = document.createElement("article");
    item.className = "achievement-item";

    const top = document.createElement("div");
    top.className = "achievement-top";

    const info = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = achievement.title;

    const note = document.createElement("p");
    note.className = "file-meta";
    note.textContent = achievement.note;

    info.appendChild(title);
    info.appendChild(note);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = achievement.done ? "badge done" : "badge";
    btn.textContent = achievement.done ? "已达成" : "未完成";
    btn.setAttribute("data-achievement-id", achievement.id);

    top.appendChild(info);
    top.appendChild(btn);
    item.appendChild(top);
    achievementList.appendChild(item);
  });

  const doneCount = achievements.filter((item) => item.done).length;
  achievementProgress.textContent = `已达成 ${doneCount} / ${achievements.length}`;
}

achievementList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const achievementId = target.getAttribute("data-achievement-id");
  if (!achievementId) return;

  achievements = achievements.map((item) =>
    item.id === achievementId ? { ...item, done: !item.done } : item,
  );

  saveAchievements();
  renderAchievements();
});

function saveFiles() {
  localStorage.setItem(fileStoreKey, JSON.stringify(files));
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

    const row = document.createElement("div");
    row.className = "file-row";

    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = file.name;

    const meta = document.createElement("p");
    meta.className = "file-meta";
    meta.textContent = `${(file.size / 1024).toFixed(1)} KB · ${file.type || "未知类型"}`;

    info.appendChild(name);
    info.appendChild(meta);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "file-remove";
    removeBtn.textContent = "移除";
    removeBtn.setAttribute("data-file-id", file.id);

    row.appendChild(info);
    row.appendChild(removeBtn);
    li.appendChild(row);
    fileList.appendChild(li);
  });
}

fileInput.addEventListener("change", (event) => {
  const selectedFiles = [...(event.target.files || [])];
  if (!selectedFiles.length) return;

  const newFiles = selectedFiles.map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    uploadedAt: Date.now(),
  }));

  files = [...newFiles, ...files];
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

syncAppearanceControls();
applyAppearance();
renderPlaylist();
renderArticles();
renderFiles();
renderAchievements();
