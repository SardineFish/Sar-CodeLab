import React, { useState } from "react";
import { useRect } from "./use-rect";
import { WindowEvent } from "./window-event";
export function evaluate(curve, x) {
    if (curve.length === 0)
        return 0;
    let start = -1;
    let end = curve.length;
    for (let i = 0; i < curve.length; ++i) {
        if (curve[i].pos.x >= x) {
            end = i;
            break;
        }
        start = i;
    }
    if (start < 0) {
        const anchor = curve[0];
        return anchor.pos.y + (x - anchor.pos.x) * anchor.inTangent;
    }
    if (end >= curve.length) {
        const anchor = curve[curve.length - 1];
        return anchor.pos.y + (x - anchor.pos.x) * anchor.outTangent;
    }
    return evalSegment({ start: curve[start], end: curve[end] }, x);
}
function evalSegment(segment, x) {
    const { start, end } = segment;
    const width = (end.pos.y - start.pos.x);
    const t = (x - start.pos.x) / width;
    const startTan = start.outTangent * width;
    const endTan = end.inTangent * width;
    const t2 = t * t;
    const t3 = t2 * t;
    const a = 2 * t3 - 3 * t2 + 1;
    const b = t3 - 2 * t2 + t;
    const c = t3 - t2;
    const d = -2 * t3 + 3 * t2;
    return a * start.pos.y + b * startTan + c * endTan + d * end.pos.y;
}
export function CurveEditor(props) {
    const [rect, ref] = useRect();
    return React.createElement("div", { className: "curve-editor" },
        React.createElement("canvas", { className: "curve-canvas", ref: ref }));
}
function CurveAnchorNode(props) {
    const handleLength = props.handleLength || 30;
    const [broken, setBroken] = useState(false);
    const [focus, setFocus] = useState(false);
    const anchorMoved = (pos) => {
        var _a;
        (_a = props.anchorChanged) === null || _a === void 0 ? void 0 : _a.call(props, props.index, Object.assign(Object.assign({}, props.anchor), { pos: pos }));
    };
    const inTangentMove = (pos) => {
        var _a;
        const anchor = Object.assign(Object.assign({}, props.anchor), { inTangent: (pos.y - props.anchor.pos.y) / (pos.x - props.anchor.pos.x) });
        if (!broken)
            anchor.outTangent = anchor.inTangent;
        (_a = props.anchorChanged) === null || _a === void 0 ? void 0 : _a.call(props, props.index, anchor);
    };
    const outTnagentMove = (pos) => {
        var _a;
        const anchor = Object.assign(Object.assign({}, props.anchor), { outTangent: (pos.y - props.anchor.pos.y) / (pos.x - props.anchor.pos.x) });
        if (!broken)
            anchor.inTangent = anchor.outTangent;
        (_a = props.anchorChanged) === null || _a === void 0 ? void 0 : _a.call(props, props.index, anchor);
    };
    const keydown = (e) => {
        var _a;
        if (focus && e.key === "Delete")
            (_a = props.anchorRemoved) === null || _a === void 0 ? void 0 : _a.call(props, props.index, props.anchor);
    };
    const inAngle = Math.atan(props.anchor.inTangent);
    const outAngle = Math.atan(props.anchor.outTangent);
    const inHandle = {
        x: Math.cos(inAngle) * handleLength + props.anchor.pos.x,
        y: Math.sin(inAngle) * handleLength + props.anchor.pos.y,
    };
    const outHandle = {
        x: Math.cos(outAngle) * handleLength + props.anchor.pos.x,
        y: Math.sin(outAngle) * handleLength + props.anchor.pos.y,
    };
    const rad2Deg = 180 / Math.PI;
    return (React.createElement("div", { className: "curve-anchor" },
        React.createElement(DragHandle, { pos: props.anchor.pos, rect: props.rect, onPosChanged: anchorMoved, focus: props.onFocus }),
        React.createElement(WindowEvent, { event: "keydown", listener: keydown }),
        React.createElement("div", { className: "curve-tangent-in", style: { width: `${handleLength}px`, height: `2px`, rotate: `${inAngle * rad2Deg}deg` } },
            React.createElement(DragHandle, { pos: inHandle, rect: props.rect, onPosChanged: inTangentMove, focus: props.onFocus })),
        React.createElement("div", { className: "curve-tangent-out", style: { width: `${handleLength}px`, height: `2px`, rotate: `${180 + inAngle * rad2Deg}deg` } },
            React.createElement(DragHandle, { pos: outHandle, rect: props.rect, onPosChanged: outTnagentMove, focus: props.onFocus }))));
}
function DragHandle(props) {
    const [drag, setDrag] = useState(false);
    const mouseDown = (e) => {
        setDrag(true);
    };
    const mouseMove = (e) => {
        var _a;
        (_a = props.onPosChanged) === null || _a === void 0 ? void 0 : _a.call(props, {
            x: e.clientX - props.rect.left,
            y: e.clientY - props.rect.top,
        });
    };
    const mouseUp = (e) => {
        setDrag(false);
    };
    return (React.createElement("div", { className: "curve-handle", onMouseDown: mouseDown },
        React.createElement("div", { className: "curve-handle-renderer" }),
        drag
            ? React.createElement(React.Fragment, null,
                React.createElement(WindowEvent, { event: "mousemove", listener: mouseMove }),
                React.createElement(WindowEvent, { event: "mouseup", listener: mouseUp }))
            : null));
}
//# sourceMappingURL=index.js.map