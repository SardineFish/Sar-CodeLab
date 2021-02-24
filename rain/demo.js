/**
 * @typedef {import("./src/index")}
 */

const canvas = document.querySelector("#canvas");
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;

const raindropFx = new SarRaindropFX(canvas, {
    spawnInterval: {
        base: 1,
        jitter: 0
    },
    spawnSize: {
        base: 100,
        jitter: 20
    }
});

raindropFx.setBackground("./assets/img/87747832_p0.jpg");
raindropFx.start();