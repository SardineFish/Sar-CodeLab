import { useEffect, useRef, useState } from "react";
export function useRect() {
    const ref = useRef();
    const [rect, setRect] = useState({
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        toJSON() {
            return JSON.stringify(this);
        }
    });
    useEffect(() => {
        var _a;
        const rect = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (rect)
            setRect(rect);
    }, []);
    return [rect, ref];
}
//# sourceMappingURL=use-rect.js.map