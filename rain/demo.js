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
        jitter: 40
    }
});

raindropFx.setBackground("./assets/img/84765992_p0.jpg");
raindropFx.start();