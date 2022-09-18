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

document.addEventListener("selectionchange", () =>
{
    const select = window.getSelection();
    const length = select.extentOffset - select.anchorOffset;
    console.log(select);
    $(".rand-key .range .start").innerText = select.anchorOffset;
    $(".rand-key .range .end").innerText = select.extentOffset;
    $(".rand-key .length .value").innerText = length;

    if (length === 0)
        $(".rand-key .select-hint").classList.add("hide")
    else
        $(".rand-key .select-hint").classList.remove("hide");
});

async function genkey()
{
    const rect = $(".rand-key .key").getBoundingClientRect();
    const paddingLeft = parseInt(getComputedStyle($(".rand-key .key")).paddingLeft)
    const chars = Math.floor((rect.width - paddingLeft * 2) / 9.6);
    const b64Bits = Math.floor(chars / 4) * 3;
    const key = openpgp.util.Uint8Array_to_b64(await openpgp.crypto.random.getRandomBytes(b64Bits));
    // $(".rand-key .key").value = key.replace(/\s/g, "");

    $(".rand-key .key").innerText = key.replace(/\s/g, "");
}

function calcTextWidth(count)
{
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.font = "1em Roboto Mono";
    // ctx.font = "1em";
    const measureText = ctx.measureText("M");
    console.log(measureText);
    return (measureText.actualBoundingBoxLeft + measureText.actualBoundingBoxRight) * count * window.devicePixelRatio;
}