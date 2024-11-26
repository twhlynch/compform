const renderer = document.getElementById('renderer');
renderer.addEventListener('click', start);
const ctx = renderer.getContext('2d');

let scale = 100;
let steps = [];
let prevSteps = [];
let runs = 0;
let iters = 0;

const scaleButton = document.getElementById('scale');

if (scaleButton) scaleButton.onclick = scaleButton.oncontextmenu = (e) => {
    e.preventDefault();
    scale = (e.type == 'click' ? scale : scale + 180) % 200 + 10;
    scaleButton.children[0].innerText = scale;
    start();
};

function step(x, y) {
    
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

    for (let x = 0; x < scale; x++) {
        for (let y = 0; y < scale; y++) {
            let c = Math.random() * 255;
            ctx.fillStyle = `rgb(${c}, ${c}, ${c})`;
            ctx.fillRect(x * (renderer.width / scale), y * (renderer.height / scale), renderer.width / scale, renderer.height / scale);
        }
    }

    requestAnimationFrame(() => frame(runs));
}

start();