const renderer = document.getElementById('renderer');
renderer.addEventListener('click', start);
const ctx = renderer.getContext('2d');

let len = 10;
let init = 5;
let count = 2;
let angle = 15;
let stopped = false;
let steps = [];
let prevSteps = [];
let iterations = 0;

const lenButton = document.getElementById('len');
const initButton = document.getElementById('init');
const countButton = document.getElementById('count');
const angleButton = document.getElementById('angle');

if (lenButton) lenButton.onclick = lenButton.oncontextmenu = (e) => {
    e.preventDefault();
    len = (e.type == 'click' ? len : len + 10) % 12 + 1;
    lenButton.children[0].innerText = len;
    start();
};
if (initButton) initButton.onclick = initButton.oncontextmenu = (e) => {
    e.preventDefault();
    init = (e.type == 'click' ? init : init + 10) % 12 + 1;
    initButton.children[0].innerText = init;
    start();
};
if (countButton) countButton.onclick = countButton.oncontextmenu = (e) => {
    e.preventDefault();
    count = (e.type == 'click' ? count : count + 10) % 12 + 1;
    countButton.children[0].innerText = count;
    start();
};
if (angleButton) angleButton.onclick = angleButton.oncontextmenu = (e) => {
    e.preventDefault();
    angle = (e.type == 'click' ? angle : angle + 80) % 90 + 5;
    angleButton.children[0].innerText = angle;
    start();
};

function step(x, y, rad) {
    const length = Math.random() * len;

    const dx = length * Math.cos(rad)
    const dy = length * Math.sin(rad)
    const nx = x + dx;
    const ny = y + dy;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    const rad1 = rad + Math.random() * (Math.PI / (180 / angle));
    const rad2 = rad - Math.random() * (Math.PI / (180 / angle));

    if (nx < -100 || nx > renderer.width + 100 || ny < -100 || ny > renderer.height + 100) return;

    if (iterations <= init || Math.random() > 0.5)
        steps.push(() => step(nx, ny, rad1));
    if (iterations <= init || Math.random() > 0.5)
        steps.push(() => step(nx, ny, rad2));
}

function frame() {
    iterations++;
    prevSteps = steps;
    steps = [];

    if (!prevSteps.length) stopped = true;
    prevSteps.forEach(f => f());

    if (!stopped) requestAnimationFrame(frame);
}

function start() {
    stopped = false;
    iterations = 0;
    prevSteps = [];
    steps = [];

    ctx.clearRect(0, 0, renderer.width, renderer.height);
    ctx.lineWidth = 1
    ctx.strokeStyle = '#ffffff40'

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

    requestAnimationFrame(frame);
}

start();