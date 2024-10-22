const renderer = document.getElementById('renderer');
renderer.addEventListener('click', start);
const ctx = renderer.getContext('2d');

let scale = 6;
let count = 1;
let prevSteps = [];
let steps = [];
let runs = 0;

const scaleButton = document.getElementById('scale');
const countButton = document.getElementById('count');

if (scaleButton) scaleButton.onclick = scaleButton.oncontextmenu = (e) => {
    e.preventDefault();
    scale = (e.type == 'click'? scale : scale + 10) % 12 + 1;
    scaleButton.children[0].innerText = scale;
    start();
};
if (countButton) countButton.onclick = countButton.oncontextmenu = (e) => {
    e.preventDefault();
    count = (e.type == 'click'? count : count + 10) % 12 + 1;
    countButton.children[0].innerText = count;
    start();
};

function step(x, y) {
    const [dx, dy] = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ][Math.floor(Math.random() * 4)];

    let nx = x + dx * scale;
    let ny = y + dy * scale;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    if (nx < -100 || nx > renderer.width + 100 || ny < -100 || ny > renderer.height + 100) return;

    if (prevSteps.length > 0) steps.push(() => step(nx, ny));
}

function frame(localRuns) {
    prevSteps = steps;
    steps = [];

    prevSteps.forEach(f => f());

    if(runs == localRuns) requestAnimationFrame(() => frame(localRuns));
}

function start() {
    steps = [];
    prevSteps = [];
    runs++;

    ctx.clearRect(0, 0, renderer.width, renderer.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ffffffff';
    
    if (count == 1) steps.push(() => step(renderer.width / 2, renderer.height / 2));
    else {
        for (let i = 0; i < count; i++) {
            let x = Math.random() * renderer.width;
            let y = Math.random() * renderer.height;
            x -= x % scale;
            y -= y % scale;
            steps.push(() => step(x, y));
        }
    }

    requestAnimationFrame(() => frame(runs));
}

start();