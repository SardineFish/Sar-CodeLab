import { $ } from "./myQuery.js";
var mouseHold = false;
var mousePos = { x: 0, y: 0 };
var rotation = { x: 0, y: 0, z: 0 };
function applyRotation(rotation)
{
    $("#cube").css("transform", "rotateX(" + rotation.x + "deg)" +
                                "rotateY(" + rotation.y + "deg)" +
                                "rotateZ(" + rotation.z + "deg)");
}                       
window.addEventListener("load", function ()
{
    applyRotation(rotation);
});
window.addEventListener("mousedown", function (e)
{
    mouseHold = true;
    mousePos = { x: e.clientX, y: e.clientY };
});
window.addEventListener("mousemove", function (e)
{
    if (!mouseHold)
        return;
    
});
window.addEventListener("keydown", function (e)
{
    switch (e.key)
    {
        case "ArrowLeft":
        case "a":    
            rotation.y -= 90;
            break;
        case "ArrowRight":
        case "d":
            rotation.y += 90;
            break;
        case "ArrowUp":
        case "w":
            rotation.x += 90;
            break;
        case "ArrowDown":
        case "s":
            rotation.x -= 90;
            break;
        case "q":
            rotation.z -= 90;
            break;
        case "e":
            rotation.z += 90;
            break;
        default:
            break;
    }
    applyRotation(rotation);
});