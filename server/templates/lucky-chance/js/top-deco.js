/**
 * Dây cỏ leoTren — xếp chồng ngang, lật xen kẽ, phủ kín mép trên.
 */
const TOP_DECO_SRC = (window.ASSET_BASE_PATH || '') + 'asset/icons/leoTren.png';

function initTopDecoStrip() {
    const strip = document.querySelector('.top-deco-strip');
    if (!strip) return;

    const probe = new Image();
    let layoutTimer;

    function layoutTopDeco() {
        const natW = probe.naturalWidth;
        const natH = probe.naturalHeight;
        if (!natW || !natH) return;

        const stripH = Math.min(window.innerHeight * 0.2, 155);
        strip.style.height = `${stripH}px`;

        const scale = stripH / natH;
        const tileW = natW * scale;
        const overlap = 0.46;
        const step = tileW * (1 - overlap);
        const count = Math.ceil((window.innerWidth + step * 2) / step) + 1;
        const startX = -step * 0.75;

        strip.replaceChildren();
        const frag = document.createDocumentFragment();

        for (let i = 0; i < count; i++) {
            const img = document.createElement('img');
            img.src = TOP_DECO_SRC;
            img.alt = '';
            img.className = 'top-deco-tile';
            img.draggable = false;
            img.decoding = 'async';
            img.style.width = `${tileW}px`;
            img.style.height = `${stripH}px`;
            img.style.left = `${startX + i * step}px`;

            if (i % 2 === 1) {
                img.classList.add('top-deco-tile--flip');
            }
            const phase = i % 4;
            if (phase === 1) img.style.top = '5px';
            else if (phase === 2) img.style.top = '-3px';
            else if (phase === 3) img.style.top = '2px';

            frag.appendChild(img);
        }

        strip.appendChild(frag);
    }

    probe.onload = layoutTopDeco;
    probe.src = TOP_DECO_SRC;

    window.addEventListener('resize', () => {
        clearTimeout(layoutTimer);
        layoutTimer = setTimeout(layoutTopDeco, 150);
    });
}

window.initTopDecoStrip = initTopDecoStrip;
