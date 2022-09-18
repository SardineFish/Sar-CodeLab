import { MutableRefObject, useEffect, useRef, useState } from "react";

export function useRect<T extends Element>(): [DOMRect, MutableRefObject<HTMLCanvasElement | null>]
{
    const ref = useRef<T>();
    const [rect, setRect] = useState<DOMRect>({
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        toJSON()
        {
            return JSON.stringify(this);
        }
    });

    useEffect(() =>
    {
        const rect = ref.current?.getBoundingClientRect();
        if (rect)
            setRect(rect);
    }, []);

    return [rect, ref as any];
}