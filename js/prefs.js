const THEMES = ["stonehenge", "deep-glade", "faery-fire", "accessible"];
const LANGS = ["en", "cy", "sco"];
const LANG_ATTR = { en: "en-GB", cy: "cy", sco: "sco" };
const STORAGE_THEME = "af-theme";
const STORAGE_LANG = "af-lang";
const THEME_ALIASES = { "megalith-night": "stonehenge" };

const cache = {};

function getNested(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
}

export async function loadLocale(lang) {
  if (!LANGS.includes(lang)) lang = "en";
  if (cache[lang]) return cache[lang];
  const res = await fetch(`/i18n/${lang}.json`);
  if (!res.ok) throw new Error(`Locale ${lang} failed`);
  cache[lang] = await res.json();
  return cache[lang];
}

export function getTheme() {
  let t = localStorage.getItem(STORAGE_THEME);
  if (THEME_ALIASES[t]) {
    t = THEME_ALIASES[t];
    localStorage.setItem(STORAGE_THEME, t);
  }
  return THEMES.includes(t) ? t : "stonehenge";
}

export function getLang() {
  const l = localStorage.getItem(STORAGE_LANG);
  return LANGS.includes(l) ? l : "en";
}

export function setTheme(theme) {
  if (!THEMES.includes(theme)) return;
  localStorage.setItem(STORAGE_THEME, theme);
  document.documentElement.dataset.theme = theme;
  syncAtmosphere(theme);
  syncHearth(theme);
  const sel = document.querySelector("#theme-select");
  if (sel) sel.value = theme;
}

export function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  localStorage.setItem(STORAGE_LANG, lang);
  document.documentElement.lang = LANG_ATTR[lang] || "en-GB";
  const sel = document.querySelector("#lang-select");
  if (sel) sel.value = lang;
}

export function applyI18n(dict) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = getNested(dict, key);
    if (val == null) return;
    el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = getNested(dict, key);
    if (val != null) el.placeholder = val;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    const val = getNested(dict, key);
    if (val != null) el.setAttribute("aria-label", val);
  });
  document.querySelectorAll("#theme-select option[data-theme-id]").forEach((opt) => {
    const id = opt.getAttribute("data-theme-id");
    const label = getNested(dict, `themes.${id}`);
    if (label) opt.textContent = label;
  });
}

function reducedMotion(theme) {
  return (
    theme === "accessible" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function setVideoSources(video, webm, mp4, poster) {
  if (!video) return;
  video.innerHTML = "";
  const s1 = document.createElement("source");
  s1.src = webm;
  s1.type = "video/webm";
  const s2 = document.createElement("source");
  s2.src = mp4;
  s2.type = "video/mp4";
  video.append(s1, s2);
  video.poster = poster;
  video.load();
}

function playOrStill(video, theme) {
  if (!video) return;
  if (reducedMotion(theme)) {
    video.pause();
    video.removeAttribute("autoplay");
  } else {
    video.setAttribute("autoplay", "");
    video.play().catch(() => {});
  }
}

export function syncAtmosphere(theme) {
  const video = document.querySelector("[data-atmosphere-video]");
  if (!video) return;

  if (theme === "deep-glade") {
    setVideoSources(
      video,
      "/assets/deep-glade/forest-bg.webm",
      "/assets/deep-glade/forest-bg.mp4",
      "/assets/deep-glade/forest-poster.jpg"
    );
    playOrStill(video, theme);
  } else if (theme === "faery-fire") {
    setVideoSources(
      video,
      "/assets/faery-fire/fire-bg.webm",
      "/assets/faery-fire/fire-bg.mp4",
      "/assets/faery-fire/fire-poster.jpg"
    );
    playOrStill(video, theme);
  } else {
    video.innerHTML = "";
    video.removeAttribute("poster");
    video.removeAttribute("src");
    video.pause();
    video.load();
  }
}

export function syncHearth(theme) {
  const media = document.querySelector("[data-hearth-media]");
  if (!media) return;
  const video = media.querySelector("video");
  const img = media.querySelector("img.poster");

  function showVideo(webm, mp4, poster) {
    if (img) {
      img.hidden = true;
      img.style.display = "none";
    }
    if (!video) return;
    video.hidden = false;
    video.style.display = "block";
    setVideoSources(video, webm, mp4, poster);
    playOrStill(video, theme);
  }

  function showStill() {
    if (video) {
      video.hidden = true;
      video.style.display = "none";
      video.pause();
    }
    if (img) {
      img.hidden = false;
      img.style.display = "block";
      img.src = "/assets/sarsen/photo-night.jpg";
    }
  }

  if (theme === "deep-glade") {
    showVideo(
      "/assets/deep-glade/forest-bg.webm",
      "/assets/deep-glade/forest-bg.mp4",
      "/assets/deep-glade/forest-poster.jpg"
    );
  } else if (theme === "faery-fire") {
    showVideo(
      "/assets/faery-fire/fire-bg.webm",
      "/assets/faery-fire/fire-bg.mp4",
      "/assets/faery-fire/fire-poster.jpg"
    );
  } else {
    showStill();
  }
}

export async function initPrefs() {
  const theme = getTheme();
  const lang = getLang();
  document.documentElement.dataset.theme = theme;
  document.documentElement.lang = LANG_ATTR[lang];

  const dict = await loadLocale(lang);
  applyI18n(dict);
  syncAtmosphere(theme);
  syncHearth(theme);

  const themeSel = document.querySelector("#theme-select");
  const langSel = document.querySelector("#lang-select");
  if (themeSel) {
    themeSel.value = theme;
    themeSel.addEventListener("change", () => setTheme(themeSel.value));
  }
  if (langSel) {
    langSel.value = lang;
    langSel.addEventListener("change", async () => {
      setLang(langSel.value);
      applyI18n(await loadLocale(langSel.value));
    });
  }
}
