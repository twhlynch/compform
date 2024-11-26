const renderer = document.getElementById('renderer');
renderer.addEventListener('click', start);
const ctx = renderer.getContext('2d');

let count = 3;
let speed = 1000;
let points = [];
let steps = [];
let prevSteps = [];
let runs = 0;
let iters = 0;

const countButton = document.getElementById('count');

if (countButton) countButton.onclick = countButton.oncontextmenu = (e) => {
    e.preventDefault();
    count = (e.type == 'click' ? count : count + 10) % 12 + 1;
    countButton.children[0].innerText = count;
    start();
};

const rateButton = document.getElementById('rate');

if (rateButton) rateButton.onclick = rateButton.oncontextmenu = (e) => {
    e.preventDefault();
    speed = (e.type == 'click' ? speed : speed + 998) % 1000 + 1;
    rateButton.children[0].innerText = speed;
    start();
};

function step(x, y) {
    const randIndex = Math.floor(Math.random() * points.length);
    const { px, py } = points[randIndex];

    const dx = (px - x) / 2;
    const dy = (py - y) / 2;

    x += dx;
    y += dy;

    ctx.fillRect(x, y, 1, 1);

    steps.push(() => step(x, y));
}

function frame(localRuns) {
    iters++;
    prevSteps = steps;
    steps = [];

    if (prevSteps.length == 0) return;

    prevSteps.forEach(f => f());

    if(runs == localRuns) requestAnimationFrame(() => frame(localRuns));
}

function start() {
    runs++;
    iters = 0;
    steps = [];
    prevSteps = [];

    ctx.clearRect(0, 0, renderer.width, renderer.height);
    ctx.lineWidth = 1
    ctx.fillStyle = '#ffffffff'

    points = [];
    for (let i = 0; i < count; i++) {
        const rad = 2 * Math.PI * i / count;
        const px = renderer.width / 2 + (renderer.width / 3) * Math.cos(rad);
        const py = renderer.height / 2 + (renderer.height / 3) * Math.sin(rad);

        points.push({ px, py });
        ctx.fillRect(px, py, 3, 3);
    }

    ctx.fillStyle = '#ffffff99'

    for (let i = 0; i < speed; i++) {
        const x = Math.random() * renderer.width;
        const y = Math.random() * renderer.height;
        steps.push(() => step(x, y));
    }

    requestAnimationFrame(() => frame(runs));
}

start();