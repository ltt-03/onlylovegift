/**
 * Dữ liệu từ server:
 * {
 *   recipientName?: string,  // tên người nhận (màn intro) — alias: recipient, recipient_name, toName
 *   music?: string,            // url nhạc nền — alias: musicUrl, audio, bgMusic, ...
 *   messages: [...],
 *   images: [...]
 * }
 *
 * messages: string | { text? }  — tối đa 28 ký tự, emoji trong chuỗi
 * images:   string (url) | { url? | image? | imageUrl? }
 */
const MAX_MESSAGE_LENGTH = 28;
const MAX_RECIPIENT_NAME_LENGTH = 32;
const DEFAULT_RECIPIENT_NAME = 'Lan Anh';

/** Dữ liệu mặc định khi chưa có phản hồi từ server */
const DEFAULT_MESSAGES = [
    'Chúc bạn thi tốt nhé! 🍀',
    'Chúc điểm cao kỳ này ✨',
    'Ôn vững, thi bình tĩnh 💚',
    'Làm bài mượt, kiểm kỹ',
    'Good luck! You got this 🍀'
];

const DEFAULT_IMAGES = [
    'asset/images/anh_1.jpg',
    'asset/images/anh_2.jpg',
    'asset/images/anh_3.jpg',
    'asset/images/anh_4.jpg',
    'asset/images/anh_5.jpg',
    'asset/images/anh_6.jpg'
];

let messages = [];
let images = [];
let recipientName = DEFAULT_RECIPIENT_NAME;
let hasServerData = false;

const container = document.getElementById('falling-container');

const TABLET_MIN_WIDTH = 768;
const TABLET_MIN_HEIGHT = 600;
const DESKTOP_MIN_WIDTH = 1024;

const GREEN_TONES = [
    'text-emerald-300', 'text-emerald-400', 'text-green-400',
    'text-lime-400', 'text-teal-300', 'text-green-300'
];
const FALLBACK_MESSAGES = ['Chúc may mắn! 🍀'];

function useDefaultData() {
    hasServerData = false;
    messages = [...DEFAULT_MESSAGES];
    images = [...DEFAULT_IMAGES];
    setRecipientName(DEFAULT_RECIPIENT_NAME);
    window.LuckyChanceMusic?.resetMusicToDefault();
}

function normalizeRecipientName(value) {
    if (value == null) return null;
    const text = String(value).trim();
    if (!text) return null;
    const chars = [...text];
    if (chars.length <= MAX_RECIPIENT_NAME_LENGTH) return text;
    return chars.slice(0, MAX_RECIPIENT_NAME_LENGTH).join('');
}

function updateIntroRecipient(name) {
    const el = document.getElementById('intro-recipient-name');
    if (el) el.textContent = name;

    const title = document.getElementById('intro-title');
    if (title) {
        title.setAttribute('aria-label', `Gửi may mắn đến bạn ${name}`);
    }
}

function setRecipientName(name) {
    const normalized = normalizeRecipientName(name);
    recipientName = normalized ?? DEFAULT_RECIPIENT_NAME;
    updateIntroRecipient(recipientName);
    return recipientName;
}

function extractRecipientFromPayload(data) {
    return normalizeRecipientName(
        data?.recipientName
        ?? data?.recipient
        ?? data?.recipient_name
        ?? data?.toName
    );
}

function limitMessageLength(text) {
    const chars = [...text];
    if (chars.length <= MAX_MESSAGE_LENGTH) return text;
    return chars.slice(0, MAX_MESSAGE_LENGTH).join('');
}

function normalizeMessage(item) {
    let text = '';
    if (typeof item === 'string') {
        text = item.trim();
    } else if (item && typeof item === 'object') {
        text = String(item.text ?? item.message ?? '').trim();
    }
    if (!text) return null;
    return limitMessageLength(text);
}

function normalizeImage(item) {
    if (typeof item === 'string') {
        const url = item.trim();
        return url || null;
    }
    if (!item || typeof item !== 'object') return null;
    const url = String(item.url ?? item.image ?? item.imageUrl ?? item.src ?? '').trim();
    return url || null;
}

/**
 * @param {{ recipientName?: string, recipient?: string, messages?: unknown[], images?: unknown[] }} data
 */
function applyServerData(data) {
    hasServerData = true;
    const msgList = data?.messages ?? [];
    const imgList = data?.images ?? [];

    const normalizedMessages = msgList.map(normalizeMessage).filter(Boolean);
    const normalizedImages = imgList.map(normalizeImage).filter(Boolean);

    messages = normalizedMessages.length > 0 ? normalizedMessages : [...DEFAULT_MESSAGES];
    images = normalizedImages.length > 0 ? normalizedImages : [...DEFAULT_IMAGES];

    const serverRecipient = extractRecipientFromPayload(data);
    recipientName = serverRecipient ?? DEFAULT_RECIPIENT_NAME;
    updateIntroRecipient(recipientName);

    window.LuckyChanceMusic?.applyMusicFromPayload(data);
}

function pickRandomItem(display) {
    const hasMessages = messages.length > 0;
    const hasImages = images.length > 0;

    if (!hasMessages && !hasImages) {
        return { kind: 'text', text: FALLBACK_MESSAGES[0] };
    }
    if (!hasImages) {
        return { kind: 'text', text: messages[Math.floor(Math.random() * messages.length)] };
    }
    if (!hasMessages) {
        return { kind: 'image', url: images[Math.floor(Math.random() * images.length)] };
    }

    if (Math.random() < display.imageChance) {
        return { kind: 'image', url: images[Math.floor(Math.random() * images.length)] };
    }
    return { kind: 'text', text: messages[Math.floor(Math.random() * messages.length)] };
}

function getViewportTier() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w >= DESKTOP_MIN_WIDTH) return 'desktop';
    if (w >= TABLET_MIN_WIDTH && h >= TABLET_MIN_HEIGHT) return 'tablet';
    return 'mobile';
}

function getDisplaySettings() {
    const presets = {
        mobile: {
            maxObjects: 75,
            totalColumns: 22,
            fontSize: 14,
            imageBaseSize: 100,
            imageChance: 0.06
        },
        tablet: {
            maxObjects: 95,
            totalColumns: 28,
            fontSize: 18,
            imageBaseSize: 118,
            imageChance: 0.16
        },
        desktop: {
            maxObjects: 115,
            totalColumns: 32,
            fontSize: 20,
            imageBaseSize: 132,
            imageChance: 0.16
        }
    };
    return presets[getViewportTier()];
}

async function loadFromServer(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    applyServerData(await res.json());
    resetFallingSystem();
}

class FallingElement {
    constructor(columnIndex, totalColumns, display, isInitial = false) {
        this.el = document.createElement('div');
        this.display = display;
        this.item = pickRandomItem(display);
        this.assignDepth();
        this.render();
        this.initPosition(columnIndex, totalColumns, isInitial);
    }

    assignDepth() {
        const depthRoll = Math.random();
        if (depthRoll < 0.40) {
            this.scale = 0.4 + Math.random() * 0.25;
            this.speed = 0.5 + Math.random() * 0.5;
            this.opacity = 0.5 + Math.random() * 0.2;
            this.zIndex = 1;
        } else if (depthRoll < 0.85) {
            this.scale = 0.7 + Math.random() * 0.25;
            this.speed = 1.0 + Math.random() * 0.75;
            this.opacity = 0.72 + Math.random() * 0.2;
            this.zIndex = 2;
        } else {
            this.scale = 0.95 + Math.random() * 0.3;
            this.speed = 1.7 + Math.random() * 1.1;
            this.opacity = 0.94 + Math.random() * 0.06;
            this.zIndex = 3;
        }
    }

    render() {
        this.el.className = 'falling-item absolute select-none';
        this.el.replaceChildren();

        this.inner = document.createElement('div');
        this.inner.className = 'wish-inner';
        this.el.appendChild(this.inner);

        if (this.item.kind === 'image') {
            this.renderImage(this.item.url);
        } else {
            this.renderText(this.item.text);
        }

        this.el.style.opacity = this.opacity;
        this.el.style.zIndex = this.zIndex;
    }

    renderText(text) {
        const color = GREEN_TONES[Math.floor(Math.random() * GREEN_TONES.length)];
        const baseSize = this.display.fontSize * this.scale;

        const textEl = document.createElement('span');
        textEl.className = `wish-text blessing-text ${color} whitespace-nowrap`;
        textEl.style.fontSize = `${baseSize}px`;
        textEl.style.textShadow =
            `0 1px 2px rgba(0, 0, 0, 0.6), 0 0 ${6 * this.scale}px rgba(52, 211, 153, 0.38)`;
        textEl.textContent = text;
        this.inner.appendChild(textEl);
    }

    renderImage(url) {
        const maxEdge = Math.floor(this.display.imageBaseSize * this.scale);

        const frame = document.createElement('div');
        frame.className = 'photo-frame';

        const img = document.createElement('img');
        img.src = url;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.className = 'wish-image';
        img.draggable = false;

        const fitImageSize = () => {
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            if (!w || !h) return;
            const ratio = Math.min(maxEdge / w, maxEdge / h);
            const width = Math.round(w * ratio);
            const height = Math.round(h * ratio);
            img.style.width = `${width}px`;
            img.style.height = `${height}px`;
            frame.style.width = `${width}px`;
            frame.style.height = `${height}px`;
        };

        img.onload = fitImageSize;
        img.onerror = () => {
            this.item = { kind: 'text', text: '💚' };
            this.render();
        };

        frame.appendChild(img);
        this.inner.appendChild(frame);

        if (img.complete && img.naturalWidth > 0) {
            fitImageSize();
        }
    }

    refresh() {
        this.item = pickRandomItem(this.display);
        this.render();
    }

    initPosition(columnIndex, totalColumns, isInitial = false) {
        const colWidth = window.innerWidth / totalColumns;
        const minX = columnIndex === 0 ? 35 : 5;
        const maxX = columnIndex === totalColumns - 1 ? colWidth - 35 : colWidth - 5;
        this.x = (columnIndex * colWidth) + minX + (Math.random() * (maxX - minX));

        if (isInitial) {
            this.y = (Math.random() * (window.innerHeight + 180)) - 100;
        } else {
            this.y = -130 - (Math.random() * 250);
        }

        this.colIndex = columnIndex;
        this.totCols = totalColumns;
        this.updateStyle();
    }

    update() {
        this.y += this.speed;
        this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`;

        if (this.y > window.innerHeight + 120) {
            this.refresh();
            this.initPosition(this.colIndex, this.totCols, false);
        }
    }

    updateStyle() {
        this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`;
    }

    destroy() {
        this.el.remove();
    }
}

const fallingObjects = [];
let currentViewportTier = null;

function resetFallingSystem() {
    fallingObjects.forEach((obj) => obj.destroy());
    fallingObjects.length = 0;
    container.innerHTML = '';
    initFallingSystem();
}

function initFallingSystem() {
    if (messages.length === 0 && images.length === 0) {
        if (hasServerData) {
            messages = [...FALLBACK_MESSAGES];
            images = [...DEFAULT_IMAGES];
        } else {
            useDefaultData();
        }
    }

    const display = getDisplaySettings();
    const columns = Math.min(display.maxObjects, display.totalColumns);

    for (let i = 0; i < display.maxObjects; i++) {
        const obj = new FallingElement(i % columns, columns, display, true);
        container.appendChild(obj.el);
        fallingObjects.push(obj);
    }
}

let animationRunning = true;

function animationLoop() {
    if (!animationRunning) return;
    for (let i = 0, len = fallingObjects.length; i < len; i++) {
        fallingObjects[i].update();
    }
    requestAnimationFrame(animationLoop);
}

document.addEventListener('visibilitychange', () => {
    animationRunning = !document.hidden;
    if (animationRunning) requestAnimationFrame(animationLoop);
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const tier = getViewportTier();
        if (tier !== currentViewportTier) {
            currentViewportTier = tier;
            resetFallingSystem();
            return;
        }
        const { totalColumns } = getDisplaySettings();
        const columns = Math.min(fallingObjects.length, totalColumns);
        fallingObjects.forEach((obj, idx) => {
            obj.initPosition(idx % columns, columns, true);
        });
    }, 150);
});

async function startLuckyChanceApp() {
    await previewInitPromise;

    if (window.__luckyChanceStarted) return;
    window.__luckyChanceStarted = true;

    const appMain = document.getElementById('app-main');
    if (appMain) {
        appMain.removeAttribute('hidden');
        appMain.classList.remove('app-main--hidden');
        appMain.classList.add('app-main--visible');
    }

    if (!hasServerData) {
        messages = [...DEFAULT_MESSAGES];
        images = [...DEFAULT_IMAGES];
    }

    // Dời khởi tạo nặng sang frame kế tiếp để màn chính hiện tức thì sau khi chạm.
    requestAnimationFrame(() => {
        currentViewportTier = getViewportTier();
        initFallingSystem();
        animationLoop();

        if (typeof window.bootImageTextFly === 'function') {
            window.bootImageTextFly();
        }
        if (typeof window.initTopDecoStrip === 'function') {
            window.initTopDecoStrip();
        }
    });
}

window.startLuckyChanceApp = startLuckyChanceApp;

function initSampleModeFromUrl() {
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('sample') !== '1') return false;
        useDefaultData();
        return true;
    } catch (_err) {
        return false;
    }
}

initSampleModeFromUrl();

if (window.luckyChanceData) {
    applyServerData(window.luckyChanceData);
}

updateIntroRecipient(recipientName);

function computePreviewWatermarkLayout() {
    const w = window.innerWidth || 360;
    const h = window.innerHeight || 640;
    const coverWidth = Math.hypot(w, h) * 1.08;
    const coverHeight = Math.hypot(w, h) * 1.22;
    const cols = Math.max(4, Math.min(12, Math.ceil(coverWidth / 96)));
    const rowGap = Math.min(72, Math.max(36, h * 0.08));
    const rows = Math.max(14, Math.ceil(coverHeight / rowGap));
    return { cols, total: cols * rows };
}

function initPreviewDemoWatermark() {
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('preview') !== '1') return;

        const root = document.getElementById('previewDemoWatermark');
        if (!root) return;

        const grid = root.querySelector('.preview-demo-watermark__grid');
        if (grid && grid.childElementCount === 0) {
            const { cols, total } = computePreviewWatermarkLayout();
            grid.style.setProperty('--preview-wm-cols', String(cols));
            for (let i = 0; i < total; i += 1) {
                const span = document.createElement('span');
                span.textContent = 'Xem Demo';
                grid.appendChild(span);
            }
        }

        root.hidden = false;
        root.setAttribute('aria-hidden', 'false');
        root.classList.add('is-active');
    } catch (_err) {
        /* ignore */
    }
}

initPreviewDemoWatermark();

async function loadPreviewDraftFromStorage() {
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('preview') !== '1') return false;

        const storage = window.LuckyChancePreviewStorage;
        if (!storage) {
            console.warn('[LuckyChance] Thiếu preview-draft-storage.js');
            return false;
        }

        const draft = await storage.loadPreviewDraft();
        const payload = storage.draftToPayload(draft);
        if (!payload) return false;

        applyServerData(payload);
        return true;
    } catch (err) {
        console.warn('[LuckyChance] Không đọc được bản xem trước:', err);
        return false;
    }
}

const previewInitPromise = loadPreviewDraftFromStorage();

window.LuckyChance = {
    loadPreviewDraftFromStorage,
    get previewInitPromise() { return previewInitPromise; },
    applyServerData,
    loadFromServer,
    useDefaultData,
    setRecipientName,
    resetFallingSystem,
    startMusic: () => window.LuckyChanceMusic?.startMusic(),
    stopMusic: () => window.LuckyChanceMusic?.stopMusic(),
    setMusicUrl: (url) => window.LuckyChanceMusic?.setMusicUrl(url),
    get messages() { return messages; },
    get images() { return images; },
    get recipientName() { return recipientName; },
    get musicUrl() { return window.LuckyChanceMusic?.musicUrl ?? ''; },
    get hasServerData() { return hasServerData; }
};
