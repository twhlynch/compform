const renderer = document.getElementById('renderer');
renderer.addEventListener('click', start);
const ctx = renderer.getContext('2d');

let count = 4;
let iter = 0;

let prevSteps = [];
let steps = [];
let runs = 0;

const countButton = document.getElementById('count');

if (countButton) countButton.onclick = countButton.oncontextmenu = (e) => {
    e.preventDefault();
    count = (e.type == 'click' ? count : count + 10) % 12 + 1;
    countButton.children[0].innerText = count;
    start();
};

function step(x, y, rad) {
    let nx = x + 10 * Math.cos(rad);
    let ny = y + 10 * Math.sin(rad);

    const rad1 = rad + Math.random() * (Math.PI / (180 / 10));
    const rad2 = rad - Math.random() * (Math.PI / (180 / 10));

    if (nx < -100 || nx > renderer.width + 100 || ny < -100 || ny > renderer.height + 100) return;

    const r = Math.random();
    if (r > 0.9) rad = rad1;
    else if (r > 0.8) rad = rad2;

    if (Math.random() > 0.99 && iter > 20) {
        steps.push(() => step(nx, ny, Math.random() > 0.5 ? rad1 : rad2));
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    if (Math.random() > 0.9) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        let cx = x + Math.random() * 100 - 50;
        let cy = y + Math.random() * 100 - 50;
        ctx.quadraticCurveTo(
            cx, cy, 
            x + Math.random() * 300 - 150, y + Math.random() * 300 - 150);
        ctx.quadraticCurveTo(
            cx + Math.random() * 40 - 20, cy + Math.random() * 40 - 20, 
            x, y);
        ctx.fill();
    }

    if (x != renderer.width / 2 && y != renderer.height / 2) steps.push(() => step(nx, ny, rad));
}

function frame(localRuns) {
    prevSteps = steps;
    steps = [];
    iter++;

    if (prevSteps.length == 0) return;

    prevSteps.forEach(f => f());

    if(runs == localRuns) requestAnimationFrame(() => frame(localRuns));
}

function start() {
    steps = [];
    prevSteps = [];
    runs++;

    ctx.clearRect(0, 0, renderer.width, renderer.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff9f';
    ctx.fillStyle = '#ffffff9f';
    
    for (let i = 0; i < count; i++) {
        const r = Math.random();
        const x = Math.random() * renderer.width;
        const y = Math.random() * renderer.height;

        steps.push(
        r < 0.5
        ? r < 0.25
            ? () => step(0, y, 0)
            : () => step(renderer.width, y, Math.PI)
        : r > 0.75
            ? () => step(x, 0, (Math.PI / 2))
            : () => step(x, renderer.height, -(Math.PI / 2))
        );
    }

    requestAnimationFrame(() => frame(runs));
}

start();