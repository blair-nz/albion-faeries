import { initPrefs } from "./prefs.js";

export function assetPrefix() {
  const parts = location.pathname.replace(/\\/g, "/").split("/").filter(Boolean);
  if (parts.length && parts[parts.length - 1].includes(".")) parts.pop();
  return parts.length === 0 ? "" : "../".repeat(parts.length);
}

export function mountChrome({ current = "", brandHref = "/", atmosphere = true } = {}) {
  if (atmosphere && !document.querySelector("[data-atmosphere]")) {
    const atm = document.createElement("div");
    atm.className = "atmosphere";
    atm.dataset.atmosphere = "";
    atm.innerHTML = `
      <video data-atmosphere-video muted loop playsinline></video>
      <div class="veil" aria-hidden="true"></div>`;
    const v = atm.querySelector("video");
    if (v) v.muted = true;
    document.body.prepend(atm);
  }

  if (!document.querySelector(".site-header")) {
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <a class="skip-link" href="#main" data-i18n="nav.skip">Skip to content</a>
      <a class="brand" href="${brandHref}">
        <img src="/assets/logos/radical_faeries_albion_moon_circle_clean_icon_preview.png" width="48" height="48" alt="" />
        <span data-i18n="home.brand">Albion Faeries</span>
      </a>
      <nav class="nav-main" aria-label="Primary">
        <a href="/gatherings" data-i18n="nav.gatherings"${current === "gatherings" || current === "whats-on" ? ' aria-current="page"' : ""}>Gatherings &amp; Events</a>
        <a href="/who-we-are" data-i18n="nav.whoWeAre"${current === "who-we-are" ? ' aria-current="page"' : ""}>Who we are</a>
        <a href="/get-involved" data-i18n="nav.getInvolved"${current === "get-involved" ? ' aria-current="page"' : ""}>Get involved</a>
      </nav>
      <div class="prefs">
        <label for="theme-select" data-i18n="nav.theme">Theme</label>
        <select id="theme-select" data-i18n-aria="nav.theme">
          <option value="stonehenge" data-theme-id="stonehenge">Stonehenge</option>
          <option value="deep-glade" data-theme-id="deep-glade">Deep Glade</option>
          <option value="faery-fire" data-theme-id="faery-fire">Faery Fire</option>
          <option value="accessible" data-theme-id="accessible">Accessible</option>
        </select>
        <label for="lang-select" data-i18n="nav.language">Language</label>
        <select id="lang-select" data-i18n-aria="nav.language">
          <option value="en">English</option>
          <option value="cy">Cymraeg</option>
          <option value="sco">Scots</option>
        </select>
      </div>`;

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="inner">
        <p data-i18n="footer.care">Radical Faeries of Albion</p>
        <div class="footer-links">
          <a href="/blog" data-i18n="footer.blog">Faerie blog</a>
          <a href="/get-involved" data-i18n="footer.contact">Contact</a>
          <a href="/get-involved#donate" data-i18n="footer.donate">Donate</a>
          <a href="/circles/" data-i18n="footer.circles">Circle sign-in</a>
        </div>
      </div>`;

    const shell = document.querySelector(".page-shell");
    const main = document.querySelector("main");
    if (shell && main) {
      shell.insertBefore(header, main);
      shell.appendChild(footer);
    } else {
      document.body.prepend(header);
      document.body.appendChild(footer);
    }
  }
}

export function initSheets(root = document) {
  const openers = [...root.querySelectorAll("[data-sheet-open]")];
  const dialogs = [...root.querySelectorAll("dialog.sheet")];

  function openSheet(id, { pushHash = true } = {}) {
    const dlg = root.getElementById?.(id) || document.getElementById(id);
    if (!dlg || typeof dlg.showModal !== "function") return;
    if (!dlg.open) dlg.showModal();
    if (pushHash) {
      const hash =
        openers.find((b) => b.getAttribute("data-sheet-open") === id)?.dataset.sheetHash ||
        dlg.dataset.sheetHash;
      if (hash) history.replaceState(null, "", `#${hash}`);
    }
  }

  function clearSheetHash(dlg) {
    const hash = dlg.dataset.sheetHash;
    const aliases = (dlg.dataset.sheetHashAliases || "").trim().split(/\s+/).filter(Boolean);
    const current = location.hash.replace(/^#/, "");
    if (hash === current || aliases.includes(current)) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  openers.forEach((btn) => {
    btn.addEventListener("click", () => openSheet(btn.getAttribute("data-sheet-open")));
  });

  dialogs.forEach((dlg) => {
    dlg.querySelectorAll("[data-sheet-close]").forEach((btn) => {
      btn.addEventListener("click", () => dlg.close());
    });
    dlg.addEventListener("close", () => clearSheetHash(dlg));
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  });

  const fromHash = location.hash.replace(/^#/, "");
  if (!fromHash) return;
  const match = dialogs.find((dlg) => {
    const primary = dlg.dataset.sheetHash || "";
    const aliases = (dlg.dataset.sheetHashAliases || "").trim().split(/\s+/).filter(Boolean);
    return [primary, ...aliases].includes(fromHash);
  });
  if (match) openSheet(match.id, { pushHash: false });
}

export function initTabs(root = document) {
  root.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = [...tabs.querySelectorAll("[role='tab']")];
    const panels = buttons
      .map((btn) => document.getElementById(btn.getAttribute("aria-controls")))
      .filter(Boolean);

    function activate(id, { pushHash = true } = {}) {
      buttons.forEach((btn) => {
        const on = btn.getAttribute("aria-controls") === id;
        btn.setAttribute("aria-selected", on ? "true" : "false");
        btn.tabIndex = on ? 0 : -1;
      });
      panels.forEach((panel) => {
        const on = panel.id === id;
        panel.hidden = !on;
      });
      if (pushHash && !tabs.hasAttribute("data-tabs-local")) {
        const hash = tabs.querySelector(`[aria-controls="${id}"]`)?.dataset.hash;
        if (hash) history.replaceState(null, "", `#${hash}`);
      }
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => activate(btn.getAttribute("aria-controls")));
      btn.addEventListener("keydown", (e) => {
        const i = buttons.indexOf(btn);
        let next = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % buttons.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + buttons.length) % buttons.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = buttons.length - 1;
        if (next < 0) return;
        e.preventDefault();
        buttons[next].focus();
        activate(buttons[next].getAttribute("aria-controls"));
      });
    });

    const fromHash = location.hash.replace(/^#/, "");
    const hashesFor = (btn) => {
      const primary = btn.dataset.hash || "";
      const aliases = (btn.dataset.hashAliases || "").trim().split(/\s+/).filter(Boolean);
      return [primary, ...aliases].filter(Boolean);
    };
    const match =
      buttons.find((b) => hashesFor(b).includes(fromHash)) ||
      buttons.find((b) => b.getAttribute("aria-selected") === "true") ||
      buttons[0];
    if (match) activate(match.getAttribute("aria-controls"), { pushHash: false });
  });
}

export async function boot(opts = {}) {
  if (opts.page) document.body.dataset.page = opts.page;
  mountChrome(opts);
  await initPrefs();
  initTabs();
  initSheets();
}
