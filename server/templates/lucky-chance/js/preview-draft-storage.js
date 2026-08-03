/**
 * Lưu bản xem trước qua IndexedDB (ảnh/nhạc Blob — không bị giới hạn localStorage).
 */
(function () {
  const DB_NAME = "LuckyChancePreview";
  const DB_VERSION = 1;
  const STORE = "drafts";
  const DRAFT_KEY = "lcPreviewDraft";

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
    });
  }

  function runTransaction(mode, fn) {
    return openDb().then(
      (db) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction(STORE, mode);
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => {
            db.close();
            reject(tx.error);
          };
          const result = fn(tx.objectStore(STORE));
          if (result && typeof result.onsuccess !== "undefined") {
            result.onsuccess = () => resolve(result.result);
            result.onerror = () => reject(result.error);
          }
        })
    );
  }

  function savePreviewDraft(draft) {
    return openDb().then(
      (db) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction(STORE, "readwrite");
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => {
            db.close();
            reject(tx.error);
          };
          tx.objectStore(STORE).put(draft, DRAFT_KEY);
        })
    );
  }

  function loadPreviewDraft() {
    return openDb().then(
      (db) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction(STORE, "readonly");
          const request = tx.objectStore(STORE).get(DRAFT_KEY);
          request.onsuccess = () => {
            db.close();
            resolve(request.result ?? null);
          };
          request.onerror = () => {
            db.close();
            reject(request.error);
          };
        })
    );
  }

  function clearPreviewDraft() {
    return openDb().then(
      (db) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction(STORE, "readwrite");
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => {
            db.close();
            reject(tx.error);
          };
          tx.objectStore(STORE).delete(DRAFT_KEY);
        })
    );
  }

  /**
   * @param {{
   *   recipientName?: string,
   *   messages?: string[],
   *   imageBlobs?: Blob[],
   *   musicType?: 'none'|'sample'|'file',
   *   musicPath?: string,
   *   musicBlob?: Blob|null
   * }} draft
   */
  function draftToPayload(draft) {
    if (!draft || typeof draft !== "object") return null;

    const imageBlobs = Array.isArray(draft.imageBlobs) ? draft.imageBlobs : [];
    const images = imageBlobs.map((blob) => URL.createObjectURL(blob));

    const messages = Array.isArray(draft.messages)
      ? draft.messages.filter((m) => String(m || "").trim())
      : [];

    let music = "";
    if (draft.musicType === "sample" && draft.musicPath) {
      music = String(draft.musicPath);
    } else if (draft.musicType === "file" && draft.musicBlob) {
      music = URL.createObjectURL(draft.musicBlob);
    }

    return {
      recipientName: draft.recipientName,
      messages,
      images,
      music,
    };
  }

  window.LuckyChancePreviewStorage = {
    DRAFT_KEY,
    savePreviewDraft,
    loadPreviewDraft,
    clearPreviewDraft,
    draftToPayload,
  };
})();
