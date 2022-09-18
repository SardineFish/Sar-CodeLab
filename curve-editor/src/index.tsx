import React, { useState } from "react";
import { useRect } from "./use-rect";
import { WindowEvent } from "./window-event";

export type vec2 = { x: number, y: number };

export interface CurveAnchor
{
    pos: vec2,
    inTangent: number,
    outTangent: number,
}

export interface CurveSegment
{
    start: CurveAnchor,
    end: CurveAnchor,
}

export function evaluate(curve: CurveAnchor[], x: number): number
{
    if (curve.length === 0)
        return 0;

    let start = -1;
    let end = curve.length;
    for (let i = 0; i < curve.length; ++i)
    {
        if (curve[i].pos.x >= x)
        {
            end = i;
            break;
        }
        start = i;
    }

    if (start < 0)
    {
        const anchor = curve[0];
        return anchor.pos.y + (x - anchor.pos.x) * anchor.inTangent;
    }
    if (end >= curve.length)
    {
        const anchor = curve[curve.length - 1];
        return anchor.pos.y + (x - anchor.pos.x) * anchor.outTangent;
    }

    return evalSegment({ start: curve[start], end: curve[end] }, x);
}

function evalSegment(segment: CurveSegment, x: number)
{
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

export interface CurveEditorProps
{
    width?: number;
    height?: number;
    onCurveChanged?: (curve: CurveAnchor[]) => void,
}

export function CurveEditor(props: CurveEditorProps)
{
    const [rect, ref] = useRect<HTMLCanvasElement>();

    return <div className="curve-editor">
        <canvas className="curve-canvas" ref={ref}>

        </canvas>
    </div>
}

interface CurveAnchorNodeProps
{
    index: number,
    anchor: CurveAnchor,
    rect: DOMRect,
    handleLength?: number,
    anchorRemoved?: (index: number, anchor: CurveAnchor) => void,
    anchorChanged?: (index: number, anchor: CurveAnchor) => void,
    onFocus?: () => void
}

function CurveAnchorNode(props: CurveAnchorNodeProps)
{
    const handleLength = props.handleLength || 30;
    const [broken, setBroken] = useState(false);
    const [focus, setFocus] = useState(false);

    const anchorMoved = (pos: vec2) =>
    {
        props.anchorChanged?.(props.index, {
            ...props.anchor,
            pos: pos
        });
    };
    const inTangentMove = (pos: vec2) =>
    {
        const anchor: CurveAnchor = {
            ...props.anchor,
            inTangent: (pos.y - props.anchor.pos.y) / (pos.x - props.anchor.pos.x)
        };
        if (!broken)
            anchor.outTangent = anchor.inTangent;
        props.anchorChanged?.(props.index, anchor);
    };
    const outTnagentMove = (pos: vec2) =>
    {
        const anchor: CurveAnchor = {
            ...props.anchor,
            outTangent: (pos.y - props.anchor.pos.y) / (pos.x - props.anchor.pos.x)
        };
        if (!broken)
            anchor.inTangent = anchor.outTangent;
        props.anchorChanged?.(props.index, anchor);
    };
    const keydown = (e: KeyboardEvent) =>
    {
        if (focus && e.key === "Delete")
            props.anchorRemoved?.(props.index, props.anchor);
    };

    const inAngle = Math.atan(props.anchor.inTangent);
    const outAngle = Math.atan(props.anchor.outTangent);
    const inHandle: vec2 = {
        x: Math.cos(inAngle) * handleLength + props.anchor.pos.x,
        y: Math.sin(inAngle) * handleLength + props.anchor.pos.y,
    };
    const outHandle: vec2 = {
        x: Math.cos(outAngle) * handleLength + props.anchor.pos.x,
        y: Math.sin(outAngle) * handleLength + props.anchor.pos.y,
    };
    const rad2Deg = 180 / Math.PI;

    return (<div className="curve-anchor">
        <DragHandle pos={props.anchor.pos} rect={props.rect} onPosChanged={anchorMoved} focus={props.onFocus}/>
        <WindowEvent event="keydown" listener={keydown}/>
        <div className="curve-tangent-in" style={{width: `${handleLength}px`, height: `2px`, rotate: `${inAngle * rad2Deg}deg`}}>
            <DragHandle pos={inHandle} rect={props.rect} onPosChanged={inTangentMove} focus={props.onFocus}/>
        </div>
        <div className="curve-tangent-out" style={{ width: `${handleLength}px`, height: `2px`, rotate: `${180 + inAngle * rad2Deg}deg` }}>
            <DragHandle pos={outHandle} rect={props.rect} onPosChanged={outTnagentMove} focus={props.onFocus}/>
        </div>
    </div>);
}

function DragHandle(props: { pos: vec2, rect: DOMRect, onPosChanged?: (pos: vec2) => void, focus?: ()=>void })
{
    const [drag, setDrag] = useState(false);

    const mouseDown = (e: React.MouseEvent<HTMLDivElement>) =>
    {
        setDrag(true);
    };

    const mouseMove = (e: MouseEvent) =>
    {
        props.onPosChanged?.({
            x: e.clientX - props.rect.left,
            y: e.clientY - props.rect.top,
        });
    };

    const mouseUp = (e: MouseEvent) =>
    {
        setDrag(false);
    };

    return (<div className="curve-handle" onMouseDown={mouseDown} >
        <div className="curve-handle-renderer"></div>
        {
            drag
                ? <>
                    <WindowEvent event="mousemove" listener={mouseMove} />
                    <WindowEvent event="mouseup" listener={mouseUp} />
                </>
                : null
        }
    </div>)
}