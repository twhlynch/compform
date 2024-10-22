const toTop = document.getElementById("toTop");

if (toTop) {
    toTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

const backgroundRenderer = document.getElementById("renderer");
backgroundRenderer.width = window.innerWidth * 2;
backgroundRenderer.height = window.innerHeight * 2;

window.addEventListener("resize", () => {
    backgroundRenderer.width = window.innerWidth * 2;
    backgroundRenderer.height = window.innerHeight * 2;
    start();
});