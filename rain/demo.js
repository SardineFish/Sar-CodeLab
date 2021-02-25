/**
 * @typedef {import("./src/index")}
 */

const canvas = document.querySelector("#canvas");
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;

const raindropFx = new SarRaindropFX(canvas, {
});

raindropFx.setBackground("./assets/img/84765992_p0.jpg");
raindropFx.start();