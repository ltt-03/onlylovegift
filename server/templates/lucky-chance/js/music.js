/**
 * Nhạc nền — phát sau thao tác người dùng (chạm cỏ intro).
 * Server: music | musicUrl | audio | audioUrl | bgMusic | backgroundMusic
 */
const DEFAULT_MUSIC_URL = (window.ASSET_BASE_PATH || '') + 'asset/musics/thieu_nien.mp3';

let musicUrl = DEFAULT_MUSIC_URL;
let audioEl = null;
let musicStarted = false;

function getAudio() {
    if (!audioEl) {
        audioEl = new Audio();
        audioEl.loop = true;
        audioEl.preload = 'auto';
    }
    return audioEl;
}

function normalizeMusicUrl(value) {
    if (value == null) return null;
    if (typeof value === 'string') {
        const url = value.trim();
        return url || null;
    }
    if (typeof value === 'object') {
        const url = String(
            value.url ?? value.src ?? value.music ?? value.musicUrl ?? ''
        ).trim();
        return url || null;
    }
    return null;
}

function extractMusicFromPayload(data) {
    return normalizeMusicUrl(
        data?.music
        ?? data?.musicUrl
        ?? data?.audio
        ?? data?.audioUrl
        ?? data?.bgMusic
        ?? data?.backgroundMusic
    );
}

function syncAudioSource() {
    const audio = getAudio();
    const resolved = new URL(musicUrl, document.baseURI).href;
    if (audio.src !== resolved) {
        audio.src = musicUrl;
        audio.load();
    }
}

function setMusicUrl(url) {
    const normalized = normalizeMusicUrl(url);
    if (!normalized) return musicUrl;
    musicUrl = normalized;
    syncAudioSource();
    return musicUrl;
}

function prepareMusic() {
    syncAudioSource();
}

/**
 * Gọi trong handler click/keyboard — trình duyệt mới cho phát.
 * @returns {Promise<void>}
 */
function startMusic() {
    const audio = getAudio();
    syncAudioSource();
    musicStarted = true;
    audio.volume = 1;
    return audio.play().catch((err) => {
        console.warn('[LuckyChance] Không phát được nhạc:', err?.message ?? err);
    });
}

function stopMusic() {
    const audio = getAudio();
    audio.pause();
    musicStarted = false;
}

function applyMusicFromPayload(data) {
    const fromServer = extractMusicFromPayload(data);
    if (fromServer) {
        setMusicUrl(fromServer);
        return;
    }
    if (!musicStarted) {
        setMusicUrl(DEFAULT_MUSIC_URL);
    }
}

function resetMusicToDefault() {
    musicUrl = DEFAULT_MUSIC_URL;
    musicStarted = false;
    const audio = getAudio();
    audio.pause();
    audio.currentTime = 0;
    syncAudioSource();
}

prepareMusic();

window.LuckyChanceMusic = {
    startMusic,
    stopMusic,
    setMusicUrl,
    prepareMusic,
    applyMusicFromPayload,
    resetMusicToDefault,
    get musicUrl() { return musicUrl; },
    get isPlaying() { return audioEl ? !audioEl.paused : false; },
    get hasStarted() { return musicStarted; }
};
