/// <reference types="react" />
export declare type vec2 = {
    x: number;
    y: number;
};
export interface CurveAnchor {
    pos: vec2;
    inTangent: number;
    outTangent: number;
}
export interface CurveSegment {
    start: CurveAnchor;
    end: CurveAnchor;
}
export declare function evaluate(curve: CurveAnchor[], x: number): number;
export interface CurveEditorProps {
    width?: number;
    height?: number;
    onCurveChanged?: (curve: CurveAnchor[]) => void;
}
export declare function CurveEditor(props: CurveEditorProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map