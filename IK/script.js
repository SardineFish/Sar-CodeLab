function IKCCD(bones, n, iteration, target)
{
    for (let it = 0; it < iteration; it++)
    {
        for (let i = n - 1; i >= 0; i--)
        {
            const endEffect = plus(bones[n - 1].root, bones[n - 1].direction);
            const toEndEffect = minus(endEffect, bones[i].root);
            const toTarget = minus(target, bones[i].root);

            let dAngle = vectorAngle(toTarget) - vectorAngle(toEndEffect);
            //dAngle = 10;
            for (let j = i; j < n; j++)
            {
                bones[j].root = rotateP(bones[j].root, bones[i].root, dAngle);
                bones[j].direction = rotateV(bones[j].direction, dAngle);
            }    
        }
    }
    let bonesAngle = [];
    let prevAngle = 0;
    for (let i = 0; i < n; i++)
    {
        bonesAngle[i] = vectorAngle(bones[i].direction) - prevAngle;
        prevAngle = vectorAngle(bones[i].direction);
    }    
    return bonesAngle;
}
test(IKCCD);

function rotateP(p,o, ang)
{
    const dp = minus(p, o);
    return plus(o, rotateV(dp, ang));
}

function rotateV(v, ang)
{
    const cos = Math.cos(ang / 180 * Math.PI);
    const sin = Math.sin(ang / 180 * Math.PI);
    return new vec2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
}

function vectorAngle(v)
{
    return Math.atan2(v.y, v.x) / Math.PI * 180;
}
