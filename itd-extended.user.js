// ==UserScript==
// @name         ITD Extended Client
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @author       Kirill
// @description  Extended client for ITD social network with modular system
// @downloadURL  https://github.com/kirillsql1kaa11/ITD-EXT-V2/raw/refs/heads/main/itd-extended.user.js
// @updateURL    https://github.com/kirillsql1kaa11/ITD-EXT-V2/raw/refs/heads/main/itd-extended.user.js
// @match        https://итд.com/*
// @match        https://xn--d1ah4a.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(' :root{--itdex-bg-primary: #151518;--itdex-bg-secondary: #1a1a1a;--itdex-bg-tertiary: #2a2a2a;--itdex-text-primary: #f5f5f5;--itdex-text-secondary: rgba(255, 255, 255, .5);--itdex-accent-primary: #0080FF;--itdex-modal-shadow: rgba(0, 0, 0, .5)}.itdex-nav-item{cursor:pointer;transition:background-color .2s}.itdex-nav-item:hover{background-color:var(--itdex-bg-tertiary)}.itdex-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:#000000b3;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;pointer-events:none;transition:opacity .2s}.itdex-modal-overlay.active{opacity:1;pointer-events:all}.itdex-modal-container{background:var(--itdex-bg-secondary);width:100%;max-width:450px;border-radius:16px;border:1px solid var(--itdex-bg-tertiary);box-shadow:0 10px 40px #00000080;transform:scale(.95);transition:transform .2s}.itdex-modal-overlay.active .itdex-modal-container{transform:scale(1)}.itdex-modal-header{padding:18px 24px;border-bottom:1px solid var(--itdex-bg-tertiary);display:flex;align-items:center;justify-content:space-between}.itdex-modal-title{font-size:18px;font-weight:700;color:var(--itdex-text-primary)}.itdex-modal-close{cursor:pointer;color:var(--itdex-text-secondary)}.itdex-modal-body{padding:12px 0}.itdex-setting-item{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;transition:background .2s}.itdex-setting-item:hover{background:#ffffff08}.itdex-setting-info{display:flex;flex-direction:column}.itdex-setting-name{font-size:15px;font-weight:500;color:var(--itdex-text-primary)}.itdex-setting-desc{font-size:12px;color:var(--itdex-text-secondary);margin-top:2px}.itdex-switch{position:relative;display:inline-block;width:40px;height:20px}.itdex-switch input{opacity:0;width:0;height:0}.itdex-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--itdex-bg-tertiary);transition:.4s;border-radius:20px}.itdex-slider:before{position:absolute;content:"";height:16px;width:16px;left:2px;bottom:2px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.itdex-slider{background-color:var(--itdex-accent-primary)}input:checked+.itdex-slider:before{transform:translate(20px)} ');

(function () {
  'use strict';

  function initInterceptor(callback) {
    const originFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originFetch(...args);
      let url = "";
      if (typeof args[0] === "string") url = args[0];
      else if (args[0] instanceof Request) url = args[0].url;
      else if (args[0] instanceof URL) url = args[0].href;
      if (url.includes("/api/")) {
        console.log("[ITD-DEBUG] API Fetch:", url);
      }
      if (url.includes("/api/users/") && !url.includes("/posts") && !url.includes("/media")) {
        const clone = response.clone();
        clone.json().then((data) => {
          if (data && data.username) callback("profile_loaded", data);
        }).catch(() => {
        });
      }
      return response;
    };
    const rawOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
      this.addEventListener("load", function() {
        const url = this.responseURL;
        if (url.includes("/api/")) {
          console.log("[ITD-DEBUG] API XHR:", url);
        }
        if (url.includes("/api/users/") && !url.includes("/posts") && !url.includes("/media")) {
          try {
            const data = JSON.parse(this.responseText);
            if (data && data.username) callback("profile_loaded", data);
          } catch (e) {
          }
        }
      });
      rawOpen.apply(this, arguments);
    };
  }
  const Settings = {
    get(key, defaultValue) {
      return GM_getValue(`itdex_${key}`, defaultValue);
    },
    set(key, value) {
      GM_setValue(`itdex_${key}`, value);
    }
  };
  const postsCount = {
    id: "show_posts_count",
    name: "Счетчик постов",
    description: "Показывает количество постов в профиле",
    default: true,
    init(data) {
      if (!data || data.postsCount === void 0) return;
      if (document.getElementById("itdex-posts-count")) return;
      const stats = document.querySelectorAll(".hSN99swS");
      if (stats.length === 0) return;
      const lastStat = stats[stats.length - 1];
      if (!lastStat.parentNode) return;
      const postsStat = lastStat.cloneNode(true);
      postsStat.id = "itdex-posts-count";
      postsStat.classList.add("wD-vYWrg");
      const countSpan = postsStat.querySelector("span:first-child") || postsStat.querySelector(".LIXEFTYA");
      const labelSpan = postsStat.querySelector("span:last-child") || postsStat.querySelector(".XHEEbVAb");
      if (countSpan) countSpan.innerText = data.postsCount;
      if (labelSpan) labelSpan.innerText = "постов";
      lastStat.parentNode.appendChild(postsStat);
    }
  };
  const modules = [
    postsCount
  ];
  function createModal(modules2, onConfigChange) {
    if (document.getElementById("itdex-modal")) return;
    const overlay = document.createElement("div");
    overlay.id = "itdex-modal";
    overlay.className = "itdex-modal-overlay";
    const modulesHtml = modules2.map((mod) => `
        <div class="itdex-setting-item">
            <div class="itdex-setting-info">
                <span class="itdex-setting-name">${mod.name}</span>
                <span class="itdex-setting-desc">${mod.description}</span>
            </div>
            <label class="itdex-switch">
                <input type="checkbox" id="itdex-opt-${mod.id}" ${Settings.get(mod.id, mod.default) ? "checked" : ""}>
                <span class="itdex-slider"></span>
            </label>
        </div>
    `).join("");
    overlay.innerHTML = `
        <div class="itdex-modal-container">
            <div class="itdex-modal-header">
                <span class="itdex-modal-title">ITD Extended</span>
                <div class="itdex-modal-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </div>
            </div>
            <div class="itdex-modal-body">
                ${modulesHtml}
            </div>
        </div>
    `;
    overlay.onclick = (e) => e.target === overlay && closeModal();
    overlay.querySelector(".itdex-modal-close").onclick = closeModal;
    modules2.forEach((mod) => {
      const checkbox = overlay.querySelector(`#itdex-opt-${mod.id}`);
      checkbox.onchange = (e) => {
        const enabled = e.target.checked;
        Settings.set(mod.id, enabled);
        onConfigChange(mod.id, enabled);
      };
    });
    document.body.appendChild(overlay);
  }
  function openModal() {
    var _a;
    (_a = document.getElementById("itdex-modal")) == null ? void 0 : _a.classList.add("active");
  }
  function closeModal() {
    var _a;
    (_a = document.getElementById("itdex-modal")) == null ? void 0 : _a.classList.remove("active");
  }
  let profileData = null;
  const CONFIG = {
    selectors: {
      nav: ".JOIWgkha, .JGhUMn6Z",
      navItem: ".Vxc0MjRf, .GNnsM0Nx",
      iconContainer: ".Yi-2DSIb, .TAGBLFdY",
      label: ".iQtUV16G"
    },
    id: "itdex-main-button"
  };
  console.log("[ITD-EXT] v1.1.5: Script starting");
  initInterceptor((event, data) => {
    if (event === "profile_loaded") {
      console.log("[ITD-EXT] Data matched!", data.username, "Posts:", data.postsCount);
      profileData = data;
      runModules(data);
    }
  });
  function runModules(data) {
    if (!data || !document.body) return;
    modules.forEach((mod) => {
      if (Settings.get(mod.id, mod.default)) {
        try {
          mod.init(data);
        } catch (e) {
          console.error(`[ITD-EXT] Error in module ${mod.id}:`, e);
        }
      }
    });
  }
  function injectExtendedButton() {
    if (!document.body || document.getElementById(CONFIG.id)) return;
    const nav = document.querySelector(CONFIG.selectors.nav);
    if (!nav) {
      return;
    }
    const template = nav.querySelector(CONFIG.selectors.navItem);
    if (!template) {
      console.warn("[ITD-EXT] Nav item template not found in nav!");
      return;
    }
    console.log("[ITD-EXT] Injecting Extended button...");
    const btn = template.cloneNode(true);
    btn.id = CONFIG.id;
    btn.href = "javascript:void(0)";
    btn.classList.remove("VPqB7n6W", "ZtAKIgsJ");
    btn.classList.add("itdex-nav-item");
    const icon = btn.querySelector(CONFIG.selectors.iconContainer);
    let label = btn.querySelector(CONFIG.selectors.label) || btn.querySelector("span:last-child");
    if (icon) icon.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
    if (label) label.innerText = "Extended";
    btn.onclick = (e) => {
      e.preventDefault();
      console.log("[ITD-EXT] Extended button clicked!");
      openModal();
    };
    nav.appendChild(btn);
  }
  function handleConfigChange(id, enabled) {
    var _a;
    console.log(`[ITD-EXT] Setting changed: ${id} = ${enabled}`);
    if (!enabled) {
      if (id === "show_posts_count") (_a = document.getElementById("itdex-posts-count")) == null ? void 0 : _a.remove();
    } else {
      runModules(profileData);
    }
  }
  const bodyCheck = setInterval(() => {
    if (document.body) {
      clearInterval(bodyCheck);
      initUI();
    }
  }, 50);
  function initUI() {
    console.log("[ITD-EXT] Initializing UI components...");
    createModal(modules, handleConfigChange);
    injectExtendedButton();
    const observer = new MutationObserver(() => {
      injectExtendedButton();
      if (profileData) runModules(profileData);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

})();