const renderer = document.getElementById('renderer');
renderer.addEventListener('click', start);
const ctx = renderer.getContext('2d');

let count = 3;
let speed = 1;
let scale = 3;
let prevSteps = [];
let steps = [];
let runs = 0;
let iters = 0;

const countButton = document.getElementById('count');

if (countButton) countButton.onclick = countButton.oncontextmenu = (e) => {
    e.preventDefault();
    count = (e.type == 'click' ? count : count + 10) % 12 + 1;
    countButton.children[0].innerText = count;
    start();
};

function step(x, y, rad, scale, active) {
    const length = speed;

    const dx = length * Math.cos(rad)
    const dy = length * Math.sin(rad)
    let nx = x + dx;
    let ny = y + dy;

    ctx.lineWidth = scale;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    if (Math.random() > 0.999) {
        active = [
            [0, 0],
            [0, renderer.height],
            [renderer.width, 0],
            [renderer.width, renderer.height]
        ][Math.floor(Math.random() * 4)];
    }
    if (Math.random() > 0.99) active = false;

    if (active && iters % 5 == 0) {
        ctx.setLineDash([2, 2]);

        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(active[0], active[1]);
        ctx.stroke();

        ctx.setLineDash([]);
    }

    if (
        nx < -100 ||
        nx > renderer.width + 100 ||
        ny < -100 ||
        ny > renderer.height + 100
    ) return;

    if (rad > -Math.PI / 2) rad -= Math.abs(-Math.PI / 2 - rad) / 1000;
    else if (rad < -Math.PI / 2) rad += Math.abs(-Math.PI / 2 - rad) / 1000;

    if (Math.random() > 0.99 && prevSteps.length < 15) {
        const _x = Math.random() * renderer.width;
        const _y = renderer.height;
        const _r = -Math.PI / 2 
            + 3 * (Math.random() > 0.5 ? -Math.PI / 8 : Math.PI / 8)
            + (Math.random() * Math.PI / 4 - Math.PI / 8);

        steps.push(
            () => step(_x, _y, _r, scale, false)
        );
    }
    steps.push(() => step(nx, ny, rad, scale, active));
}

function frame(localRuns) {
    prevSteps = steps;
    steps = [];
    iters++;

    if (iters % 10 == 0) {
        ctx.fillStyle = "#00000010";
        ctx.fillRect(0, 0, renderer.width, renderer.height);
    }

    prevSteps.forEach(f => f());

    if(runs == localRuns) requestAnimationFrame(() => frame(localRuns));
}

function start() {
    steps = [];
    prevSteps = [];
    runs++;
    iters = 0;

    ctx.clearRect(0, 0, renderer.width, renderer.height);
    ctx.lineWidth = 1
    ctx.strokeStyle = '#ffffffff'

    for (let i = 0; i < count; i++) {
        const x = Math.random() * renderer.width;
        const y = renderer.height;
        const r = -Math.PI / 2 
            + 3 * (Math.random() > 0.5 ? -Math.PI / 8 : Math.PI / 8)
            + (Math.random() * Math.PI / 4 - Math.PI / 8);

        steps.push(
            () => step(x, y, r, Math.random() * scale, false)
        );
    }

    requestAnimationFrame(() => frame(runs));
}

start();