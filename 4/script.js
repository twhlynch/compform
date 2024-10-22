const renderer = document.getElementById('renderer');
renderer.addEventListener('click', start);
const ctx = renderer.getContext('2d');

let angle = 5;
let points = 6;
let prevSteps = [];
let steps = [];
let runs = 0;

const angleButton = document.getElementById('angle');
const pointsButton = document.getElementById('points');

if (angleButton) angleButton.onclick = angleButton.oncontextmenu = (e) => {
    e.preventDefault();
    angle = (e.type == 'click' ? angle : angle + 3) % 5 + 1;
    angleButton.children[0].innerText = angle;
    start();
};
if (pointsButton) pointsButton.onclick = pointsButton.oncontextmenu = (e) => {
    e.preventDefault();
    points = (e.type == 'click'? points : points + 10) % 12 + 1;
    pointsButton.children[0].innerText = points;
    start();
};

function step(x, y, p) {

    let center = {
        x: renderer.width / 2,
        y: renderer.height / 2
    };
    
    let nx = Math.cos(angle / 360) * (x - center.x) - Math.sin(angle / 360) * (y - center.y) + center.x;
    let ny = Math.sin(angle / 360) * (x - center.x) + Math.cos(angle / 360) * (y - center.y) + center.y;

    ctx.beginPath();
    ctx.arc(x, y, p ? 2 : 5, 0, 2 * Math.PI, false);
    ctx.stroke();

    steps.push(() => step(nx, ny, p));
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
    
    let pointList = [];
    for (let i = 0; i < points; i++) {
        let x = Math.random() * renderer.width;
        let y = Math.random() * renderer.height;
        pointList.push({ x, y });
        steps.push(() => step(x, y, false));
    }
    let pathPointsList = [];
    for (let i = 0; i < points - 1; i++) {
        const point = pointList[i];
        const nextPoint = pointList[(i + 1) % points];

        for (let j = 0; j < 10; j++) {
            let x = point.x * (1 - j / 10) + nextPoint.x * (j / 10);
            let y = point.y * (1 - j / 10) + nextPoint.y * (j / 10);
            pathPointsList.push({ x, y });
            steps.push(() => step(x, y, true));
        }
    }

    requestAnimationFrame(() => frame(runs));
}

start();