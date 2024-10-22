const renderer = document.getElementById('renderer');
renderer.addEventListener('click', start);
const ctx = renderer.getContext('2d');

let count = 4;
let runs = 0;
let points = [];

const countButton = document.getElementById('count');

if (countButton) countButton.onclick = countButton.oncontextmenu = (e) => {
    e.preventDefault();
    count = (e.type == 'click' ? count : count + 10) % 12 + 1;
    countButton.children[0].innerText = count;
    start();
};

function step() {
    const imageData = new ImageData(renderer.width, renderer.height);

    for (let i = 0; i < renderer.width * renderer.height; i++) {
        const x = i % renderer.width;
        const y = Math.floor(i / renderer.width);

        const distances = points.map(point => Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2));
        const distance = distances[Math.floor(Math.random() * distances.length)];

        const h = Math.max(0, 1 - distance / Math.max(renderer.width, renderer.height));
        const s = 1;
        const v = 0.8;

        let r, g, b;

        let _i, _f, _p, _q, _t;
        _i = Math.floor(h * 6);
        _f = h * 6 - _i;
        _p = v * (1 - s);
        _q = v * (1 - _f * s);
        _t = v * (1 - (1 - _f) * s);
        switch (_i % 6) {
            case 0: r = v, g = _t, b = _p; break;
            case 1: r = _q, g = v, b = _p; break;
            case 2: r = _p, g = v, b = _t; break;
            case 3: r = _p, g = _q, b = v; break;
            case 4: r = _t, g = _p, b = v; break;
            case 5: r = v, g = _p, b = _q; break;
        }

        imageData.data[i * 4] = Math.round(r * 255);
        imageData.data[i * 4 + 1] = Math.round(g * 255);
        imageData.data[i * 4 + 2] = Math.round(b * 255);

        imageData.data[i * 4 + 3] = 255;
    }

    points = points.map(point => {
        let r = point.r;
        r += Math.random() > 0.5 ? Math.PI / 18 : -Math.PI / 18;

        r += (
            point.x < 0 || point.x >= renderer.width ||
            point.y < 0 || point.y >= renderer.height
        ) ? 180 : 0;
        
        return {
            x: point.x + 5 * Math.cos(r), 
            y: point.y + 5 * Math.sin(r),
            r
        }
    });

    ctx.putImageData(imageData, 0, 0);
}

function frame(localRuns) {
    
    step();

    if(runs == localRuns) requestAnimationFrame(() => frame(localRuns));
}

function start() {
    points = [];
    runs++;

    ctx.clearRect(0, 0, renderer.width, renderer.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffffff';
    ctx.fillStyle = '#ffffffff';

    for (let i = 0; i < count; i++) {
        const x = Math.random() * renderer.width;
        const y = Math.random() * renderer.height;
        const r = Math.random() * Math.PI * 2;

        points.push({
            x, y, r
        });
    }

    requestAnimationFrame(() => frame(runs));
}

start();