import {
  fetchLuckyChanceById,
  getLuckyChanceIdFromUrl,
} from "../api/luckyChanceView.js";

async function applyRecordWhenReady(data) {
  const tryApply = () => {
    if (typeof window.LuckyChance?.applyServerData === "function") {
      window.LuckyChance.applyServerData(data);
      if (typeof window.LuckyChance.resetFallingSystem === "function") {
        window.LuckyChance.resetFallingSystem();
      }
      return true;
    }
    return false;
  };

  if (tryApply()) return;

  await new Promise((resolve) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", resolve, { once: true });
    } else {
      resolve();
    }
  });

  for (let i = 0; i < 40; i += 1) {
    if (tryApply()) return;
    await new Promise((r) => requestAnimationFrame(r));
  }

  console.warn("[LuckyChance] Không gọi được applyServerData sau khi tải quà.");
}

async function bootFromServerId() {
  if ((window.DYNAMIC_DATA || window.luckyChanceData)) {
    await applyRecordWhenReady((window.DYNAMIC_DATA || window.luckyChanceData));
    return;
  }

  const id = getLuckyChanceIdFromUrl();
  if (!id) return;

  const res = await fetchLuckyChanceById(id);
  if (!res.success || !res.data) {
    console.warn("[LuckyChance] Tải quà:", res.message || "lỗi không xác định");
    return;
  }

  await applyRecordWhenReady(res.data);
}

bootFromServerId();
