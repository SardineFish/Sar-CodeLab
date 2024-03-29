// import * as ace from "../lib/ace-builds";
// import "../lib/ace-builds/src-noconflict/ext-language_tools";
import { Color, vec2 } from "./lib";
import * as monaco from "monaco-editor";

const $ = (selector: string) => <HTMLElement>document.querySelector(selector);

type RenderFn = (x: number, y: number) => Color | [number, number, number, number] | number;
let userlib: string;
let livePreview = false;

interface Config
{
	width?: number,
	height?: number,
	background?: string | Color,
	normalizedInput?: boolean,
	livePreview?: boolean,
}

function initCanvas(config: Config)
{
	const canvas = $("#canvas") as HTMLCanvasElement;
	canvas.width = config.width ?? 256;
	canvas.height = config.height ?? 256;
}
const onEditorChanged = () =>
{
	setTimeout(() =>
	{
		// const code = editor.session.getDocument().getValue();
		// renderCaller(userlib + code);
	});
}
function renderCaller(code: string)
{
	let _userConfig: Config = {
		width: 256,
		height: 256,
		background: Color.transparent,
		normalizedInput: false,
		livePreview: false,
	};

	initCanvas(_userConfig);

	function config(config: Config)
	{
		_userConfig = config;
		initCanvas(config);
		livePreview = livePreview;
	}
	function render(func: RenderFn)
	{
		const canvas = $("#canvas") as HTMLCanvasElement;
		const ctx = canvas.getContext("2d");
		const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let imgY = 0; imgY < canvas.height; imgY++)
		{
			for (let imgX = 0; imgX < canvas.width; imgX++)
			{
				const pos = _userConfig.normalizedInput
					? vec2(imgX / canvas.width, (canvas.height - imgY - 1) / canvas.height)
					: vec2(imgX, canvas.height - imgY - 1);
				const color = func(pos.x, pos.y);
				if (color instanceof Color)
				{
					let idx = (imgY * data.width + imgX) * 4;
					data.data[idx + 0] = Math.floor(color.r * 255);
					data.data[idx + 1] = Math.floor(color.g * 255);
					data.data[idx + 2] = Math.floor(color.b * 255);
					data.data[idx + 3] = Math.floor(color.a * 255);
				}
				else if (color instanceof Array)
				{
					const [r, g, b, a] = color;
					let idx = (imgY * data.width + imgX) * 4;
					data.data[idx + 0] = Math.floor(r * 255);
					data.data[idx + 1] = Math.floor(g * 255);
					data.data[idx + 2] = Math.floor(b * 255);
					data.data[idx + 3] = Math.floor(a * 255);
				}
				else if (typeof (color) === "number")
				{
					let idx = (imgY * data.width + imgX) * 4;
					data.data[idx + 0] = Math.floor(color * 255);
					data.data[idx + 1] = Math.floor(color * 255);
					data.data[idx + 2] = Math.floor(color * 255);
					data.data[idx + 3] = Math.floor(color * 255);
				}
			}
		}
		ctx.putImageData(data, 0, 0);
	}

	eval(code);


}
// ace.config.set("basePath", "lib/ace-builds/src-min-noconflict");
// const editor = ace.edit($("#editor-wrapper"));
// editor.setOptions({
// 	enableBasicAutocompletion: true,
// 	enableLiveAutocompletion: true,
// 	autoScrollEditorIntoView: true,
// 	hScrollBarAlwaysVisible: true,
// 	vScrollBarAlwaysVisible: true,
// 	fontSize: "11pt",
// 	fontFamily: "consolas",
// });
// editor.setTheme("ace/theme/monokai");
// editor.session.setMode("ace/mode/javascript");
function renderOnType(code: string)
{
	let timeout: number;
	if (timeout)
	{
		clearTimeout(timeout);
		timeout = 0;
	}
	timeout = setTimeout(() =>
	{
		renderCaller(userlib + code);
	}, 500);

}
async function load()
{
	const demo = await fetch("lib/user-lib/build/demo.js").then(r => r.text());
	userlib = await fetch("lib/user-lib/build/user-lib.js").then(r => r.text());
	const libDeclaration = await fetch("lib/user-lib/build/user-lib.d.ts").then(r => r.text());

	monaco.languages.typescript.javascriptDefaults.addExtraLib(libDeclaration, "ts:lib/user-lib/build/user-lib.d.ts");

	const editor = monaco.editor.create($("#editor-wrapper"), {
		value: demo,
		language: "javascript",
		theme: "vs-dark",
	});
	editor.onDidChangeModelContent((e) =>
	{
		if (livePreview)
			renderOnType(editor.getValue());
	});
	$("#button-render").addEventListener("click", () =>
	{
		const code = editor.getValue();
		renderCaller(userlib + code);
	});
	renderCaller(userlib + demo);
}
load();
// fetch("lib/user-lib/build/demo.js")
// 	.then(response => response.text())
// 	.then(code =>
// 	{
// 		monaco.editor.create($("#editor-wrapper"), {
// 			value: code,
// 			language: "javascript",
// 			theme: "vs-dark",
// 		});
// 		// editor.session.getDocument().setValue(code);

// 		fetch("lib/user-lib/build/user-lib.js")
// 			.then((response) => response.text())
// 			.then((lib) =>
// 			{
// 				$("#button-render").addEventListener("click", () =>
// 				{
// 					// const code = editor.session.getDocument().getValue();
// 					renderCaller(lib + code);
// 				});
// 				userlib = lib;
// 				// editor.on("change", (e) =>
// 				// {
// 				// 	setTimeout(() =>
// 				// 	{
// 				// 		const code = editor.session.getDocument().getValue();
// 				// 		renderCaller(lib + code);
// 				// 	});
// 				// });

// 				// var code = editor.session.getDocument().getValue();
// 				renderCaller(lib + code);
// 			});
// 	});