/**
 * @typedef {import("./src/index")}
 */

const canvas = document.querySelector("#canvas");
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;

const raindropFx = new SarRaindropFX({
    spawnInterval: [0.1, 0.1],
    canvas: canvas,
    background: "./assets/img/84765992_p0.jpg"
});

// raindropFx.setBackground("./assets/img/84765992_p0.jpg");
// raindropFx.start();
// (async () =>
// {
//     await raindropFx.load();
//     raindropFx.start();
// })();

raindropFx.start();