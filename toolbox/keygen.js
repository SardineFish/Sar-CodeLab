/** @type {typeof document.querySelector} */
const $ = (selector) => document.querySelector(selector);

const KEY_SIZE = 36;

window.addEventListener("load", () =>
{
    genkey();
});

$(".rand-key .button-update").addEventListener("click", async () =>
{
    genkey();
});

async function genkey()
{
    const rect = $(".rand-key .key").getBoundingClientRect();
    const chars = Math.floor(rect.width / calcTextWidth(1));
    const b64Bits = Math.floor(chars / 6) * 24 / 8;
    const key = openpgp.util.Uint8Array_to_b64(await openpgp.crypto.random.getRandomBytes(b64Bits));
    $(".rand-key .key").innerText = key.replace(/\s/g, "");
}

function calcTextWidth(count)
{
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.font = "Roboto Mono";
    // ctx.font = "1em";
    const measureText = ctx.measureText("X");
    return (measureText.actualBoundingBoxLeft + measureText.actualBoundingBoxRight) * count;
}