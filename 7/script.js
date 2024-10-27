const renderer = document.getElementById('renderer');
renderer.addEventListener('click', start);
const ctx = renderer.getContext('2d');

let count = 4;
let runs = 0;
let steps = [];
let prevSteps = [];

let directions = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

const countButton = document.getElementById('count');

if (countButton) countButton.onclick = countButton.oncontextmenu = (e) => {
    e.preventDefault();
    count = (e.type == 'click' ? count : count + 10) % 12 + 1;
    countButton.children[0].innerText = count;
    start();
};

function step(x, y, rad, i) {
    let nx = x + 10 * Math.cos(rad);
    let ny = y + 10 * Math.sin(rad);

    if (nx < -100 || nx > renderer.width + 100 || ny < -100 || ny > renderer.height + 100) return;

    if (Math.random() > 0.99 + steps.length * 0.001) {
        steps.push(() => step(nx, ny, rad, i));
    }

    if (Math.random() > 0.95) {

        ctx.beginPath();
        ctx.arc(nx, ny, 10, Math.PI * 2, 0);
        ctx.stroke();

        i++;
        if (i >= directions.length) i = 0;
        rad = directions[i];
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    if (x != renderer.width / 2 && y != renderer.height / 2) steps.push(() => step(nx, ny, rad, i));
}

function frame(localRuns) {
    prevSteps = steps;
    steps = [];

    if (prevSteps.length == 0) return;

    prevSteps.forEach(f => f());

    if(runs == localRuns) requestAnimationFrame(() => frame(localRuns));
}

function start() {
    steps = [];
    prevSteps = [];
    runs++;

    ctx.clearRect(0, 0, renderer.width, renderer.height);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ffffff70';

    for (let i = 0; i < count; i++) {
        const x = Math.random() * renderer.width;
        const y = Math.random() * renderer.height;
        const _i = Math.floor(Math.random() * directions.length);
        const r = directions[_i];

        ctx.beginPath();
        ctx.arc(x, y, 10, Math.PI * 2, 0);
        ctx.stroke();

        steps.push(() => step(x, y, r, _i));
    }

    requestAnimationFrame(() => frame(runs));
}

start();