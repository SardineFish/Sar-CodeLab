/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("#canvas");
/**
 * @type {HTMLTextAreaElement}
 */
const input = document.querySelector("#input");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

input.addEventListener("blur", () =>
{
    const text = input.value;
    const data = parse(text);
    canvas.width = data.width;
    canvas.height = data.height;
    ctx.putImageData(data, 0, 0);
});

function parse(text = "")
{
    let x = 0, y = 0, w = 0, h = 0;
    let runCount = 0;
    let data;
    const pattern = {
        whiteSpace: /^(\s|\r\n|\r|\n)/,
        comment: /^#.*(\r\n|\r|\n)/,
        runCount: /^\d+/,
        header: /x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)\s*(,\s*rule\s*=\s*(\S+))?/,
        dead: /^b/i,
        alive: /^o/i,
        EOL: /^\$/i,
        final: /^!/,
    };
    while (true)
    {
        let match = pattern.whiteSpace.exec(text);
        if (match)
        {
            text = text.substr(match[0].length);
            continue;
        }
        if (match = pattern.comment.exec(text))
        {
            text = text.substr(match[0].length);
            continue;
        }
        if (match = pattern.header.exec(text))
        {
            text = text.substr(match[0].length);
            w = parseInt(match[1]);
            h = parseInt(match[2]);
            data = new ImageData(w, h);
            data.data.fill(0, 0, data.data.length);
            continue;
        }
        if (match = pattern.runCount.exec(text))
        {
            text = text.substr(match[0].length);
            runCount = parseInt(match[0]);
            continue;
        }
        if (match = pattern.dead.exec(text))
        {
            text = text.substr(match[0].length);
            for (let i = 0; i < runCount; i++)
            {
                idx = (y * w + (x + i)) * 4;
                data.data[idx + 0] =
                    data.data[idx + 1] =
                    data.data[idx + 2] = 0;
                data.data[idx + 3] = 255;
            }
            x += runCount;
            runCount = 1;
            continue;
        }
        if (match = pattern.alive.exec(text))
        {
            text = text.substr(match[0].length);
            for (let i = 0; i < runCount; i++)
            {
                idx = (y * w + (x + i)) * 4;
                data.data[idx + 0] =
                    data.data[idx + 1] =
                    data.data[idx + 2] =
                    data.data[idx + 3] = 255;
            }
            x += runCount;
            runCount = 1;
            continue;
        }
        if (match = pattern.EOL.exec(text))
        {
            text = text.substr(match[0].length);
            for (let i = 0; i < runCount; i++)
            {
                for (; x < w; x++)
                {
                    idx = (y * w + x) * 4;
                    data.data[idx + 0] =
                        data.data[idx + 1] =
                        data.data[idx + 2] = 0;
                    data.data[idx + 3] = 255;
                }
                x = 0;
                y++;
            }
            runCount = 1;
            continue;
        }
        if (match = pattern.final.exec(text))
        {
            text = text.substr(match[0].length);
            for (; x < w; x++)
            {
                idx = (y * w + x) * 4;
                data.data[idx + 0] =
                    data.data[idx + 1] =
                    data.data[idx + 2] = 0;
                data.data[idx + 3] = 255;
            }
        }
        break;
    }
    return data;
}