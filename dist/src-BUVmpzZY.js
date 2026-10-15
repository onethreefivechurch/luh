//#region src/name.ts
var e = "luh", t = "#e5484d", n = /* @__PURE__ */ new Map();
async function r(e, t = () => {}) {
	let r = document.documentElement;
	try {
		let { createContext: a, destroyContext: o, domToBlob: s } = await import("./dist-B3Z-tFLj.js");
		await document.fonts?.ready;
		let c = [r], l = 0, u = await a(r, {
			filter: (e) => {
				if (e instanceof Element) {
					if (e === u.sandbox || getComputedStyle(e).display === "none") return !1;
					c.push(e);
				}
				return !0;
			},
			width: window.innerWidth,
			height: window.innerHeight,
			scale: Math.min(window.devicePixelRatio || 1, 2),
			backgroundColor: getComputedStyle(document.body).backgroundColor,
			type: "image/png",
			progress: (e, n) => t(n === 0 ? 90 : Math.round(e / n * 90)),
			features: { restoreScrollPosition: !0 },
			onCloneNode: () => t(0),
			onEmbedNode: () => t(95),
			onCloneEachNode: (t) => {
				if (!(t instanceof Element)) return;
				let n = c.pop();
				if (!(t instanceof HTMLElement) || !(n instanceof HTMLElement)) return;
				t instanceof HTMLInputElement && t.type === "password" && (t.value = "", t.setAttribute("value", "")), n.matches(e) && (t.style.opacity = "0"), t instanceof HTMLImageElement && n instanceof HTMLImageElement && i(n, t);
				let r = getComputedStyle(n);
				if (t.matches("input, textarea")) {
					let e = getComputedStyle(n, "::placeholder"), r = `luh-placeholder-${l++}`;
					t.classList.add(r), u.svgStyleElement?.appendChild(document.createTextNode(`.${r}::placeholder { color: ${e.color}; -webkit-text-fill-color: ${e.webkitTextFillColor}; opacity: ${e.opacity}; }`));
				}
				let a = n.offsetWidth - n.clientWidth - parseFloat(r.borderLeftWidth) - parseFloat(r.borderRightWidth), o = n.offsetHeight - n.clientHeight - parseFloat(r.borderTopWidth) - parseFloat(r.borderBottomWidth);
				[
					"auto",
					"scroll",
					"overlay"
				].includes(t.style.overflowX) && o < 1 && (t.style.overflowX = "hidden"), [
					"auto",
					"scroll",
					"overlay"
				].includes(t.style.overflowY) && a < 1 && (t.style.overflowY = "hidden");
			}
		});
		u.fontCssTexts = new Map(n);
		try {
			let e = await s(u);
			return t(100), e;
		} finally {
			u.fontCssTexts.forEach((e, t) => n.set(t, e)), o(u);
		}
	} catch {
		return null;
	}
}
function i(e, t) {
	if (e.complete && e.naturalWidth && e.naturalHeight) try {
		let n = document.createElement("canvas"), r = Math.min(2, Math.max(e.width / e.naturalWidth, e.height / e.naturalHeight) * Math.min(window.devicePixelRatio || 1, 2));
		n.width = Math.max(1, Math.ceil(e.naturalWidth * r)), n.height = Math.max(1, Math.ceil(e.naturalHeight * r));
		let i = n.getContext("2d");
		if (!i) return;
		i.drawImage(e, 0, 0, n.width, n.height);
		let a = n.toDataURL("image/png");
		t.srcset = "", t.src = a;
	} catch {}
}
function a(e, t) {
	let n = Math.max(0, e.left), r = Math.max(0, e.top), i = Math.min(t.width, e.left + e.width) - n, a = Math.min(t.height, e.top + e.height) - r;
	return i > 0 && a > 0 ? {
		left: n,
		top: r,
		width: i,
		height: a
	} : null;
}
async function o(e, t, n) {
	try {
		let r = await createImageBitmap(e), i = n(r, r.width / t.width);
		return r.close(), i ? await new Promise((e) => i.toBlob(e, "image/png")) : null;
	} catch {
		return null;
	}
}
function s(e, t, n) {
	return o(e, n, (e, r) => {
		let i = a(t, n);
		if (!i) return null;
		let o = document.createElement("canvas");
		return o.width = Math.ceil(i.width * r), o.height = Math.ceil(i.height * r), o.getContext("2d")?.drawImage(e, i.left * r, i.top * r, i.width * r, i.height * r, 0, 0, o.width, o.height), o;
	});
}
function c(e, n, r) {
	return o(e, r, (e, i) => {
		let o = document.createElement("canvas");
		o.width = e.width, o.height = e.height;
		let s = o.getContext("2d");
		if (!s) return null;
		s.drawImage(e, 0, 0);
		let c = a(n, r);
		if (!c) return o;
		let l = 3 * i, u = [
			c.left * i - l,
			c.top * i - l,
			c.width * i + l * 2,
			c.height * i + l * 2
		];
		return s.lineJoin = "round", s.strokeStyle = "rgba(255, 255, 255, 0.9)", s.lineWidth = 6 * i, s.strokeRect(...u), s.strokeStyle = t, s.lineWidth = 3 * i, s.strokeRect(...u), o;
	});
}
//#endregion
//#region node_modules/@medv/finder/finder.js
var l = /* @__PURE__ */ new Set([
	"role",
	"name",
	"aria-label",
	"rel",
	"href"
]);
function u(e, t) {
	let n = l.has(e);
	n ||= e.startsWith("data-") && g(e);
	let r = g(t) && t.length < 100;
	return r ||= t.startsWith("#") && g(t.slice(1)), n && r;
}
function d(e) {
	return g(e);
}
function f(e) {
	return g(e);
}
function p(e) {
	return !0;
}
function m(e, t) {
	if (e.nodeType !== Node.ELEMENT_NODE) throw Error("Can't generate CSS selector for non-element node type.");
	if (e.tagName.toLowerCase() === "html") return "html";
	let n = {
		root: document.body,
		idName: d,
		className: f,
		tagName: p,
		attr: u,
		timeoutMs: 1e3,
		seedMinLength: 3,
		optimizedMinLength: 2,
		maxNumberOfPathChecks: Infinity
	}, r = /* @__PURE__ */ new Date(), i = {
		...n,
		...t
	}, a = w(i.root, n), o, s = 0;
	for (let t of h(e, i, a)) {
		if ((/* @__PURE__ */ new Date()).getTime() - r.getTime() > i.timeoutMs || s >= i.maxNumberOfPathChecks) {
			let t = ee(e, a);
			if (!t) throw Error(`Timeout: Can't find a unique selector after ${i.timeoutMs}ms`);
			return v(t);
		}
		if (s++, T(t, a)) {
			o = t;
			break;
		}
	}
	if (!o) throw Error("Selector was not found.");
	let c = [...E(o, e, i, a, r)];
	return c.sort(b), c.length > 0 ? v(c[0]) : v(o);
}
function* h(e, t, n) {
	let r = [], i = [], a = e, o = 0;
	for (; a && a !== n;) {
		let e = _(a, t);
		for (let t of e) t.level = o;
		if (r.push(e), a = a.parentElement, o++, i.push(...C(r)), o >= t.seedMinLength) {
			i.sort(b);
			for (let e of i) yield e;
			i = [];
		}
	}
	i.sort(b);
	for (let e of i) yield e;
}
function g(e) {
	if (/^[a-z\-]{3,}$/i.test(e)) {
		let t = e.split(/-|[A-Z]/);
		for (let e of t) if (e.length <= 2 || /[^aeiou]{4,}/i.test(e)) return !1;
		return !0;
	}
	return !1;
}
function _(e, t) {
	let n = [], r = e.getAttribute("id");
	r && t.idName(r) && n.push({
		name: "#" + CSS.escape(r),
		penalty: 0
	});
	for (let r = 0; r < e.classList.length; r++) {
		let i = e.classList[r];
		t.className(i) && n.push({
			name: "." + CSS.escape(i),
			penalty: 1
		});
	}
	for (let r = 0; r < e.attributes.length; r++) {
		let i = e.attributes[r];
		t.attr(i.name, i.value) && n.push({
			name: `[${CSS.escape(i.name)}="${CSS.escape(i.value)}"]`,
			penalty: 2
		});
	}
	let i = e.tagName.toLowerCase();
	if (t.tagName(i)) {
		n.push({
			name: i,
			penalty: 5
		});
		let t = x(e, i);
		t !== void 0 && n.push({
			name: S(i, t),
			penalty: 10
		});
	}
	let a = x(e);
	return a !== void 0 && n.push({
		name: te(i, a),
		penalty: 50
	}), n;
}
function v(e) {
	let t = e[0], n = t.name;
	for (let r = 1; r < e.length; r++) {
		let i = e[r].level || 0;
		n = t.level === i - 1 ? `${e[r].name} > ${n}` : `${e[r].name} ${n}`, t = e[r];
	}
	return n;
}
function y(e) {
	return e.map((e) => e.penalty).reduce((e, t) => e + t, 0);
}
function b(e, t) {
	return y(e) - y(t);
}
function x(e, t) {
	let n = e.parentNode;
	if (!n) return;
	let r = n.firstChild;
	if (!r) return;
	let i = 0;
	for (; r && (r.nodeType === Node.ELEMENT_NODE && (t === void 0 || r.tagName.toLowerCase() === t) && i++, r !== e);) r = r.nextSibling;
	return i;
}
function ee(e, t) {
	let n = 0, r = e, i = [];
	for (; r && r !== t;) {
		let e = r.tagName.toLowerCase(), t = x(r, e);
		if (t === void 0) return;
		i.push({
			name: S(e, t),
			penalty: NaN,
			level: n
		}), r = r.parentElement, n++;
	}
	if (T(i, t)) return i;
}
function te(e, t) {
	return e === "html" ? "html" : `${e}:nth-child(${t})`;
}
function S(e, t) {
	return e === "html" ? "html" : `${e}:nth-of-type(${t})`;
}
function* C(e, t = []) {
	if (e.length > 0) for (let n of e[0]) yield* C(e.slice(1, e.length), t.concat(n));
	else yield t;
}
function w(e, t) {
	return e.nodeType === Node.DOCUMENT_NODE ? e : e === t.root ? e.ownerDocument : e;
}
function T(e, t) {
	let n = v(e);
	switch (t.querySelectorAll(n).length) {
		case 0: throw Error(`Can't select any node with this selector: ${n}`);
		case 1: return !0;
		default: return !1;
	}
}
function* E(e, t, n, r, i) {
	if (e.length > 2 && e.length > n.optimizedMinLength) for (let a = 1; a < e.length - 1; a++) {
		if ((/* @__PURE__ */ new Date()).getTime() - i.getTime() > n.timeoutMs) return;
		let o = [...e];
		o.splice(a, 1), T(o, r) && r.querySelector(v(o)) === t && (yield o, yield* E(o, t, n, r, i));
	}
}
//#endregion
//#region src/strings.ts
var D = {
	nameLabel: "Your name",
	nameOptional: "Your name (optional)",
	namePlaceholder: "Name",
	nameRequired: "Enter your name before sending.",
	notAllowed: "Feedback is not available for this account.",
	sendShortcut: "Ctrl+Enter",
	controlKey: "Ctrl",
	deleteKey: "Delete",
	title: "Send feedback",
	close: "Close",
	cancel: "Cancel",
	send: "Send",
	sending: "Sending…",
	sent: "Sent. Thank you.",
	failed: "That didn't send. Check your connection and try again.",
	placeholder: "Write your note",
	kindLabel: "Kind",
	moveWindow: "Move with arrow keys",
	wider: "Wider",
	widerHint: "Wider · pick what holds it",
	narrower: "Narrower",
	selection: "Selected words",
	screenshot: "Screenshot this page",
	screenshotTaking: "Taking a screenshot…",
	screenshotFailed: "The screenshot didn't work. Add an image or send your words.",
	addImages: "Add images",
	dropHint: "or drag and drop images here, as many as you like.",
	dropHere: "Drop images to add them",
	images: "Images",
	screenshotName: "Screenshot",
	elementImageName: "The part you picked",
	draw: "Draw on it",
	drawOn: "Draw on {name}",
	removeNamed: "Remove {name}",
	tooMany: "Up to {max} images.",
	wrongImage: "{name} can't be added: images only (PNG, JPEG or WebP), up to {size} MB.",
	discardTitle: "Discard this note?",
	keepEditing: "Keep editing",
	discard: "Discard",
	trigger: "Luh!",
	modeOn: "Comment mode on. Click anything, or select words, to comment on it. Escape to finish.",
	modeOff: "Comment mode off.",
	pickHint: "↑ wider",
	drawTitle: "Draw on image",
	arrow: "Arrow",
	box: "Box",
	text: "Text",
	blur: "Blur",
	crop: "Crop",
	undo: "Undo",
	redo: "Redo",
	deleteMark: "Delete",
	done: "Done",
	removeImage: "Remove image",
	drawing: "Image being drawn on",
	wordsOnImage: "Words on the image",
	drawHelp: "Drag to draw. Click a mark to select it, drag to move it, Delete to remove it. Escape finishes.",
	markLabel: "{kind} {number}",
	link: "Link",
	button: "Button",
	field: "Field",
	choice: "Choice",
	label: "Label",
	image: "Image",
	icon: "Icon",
	heading: "Heading",
	textKind: "Text",
	row: "Row",
	cell: "Cell",
	table: "Table",
	list: "List",
	menu: "Menu",
	form: "Form",
	area: "Area",
	named: "{kind} “{label}”"
};
function O(e, t = {}) {
	return e.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e);
}
var k = { en: D };
function A(e = "en", t = {}, n = {}) {
	let r = e.toLowerCase().replace(/_/g, "-"), i = Object.fromEntries(Object.entries({
		...k,
		...t
	}).map(([e, t]) => [e.toLowerCase().replace(/_/g, "-"), t]));
	return {
		...D,
		...i[r.split("-")[0]],
		...i[r],
		...n
	};
}
//#endregion
//#region src/context.ts
var j = {
	a: "link",
	button: "button",
	input: "field",
	textarea: "field",
	select: "choice",
	label: "label",
	img: "image",
	svg: "icon",
	h1: "heading",
	h2: "heading",
	h3: "heading",
	h4: "heading",
	p: "textKind",
	span: "textKind",
	li: "row",
	tr: "row",
	td: "cell",
	th: "cell",
	table: "table",
	ul: "list",
	ol: "list",
	nav: "menu",
	form: "form"
}, M = {
	button: "button",
	link: "link",
	textbox: "field",
	searchbox: "field",
	combobox: "choice",
	listbox: "choice",
	checkbox: "choice",
	radio: "choice",
	switch: "choice",
	slider: "field",
	spinbutton: "field",
	heading: "heading",
	img: "image",
	row: "row",
	cell: "cell",
	gridcell: "cell",
	columnheader: "cell",
	rowheader: "cell",
	table: "table",
	grid: "table",
	list: "list",
	listitem: "row",
	menu: "menu",
	menubar: "menu",
	menuitem: "button",
	tab: "button",
	tablist: "menu",
	form: "form",
	navigation: "menu"
}, N = (e) => e.matches("input, textarea, select"), P = (e) => (e ?? "").replace(/\s+/g, " ").trim();
function F(e, t) {
	let n = e.getAttribute("aria-label") ?? (N(e) ? "" : P(e.textContent)), r = e.getAttribute("role"), i = r ? t[M[r.toLowerCase()] ?? "area"] : t[j[e.tagName.toLowerCase()] ?? "area"], a = n.length > 32 ? `${n.slice(0, 31)}…` : n;
	return a ? O(t.named, {
		kind: i,
		label: a
	}) : i;
}
function I(e, t) {
	let n = "";
	try {
		n = m(e, {
			timeoutMs: 100,
			attr: (e, t) => [
				"data-testid",
				"role",
				"aria-label"
			].includes(e) || e === "id" && !/\d/.test(t),
			className: () => !1
		});
	} catch {
		n = e.id ? `#${CSS.escape(e.id)}` : e.tagName.toLowerCase();
	}
	return {
		selector: n.slice(0, 1e3),
		id: e.id.slice(0, 300),
		text: N(e) ? (e.getAttribute("aria-label") ?? "").slice(0, 300) : P(e.textContent).slice(0, 300),
		role: e.getAttribute("role") ?? e.tagName.toLowerCase(),
		name: F(e, t)
	};
}
function L(e) {
	if (!e) return;
	let t = e.getAttribute("aria-labelledby");
	return P(t ? e.ownerDocument.getElementById(t)?.textContent : e.getAttribute("aria-label")).slice(0, 100) || void 0;
}
function R(e, t) {
	let n = "dialog[open], [role=\"dialog\"][aria-modal=\"true\"], [role=\"dialog\"][data-state=\"open\"]", r = e, i = null;
	for (; r && !i;) {
		i = r.closest(n);
		let e = r.getRootNode();
		r = e instanceof ShadowRoot ? e.host : null;
	}
	return i instanceof HTMLElement && !i.closest(t) ? i : [...document.querySelectorAll(n)].filter((e) => !e.closest(t) && e.getClientRects().length > 0).at(-1) ?? null;
}
function z(e) {
	let t = document.documentElement, n = t.classList.contains("dark") || t.dataset.theme === "dark" || getComputedStyle(t).colorScheme === "dark";
	return {
		url: location.href,
		path: location.pathname,
		title: document.title,
		language: t.lang || navigator.language,
		screen: {
			width: window.innerWidth,
			height: window.innerHeight,
			pixelRatio: window.devicePixelRatio || 1
		},
		colorScheme: n ? "dark" : "light",
		...e.appVersion ? { appVersion: e.appVersion } : {},
		capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...L(e.dialog) ? { dialog: L(e.dialog) } : {},
		extra: e.extra
	};
}
function B() {
	let e = document.getSelection();
	return e && !e.isCollapsed ? P(e.toString()).slice(0, 1e3) : "";
}
//#endregion
//#region src/parts.ts
var ne = {
	"cm-window": "window",
	"cm-header": "header",
	"cm-title": "title",
	"cm-scroll": "scroll",
	"cm-form": "form",
	"cm-footer": "footer",
	"cm-handle-bar": "move-handle",
	"cm-field": "field",
	"cm-kinds": "kinds",
	"cm-chip": "kind",
	"cm-quote": "quote",
	"cm-images": "images",
	"cm-image": "image-row",
	"cm-image-name": "image-name",
	"cm-thumb": "thumbnail",
	"cm-picture-actions": "image-actions",
	"cm-button": "button",
	"cm-icon-button": "icon-button",
	"cm-primary": "primary",
	"cm-quiet": "quiet",
	"cm-danger": "danger",
	"cm-kbd": "shortcut",
	"cm-small": "small-text",
	"cm-warning": "warning",
	"cm-fine": "fine-print",
	"cm-error": "error",
	"cm-error-box": "error-message",
	"cm-confirm": "discard-dialog",
	"cm-confirm-text": "discard-text",
	"cm-drop": "drop-zone",
	"cm-toast": "toast",
	"cm-editor": "editor",
	"cm-editor-bar": "editor-header",
	"cm-editor-footer": "editor-footer",
	"cm-editor-help": "editor-help",
	"cm-tools": "tools",
	"cm-tool": "tool",
	"cm-tool-label": "tool-label",
	"cm-stage": "drawing-stage",
	"cm-canvas": "canvas",
	"cm-mark": "mark",
	"cm-selection": "selection",
	"cm-handle": "resize-handle",
	"cm-words": "drawing-text",
	"cm-outline": "outline",
	"cm-outline-name": "outline-label",
	"cm-sr": "announcement",
	"cm-trigger": "trigger"
}, re = {
	button: "button",
	input: "field",
	textarea: "field",
	label: "label",
	p: "text",
	span: "text",
	img: "image",
	image: "image",
	polygon: "polygon",
	ellipse: "ellipse",
	polyline: "polyline",
	use: "symbol",
	svg: "graphic",
	path: "path",
	rect: "rectangle",
	line: "line",
	text: "drawing-label",
	g: "drawing-group",
	circle: "circle",
	foreignobject: "drawing-object",
	div: "group",
	header: "header"
};
function V(e) {
	let t = new Set((e.getAttribute("part") ?? "").split(/\s+/).filter(Boolean)), n = re[e.localName.toLowerCase()];
	n && t.add(n);
	for (let n of e.classList) {
		let e = ne[n];
		e && t.add(e);
	}
	t.size && e.setAttribute("part", [...t].join(" "));
}
//#endregion
//#region src/dom.ts
function H(e, t = {}, ...n) {
	let r = document.createElement(e);
	return G(r, t), K(r, n), V(r), r;
}
var U = "http://www.w3.org/2000/svg";
function W(e, t = {}, ...n) {
	let r = document.createElementNS(U, e);
	return G(r, t), K(r, n), V(r), r;
}
function G(e, t) {
	for (let [n, r] of Object.entries(t)) typeof r == "function" ? e.addEventListener(n.slice(2), r) : r === !0 ? e.setAttribute(n, "") : r !== !1 && r != null && e.setAttribute(n, String(r));
}
function K(e, t) {
	for (let n of t) (n || n === "") && e.append(n);
}
var ie = {
	close: "M18 6 6 18M6 6l12 12",
	camera: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
	image: "M21 15l-5-5L5 21M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
	pen: "M12 20h9M16.4 3.6a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
	send: "M14.5 21.7a.5.5 0 0 0 .9 0l6.5-19a.5.5 0 0 0-.6-.6l-19 6.5a.5.5 0 0 0 0 .9l7.9 3.2a2 2 0 0 1 1.1 1.1zM21.9 2.1 10.9 13.1",
	up: "M18 15l-6-6-6 6",
	down: "M6 9l6 6 6-6",
	arrow: "M5 19 19 5M9 5h10v10",
	box: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
	text: "M4 7V4h16v3M9 20h6M12 4v16",
	blur: "M3 3h4v4H3zM10 3h4v4h-4zM17 3h4v4h-4zM3 10h4v4H3zM17 10h4v4h-4zM3 17h4v4H3zM10 17h4v4h-4zM17 17h4v4h-4zM10 10h4v4h-4z",
	crop: "M6 2v14a2 2 0 0 0 2 2h14M18 22V8a2 2 0 0 0-2-2H2",
	undo: "M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11",
	redo: "M15 14l5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13",
	trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
	grip: "M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01"
};
function q(e, t) {
	let n = t?.[e]?.();
	if (n && (n.namespaceURI !== U || n.localName !== "svg")) throw TypeError(`Luh icon "${e}" must be an SVG root element`);
	let r = n ? n.cloneNode(!0) : W("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": 2,
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"aria-hidden": "true",
		class: "cm-icon"
	}, W("path", { d: ie[e] }));
	return r.classList.add("cm-icon"), r.setAttribute("aria-hidden", "true"), r.setAttribute("focusable", "false"), r.setAttribute("part", `icon icon-${e}`), r.querySelectorAll("*").forEach(V), r;
}
function J(e) {
	if (typeof e.showPopover == "function" && !e.matches(":popover-open")) try {
		e.showPopover();
	} catch {}
}
function Y(e) {
	if (typeof e.hidePopover == "function") try {
		e.matches(":popover-open") && e.hidePopover();
	} catch {}
}
var ae = () => /Mac|iPhone|iPad/.test(navigator.platform), X = () => window.matchMedia?.("(pointer: fine)").matches ?? !0, oe = "button, a, input, textarea, select, label, summary, [role=\"button\"], [role=\"tab\"], [role=\"checkbox\"], [role=\"radio\"], [role=\"switch\"], [role=\"menuitem\"], [role=\"option\"], [role=\"link\"]", se = class {
	host;
	hovered = null;
	narrower = [];
	pinned = null;
	on = !1;
	outline = H("div", {
		class: "cm-outline",
		popover: "manual",
		hidden: !0,
		"aria-hidden": "true"
	});
	name = H("span", { class: "cm-outline-name" });
	cleanups = [];
	constructor(e, t) {
		this.host = t, this.outline.append(this.name), e.append(this.outline);
	}
	get active() {
		return this.on;
	}
	set active(e) {
		e !== this.on && (this.on = e, e ? this.listen() : (this.cleanups.forEach((e) => e()), this.cleanups = [], this.hover(null)), this.draw());
	}
	get picking() {
		return this.on && !this.host.paused();
	}
	pin(e) {
		this.pinned = e, this.draw();
	}
	target(e) {
		return !(e instanceof Element) || e.closest(this.host.ignore) ? null : e.closest(oe) ?? (e instanceof SVGElement ? e.closest("svg")?.parentElement ?? e : e);
	}
	hover(e) {
		e === this.hovered || e && this.hovered?.contains(e) && this.narrower.length || (this.hovered = e, this.narrower = [], this.draw());
	}
	choose(e, t = "") {
		this.host.pick(e, t);
	}
	draw() {
		document.documentElement.classList.toggle("luh-picking", this.picking);
		let e = this.pinned ?? (this.picking ? this.hovered : null), t = e?.isConnected ? e.getBoundingClientRect() : null;
		if (!e || !t) {
			this.outline.hidden = !0, Y(this.outline);
			return;
		}
		Object.assign(this.outline.style, {
			left: `${t.left}px`,
			top: `${t.top}px`,
			width: `${t.width}px`,
			height: `${t.height}px`
		}), this.outline.classList.toggle("cm-pinned", !!this.pinned);
		let n = this.pinned ? "" : F(e, this.host.strings);
		this.name.textContent = n && X() ? `${n} · ${this.host.strings.pickHint}` : n, this.name.hidden = !n, this.name.classList.toggle("cm-below", t.top < 28), this.outline.hidden = !1, J(this.outline);
	}
	listen() {
		let e = (e, t, n = !0) => {
			document.addEventListener(e, t, { capture: n }), this.cleanups.push(() => document.removeEventListener(e, t, { capture: n }));
		};
		e("pointermove", (e) => {
			this.picking && this.hover(this.target(e.target));
		});
		let t = !1;
		e("focusin", (e) => {
			this.picking && !t && this.hover(this.target(e.target));
		}), e("pointerup", () => setTimeout(() => t = !1));
		let n = "", r = (e) => {
			if (!this.picking) return;
			let r = this.target(e.target);
			r && (e.type === "pointerdown" && (n = B(), t = !0), e.stopImmediatePropagation(), (r.matches(oe) || r.closest("[draggable=\"true\"]")) && e.preventDefault());
		};
		e("pointerdown", r), e("mousedown", r), e("touchstart", r), e("click", (e) => {
			if (!this.picking) return;
			let t = this.target(e.target);
			if (!t) return;
			e.preventDefault(), e.stopImmediatePropagation();
			let r = document.getSelection(), i = B();
			if (i && i !== n && r?.rangeCount) {
				let e = r.getRangeAt(0), n = e.commonAncestorContainer, a = n instanceof Element ? n : n.parentElement;
				if (a && e.intersectsNode(t) && !a.closest(this.host.ignore)) return this.choose(a, i);
			}
			this.choose(this.narrower.length && this.hovered?.contains(t) ? this.hovered : t);
		});
		for (let t of [
			"pointerup",
			"mouseup",
			"dblclick",
			"auxclick",
			"contextmenu"
		]) e(t, (e) => {
			this.picking && this.target(e.target) && e.stopImmediatePropagation();
		});
		let i = () => this.draw();
		window.addEventListener("scroll", i, {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", i, { passive: !0 }), this.cleanups.push(() => {
			window.removeEventListener("scroll", i, { capture: !0 }), window.removeEventListener("resize", i);
		});
	}
	key(e) {
		if (!this.picking) return !1;
		let t = this.hovered;
		return e.key === "ArrowUp" && t?.parentElement && t.parentElement !== document.body ? (this.narrower = [...this.narrower, t], this.hovered = t.parentElement, this.draw(), !0) : e.key === "ArrowDown" && this.narrower.length ? (this.hovered = this.narrower.at(-1), this.narrower = this.narrower.slice(0, -1), this.draw(), !0) : (e.key === "Enter" || e.key === " ") && t && !Z(e.composedPath()[0] ?? e.target) ? (this.choose(t), !0) : !1;
	}
};
function Z(e) {
	return e instanceof HTMLElement && (e.isContentEditable || e.matches("input, textarea, select"));
}
//#endregion
//#region src/styles.ts
var ce = String.raw`
:host, .cm-root {
  color-scheme: light;
  --cm-default-accent: #2563eb;
  --cm-default-on-accent: #ffffff;
  --cm-default-bg: #ffffff;
  --cm-default-raised: #f4f4f5;
  --cm-default-fg: #18181b;
  --cm-default-muted: #52525b;
  --cm-default-border: #e4e4e7;
  --cm-default-danger: #dc2626;
  --cm-default-warning: #a16207;
  --cm-accent: var(--${"luh"}-accent, var(--cm-default-accent));
  --cm-on-accent: var(--${"luh"}-on-accent, var(--cm-default-on-accent));
  --cm-bg: var(--${"luh"}-bg, var(--cm-default-bg));
  --cm-raised: var(--${"luh"}-raised, var(--cm-default-raised));
  --cm-fg: var(--${"luh"}-fg, var(--cm-default-fg));
  --cm-muted: var(--${"luh"}-muted, var(--cm-default-muted));
  --cm-border: var(--${"luh"}-border, var(--cm-default-border));
  --cm-danger: var(--${"luh"}-danger, var(--cm-default-danger));
  --cm-warning: var(--${"luh"}-warning, var(--cm-default-warning));
  --cm-radius: var(--${"luh"}-radius, 12px);
  --cm-font: var(--${"luh"}-font, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif);
  --cm-shadow: var(--${"luh"}-shadow, 0 12px 32px -8px rgb(0 0 0 / 0.22), 0 2px 6px -1px rgb(0 0 0 / 0.08));
  --cm-control: 36px;
  cursor: auto;
  font-family: var(--cm-font);
  color: var(--cm-fg);
}
/* Public theme defaults never assign --luh tokens: host overrides keep precedence. */
:host([data-luh-theme="dark"]) {
  color-scheme: dark;
  --cm-default-accent: #60a5fa;
  --cm-default-on-accent: #09090b;
  --cm-default-bg: #18181b;
  --cm-default-raised: #27272a;
  --cm-default-fg: #fafafa;
  --cm-default-muted: #a1a1aa;
  --cm-default-border: #52525b;
  --cm-default-danger: #f87171;
  --cm-default-warning: #fbbf24;
}
@media (pointer: coarse) {
  :host, .cm-root { --cm-control: 44px; }
}
* { box-sizing: border-box; }
[hidden] { display: none !important; }
.cm-sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;
}
.cm-icon { width: 16px; height: 16px; flex: none; }
button { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--cm-accent); outline-offset: 2px; }
::selection { background: color-mix(in oklab, var(--cm-accent) 25%, transparent); }

/* Popovers in the top layer start with the browser's own box; reset it. */
[popover] { margin: 0; padding: 0; border: 0; background: none; color: inherit; overflow: visible; inset: auto; }

/* ---------- The outline over what the pointer is on ---------- */
.cm-outline {
  position: fixed;
  pointer-events: none;
  outline: 2px solid var(--cm-accent);
  outline-offset: 2px;
  border-radius: 4px;
  background: color-mix(in oklab, var(--cm-accent) 8%, transparent);
  transition: left 80ms ease-out, top 80ms ease-out, width 80ms ease-out, height 80ms ease-out;
}
.cm-outline.cm-pinned { outline-width: 3px; background: none; }
.cm-outline-name {
  position: absolute;
  left: -2px;
  bottom: calc(100% + 6px);
  max-width: min(22rem, 90vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--cm-accent);
  color: var(--cm-on-accent);
  font: 500 12px/16px var(--cm-font);
}
.cm-outline-name.cm-below { bottom: auto; top: calc(100% + 6px); }
@media (prefers-reduced-motion: reduce) { .cm-outline { transition: none; } }

/* ---------- The note window ---------- */
.cm-window {
  position: fixed;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--cm-bg);
  color: var(--cm-fg);
  border: 1px solid var(--cm-border);
  border-radius: var(--cm-radius);
  box-shadow: var(--cm-shadow);
  font: 14px/20px var(--cm-font);
  overflow: hidden;
  animation: cm-in 160ms cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes cm-in { from { opacity: 0; transform: translateY(4px) scale(0.98); } }
@media (prefers-reduced-motion: reduce) { .cm-window { animation: none; } }
.cm-header {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 6px 6px 4px;
  cursor: move;
  touch-action: none;
  user-select: none;
}
.cm-handle-bar {
  display: grid;
  place-items: center;
  width: 24px;
  height: var(--cm-control);
  color: var(--cm-muted);
  border-radius: 6px;
  flex: none;
}
.cm-title {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
}
.cm-icon-button {
  display: grid;
  place-items: center;
  width: var(--cm-control);
  height: var(--cm-control);
  flex: none;
  border: 0;
  border-radius: 8px;
  background: none;
  color: var(--cm-muted);
  cursor: pointer;
}
.cm-icon-button:hover:not(:disabled) { background: var(--cm-raised); color: var(--cm-fg); }
.cm-icon-button:disabled { opacity: 0.4; cursor: default; }
.cm-scroll { min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.cm-form { display: flex; flex-direction: column; gap: 12px; padding: 4px 16px 16px; }
.cm-quote {
  margin: 0;
  padding: 2px 0 2px 10px;
  border-left: 2px solid var(--cm-accent);
  color: var(--cm-muted);
  font-style: italic;
  max-height: 5lh;
  overflow: auto;
  overflow-wrap: anywhere;
}
.cm-kinds { display: flex; flex-wrap: wrap; gap: 6px; }
.cm-chip {
  min-height: 32px;
  padding: 0 14px;
  border: 1px solid var(--cm-border);
  border-radius: 999px;
  background: var(--cm-bg);
  font-weight: 500;
  cursor: pointer;
}
@media (pointer: coarse) { .cm-chip { min-height: 44px; } }
.cm-chip:hover:not(:disabled) { background: var(--cm-raised); }
.cm-chip[aria-checked="true"] { background: var(--cm-accent); border-color: var(--cm-accent); color: var(--cm-on-accent); }
.cm-field {
  display: block;
  width: 100%;
  min-height: 84px;
  resize: none;
  padding: 10px 12px;
  border: 1px solid var(--cm-border);
  border-radius: 8px;
  background: var(--cm-bg);
  color: var(--cm-fg);
  font: 16px/24px var(--cm-font);
}
input.cm-field { min-height: var(--cm-control); height: var(--cm-control); padding: 6px 10px; }
.cm-field::placeholder { color: var(--cm-muted); opacity: 1; }
.cm-field:focus { outline: none; border-color: var(--cm-accent); box-shadow: 0 0 0 3px color-mix(in oklab, var(--cm-accent) 22%, transparent); }
.cm-images { list-style: none; margin: 0; padding: 0; border: 1px solid var(--cm-border); border-radius: 8px; }
.cm-image { display: flex; align-items: center; gap: 8px; padding: 6px 4px 6px 6px; }
.cm-image + .cm-image { border-top: 1px solid var(--cm-border); }
.cm-thumb { padding: 0; border: 1px solid var(--cm-border); border-radius: 6px; background: var(--cm-raised); cursor: pointer; flex: none; overflow: hidden; }
.cm-thumb img { display: block; width: 40px; height: 40px; object-fit: cover; object-position: top; }
.cm-image-name { flex: 1; min-width: 0; overflow-wrap: anywhere; font-weight: 500; }
.cm-picture-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.cm-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: var(--cm-control);
  padding: 0 12px;
  border: 1px solid var(--cm-border);
  border-radius: 8px;
  background: var(--cm-bg);
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
}
.cm-button:hover:not(:disabled) { background: var(--cm-raised); }
.cm-button:disabled { opacity: 0.5; cursor: default; }
.cm-button.cm-quiet { border-color: transparent; background: none; }
.cm-button.cm-quiet:hover:not(:disabled) { background: var(--cm-raised); }
.cm-button.cm-primary { background: var(--cm-accent); border-color: var(--cm-accent); color: var(--cm-on-accent); }
.cm-button.cm-primary:hover:not(:disabled) { background: color-mix(in oklab, var(--cm-accent) 88%, black); }
.cm-button.cm-danger { background: var(--cm-danger); border-color: var(--cm-danger); color: #fff; }
.cm-button[aria-busy="true"] { cursor: progress; }
.cm-kbd { font: 500 12px/16px var(--cm-font); opacity: 0.75; margin-inline-start: 2px; }
.cm-small { margin: -6px 0 0; color: var(--cm-muted); font-size: 13px; line-height: 18px; }
.cm-warning { margin: 0; color: var(--cm-warning); }
.cm-error { margin: 0; color: var(--cm-danger); }
.cm-error-box {
  margin: 0;
  padding: 8px 10px;
  border-radius: 8px;
  background: color-mix(in oklab, var(--cm-danger) 10%, var(--cm-bg));
  color: var(--cm-danger);
}
.cm-footer, .cm-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--cm-border);
}
.cm-fine { flex: 1; min-width: 0; margin: 0; }
.cm-spacer { flex: 1; }
.cm-confirm { background: var(--cm-raised); }
.cm-confirm-text { flex: 1; margin: 0; font-weight: 600; }

.cm-drop {
  position: fixed;
  inset: 8px;
  display: grid;
  place-items: center;
  border: 2px dashed var(--cm-accent);
  border-radius: 16px;
  background: color-mix(in oklab, var(--cm-accent) 10%, transparent);
  color: var(--cm-accent);
  font: 600 18px/24px var(--cm-font);
  pointer-events: none;
}
.cm-toast {
  position: fixed;
  inset: auto auto 24px 50%;
  translate: -50% 0;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--cm-fg);
  color: var(--cm-bg);
  font: 500 14px/20px var(--cm-font);
  box-shadow: var(--cm-shadow);
}

/* ---------- The drawing editor ---------- */
.cm-editor[open] {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--cm-raised);
  color: var(--cm-fg);
  font: 14px/20px var(--cm-font);
}
.cm-editor::backdrop { background: rgb(0 0 0 / 0.4); }
.cm-editor-bar, .cm-editor-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--cm-bg);
}
.cm-editor-bar { border-bottom: 1px solid var(--cm-border); }
.cm-editor-footer { border-top: 1px solid var(--cm-border); }
.cm-tools { display: flex; gap: 2px; padding: 2px; border-radius: 10px; background: var(--cm-raised); }
.cm-tool {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: var(--cm-control);
  min-width: var(--cm-control);
  justify-content: center;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  font-weight: 500;
  cursor: pointer;
}
.cm-tool:hover:not(:disabled) { background: var(--cm-bg); }
.cm-tool[aria-pressed="true"] { background: var(--cm-bg); color: var(--cm-accent); box-shadow: 0 1px 2px rgb(0 0 0 / 0.12); }
.cm-tool:disabled { opacity: 0.4; cursor: default; }
@media (max-width: 640px) { .cm-tool-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); } }
.cm-stage { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding: 16px; }
.cm-canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.16);
  touch-action: none;
  user-select: none;
  cursor: crosshair;
  background: var(--cm-bg);
}
.cm-canvas[data-tool="text"] { cursor: text; }
.cm-canvas[data-over="mark"] { cursor: move; }
.cm-canvas[data-over="handle"] { cursor: grab; }
.cm-mark { outline: none; }
.cm-mark:focus-visible > * { filter: drop-shadow(0 0 3px var(--cm-accent)); }
.cm-selection { stroke: var(--cm-accent); }
.cm-handle { fill: #fff; stroke: var(--cm-accent); }
.cm-words { width: 100%; padding: 0; border: 0; background: transparent; font-family: system-ui, sans-serif; font-weight: 600; outline: none; }
.cm-editor-help { margin: 0; padding: 0 16px 8px; text-align: center; color: var(--cm-muted); font-size: 13px; }
@media (pointer: coarse) { .cm-editor-help { display: none; } }
`, Q = String.raw`
html.${"luh"}-picking, html.${"luh"}-picking *:not([data-${"luh"}]) {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z' fill='%23fff' stroke='%2318181b' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E") 3 21, crosshair !important;
}
`;
//#endregion
//#region src/drawing.ts
function $(e, t) {
	return {
		x: Math.min(e.x, t.x),
		y: Math.min(e.y, t.y),
		w: Math.abs(e.x - t.x),
		h: Math.abs(e.y - t.y)
	};
}
function le(e, t, n) {
	return e.kind === "arrow" ? $({
		x: e.x1,
		y: e.y1
	}, {
		x: e.x2,
		y: e.y2
	}) : e.kind === "text" ? {
		x: e.x,
		y: e.y,
		w: t(e.text),
		h: n * 1.25
	} : {
		x: e.x,
		y: e.y,
		w: e.w,
		h: e.h
	};
}
function ue(e, t, n) {
	let r = n.x - t.x, i = n.y - t.y, a = r * r + i * i, o = a ? Math.max(0, Math.min(1, ((e.x - t.x) * r + (e.y - t.y) * i) / a)) : 0;
	return Math.hypot(e.x - (t.x + o * r), e.y - (t.y + o * i));
}
function de(e, t, n, r, i) {
	for (let a = e.length - 1; a >= 0; a--) {
		let o = e[a];
		if (o.kind === "arrow") {
			if (ue(t, {
				x: o.x1,
				y: o.y1
			}, {
				x: o.x2,
				y: o.y2
			}) <= n) return o;
			continue;
		}
		let s = le(o, r, i);
		if (t.x >= s.x - n && t.x <= s.x + s.w + n && t.y >= s.y - n && t.y <= s.y + s.h + n && (o.kind !== "box" || t.x <= s.x + n || t.x >= s.x + s.w - n || t.y <= s.y + n || t.y >= s.y + s.h - n)) return o;
	}
	return null;
}
function fe(e) {
	return e.kind === "arrow" ? [{
		handle: "start",
		x: e.x1,
		y: e.y1
	}, {
		handle: "end",
		x: e.x2,
		y: e.y2
	}] : e.kind === "text" ? [] : [
		{
			handle: "nw",
			x: e.x,
			y: e.y
		},
		{
			handle: "ne",
			x: e.x + e.w,
			y: e.y
		},
		{
			handle: "sw",
			x: e.x,
			y: e.y + e.h
		},
		{
			handle: "se",
			x: e.x + e.w,
			y: e.y + e.h
		}
	];
}
function pe(e, t, n) {
	return fe(e).find((e) => Math.hypot(e.x - t.x, e.y - t.y) <= n)?.handle ?? null;
}
var me = (e, t, n) => Math.max(t, Math.min(n, e));
function he(e, t, n, r, i) {
	let a = me(t, -i.x, r.width - i.x - i.w), o = me(n, -i.y, r.height - i.y - i.h);
	return e.kind === "arrow" ? {
		...e,
		x1: e.x1 + a,
		y1: e.y1 + o,
		x2: e.x2 + a,
		y2: e.y2 + o
	} : {
		...e,
		x: e.x + a,
		y: e.y + o
	};
}
function ge(e, t, n) {
	if (e.kind === "arrow") return t === "start" ? {
		...e,
		x1: n.x,
		y1: n.y
	} : {
		...e,
		x2: n.x,
		y2: n.y
	};
	if (e.kind === "text") return e;
	let r = {
		nw: {
			x: e.x + e.w,
			y: e.y + e.h
		},
		ne: {
			x: e.x,
			y: e.y + e.h
		},
		sw: {
			x: e.x + e.w,
			y: e.y
		},
		se: {
			x: e.x,
			y: e.y
		}
	}[t];
	return {
		...e,
		...$(r, n)
	};
}
function _e(e, t) {
	return e.kind === "arrow" ? Math.hypot(e.x2 - e.x1, e.y2 - e.y1) < t : e.kind === "text" ? !e.text.trim() : e.w < t || e.h < t;
}
function ve(e, t) {
	let n = Math.atan2(e.y2 - e.y1, e.x2 - e.x1), r = t * 5, i = Math.PI / 7;
	return [
		[e.x2, e.y2],
		[e.x2 - r * Math.cos(n - i), e.y2 - r * Math.sin(n - i)],
		[e.x2 - r * Math.cos(n + i), e.y2 - r * Math.sin(n + i)]
	];
}
var ye = class {
	scene;
	past = [];
	future = [];
	constructor(e) {
		this.scene = e;
	}
	get canUndo() {
		return this.past.length > 0;
	}
	get canRedo() {
		return this.future.length > 0;
	}
	commit(e) {
		this.past.push(this.scene), this.future = [], this.scene = e;
	}
	undo() {
		let e = this.past.pop();
		e && (this.future.push(this.scene), this.scene = e);
	}
	redo() {
		let e = this.future.pop();
		e && (this.past.push(this.scene), this.scene = e);
	}
}, be = [
	{
		tool: "arrow",
		icon: "arrow",
		key: "a",
		label: "arrow"
	},
	{
		tool: "box",
		icon: "box",
		key: "r",
		label: "box"
	},
	{
		tool: "text",
		icon: "text",
		key: "t",
		label: "text"
	},
	{
		tool: "blur",
		icon: "blur",
		key: "b",
		label: "blur"
	},
	{
		tool: "crop",
		icon: "crop",
		key: "c",
		label: "crop"
	}
];
function xe(e, n, r, i, a) {
	if (i?.aborted) return Promise.resolve({ action: "cancel" });
	let o = (e) => q(e, a);
	return new Promise((a) => {
		let s = !1, c = URL.createObjectURL(e), l = new Image(), u = {
			width: 0,
			height: 0
		}, d = "arrow", f = new ye({
			marks: [],
			crop: null
		}), p = null, m = null, h = null, g = 1, _ = /* @__PURE__ */ new Map(), v = `cm-editor-${Math.random().toString(36).slice(2)}`, y = W("svg", {
			class: "cm-canvas",
			tabindex: 0,
			role: "group",
			"aria-label": n.drawing
		}), b = H("p", {
			class: "cm-sr",
			role: "status"
		}), x = be.map((e) => H("button", {
			type: "button",
			class: "cm-tool",
			part: `tool-${e.tool}`,
			title: `${n[e.label]} · ${e.key.toUpperCase()}`,
			"aria-keyshortcuts": e.key.toUpperCase(),
			onclick: () => G(e.tool)
		}, o(e.icon), H("span", { class: "cm-tool-label" }, n[e.label]))), ee = ae() ? "⌘" : `${n.controlKey}+`, te = E("undo", n.undo, `${ee}Z`, () => K("undo")), S = E("redo", n.redo, `${ee}⇧Z`, () => K("redo")), C = E("trash", n.deleteMark, n.deleteKey, () => ie()), w = H("button", {
			type: "button",
			class: "cm-button cm-primary",
			part: "done",
			onclick: () => void Z()
		}, n.done), T = H("dialog", {
			class: "cm-editor",
			"aria-labelledby": v
		}, H("div", { class: "cm-editor-bar" }, H("h2", {
			id: v,
			class: "cm-sr"
		}, n.drawTitle), H("div", {
			class: "cm-tools",
			role: "toolbar",
			"aria-label": n.drawTitle
		}, ...x), H("div", { class: "cm-tools" }, te, S, C)), H("div", { class: "cm-stage" }, y), H("p", { class: "cm-editor-help" }, n.drawHelp), b, H("div", { class: "cm-editor-footer" }, H("button", {
			type: "button",
			class: "cm-button cm-quiet",
			part: "editor-remove",
			onclick: () => Q({ action: "remove" })
		}, o("trash"), n.removeImage), H("span", { class: "cm-spacer" }), H("button", {
			type: "button",
			class: "cm-button",
			part: "editor-cancel",
			onclick: () => Q({ action: "cancel" })
		}, n.cancel), w));
		function E(e, t, n, r) {
			return H("button", {
				type: "button",
				class: "cm-tool",
				part: e === "trash" ? "delete-mark" : e,
				title: `${t} · ${n}`,
				"aria-label": t,
				onclick: r
			}, o(e));
		}
		function D() {
			let e = y.getBoundingClientRect().width;
			return e ? Math.max(1, u.width / e) : 1;
		}
		let k = () => Math.min(u.width, u.height), A = () => Math.round(Math.max(3, 3 * D(), k() / 250)), j = () => Math.round(Math.max(16, 16 * D(), k() * .035)), M = () => Math.max(A() * 2, 10 * D()), N = document.createElement("canvas").getContext("2d");
		function P(e) {
			return N ? (N.font = `600 ${j()}px system-ui, sans-serif`, N.measureText(e).width) : e.length * j() * .6;
		}
		function F(e) {
			let t = y.getScreenCTM?.()?.inverse(), n;
			if (t) n = new DOMPoint(e.clientX, e.clientY).matrixTransform(t);
			else {
				let t = y.getBoundingClientRect(), r = t.width ? u.width / t.width : 1;
				n = {
					x: (e.clientX - t.left) * r,
					y: (e.clientY - t.top) * r
				};
			}
			return {
				x: Math.max(0, Math.min(u.width, n.x)),
				y: Math.max(0, Math.min(u.height, n.y))
			};
		}
		let I = () => f.scene, L = () => I().marks.find((e) => e.id === p) ?? null;
		function R(e) {
			f.commit(e), U();
		}
		function z(e) {
			return {
				...I(),
				marks: I().marks.map((t) => t.id === e.id ? e : t)
			};
		}
		function B(e) {
			let t = document.createElement("canvas");
			t.width = Math.max(1, Math.round(e.w)), t.height = Math.max(1, Math.round(e.h));
			let n = Math.max(8, Math.round(u.width / 80)), r = document.createElement("canvas");
			r.width = Math.max(1, Math.ceil(e.w / n)), r.height = Math.max(1, Math.ceil(e.h / n));
			let i = r.getContext("2d"), a = t.getContext("2d");
			return !i || !a ? null : (i.drawImage(l, e.x, e.y, e.w, e.h, 0, 0, r.width, r.height), a.imageSmoothingEnabled = !1, a.drawImage(r, 0, 0, t.width, t.height), t);
		}
		function ne(e) {
			let t = `${e.x},${e.y},${e.w},${e.h}`, n = _.get(e.id);
			if (n?.key === t) return n.url;
			let r = B(e)?.toDataURL() ?? "";
			return _.set(e.id, {
				key: t,
				url: r
			}), r;
		}
		function re(e, t) {
			let r = {
				arrow: n.arrow,
				box: n.box,
				blur: n.blur,
				text: n.text
			}[e.kind], i = O(n.markLabel, {
				kind: r,
				number: t + 1
			});
			return e.kind === "text" ? `${i}: ${e.text}` : i;
		}
		function V(e, n = !1) {
			let r = A();
			if (e.kind === "blur") {
				let i = n ? "" : ne(e);
				return i ? W("image", {
					href: i,
					x: e.x,
					y: e.y,
					width: e.w,
					height: e.h,
					preserveAspectRatio: "none"
				}) : W("rect", {
					x: e.x,
					y: e.y,
					width: e.w,
					height: e.h,
					fill: "rgba(0,0,0,0.25)",
					stroke: t,
					"stroke-width": r / 2,
					"stroke-dasharray": "6 4"
				});
			}
			if (e.kind === "box") return W("rect", {
				x: e.x,
				y: e.y,
				width: e.w,
				height: e.h,
				fill: "none",
				stroke: t,
				"stroke-width": r,
				"stroke-linejoin": "round"
			});
			if (e.kind === "arrow") {
				let n = ve(e, r);
				return W("g", {}, W("line", {
					x1: e.x1,
					y1: e.y1,
					x2: (n[1][0] + n[2][0]) / 2,
					y2: (n[1][1] + n[2][1]) / 2,
					stroke: t,
					"stroke-width": r,
					"stroke-linecap": "round"
				}), W("polygon", {
					points: n.map((e) => e.join(",")).join(" "),
					fill: t
				}));
			}
			let i = j();
			return W("text", {
				x: e.x,
				y: e.y,
				"dominant-baseline": "hanging",
				"font-size": i,
				"font-weight": 600,
				fill: t,
				stroke: "white",
				"stroke-width": i / 4,
				"paint-order": "stroke",
				"font-family": "system-ui, sans-serif"
			}, e.text);
		}
		function U() {
			let e = y.getRootNode().activeElement?.closest?.("[data-mark]");
			if (y.replaceChildren(), !u.width) return;
			y.setAttribute("viewBox", `0 0 ${u.width} ${u.height}`), y.style.aspectRatio = `${u.width} / ${u.height}`, y.dataset.tool = d, y.append(W("image", {
				href: c,
				width: u.width,
				height: u.height
			})), I().marks.forEach((e, t) => {
				if (h?.id === e.id) return;
				let n = W("g", {
					"data-mark": e.id,
					tabindex: 0,
					role: "button",
					"aria-label": re(e, t),
					"aria-pressed": e.id === p ? "true" : "false",
					class: "cm-mark"
				}, V(e));
				n.addEventListener("focus", () => {
					p !== e.id && (p = e.id, U());
				}), y.append(n);
			});
			let r = m?.kind === "draw" ? m.draft : null;
			r && r.kind !== "crop" && y.append(V(r, !0));
			let i = I().crop;
			if (i) {
				let { width: e, height: t } = u;
				y.append(W("path", {
					d: `M0 0H${e}V${t}H0Z M${i.x} ${i.y}V${i.y + i.h}H${i.x + i.w}V${i.y}Z`,
					fill: "rgba(0,0,0,0.55)",
					"fill-rule": "evenodd",
					"pointer-events": "none"
				}));
			}
			r?.kind === "crop" && y.append(W("rect", {
				x: r.x,
				y: r.y,
				width: r.w,
				height: r.h,
				fill: "none",
				stroke: "white",
				"stroke-width": A() / 2,
				"stroke-dasharray": "8 6"
			}));
			let a = L();
			if (a) {
				let e = le(a, P, j()), t = A() * 2, n = D() * 1.5;
				a.kind !== "arrow" && y.append(W("rect", {
					class: "cm-selection",
					x: e.x - t,
					y: e.y - t,
					width: e.w + t * 2,
					height: e.h + t * 2,
					fill: "none",
					"stroke-width": n,
					"stroke-dasharray": `${n * 4} ${n * 3}`,
					"pointer-events": "none"
				}));
				for (let e of fe(a)) y.append(W("circle", {
					class: "cm-handle",
					cx: e.x,
					cy: e.y,
					r: D() * 6,
					"stroke-width": n,
					"pointer-events": "none"
				}));
			}
			if (h) {
				let e = H("input", {
					class: "cm-words",
					"aria-label": n.wordsOnImage,
					value: h.text,
					style: `font-size:${j()}px;color:${t};caret-color:${t}`
				});
				e.addEventListener("input", () => h && (h.text = e.value)), e.addEventListener("keydown", (e) => {
					e.key === "Enter" ? (e.preventDefault(), q()) : e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), q()), e.stopPropagation();
				}), e.addEventListener("pointerdown", (e) => e.stopPropagation());
				let r = W("foreignObject", {
					x: h.x,
					y: h.y - j() * .15,
					width: Math.max(1, u.width - h.x),
					height: j() * 1.6
				});
				r.append(e), y.append(r), queueMicrotask(() => e.focus({ preventScroll: !0 }));
			} else e && y.querySelector(`[data-mark="${p}"]`)?.focus({ preventScroll: !0 });
			x.forEach((e, t) => e.setAttribute("aria-pressed", String(be[t].tool === d))), te.disabled = !f.canUndo, S.disabled = !f.canRedo, C.disabled = !a;
		}
		function G(e) {
			q(), d = e, p = null, U();
		}
		function K(e) {
			q(), f[e](), L() || (p = null), U();
		}
		function ie() {
			let e = L();
			e && (p = null, R({
				...I(),
				marks: I().marks.filter((t) => t.id !== e.id)
			}), b.textContent = `${n.deleteMark}: ${re(e, 0).replace(/ 1(:|$)/, "$1")}`);
		}
		function q() {
			let e = h;
			if (!e) return;
			h = null;
			let t = e.text.trim();
			if (e.id !== void 0) {
				let n = I().marks.find((t) => t.id === e.id);
				n?.kind === "text" && t && t !== n.text ? R(z({
					...n,
					text: t
				})) : n && !t ? (p = null, R({
					...I(),
					marks: I().marks.filter((t) => t.id !== e.id)
				})) : U();
				return;
			}
			if (!t) return U();
			let n = {
				id: g++,
				kind: "text",
				x: e.x,
				y: e.y,
				text: t
			};
			p = n.id, R({
				...I(),
				marks: [...I().marks, n]
			});
		}
		function J(e) {
			if (!u.width || e.button > 0) return;
			if (e.preventDefault(), h) {
				q();
				return;
			}
			let t = F(e), n = L(), r = n && pe(n, t, M() * 1.2);
			if (n && r) m = {
				kind: "handle",
				handle: r,
				original: n
			};
			else {
				let e = d === "crop" ? null : de(I().marks, t, M(), P, j());
				if (e) p = e.id, m = {
					kind: "move",
					start: t,
					original: e,
					box: le(e, P, j()),
					moved: !1
				};
				else if (p !== null) {
					p = null, U();
					return;
				} else if (d === "text") {
					h = {
						x: t.x,
						y: t.y,
						text: ""
					}, U();
					return;
				} else m = {
					kind: "draw",
					start: t,
					draft: d === "arrow" ? {
						id: 0,
						kind: "arrow",
						x1: t.x,
						y1: t.y,
						x2: t.x,
						y2: t.y
					} : d === "crop" ? {
						kind: "crop",
						...$(t, t)
					} : {
						id: 0,
						kind: d,
						...$(t, t)
					}
				};
			}
			y.setPointerCapture?.(e.pointerId), U();
		}
		function Y(e) {
			if (!m) {
				let t = F(e), n = L(), r = n && pe(n, t, M() * 1.2) && "handle" || d !== "crop" && de(I().marks, t, M(), P, j()) && "mark" || "";
				y.dataset.over = r;
				return;
			}
			let t = F(e);
			if (m.kind === "draw") {
				let e = m.draft;
				m.draft = e.kind === "arrow" ? {
					...e,
					x2: t.x,
					y2: t.y
				} : {
					...e,
					...$(m.start, t)
				};
			} else if (m.kind === "move") {
				let e = he(m.original, t.x - m.start.x, t.y - m.start.y, u, m.box);
				m.moved = !0, f.scene = z(e);
			} else f.scene = z(ge(m.original, m.handle, t));
			U();
		}
		function X() {
			let e = m;
			if (m = null, !e) return;
			if (e.kind === "draw") {
				let t = e.draft;
				if (_e(t, A() * 3)) return U();
				if (t.kind === "crop") {
					R({
						...I(),
						crop: {
							x: t.x,
							y: t.y,
							w: t.w,
							h: t.h
						}
					});
					return;
				}
				let n = {
					...t,
					id: g++
				};
				p = n.id, R({
					...I(),
					marks: [...I().marks, n]
				});
				return;
			}
			let t = I(), n = {
				...t,
				marks: t.marks.map((t) => t.id === e.original.id ? e.original : t)
			};
			f.scene = n;
			let r = t.marks.find((t) => t.id === e.original.id);
			r && JSON.stringify(r) !== JSON.stringify(e.original) ? _e(r, A()) ? U() : R(t) : U();
		}
		function oe(e) {
			let t = F(e), n = de(I().marks, t, M(), P, j());
			n?.kind === "text" && (p = n.id, h = {
				x: n.x,
				y: n.y,
				text: n.text,
				id: n.id
			}, U());
		}
		function se(e) {
			if (h) return;
			let t = e.metaKey || e.ctrlKey, n = e.key.toLowerCase();
			if (t && n === "z") {
				e.preventDefault(), K(e.shiftKey ? "redo" : "undo");
				return;
			}
			if (t && n === "y") {
				e.preventDefault(), K("redo");
				return;
			}
			if (t && n === "enter") {
				e.preventDefault(), Z();
				return;
			}
			let r = L();
			if (r && (e.key === "Delete" || e.key === "Backspace")) {
				e.preventDefault(), ie();
				return;
			}
			if (r && e.key === "Enter" && r.kind === "text") {
				e.preventDefault(), h = {
					x: r.x,
					y: r.y,
					text: r.text,
					id: r.id
				}, U();
				return;
			}
			let i = {
				ArrowLeft: [-1, 0],
				ArrowRight: [1, 0],
				ArrowUp: [0, -1],
				ArrowDown: [0, 1]
			};
			if (r && i[e.key]) {
				e.preventDefault();
				let t = (e.shiftKey ? 10 : 1) * D(), [n, a] = i[e.key];
				R(z(he(r, n * t, a * t, u, le(r, P, j()))));
				return;
			}
			if (t || e.altKey) return;
			let a = be.find((e) => e.key === n);
			a && !(e.target instanceof HTMLInputElement) && (e.preventDefault(), G(a.tool));
		}
		T.addEventListener("cancel", (e) => {
			e.preventDefault(), h ? q() : p === null ? f.canUndo || Q({ action: "cancel" }) : (p = null, U());
		}), T.addEventListener("keydown", se), y.addEventListener("pointerdown", J), y.addEventListener("pointermove", Y), y.addEventListener("pointerup", X), y.addEventListener("pointercancel", () => {
			m = null, U();
		}), y.addEventListener("dblclick", oe);
		async function Z() {
			if (q(), !u.width) return;
			w.disabled = !0;
			let t = I().crop ?? {
				x: 0,
				y: 0,
				w: u.width,
				h: u.height
			}, n = document.createElement("canvas");
			n.width = Math.round(t.w), n.height = Math.round(t.h);
			let r = n.getContext("2d");
			if (!r) return Q({ action: "cancel" });
			r.translate(-t.x, -t.y), r.drawImage(l, 0, 0);
			for (let e of I().marks) ce(r, e);
			let i = await new Promise((e) => n.toBlob(e, "image/png"));
			w.disabled = !1, i && Q({
				action: "done",
				file: new File([i], e.name.replace(/\.\w+$/, ".png"), { type: "image/png" })
			});
		}
		function ce(e, n) {
			if (e.strokeStyle = t, e.fillStyle = t, e.lineWidth = A(), e.lineCap = "round", e.lineJoin = "round", n.kind === "blur") {
				let t = B(n);
				t && e.drawImage(t, n.x, n.y);
			} else if (n.kind === "box") e.strokeRect(n.x, n.y, n.w, n.h);
			else if (n.kind === "arrow") {
				let t = ve(n, A());
				e.beginPath(), e.moveTo(n.x1, n.y1), e.lineTo((t[1][0] + t[2][0]) / 2, (t[1][1] + t[2][1]) / 2), e.stroke(), e.beginPath(), t.forEach(([t, n], r) => r ? e.lineTo(t, n) : e.moveTo(t, n)), e.closePath(), e.fill();
			} else e.font = `600 ${j()}px system-ui, sans-serif`, e.textBaseline = "top", e.lineWidth = j() / 4, e.strokeStyle = "white", e.strokeText(n.text, n.x, n.y), e.fillText(n.text, n.x, n.y);
		}
		function Q(e) {
			s || (s = !0, i?.removeEventListener("abort", ue), l.onload = null, l.onerror = null, T.open && T.close(), T.remove(), URL.revokeObjectURL(c), _.forEach((e) => URL.revokeObjectURL(e.url)), _.clear(), a(e));
		}
		let ue = () => Q({ action: "cancel" });
		i?.addEventListener("abort", ue, { once: !0 }), r.appendChild(T), typeof T.showModal == "function" ? T.showModal() : T.setAttribute("open", ""), l.onload = () => {
			u = {
				width: l.naturalWidth,
				height: l.naturalHeight
			}, U();
		}, l.onerror = () => Q({ action: "cancel" }), l.src = c, U(), y.focus({ preventScroll: !0 });
	});
}
//#endregion
//#region src/window.ts
var Se = [
	"image/png",
	"image/jpeg",
	"image/webp"
], Ce = class {
	root;
	host;
	panel;
	body = "";
	nameField;
	kind;
	pictures = [];
	nextId = 1;
	sending = !1;
	capturing = !1;
	percent = 0;
	progressLine = H("p", {
		class: "cm-sr",
		role: "status"
	});
	selectedText = "";
	confirming = !1;
	problem = null;
	error = null;
	drawing = !1;
	editorController = null;
	opening = 0;
	via = "write";
	position = {
		x: 16,
		y: 16
	};
	dragging = 0;
	cleanups = [];
	titleId = `cm-title-${Math.random().toString(36).slice(2)}`;
	title = H("h2", { class: "cm-title" });
	quote = H("blockquote", { class: "cm-quote" });
	widerButton;
	narrowerButton;
	kindRow;
	field;
	list = H("ul", { class: "cm-images" });
	screenshotButton;
	pickButton = null;
	suspended = !1;
	addButton;
	note = H("p", { class: "cm-small cm-warning" });
	problemLine = H("p", {
		class: "cm-small cm-error",
		role: "alert"
	});
	errorLine = H("p", {
		class: "cm-error-box",
		role: "alert"
	});
	sendButton;
	footer;
	confirm;
	chooser;
	dropZone;
	constructor(e, t) {
		this.root = e, this.host = t;
		let { strings: n } = t;
		this.kind = t.kinds[0]?.value ?? null, this.nameField = H("input", {
			type: "text",
			part: "name-field",
			class: "cm-field",
			autocomplete: "name",
			maxlength: 200,
			placeholder: n.namePlaceholder,
			"aria-label": t.name === "optional" ? n.nameOptional : n.nameLabel,
			required: t.name === "required",
			hidden: t.name === "off"
		}), this.nameField.addEventListener("input", () => this.refresh()), this.widerButton = this.toolButton("up", n.wider, n.widerHint, () => this.widen(1)), this.narrowerButton = this.toolButton("down", n.narrower, n.narrower, () => this.widen(-1));
		let r = H("div", {
			class: "cm-handle-bar",
			tabindex: 0,
			role: "group",
			"aria-label": n.moveWindow
		}, this.icon("grip"));
		this.kindRow = H("div", {
			class: "cm-kinds",
			role: "radiogroup",
			"aria-label": n.kindLabel
		}), this.field = H("textarea", {
			class: "cm-field",
			part: "body-field",
			rows: 3,
			maxlength: 5e3,
			"aria-labelledby": this.titleId
		}), this.field.addEventListener("input", () => {
			this.body = this.field.value, this.fit(), this.refresh();
		}), this.field.addEventListener("keydown", (e) => {
			e.key === "Enter" && (e.metaKey || e.ctrlKey) && (e.preventDefault(), this.submit());
		}), this.screenshotButton = H("button", {
			type: "button",
			class: "cm-button",
			part: "screenshot",
			onclick: () => void this.screenshot()
		}, this.icon("camera"), H("span", {}, n.screenshot)), this.addButton = H("button", {
			type: "button",
			class: "cm-button",
			part: "add-images",
			onclick: () => this.chooser.click()
		}, this.icon("image"), H("span", {}, n.addImages)), this.chooser = H("input", {
			type: "file",
			multiple: !0,
			accept: Se.join(","),
			hidden: !0,
			tabindex: -1
		}), this.chooser.addEventListener("change", () => {
			[...this.chooser.files ?? []].forEach((e) => this.add(e)), this.chooser.value = "";
		});
		let i = ae() ? "⌘↵" : n.sendShortcut;
		this.sendButton = H("button", {
			type: "button",
			class: "cm-button cm-primary",
			part: "send",
			"aria-keyshortcuts": ae() ? "Meta+Enter" : "Control+Enter"
		}, this.icon("send"), H("span", {}, n.send), X() ? H("kbd", { class: "cm-kbd" }, i) : null), this.footer = H("div", { class: "cm-footer" }, t.finePrint ? H("p", { class: "cm-small cm-fine" }, t.finePrint) : H("span", { class: "cm-spacer" }), H("button", {
			type: "button",
			class: "cm-button cm-quiet",
			part: "cancel",
			onclick: () => this.requestClose()
		}, n.cancel), this.sendButton), this.confirm = H("div", {
			class: "cm-confirm",
			role: "alertdialog",
			"aria-label": n.discardTitle,
			hidden: !0
		}, H("p", { class: "cm-confirm-text" }, n.discardTitle), H("button", {
			type: "button",
			class: "cm-button",
			part: "keep-editing",
			onclick: () => this.keepEditing()
		}, n.keepEditing), H("button", {
			type: "button",
			class: "cm-button cm-danger",
			part: "discard",
			onclick: () => this.close()
		}, n.discard)), this.pickButton = t.pick ? H("button", {
			type: "button",
			class: "cm-button",
			part: "point",
			onclick: () => t.pick?.()
		}, this.icon("pen"), t.pickLabel) : null;
		let a = H("div", { class: "cm-form" }, this.pickButton, this.quote, this.kindRow, this.field, t.name === "off" ? null : H("label", { class: "cm-small" }, t.name === "optional" ? n.nameOptional : n.nameLabel, this.nameField), this.errorLine, this.list, H("div", { class: "cm-picture-actions" }, this.screenshotButton, this.addButton), X() ? H("p", { class: "cm-small" }, n.dropHint) : null, this.note, this.problemLine, this.progressLine, this.chooser);
		this.sendButton.addEventListener("click", () => void this.submit()), this.title.id = this.titleId, this.panel = H("section", {
			class: "cm-window",
			role: "dialog",
			"aria-modal": "false",
			"aria-labelledby": this.titleId,
			popover: "manual",
			hidden: !0
		}, H("header", { class: "cm-header" }, r, this.title, this.widerButton, this.narrowerButton, this.toolButton("close", n.close, n.close, () => this.requestClose())), H("div", { class: "cm-scroll" }, a), this.footer, this.confirm), this.dropZone = H("div", {
			class: "cm-drop",
			popover: "manual",
			hidden: !0,
			"aria-hidden": "true"
		}, n.dropHere), e.append(this.panel, this.dropZone), this.draggable(r);
	}
	get isOpen() {
		return !this.panel.hidden || this.suspended;
	}
	icon(e) {
		return q(e, this.host.icons);
	}
	toolButton(e, t, n, r) {
		let i = H("button", {
			type: "button",
			class: "cm-icon-button",
			part: e === "up" ? "wider" : e === "down" ? "narrower" : "close",
			"aria-label": t,
			title: n,
			onclick: r
		}, this.icon(e));
		return i.addEventListener("pointerdown", (e) => e.stopPropagation()), i;
	}
	dropTaken() {
		let e = this.pictures.filter((e) => e.taken && !e.drawn);
		e.forEach((e) => URL.revokeObjectURL(e.url)), this.pictures = this.pictures.filter((t) => !e.includes(t));
	}
	suspend() {
		this.suspended = !0, Y(this.panel), Y(this.dropZone), this.panel.hidden = !0, this.dropZone.hidden = !0, this.cleanups.forEach((e) => e()), this.cleanups = [];
	}
	open(e) {
		let { strings: t } = this.host;
		this.suspended = !1, this.opening++, this.via = e.via, this.title.textContent = e.via === "pick" && e.name ? e.name : t.title, this.selectedText = e.selectedText ?? "", this.quote.textContent = this.selectedText || e.pickedText || "", this.quote.hidden = !this.quote.textContent, this.quote.setAttribute("aria-label", this.selectedText ? t.selection : t.elementImageName), this.error = null, this.problem = null, this.confirming = !1, this.panel.hidden = !1, J(this.panel), this.listen(), this.refresh(), this.place(), this.fit(), requestAnimationFrame(() => this.field.focus({ preventScroll: !0 }));
	}
	close() {
		this.isOpen && (this.suspended = !1, this.opening++, this.editorController?.abort(), this.editorController = null, this.drawing = !1, this.sending = !1, this.body = "", this.field.value = "", this.nameField.value = "", this.kind = this.host.kinds[0]?.value ?? null, this.pictures.forEach((e) => URL.revokeObjectURL(e.url)), this.pictures = [], this.confirming = !1, this.capturing = !1, Y(this.panel), Y(this.dropZone), this.dropZone.hidden = !0, this.panel.hidden = !0, this.cleanups.forEach((e) => e()), this.cleanups = [], this.host.closed());
	}
	requestClose() {
		if (!this.sending) {
			if (!this.body.trim() && !this.nameField.value.trim() && !this.pictures.length) return this.close();
			this.confirming = !0, this.refresh(), this.confirm.querySelector("button")?.focus();
		}
	}
	keepEditing() {
		this.confirming = !1, this.refresh(), this.field.focus();
	}
	async widen(e) {
		let t = this.host.widen(e);
		if (t && (this.title.textContent = t, this.selectedText || (this.quote.textContent = this.host.pickedText(), this.quote.hidden = !this.quote.textContent)), this.refresh(), this.place(), !this.pictures.some((e) => e.taken && !e.drawn)) return;
		let n = this.opening, r = await this.host.remark();
		if (r && n === this.opening) {
			for (let e of ["page", "element"]) {
				let t = this.pictures.find((t) => t.taken === e);
				if (t?.drawn) continue;
				t && this.remove(t.id);
				let n = r[e];
				n && this.add(n, e);
			}
			this.refresh();
		}
	}
	fit() {
		this.field.style.height = "auto", this.field.style.height = `${Math.min(this.field.scrollHeight + 2, 240)}px`;
	}
	refresh() {
		let { strings: e, kinds: t } = this.host, n = t.find((e) => e.value === this.kind)?.prompt ?? e.placeholder;
		this.pickButton && (this.pickButton.disabled = this.sending || this.capturing || this.drawing), this.field.placeholder = n, this.field.disabled = this.sending, this.kindRow.hidden = t.length === 0, this.kindRow.replaceChildren(...t.map((e, n) => {
			let r = e.value === this.kind, i = H("button", {
				type: "button",
				role: "radio",
				class: "cm-chip",
				"aria-checked": String(r),
				tabindex: r ? 0 : -1,
				disabled: this.sending
			}, e.label);
			return i.addEventListener("click", () => {
				this.kind = e.value, this.refresh();
			}), i.addEventListener("keydown", (e) => {
				let r = {
					ArrowRight: 1,
					ArrowDown: 1,
					ArrowLeft: -1,
					ArrowUp: -1
				}[e.key];
				if (!r) return;
				e.preventDefault();
				let i = t[(n + r + t.length) % t.length];
				this.kind = i.value, this.refresh(), this.kindRow.querySelector("[aria-checked=\"true\"]")?.focus();
			}), i;
		}));
		let r = this.host.widenState();
		this.widerButton.hidden = this.via !== "pick", this.widerButton.disabled = !r.wider || this.capturing, this.narrowerButton.hidden = this.via !== "pick" || !r.narrower, this.narrowerButton.disabled = this.capturing, this.list.hidden = this.pictures.length === 0, this.list.setAttribute("aria-label", e.images), this.list.replaceChildren(...this.pictures.map((e) => this.row(e)));
		let i = this.pictures.some((e) => e.taken === "page");
		this.screenshotButton.hidden = !this.host.screenshot || i, this.screenshotButton.disabled = this.capturing || this.sending || this.full(), this.screenshotButton.querySelector("span").textContent = this.capturing ? `${e.screenshotTaking} ${this.percent}%` : e.screenshot, this.screenshotButton.setAttribute("aria-busy", String(this.capturing)), this.addButton.disabled = this.sending || this.full();
		let a = !this.host.screenshot || i ? null : this.host.screenshotNote();
		this.note.textContent = a ?? "", this.note.hidden = !a, this.problemLine.textContent = this.problem ?? "", this.problemLine.hidden = !this.problem, this.errorLine.textContent = this.error ?? "", this.errorLine.hidden = !this.error, this.nameField.disabled = this.sending, this.sendButton.disabled = !this.body.trim() || this.host.name === "required" && !this.nameField.value.trim() || this.sending || this.capturing, this.sendButton.querySelector("span").textContent = this.sending ? e.sending : e.send, this.sendButton.setAttribute("aria-busy", String(this.sending)), this.footer.hidden = this.confirming, this.confirm.hidden = !this.confirming, this.panel.setAttribute("aria-busy", String(this.sending || this.capturing));
	}
	label(e) {
		let { strings: t } = this.host;
		return e.taken === "page" ? t.screenshotName : e.taken === "element" ? t.elementImageName : e.file.name;
	}
	row(e) {
		let { strings: t } = this.host, n = this.label(e), r = () => void this.draw(e);
		return H("li", { class: "cm-image" }, H("button", {
			type: "button",
			class: "cm-thumb",
			tabindex: -1,
			"aria-hidden": "true",
			onclick: r
		}, H("img", {
			src: e.url,
			alt: ""
		})), H("span", { class: "cm-image-name" }, n), this.host.drawing ? H("button", {
			type: "button",
			class: "cm-button cm-quiet",
			part: "draw",
			"aria-label": O(t.drawOn, { name: n }),
			disabled: this.sending,
			onclick: r
		}, this.icon("pen"), H("span", {}, t.draw)) : null, H("button", {
			type: "button",
			class: "cm-icon-button",
			part: "remove-image",
			"aria-label": O(t.removeNamed, { name: n }),
			title: O(t.removeNamed, { name: n }),
			disabled: this.sending,
			onclick: () => {
				this.remove(e.id), this.refresh(), this.addButton.focus();
			}
		}, this.icon("close")));
	}
	full() {
		return this.pictures.length >= this.host.maxImages;
	}
	add(e, t) {
		let { strings: n, maxImages: r, maxImageBytes: i } = this.host;
		if (this.problem = null, this.pictures.length >= r) this.problem = O(n.tooMany, { max: r });
		else if (!Se.includes(e.type) || e.size > i) this.problem = O(n.wrongImage, {
			name: e.name,
			size: Math.round(i / 1024 / 1024)
		});
		else {
			let n = {
				id: this.nextId++,
				file: e,
				url: URL.createObjectURL(e),
				taken: t
			}, r = (e) => e.taken === "page" ? 0 : e.taken === "element" ? 1 : 2;
			this.pictures = [...this.pictures, n].sort((e, t) => r(e) - r(t));
		}
		this.refresh();
	}
	remove(e) {
		let t = this.pictures.find((t) => t.id === e);
		t && URL.revokeObjectURL(t.url), this.pictures = this.pictures.filter((t) => t.id !== e);
	}
	captureProgress(e) {
		this.capturing && this.isOpen && (this.percent = e, this.progressLine.textContent = `${this.host.strings.screenshotTaking} ${e}%`, this.screenshotButton.querySelector("span").textContent = `${this.host.strings.screenshotTaking} ${e}%`);
	}
	async screenshot() {
		if (!this.host.screenshot || this.capturing) return;
		this.capturing = !0, this.percent = 0, this.problem = null, this.refresh();
		let e = this.opening;
		if (await new Promise((e) => requestAnimationFrame(() => setTimeout(e, 0))), !this.isOpen || e !== this.opening) return;
		let { page: t, element: n } = await this.host.capture();
		e === this.opening && (this.capturing = !1, this.isOpen && (t ? (this.add(t, "page"), n && !this.full() && this.add(n, "element")) : this.problem = this.host.strings.screenshotFailed, this.refresh(), this.list.querySelector(".cm-image .cm-button")?.focus()));
	}
	async draw(e) {
		if (!this.host.drawing || this.drawing) return;
		let t = this.opening;
		this.drawing = !0;
		let n = new AbortController();
		this.editorController = n;
		let r = await xe(e.file, this.host.strings, this.root, n.signal, this.host.icons);
		if (t !== this.opening || !this.isOpen) return;
		this.editorController = null, this.drawing = !1, r.action === "done" ? (URL.revokeObjectURL(e.url), this.pictures = this.pictures.map((t) => t.id === e.id ? {
			...t,
			file: r.file,
			url: URL.createObjectURL(r.file),
			drawn: !0
		} : t)) : r.action === "remove" && this.remove(e.id), this.refresh();
		let i = this.pictures.findIndex((t) => t.id === e.id);
		(i >= 0 ? this.list.children[i]?.querySelector(".cm-button") : this.addButton)?.focus();
	}
	get editing() {
		return this.drawing;
	}
	async submit() {
		if (!this.body.trim() || this.sending || this.capturing) return;
		if (this.host.name === "required" && !this.nameField.value.trim()) {
			this.error = this.host.strings.nameRequired, this.refresh(), this.nameField.focus();
			return;
		}
		let e = this.opening;
		this.sending = !0, this.error = null, this.refresh();
		let t = this.pictures.find((e) => e.taken === "page"), n = this.pictures.filter((e) => e !== t).map((e) => e.taken === "element" ? we(e.file, "element.png") : e.file), r;
		try {
			r = await this.host.send({
				body: this.body.trim(),
				name: this.host.name === "off" ? null : this.nameField.value.trim() || null,
				kind: this.kind,
				screenshot: t ? we(t.file, "page.png") : null,
				images: n
			});
		} catch {
			r = this.host.strings.failed;
		}
		e === this.opening && this.isOpen && (this.sending = !1, r === null ? this.close() : (this.error = r, this.refresh(), this.field.focus()));
	}
	listen() {
		let e = (e, t) => {
			document.addEventListener(e, t), this.cleanups.push(() => document.removeEventListener(e, t));
		}, t = (e) => [...e.dataTransfer?.types ?? []].includes("Files"), n = (e) => {
			this.dropZone.hidden = !e, e ? J(this.dropZone) : Y(this.dropZone);
		};
		e("paste", (e) => {
			if (this.drawing || this.sending) return;
			let t = [...e.clipboardData?.files ?? []].filter((e) => e.type.startsWith("image/"));
			t.length && (e.preventDefault(), t.forEach((e) => this.add(e)));
		}), e("dragenter", (e) => {
			t(e) && (this.dragging++, n(!0));
		}), e("dragleave", (e) => {
			t(e) && (this.dragging = Math.max(0, this.dragging - 1), this.dragging || n(!1));
		}), e("dragover", (e) => {
			t(e) && e.preventDefault();
		}), e("drop", (e) => {
			this.dragging = 0, n(!1);
			let t = [...e.dataTransfer?.files ?? []];
			t.length && (e.preventDefault(), !this.drawing && !this.sending && t.forEach((e) => this.add(e)));
		});
		let r = () => this.place();
		window.addEventListener("resize", r), this.cleanups.push(() => window.removeEventListener("resize", r));
	}
	width() {
		return Math.min(400, window.innerWidth - 32);
	}
	place() {
		let e = this.width(), t = {
			width: window.innerWidth,
			height: window.innerHeight
		}, n = this.host.anchor(), r = t.width - e - 16, i = 16, a = t.height - 32, o = n ? null : this.host.opener();
		if (o && o.width && t.height - o.bottom - 24 >= 320 && (r = Math.max(16, Math.min(o.right - e, t.width - e - 16)), i = o.bottom + 8, a = t.height - i - 16), n) {
			let o = Math.max(16, Math.min(n.top, t.height - 280));
			if (t.width - n.right - 32 >= e) r = n.right + 16, i = o;
			else if (n.left - 32 >= e) r = n.left - e - 16, i = o;
			else {
				r = Math.max(16, Math.min(n.left, t.width - e - 16));
				let o = t.height - Math.max(0, n.bottom) - 32, s = Math.min(t.height, n.top) - 32;
				i = o >= s ? Math.max(16, n.bottom + 16) : 16, a = Math.max(o, s);
			}
			a = Math.max(320, Math.min(a, t.height - i - 16)), i = Math.max(16, Math.min(i, t.height - 16 - a));
		}
		this.position = {
			x: r,
			y: i
		}, this.apply(e, a);
	}
	apply(e = this.width(), t = window.innerHeight - this.position.y - 16) {
		Object.assign(this.panel.style, {
			left: `${this.position.x}px`,
			top: `${this.position.y}px`,
			width: `${e}px`,
			maxHeight: `${Math.max(220, t)}px`
		});
	}
	moveTo(e, t) {
		let n = this.width();
		this.position = {
			x: Math.max(8, Math.min(e, window.innerWidth - n - 8)),
			y: Math.max(8, Math.min(t, window.innerHeight - 120))
		}, this.apply(n);
	}
	draggable(e) {
		let t = e.parentElement;
		t.addEventListener("pointerdown", (e) => {
			if (e.button > 0 || e.target.closest("button")) return;
			e.preventDefault();
			let n = {
				x: e.clientX - this.position.x,
				y: e.clientY - this.position.y
			};
			t.setPointerCapture?.(e.pointerId);
			let r = (e) => this.moveTo(e.clientX - n.x, e.clientY - n.y), i = () => {
				t.removeEventListener("pointermove", r), t.removeEventListener("pointerup", i), t.removeEventListener("pointercancel", i);
			};
			t.addEventListener("pointermove", r), t.addEventListener("pointerup", i), t.addEventListener("pointercancel", i);
		}), e.addEventListener("keydown", (e) => {
			let t = {
				ArrowLeft: [-16, 0],
				ArrowRight: [16, 0],
				ArrowUp: [0, -16],
				ArrowDown: [0, 16]
			}[e.key];
			t && (e.preventDefault(), this.moveTo(this.position.x + t[0], this.position.y + t[1]));
		});
	}
	escape() {
		this.drawing || (this.confirming ? this.keepEditing() : this.requestClose());
	}
};
function we(e, t) {
	return e.name === t ? e : new File([e], t, { type: e.type });
}
//#endregion
//#region src/element.ts
var Te = "[data-luh]", Ee = "luh-surface";
function De() {
	customElements.get(Ee) || customElements.define(Ee, class extends HTMLElement {});
	let e = document.createElement(Ee);
	return e.setAttribute("data-luh", "window"), e;
}
var Oe = class extends HTMLElement {
	static observedAttributes = [
		"submit-url",
		"key",
		"app-version",
		"ignore"
	];
	settings = {};
	strings = D;
	picker;
	window;
	windowHost = De();
	announcer = H("p", {
		class: "cm-sr",
		role: "status"
	});
	toast = H("p", {
		class: "cm-toast",
		popover: "manual",
		role: "status",
		hidden: !0
	});
	ready = !1;
	capturing = !1;
	captureSequence = 0;
	returnFocus = null;
	lineage = [];
	shot = null;
	stale = !1;
	step = 0;
	context = null;
	via = "write";
	picking = !1;
	pickWasActive = !1;
	watcher = null;
	toastTimer = 0;
	themeQuery = null;
	onThemeChange = () => this.applyTheme();
	get surface() {
		return this.windowHost;
	}
	applyTheme() {
		let e = this.settings.theme ?? "auto", t = e === "auto" ? this.themeQuery?.matches ? "dark" : "light" : e;
		this.setAttribute("data-luh-theme", t), this.windowHost.setAttribute("data-luh-theme", t);
	}
	addEventListener(e, t, n) {
		t && super.addEventListener(e, t, n);
	}
	get allowed() {
		try {
			return typeof this.settings.allowed == "function" ? this.settings.allowed() : this.settings.allowed !== !1;
		} catch {
			return !1;
		}
	}
	configure(e) {
		this.settings = {
			...this.settings,
			...e
		};
		let t = this.allowed && this.settings.elementPicking !== !1;
		return this.picking && !t && this.resume(), t || (this.active = !1), this.window?.pickButton && (this.window.pickButton.hidden = !t || !this.settings.pickLabel), this.applyTheme(), this.strings = A(this.settings.language ?? document.documentElement.lang ?? "en", this.settings.languages, this.settings.strings), this.ready && this.isOpen ? this.stale = !0 : this.ready && this.build(), this;
	}
	get options() {
		return this.settings;
	}
	get ignore() {
		return [Te, this.settings.ignore ?? this.getAttribute("ignore")].filter(Boolean).join(", ");
	}
	connectedCallback() {
		if (!this.ready) {
			if (this.ready = !0, this.setAttribute("data-luh", ""), !document.getElementById("luh-page-style")) {
				let e = H("style", { id: "luh-page-style" });
				e.textContent = Q, document.head.append(e);
			}
			this.themeQuery = window.matchMedia("(prefers-color-scheme: dark)"), this.themeQuery.addEventListener("change", this.onThemeChange), this.applyTheme(), this.build(), document.addEventListener("keydown", this.onKey, { capture: !0 });
		}
	}
	disconnectedCallback() {
		queueMicrotask(() => {
			this.isConnected || (this.active = !1, this.window?.close(), this.themeQuery?.removeEventListener("change", this.onThemeChange), this.themeQuery = null, window.clearTimeout(this.toastTimer), Y(this.toast), this.windowHost.remove(), document.removeEventListener("keydown", this.onKey, { capture: !0 }), this.ready = !1);
		});
	}
	attributeChangedCallback() {
		this.ready && this.isOpen ? this.stale = !0 : this.ready && this.build();
	}
	shadow() {
		let e = this.shadowRoot ?? this.attachShadow({ mode: "open" });
		e.replaceChildren(H("style", {}, ce), this.announcer, this.toast);
		let t = this.windowHost.shadowRoot ?? this.windowHost.attachShadow({ mode: "open" });
		return t.replaceChildren(H("style", {}, ce)), {
			root: e,
			windowRoot: t
		};
	}
	build() {
		this.stale = !1;
		let e = this.picker?.active ?? !1;
		this.picker && (this.picker.active = !1);
		let { root: t, windowRoot: n } = this.shadow();
		this.picker = new se(t, {
			strings: this.strings,
			ignore: this.ignore,
			paused: () => this.isOpen && !this.picking || this.capturing,
			pick: (e, t) => this.open({
				element: e,
				selectedText: t
			})
		});
		let r = this.settings.language ?? document.documentElement.lang ?? "en";
		n.host.setAttribute("lang", r), this.setAttribute("lang", r), this.settings.trigger && t.append(H("button", {
			type: "button",
			class: "cm-button cm-trigger",
			onclick: (e) => this.open({ from: e })
		}, q("pen", this.settings.icons), this.strings.trigger)), this.window = new Ce(n, {
			pickLabel: this.settings.pickLabel,
			pick: this.settings.pickLabel && this.settings.elementPicking !== !1 ? () => this.point() : void 0,
			icons: this.settings.icons,
			strings: this.strings,
			name: this.settings.name ?? "off",
			screenshot: this.settings.screenshot !== !1,
			drawing: this.settings.drawing !== !1,
			kinds: this.settings.kinds ?? [],
			finePrint: this.settings.finePrint,
			remark: () => this.remark(),
			maxImages: this.settings.maxImages ?? 8,
			maxImageBytes: this.settings.maxImageBytes ?? 10485760,
			capture: () => this.capture(),
			screenshotNote: () => this.settings.screenshotNote?.() ?? null,
			widen: (e) => this.widen(e),
			widenState: () => ({
				wider: this.step < this.lineage.length - 1,
				narrower: this.step > 0
			}),
			pickedText: () => this.context?.element?.text ?? "",
			send: (e) => this.send(e),
			closed: () => this.closed(),
			opener: () => this.returnFocus?.isConnected ? this.returnFocus.getBoundingClientRect() : null,
			anchor: () => this.where(this.lineage[this.step]) ?? null
		}), this.picker.active = e && this.allowed && this.settings.elementPicking !== !1, this.windowHost.isConnected || document.body.append(this.windowHost);
	}
	get active() {
		return this.picker?.active ?? !1;
	}
	set active(e) {
		e && (!this.allowed || this.settings.elementPicking === !1) && (e = !1), this.picker && e !== this.picker.active && (this.picker.active = e, this.announce(e ? this.strings.modeOn : this.strings.modeOff), this.changed());
	}
	toggle(e) {
		this.active = e ?? !this.active;
	}
	get isOpen() {
		return this.window?.isOpen ?? !1;
	}
	get state() {
		return {
			active: this.active,
			open: this.isOpen,
			capturing: this.capturing
		};
	}
	point() {
		this.allowed && this.settings.elementPicking !== !1 && this.isOpen && !this.capturing && (this.pickWasActive = this.active, this.picking = !0, this.window.suspend(), this.picker.pin(null), this.returnFocus?.focus({ preventScroll: !0 }), this.active = !0, this.changed());
	}
	resume() {
		this.picking = !1, this.active = this.pickWasActive, this.picker.pin(this.lineage[this.step]?.element ?? null), this.window.open({
			via: this.via,
			name: this.context?.element?.name,
			selectedText: this.context?.selectedText,
			pickedText: this.context?.element?.text
		}), this.changed();
	}
	open(e = {}) {
		if (this.picking && (!e.element || !this.allowed)) {
			this.resume(), this.allowed || (this.active = !1);
			return;
		}
		if (!this.ready || !this.allowed || e.element && this.settings.elementPicking === !1) return;
		if (this.isOpen && !this.picking) {
			if (this.windowHost.isConnected) return this.window.panel.querySelector("textarea")?.focus();
			this.window.close();
		}
		let t = e.from, n = t instanceof Event ? t.currentTarget instanceof Element ? t.currentTarget : null : t ?? null, r = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		this.picking || (this.returnFocus = n instanceof HTMLElement ? n : r);
		let i = e.element ?? null, a = R(i ?? n, this.ignore);
		(a ?? document.body).append(this.windowHost), this.lineage = [];
		for (let e = i; e && e !== document.body; e = e.parentElement) this.lineage.push({
			element: e,
			bounds: e.getBoundingClientRect()
		});
		this.step = 0, this.shot = null, this.via = i ? "pick" : "write";
		let o = e.selectedText ?? "", s = this.picking && this.context ? { ...this.context } : z({
			appVersion: this.settings.appVersion ?? this.getAttribute("app-version") ?? void 0,
			extra: this.settings.context?.() ?? {},
			dialog: a
		});
		delete s.selectedText, this.context = {
			...s,
			...i ? { element: I(i, this.strings) } : {},
			...o ? { selectedText: o } : {}
		}, this.picking && (this.picking = !1, this.active = this.pickWasActive, this.window.dropTaken()), this.window.open({
			via: this.via,
			name: i ? F(i, this.strings) : void 0,
			selectedText: e.selectedText,
			pickedText: this.context.element?.text
		}), this.picker.pin(i), this.watcher?.disconnect(), this.watcher = new MutationObserver(() => {
			this.windowHost.isConnected || this.window.close();
		}), this.watcher.observe(document.body, {
			childList: !0,
			subtree: !0
		}), this.changed(), this.dispatchEvent(new CustomEvent("open", { detail: this.context }));
	}
	close() {
		this.window?.close();
	}
	closed() {
		this.picking && (this.picking = !1, this.active = this.isConnected && this.pickWasActive), this.watcher?.disconnect(), this.watcher = null, this.picker.pin(null), this.lineage = [], this.shot = null, this.context = null, document.body.append(this.windowHost);
		let e = this.returnFocus;
		this.returnFocus = null, requestAnimationFrame(() => {
			e?.isConnected && e.focus({ preventScroll: !0 });
		}), this.stale && this.isConnected && this.build(), this.changed(), this.dispatchEvent(new CustomEvent("close", { detail: this.state }));
	}
	widen(e) {
		this.step = Math.max(0, Math.min(this.lineage.length - 1, this.step + e));
		let t = this.lineage[this.step]?.element;
		return !t || !this.context ? null : (this.context = {
			...this.context,
			element: I(t, this.strings)
		}, this.picker.pin(t), F(t, this.strings));
	}
	where(e) {
		if (!e) return;
		let t = e.element.isConnected ? e.element.getBoundingClientRect() : null;
		return t && t.width && t.height && (e.bounds = t), e.bounds;
	}
	async capture() {
		let e = ++this.captureSequence, t = this.context;
		this.capturing = !0, this.changed();
		let n = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		this.lineage.forEach((e) => this.where(e));
		try {
			let i = await r(this.ignore, (e) => this.window.captureProgress(e));
			return !i || this.context !== t || e !== this.captureSequence ? {
				page: null,
				element: null
			} : (this.shot = {
				raw: i,
				viewport: n
			}, await this.marked());
		} finally {
			e === this.captureSequence && (this.capturing = !1, this.changed());
		}
	}
	remark() {
		return this.shot ? this.marked() : Promise.resolve(null);
	}
	async marked() {
		let { raw: e, viewport: t } = this.shot, n = this.lineage[this.step]?.bounds, [r, i] = n ? await Promise.all([c(e, n, t), s(e, n, t)]) : [e, null], a = (e, t) => e ? new File([e], t, { type: "image/png" }) : null;
		return {
			page: a(r ?? e, "page.png"),
			element: a(i, "element.png")
		};
	}
	async send(e) {
		if (!this.allowed) return this.strings.notAllowed;
		if (!this.context) return this.strings.failed;
		let t = {
			via: this.via,
			...e,
			context: this.context
		}, n = this.settings.onSubmit ? await this.settings.onSubmit(t) : await ke(this.settings.submitUrl ?? this.getAttribute("submit-url"), t, this.strings);
		return n && typeof n == "object" && "error" in n ? n.error || this.strings.failed : (this.context === t.context && this.settings.deactivateOnSubmit !== !1 && (this.active = !1), this.context === t.context && this.settings.thanks !== !1 && this.say(this.strings.sent), this.dispatchEvent(new CustomEvent("sent", { detail: t })), null);
	}
	onKey = (e) => {
		if (!this.allowed) {
			this.picking && this.resume(), this.active = !1, this.isOpen && !this.window.editing && e.key === "Escape" && (e.preventDefault(), e.stopImmediatePropagation(), this.window.escape());
			return;
		}
		let t = this.settings.key ?? this.getAttribute("key") ?? "c";
		if (this.picking && (e.key === "Escape" || !e.metaKey && !e.ctrlKey && !e.altKey && typeof t == "string" && e.key.toLowerCase() === t.toLowerCase())) {
			e.preventDefault(), e.stopImmediatePropagation(), this.resume();
			return;
		}
		if (this.window?.editing) return;
		if (this.picking) {
			this.picker.key(e) && (e.preventDefault(), e.stopImmediatePropagation());
			return;
		}
		if (this.isOpen) {
			e.key === "Escape" && (e.preventDefault(), e.stopImmediatePropagation(), this.window.escape());
			return;
		}
		if (this.capturing) return;
		let n = !e.metaKey && !e.ctrlKey && !e.altKey;
		if (t && n && typeof t == "string" && e.key.toLowerCase() === t.toLowerCase() && !Z(e.composedPath()[0] ?? e.target)) e.preventDefault(), this.toggle();
		else if (this.active) {
			if (e.key === "Escape") {
				if (document.querySelector(`:is(${this.ignore}) [aria-expanded="true"]`)) return;
				e.preventDefault(), e.stopImmediatePropagation(), this.active = !1;
			} else this.picker.key(e) && (e.preventDefault(), e.stopImmediatePropagation());
		}
	};
	changed() {
		this.picker.draw(), this.dispatchEvent(new CustomEvent("change", { detail: this.state }));
	}
	announce(e) {
		this.announcer.textContent = "", requestAnimationFrame(() => this.announcer.textContent = e);
	}
	say(e) {
		window.clearTimeout(this.toastTimer), this.toast.textContent = e, this.toast.hidden = !1, J(this.toast), this.toastTimer = window.setTimeout(() => {
			this.toast.hidden = !0, Y(this.toast);
		}, 3e3);
	}
};
async function ke(e, t, n) {
	if (!e) return { error: n.failed };
	let r = new FormData();
	r.append("body", t.body), t.name && r.append("name", t.name), t.kind && r.append("kind", t.kind), r.append("via", t.via), r.append("context", JSON.stringify(t.context)), t.screenshot && r.append("screenshot", t.screenshot), t.images.forEach((e) => r.append("images[]", e));
	try {
		let t = await fetch(e, {
			method: "POST",
			body: r,
			credentials: "same-origin"
		});
		if (t.ok) return;
		let i = await t.json().catch(() => null);
		return { error: i && typeof i.error == "string" && i.error || n.failed };
	} catch {
		return { error: n.failed };
	}
}
//#endregion
//#region src/index.ts
var Ae = "luh-notes";
function je(e = Ae) {
	return customElements.get(e) || customElements.define(e, class extends Oe {}), customElements.get(e);
}
function Me(e = {}) {
	je();
	let t = document.createElement(Ae);
	return t.configure(e), document.body.append(t), t;
}
function Ne(e, t = {}) {
	return F(e, {
		...D,
		...t
	});
}
//#endregion
export { Oe as a, ne as c, O as d, A as f, Ne as i, k as l, e as m, Me as n, Te as o, t as p, je as r, Ee as s, Ae as t, D as u };

//# sourceMappingURL=src-BUVmpzZY.js.map