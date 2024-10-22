const renderer = document.getElementById('renderer');
renderer.addEventListener('click', start);
const ctx = renderer.getContext('2d');

let count = 100;
let speed = 10;
let scale = 1;
let prevSteps = [];
let steps = [];
let runs = 0;

const countButton = document.getElementById('count');
const speedButton = document.getElementById('speed');
const scaleButton = document.getElementById('scale');

if (countButton) countButton.onclick = countButton.oncontextmenu = (e) => {
    e.preventDefault();
    count = (e.type == 'click' ? count : count + 480) % 500 + 10;
    countButton.children[0].innerText = count;
    start();
};
if (speedButton) speedButton.onclick = speedButton.oncontextmenu = (e) => {
    e.preventDefault();
    speed = (e.type == 'click'? speed : speed + 18) % 20 + 1;
    speedButton.children[0].innerText = speed;
    start();
};
if (scaleButton) scaleButton.onclick = scaleButton.oncontextmenu = (e) => {
    e.preventDefault();
    scale = (e.type == 'click'? scale : scale + 48) % 50 + 1;
    scaleButton.children[0].innerText = scale;
    start();
};

function step(x, y, rad, scale) {
    const length = Math.random() * speed;

    const dx = length * Math.cos(rad)
    const dy = length * Math.sin(rad)
    let nx = x + dx;
    let ny = y + dy;

    ctx.lineWidth = scale;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    if (nx < -100) nx += renderer.width + 99;
    if (nx > renderer.width + 100) nx -= renderer.width + 99;
    if (ny < -100) ny += renderer.height + 99;
    if (ny > renderer.height + 100) ny -= renderer.height + 99;

    const rad1 = rad + Math.random() * (Math.PI / 15);
    const rad2 = rad - Math.random() * (Math.PI / 15);

    if (Math.random() > 0.5) {
        steps.push(() => step(nx, ny, rad1, scale));
    } else {
        steps.push(() => step(nx, ny, rad2, scale));
    }
}

function frame(localRuns) {
    prevSteps = steps;
    steps = [];

    ctx.fillStyle = "#00000010";
    ctx.fillRect(0, 0, renderer.width, renderer.height);

    prevSteps.forEach(f => f());

    if(runs == localRuns) requestAnimationFrame(() => frame(localRuns));
}

function start() {
    steps = [];
    prevSteps = [];
    runs++;

    ctx.clearRect(0, 0, renderer.width, renderer.height);
    ctx.lineWidth = 1
    ctx.strokeStyle = '#ffffffff'

    for (let i = 0; i < count; i++) {
        const r = Math.random();
        const s = Math.random();
        const x = Math.random() * renderer.width;
        const y= Math.random() * renderer.height;

        steps.push(
        r < 0.5
        ? r < 0.25
            ? () => step(0, y, 0, Math.max(1, s * scale))
            : () => step(renderer.width, y, Math.PI, Math.max(1, s * scale))
        : r > 0.75
            ? () => step(x, 0, (Math.PI / 2), Math.max(1, s * scale))
            : () => step(x, renderer.height, -(Math.PI / 2), Math.max(1, s * scale))
        );
    }

    requestAnimationFrame(() => frame(runs));
}

start();