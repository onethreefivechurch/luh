//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = "luh", u = "#e5484d", d = /* @__PURE__ */ new Map();
async function f(e, t = () => {}) {
	let n = document.documentElement;
	try {
		let { createContext: r, destroyContext: i, domToBlob: a } = await import("./dist-DhYexWcW.js");
		await document.fonts?.ready;
		let o = [n], s = 0, c = await r(n, {
			filter: (e) => {
				if (e instanceof Element) {
					if (e === c.sandbox || getComputedStyle(e).display === "none") return !1;
					o.push(e);
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
				let n = o.pop();
				if (!(t instanceof HTMLElement) || !(n instanceof HTMLElement)) return;
				t instanceof HTMLInputElement && t.type === "password" && (t.value = "", t.setAttribute("value", "")), n.matches(e) && (t.style.opacity = "0"), t instanceof HTMLImageElement && n instanceof HTMLImageElement && p(n, t);
				let r = getComputedStyle(n);
				if (t.matches("input, textarea")) {
					let e = getComputedStyle(n, "::placeholder"), r = `luh-placeholder-${s++}`;
					t.classList.add(r), c.svgStyleElement?.appendChild(document.createTextNode(`.${r}::placeholder { color: ${e.color}; -webkit-text-fill-color: ${e.webkitTextFillColor}; opacity: ${e.opacity}; }`));
				}
				let i = n.offsetWidth - n.clientWidth - parseFloat(r.borderLeftWidth) - parseFloat(r.borderRightWidth), a = n.offsetHeight - n.clientHeight - parseFloat(r.borderTopWidth) - parseFloat(r.borderBottomWidth);
				[
					"auto",
					"scroll",
					"overlay"
				].includes(t.style.overflowX) && a < 1 && (t.style.overflowX = "hidden"), [
					"auto",
					"scroll",
					"overlay"
				].includes(t.style.overflowY) && i < 1 && (t.style.overflowY = "hidden");
			}
		});
		c.fontCssTexts = new Map(d);
		try {
			let e = await a(c);
			return t(100), e;
		} finally {
			c.fontCssTexts.forEach((e, t) => d.set(t, e)), i(c);
		}
	} catch {
		return null;
	}
}
function p(e, t) {
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
function m(e, t) {
	let n = Math.max(0, e.left), r = Math.max(0, e.top), i = Math.min(t.width, e.left + e.width) - n, a = Math.min(t.height, e.top + e.height) - r;
	return i > 0 && a > 0 ? {
		left: n,
		top: r,
		width: i,
		height: a
	} : null;
}
async function h(e, t, n) {
	try {
		let r = await createImageBitmap(e), i = n(r, r.width / t.width);
		return r.close(), i ? await new Promise((e) => i.toBlob(e, "image/png")) : null;
	} catch {
		return null;
	}
}
function g(e, t, n) {
	return h(e, n, (e, r) => {
		let i = m(t, n);
		if (!i) return null;
		let a = document.createElement("canvas");
		return a.width = Math.ceil(i.width * r), a.height = Math.ceil(i.height * r), a.getContext("2d")?.drawImage(e, i.left * r, i.top * r, i.width * r, i.height * r, 0, 0, a.width, a.height), a;
	});
}
function _(e, t, n) {
	return h(e, n, (e, r) => {
		let i = document.createElement("canvas");
		i.width = e.width, i.height = e.height;
		let a = i.getContext("2d");
		if (!a) return null;
		a.drawImage(e, 0, 0);
		let o = m(t, n);
		if (!o) return i;
		let s = 3 * r, c = [
			o.left * r - s,
			o.top * r - s,
			o.width * r + s * 2,
			o.height * r + s * 2
		];
		return a.lineJoin = "round", a.strokeStyle = "rgba(255, 255, 255, 0.9)", a.lineWidth = 6 * r, a.strokeRect(...c), a.strokeStyle = u, a.lineWidth = 3 * r, a.strokeRect(...c), i;
	});
}
//#endregion
//#region node_modules/.pnpm/@medv+finder@4.0.2/node_modules/@medv/finder/finder.js
var v = /* @__PURE__ */ new Set([
	"role",
	"name",
	"aria-label",
	"rel",
	"href"
]);
function y(e, t) {
	let n = v.has(e);
	n ||= e.startsWith("data-") && C(e);
	let r = C(t) && t.length < 100;
	return r ||= t.startsWith("#") && C(t.slice(1)), n && r;
}
function ee(e) {
	return C(e);
}
function te(e) {
	return C(e);
}
function b(e) {
	return !0;
}
function x(e, t) {
	if (e.nodeType !== Node.ELEMENT_NODE) throw Error("Can't generate CSS selector for non-element node type.");
	if (e.tagName.toLowerCase() === "html") return "html";
	let n = {
		root: document.body,
		idName: ee,
		className: te,
		tagName: b,
		attr: y,
		timeoutMs: 1e3,
		seedMinLength: 3,
		optimizedMinLength: 2,
		maxNumberOfPathChecks: Infinity
	}, r = /* @__PURE__ */ new Date(), i = {
		...n,
		...t
	}, a = N(i.root, n), o, s = 0;
	for (let t of S(e, i, a)) {
		if ((/* @__PURE__ */ new Date()).getTime() - r.getTime() > i.timeoutMs || s >= i.maxNumberOfPathChecks) {
			let t = k(e, a);
			if (!t) throw Error(`Timeout: Can't find a unique selector after ${i.timeoutMs}ms`);
			return T(t);
		}
		if (s++, P(t, a)) {
			o = t;
			break;
		}
	}
	if (!o) throw Error("Selector was not found.");
	let c = [...F(o, e, i, a, r)];
	return c.sort(D), c.length > 0 ? T(c[0]) : T(o);
}
function* S(e, t, n) {
	let r = [], i = [], a = e, o = 0;
	for (; a && a !== n;) {
		let e = w(a, t);
		for (let t of e) t.level = o;
		if (r.push(e), a = a.parentElement, o++, i.push(...M(r)), o >= t.seedMinLength) {
			i.sort(D);
			for (let e of i) yield e;
			i = [];
		}
	}
	i.sort(D);
	for (let e of i) yield e;
}
function C(e) {
	if (/^[a-z\-]{3,}$/i.test(e)) {
		let t = e.split(/-|[A-Z]/);
		for (let e of t) if (e.length <= 2 || /[^aeiou]{4,}/i.test(e)) return !1;
		return !0;
	}
	return !1;
}
function w(e, t) {
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
		let t = O(e, i);
		t !== void 0 && n.push({
			name: j(i, t),
			penalty: 10
		});
	}
	let a = O(e);
	return a !== void 0 && n.push({
		name: A(i, a),
		penalty: 50
	}), n;
}
function T(e) {
	let t = e[0], n = t.name;
	for (let r = 1; r < e.length; r++) {
		let i = e[r].level || 0;
		n = t.level === i - 1 ? `${e[r].name} > ${n}` : `${e[r].name} ${n}`, t = e[r];
	}
	return n;
}
function E(e) {
	return e.map((e) => e.penalty).reduce((e, t) => e + t, 0);
}
function D(e, t) {
	return E(e) - E(t);
}
function O(e, t) {
	let n = e.parentNode;
	if (!n) return;
	let r = n.firstChild;
	if (!r) return;
	let i = 0;
	for (; r && (r.nodeType === Node.ELEMENT_NODE && (t === void 0 || r.tagName.toLowerCase() === t) && i++, r !== e);) r = r.nextSibling;
	return i;
}
function k(e, t) {
	let n = 0, r = e, i = [];
	for (; r && r !== t;) {
		let e = r.tagName.toLowerCase(), t = O(r, e);
		if (t === void 0) return;
		i.push({
			name: j(e, t),
			penalty: NaN,
			level: n
		}), r = r.parentElement, n++;
	}
	if (P(i, t)) return i;
}
function A(e, t) {
	return e === "html" ? "html" : `${e}:nth-child(${t})`;
}
function j(e, t) {
	return e === "html" ? "html" : `${e}:nth-of-type(${t})`;
}
function* M(e, t = []) {
	if (e.length > 0) for (let n of e[0]) yield* M(e.slice(1, e.length), t.concat(n));
	else yield t;
}
function N(e, t) {
	return e.nodeType === Node.DOCUMENT_NODE ? e : e === t.root ? e.ownerDocument : e;
}
function P(e, t) {
	let n = T(e);
	switch (t.querySelectorAll(n).length) {
		case 0: throw Error(`Can't select any node with this selector: ${n}`);
		case 1: return !0;
		default: return !1;
	}
}
function* F(e, t, n, r, i) {
	if (e.length > 2 && e.length > n.optimizedMinLength) for (let a = 1; a < e.length - 1; a++) {
		if ((/* @__PURE__ */ new Date()).getTime() - i.getTime() > n.timeoutMs) return;
		let o = [...e];
		o.splice(a, 1), P(o, r) && r.querySelector(T(o)) === t && (yield o, yield* F(o, t, n, r, i));
	}
}
//#endregion
//#region src/strings.ts
var I = {
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
function L(e, t = {}) {
	return e.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e);
}
var R = { en: I };
function z(e = "en", t = {}, n = {}) {
	let r = e.toLowerCase().replace(/_/g, "-"), i = Object.fromEntries(Object.entries({
		...R,
		...t
	}).map(([e, t]) => [e.toLowerCase().replace(/_/g, "-"), t]));
	return {
		...I,
		...i[r.split("-")[0]],
		...i[r],
		...n
	};
}
//#endregion
//#region src/context.ts
var ne = {
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
}, re = {
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
}, ie = (e) => e.matches("input, textarea, select"), B = (e) => (e ?? "").replace(/\s+/g, " ").trim();
function V(e, t) {
	let n = e.getAttribute("aria-label") ?? (ie(e) ? "" : B(e.textContent)), r = e.getAttribute("role"), i = r ? t[re[r.toLowerCase()] ?? "area"] : t[ne[e.tagName.toLowerCase()] ?? "area"], a = n.length > 32 ? `${n.slice(0, 31)}…` : n;
	return a ? L(t.named, {
		kind: i,
		label: a
	}) : i;
}
function H(e, t) {
	let n = "";
	try {
		n = x(e, {
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
		text: ie(e) ? (e.getAttribute("aria-label") ?? "").slice(0, 300) : B(e.textContent).slice(0, 300),
		role: e.getAttribute("role") ?? e.tagName.toLowerCase(),
		name: V(e, t)
	};
}
function U(e) {
	if (!e) return;
	let t = e.getAttribute("aria-labelledby");
	return B(t ? e.ownerDocument.getElementById(t)?.textContent : e.getAttribute("aria-label")).slice(0, 100) || void 0;
}
function ae(e, t) {
	let n = "dialog[open], [role=\"dialog\"][aria-modal=\"true\"], [role=\"dialog\"][data-state=\"open\"]", r = e, i = null;
	for (; r && !i;) {
		i = r.closest(n);
		let e = r.getRootNode();
		r = e instanceof ShadowRoot ? e.host : null;
	}
	return i instanceof HTMLElement && !i.closest(t) ? i : [...document.querySelectorAll(n)].filter((e) => !e.closest(t) && e.getClientRects().length > 0).at(-1) ?? null;
}
function W(e) {
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
		...U(e.dialog) ? { dialog: U(e.dialog) } : {},
		extra: e.extra
	};
}
function oe() {
	let e = document.getSelection();
	return e && !e.isCollapsed ? B(e.toString()).slice(0, 1e3) : "";
}
//#endregion
//#region src/parts.ts
var se = {
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
}, ce = {
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
function le(e) {
	let t = new Set((e.getAttribute("part") ?? "").split(/\s+/).filter(Boolean)), n = ce[e.localName.toLowerCase()];
	n && t.add(n);
	for (let n of e.classList) {
		let e = se[n];
		e && t.add(e);
	}
	t.size && e.setAttribute("part", [...t].join(" "));
}
//#endregion
//#region src/dom.ts
function G(e, t = {}, ...n) {
	let r = document.createElement(e);
	return q(r, t), de(r, n), le(r), r;
}
var ue = "http://www.w3.org/2000/svg";
function K(e, t = {}, ...n) {
	let r = document.createElementNS(ue, e);
	return q(r, t), de(r, n), le(r), r;
}
function q(e, t) {
	for (let [n, r] of Object.entries(t)) typeof r == "function" ? e.addEventListener(n.slice(2), r) : r === !0 ? e.setAttribute(n, "") : r !== !1 && r != null && e.setAttribute(n, String(r));
}
function de(e, t) {
	for (let n of t) (n || n === "") && e.append(n);
}
var J = {
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
function Y(e, t) {
	let n = t?.[e]?.();
	if (n && (n.namespaceURI !== ue || n.localName !== "svg")) throw TypeError(`Luh icon "${e}" must be an SVG root element`);
	let r = n ? n.cloneNode(!0) : K("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": 2,
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"aria-hidden": "true",
		class: "cm-icon"
	}, K("path", { d: J[e] }));
	return r.classList.add("cm-icon"), r.setAttribute("aria-hidden", "true"), r.setAttribute("focusable", "false"), r.setAttribute("part", `icon icon-${e}`), r.querySelectorAll("*").forEach(le), r;
}
function fe(e) {
	if (typeof e.showPopover == "function" && !e.matches(":popover-open")) try {
		e.showPopover();
	} catch {}
}
function X(e) {
	if (typeof e.hidePopover == "function") try {
		e.matches(":popover-open") && e.hidePopover();
	} catch {}
}
var pe = () => /Mac|iPhone|iPad/.test(navigator.platform), me = () => window.matchMedia?.("(pointer: fine)").matches ?? !0, he = "button, a, input, textarea, select, label, summary, [role=\"button\"], [role=\"tab\"], [role=\"checkbox\"], [role=\"radio\"], [role=\"switch\"], [role=\"menuitem\"], [role=\"option\"], [role=\"link\"]", ge = class {
	host;
	hovered = null;
	narrower = [];
	pinned = null;
	on = !1;
	outline = G("div", {
		class: "cm-outline",
		popover: "manual",
		hidden: !0,
		"aria-hidden": "true"
	});
	name = G("span", { class: "cm-outline-name" });
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
		return !(e instanceof Element) || e.closest(this.host.ignore) ? null : e.closest(he) ?? (e instanceof SVGElement ? e.closest("svg")?.parentElement ?? e : e);
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
			this.outline.hidden = !0, X(this.outline);
			return;
		}
		Object.assign(this.outline.style, {
			left: `${t.left}px`,
			top: `${t.top}px`,
			width: `${t.width}px`,
			height: `${t.height}px`
		}), this.outline.classList.toggle("cm-pinned", !!this.pinned);
		let n = this.pinned ? "" : V(e, this.host.strings);
		this.name.textContent = n && me() ? `${n} · ${this.host.strings.pickHint}` : n, this.name.hidden = !n, this.name.classList.toggle("cm-below", t.top < 28), this.outline.hidden = !1, fe(this.outline);
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
			r && (e.type === "pointerdown" && (n = oe(), t = !0), e.stopImmediatePropagation(), (r.matches(he) || r.closest("[draggable=\"true\"]")) && e.preventDefault());
		};
		e("pointerdown", r), e("mousedown", r), e("touchstart", r), e("click", (e) => {
			if (!this.picking) return;
			let t = this.target(e.target);
			if (!t) return;
			e.preventDefault(), e.stopImmediatePropagation();
			let r = document.getSelection(), i = oe();
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
		return e.key === "ArrowUp" && t?.parentElement && t.parentElement !== document.body ? (this.narrower = [...this.narrower, t], this.hovered = t.parentElement, this.draw(), !0) : e.key === "ArrowDown" && this.narrower.length ? (this.hovered = this.narrower.at(-1), this.narrower = this.narrower.slice(0, -1), this.draw(), !0) : (e.key === "Enter" || e.key === " ") && t && !_e(e.composedPath()[0] ?? e.target) ? (this.choose(t), !0) : !1;
	}
};
function _e(e) {
	return e instanceof HTMLElement && (e.isContentEditable || e.matches("input, textarea, select"));
}
//#endregion
//#region src/styles.ts
var ve = String.raw`
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
.cm-window progress { width: 100%; accent-color: var(--cm-accent); }
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
`, ye = String.raw`
html.${"luh"}-picking, html.${"luh"}-picking *:not([data-${"luh"}]) {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z' fill='%23fff' stroke='%2318181b' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E") 3 21, crosshair !important;
}
`;
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/toError.js
function be(e) {
	return e instanceof Error || typeof e == "object" && !!e && "message" in e && typeof e.message == "string";
}
function xe(e) {
	return be(e) ? e : Error(String(e));
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/getFileNameAndExtension.js
function Se(e) {
	let t = e.lastIndexOf(".");
	return t === -1 || t === e.length - 1 ? {
		name: e,
		extension: void 0
	} : {
		name: e.slice(0, t),
		extension: e.slice(t + 1)
	};
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/mimeTypes.js
var Ce = {
	__proto__: null,
	md: "text/markdown",
	markdown: "text/markdown",
	mp4: "video/mp4",
	mp3: "audio/mp3",
	svg: "image/svg+xml",
	jpg: "image/jpeg",
	png: "image/png",
	webp: "image/webp",
	gif: "image/gif",
	heic: "image/heic",
	heif: "image/heif",
	yaml: "text/yaml",
	yml: "text/yaml",
	csv: "text/csv",
	tsv: "text/tab-separated-values",
	tab: "text/tab-separated-values",
	avi: "video/x-msvideo",
	mks: "video/x-matroska",
	mkv: "video/x-matroska",
	mov: "video/quicktime",
	dicom: "application/dicom",
	doc: "application/msword",
	msg: "application/vnd.ms-outlook",
	docm: "application/vnd.ms-word.document.macroenabled.12",
	docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	dot: "application/msword",
	dotm: "application/vnd.ms-word.template.macroenabled.12",
	dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
	xla: "application/vnd.ms-excel",
	xlam: "application/vnd.ms-excel.addin.macroenabled.12",
	xlc: "application/vnd.ms-excel",
	xlf: "application/x-xliff+xml",
	xlm: "application/vnd.ms-excel",
	xls: "application/vnd.ms-excel",
	xlsb: "application/vnd.ms-excel.sheet.binary.macroenabled.12",
	xlsm: "application/vnd.ms-excel.sheet.macroenabled.12",
	xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	xlt: "application/vnd.ms-excel",
	xltm: "application/vnd.ms-excel.template.macroenabled.12",
	xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
	xlw: "application/vnd.ms-excel",
	txt: "text/plain",
	text: "text/plain",
	conf: "text/plain",
	log: "text/plain",
	pdf: "application/pdf",
	zip: "application/zip",
	"7z": "application/x-7z-compressed",
	rar: "application/x-rar-compressed",
	tar: "application/x-tar",
	gz: "application/gzip",
	dmg: "application/x-apple-diskimage"
};
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/getFileType.js
function we(e) {
	if (e.type) return e.type;
	let t = e.name ? Se(e.name).extension?.toLowerCase() : null;
	return t && t in Ce ? Ce[t] : "application/octet-stream";
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/generateFileID.js
function Te(e) {
	return e.charCodeAt(0).toString(32);
}
function Ee(e) {
	let t = "";
	return e.replace(/[^A-Z0-9]/gi, (e) => (t += `-${Te(e)}`, "/")) + t;
}
function De(e, t) {
	let n = t || "uppy";
	return typeof e.name == "string" && (n += `-${Ee(e.name.toLowerCase())}`), e.type !== void 0 && (n += `-${e.type}`), e.meta && typeof e.meta.relativePath == "string" && (n += `-${Ee(e.meta.relativePath.toLowerCase())}`), e.data?.size !== void 0 && (n += `-${e.data.size}`), e.data.lastModified !== void 0 && (n += `-${e.data.lastModified}`), n;
}
function Oe(e) {
	return !e.isRemote || !e.remote ? !1 : (/* @__PURE__ */ new Set([
		"box",
		"dropbox",
		"drive",
		"facebook",
		"unsplash"
	])).has(e.remote.provider);
}
function ke(e, t) {
	if (Oe(e)) return e.id;
	let n = we(e);
	return De({
		...e,
		type: n
	}, t);
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/getErrorMessage.js
function Ae(e) {
	return be(e) ? e.message : String(e);
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/getTimeStamp.js
function je(e) {
	return e < 10 ? `0${e}` : e.toString();
}
function Me() {
	let e = /* @__PURE__ */ new Date();
	return `${je(e.getHours())}:${je(e.getMinutes())}:${je(e.getSeconds())}`;
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/isRestrictionError.js
function Ne(e) {
	return e instanceof Error && "isRestriction" in e && e.isRestriction === !0;
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/Translator.js
function Pe(e, t, n) {
	let r = [];
	return e.forEach((e) => {
		typeof e == "string" ? t[Symbol.split](e).forEach((e, t, i) => {
			e !== "" && r.push(e), t < i.length - 1 && r.push(n);
		}) : r.push(e);
	}), r;
}
function Fe(e, t) {
	let n = /\$/g, r = [e];
	if (t == null) return r;
	for (let e of Object.keys(t)) if (e !== "_") {
		let i = t[e];
		typeof i == "string" && (i = n[Symbol.replace](i, "$$$$")), r = Pe(r, RegExp(`%\\{${e}\\}`, "g"), i);
	}
	return r;
}
var Ie = (e) => {
	throw Error(`missing string: ${e}`);
}, Le = class {
	locale;
	constructor(e, { onMissingKey: t = Ie } = {}) {
		this.locale = {
			strings: {},
			pluralize(e) {
				return e === 1 ? 0 : 1;
			}
		}, Array.isArray(e) ? e.forEach(this.#t, this) : this.#t(e), this.#e = t;
	}
	#e;
	#t(e) {
		if (!e?.strings) return;
		let t = this.locale;
		Object.assign(this.locale, {
			strings: {
				...t.strings,
				...e.strings
			},
			pluralize: e.pluralize || t.pluralize
		});
	}
	translate(e, t) {
		return this.translateArray(e, t).join("");
	}
	translateArray(e, t) {
		let n = this.locale.strings[e];
		if (n ??= (this.#e(e), e), typeof n == "object") {
			if (t && t.smart_count !== void 0) {
				let e = this.locale.pluralize(t.smart_count);
				return Fe(n[e], t);
			}
			throw Error("Attempted to use a string with plural forms, but no value was given for %{smart_count}");
		}
		if (typeof n != "string") throw Error("string was not a string");
		return Fe(n, t);
	}
}, Re = {
	debug: () => {},
	warn: () => {},
	error: (...e) => console.error(`[Uppy] [${Me()}]`, ...e)
}, ze = {
	debug: (...e) => console.debug(`[Uppy] [${Me()}]`, ...e),
	warn: (...e) => console.warn(`[Uppy] [${Me()}]`, ...e),
	error: (...e) => console.error(`[Uppy] [${Me()}]`, ...e)
}, Be = [
	"B",
	"KB",
	"MB",
	"GB",
	"TB",
	"PB",
	"EB",
	"ZB",
	"YB"
];
function Ve(e, t) {
	if (typeof e != "number" || Number.isNaN(e)) throw TypeError(`Expected a number, got ${typeof e}`);
	let n = e < 0, r = Math.abs(e);
	if (n && (r = -r), r === 0) return "0 B";
	let i = t ? Be.indexOf(t) : Math.min(Math.floor(Math.log(r) / Math.log(1024)), Be.length - 1), a = Number(r / 1024 ** i), o = Be[i];
	return i >= 3 ? a % 1 == 0 ? `${Math.round(a)} ${o}` : `${a.toFixed(2)} ${o}` : `${a >= 10 || a % 1 == 0 ? Math.round(a) : a.toFixed(1)} ${o}`;
}
//#endregion
//#region node_modules/.pnpm/wildcard@1.1.2/node_modules/wildcard/index.js
var He = /* @__PURE__ */ o(((e, t) => {
	function n(e, t) {
		this.text = e ||= "", this.hasWild = ~e.indexOf("*"), this.separator = t, this.parts = e.split(t);
	}
	n.prototype.match = function(e) {
		var t = !0, n = this.parts, r, i = n.length, a;
		if (typeof e == "string" || e instanceof String) {
			if (!this.hasWild && this.text != e) t = !1;
			else {
				for (a = (e || "").split(this.separator), r = 0; t && r < i; r++) if (n[r] === "*") continue;
				else t = r < a.length && n[r] === a[r];
				t &&= a;
			}
		} else if (typeof e.splice == "function") for (t = [], r = e.length; r--;) this.match(e[r]) && (t[t.length] = e[r]);
		else if (typeof e == "object") for (var o in t = {}, e) this.match(o) && (t[o] = e[o]);
		return t;
	}, t.exports = function(e, t, r) {
		var i = new n(e, r || /[\/\.]/);
		return t === void 0 ? i : i.match(t);
	};
})), Ue = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	var n = He(), r = /[\/\+\.]/;
	t.exports = function(e, t) {
		function i(t) {
			var i = n(t, e, r);
			return i && i.length >= 2;
		}
		return t ? i(t.split(";")[0]) : i;
	};
})))(), 1), We = {
	maxFileSize: null,
	minFileSize: null,
	maxTotalFileSize: null,
	maxNumberOfFiles: null,
	minNumberOfFiles: null,
	allowedFileTypes: null,
	requiredMetaFields: []
}, Z = class extends Error {
	isUserFacing;
	file;
	constructor(e, t) {
		super(e), this.isUserFacing = t?.isUserFacing ?? !0, t?.file && (this.file = t.file);
	}
	isRestriction = !0;
}, Ge = class {
	getI18n;
	getOpts;
	constructor(e, t) {
		this.getI18n = t, this.getOpts = () => {
			let t = e();
			if (t.restrictions?.allowedFileTypes != null && !Array.isArray(t.restrictions.allowedFileTypes)) throw TypeError("`restrictions.allowedFileTypes` must be an array");
			return t;
		};
	}
	validateAggregateRestrictions(e, t) {
		let { maxTotalFileSize: n, maxNumberOfFiles: r } = this.getOpts().restrictions;
		if (r && e.filter((e) => !e.isGhost).length + t.length > r) throw new Z(`${this.getI18n()("youCanOnlyUploadX", { smart_count: r })}`);
		if (n) {
			let r = [...e, ...t].reduce((e, t) => e + (t.size ?? 0), 0);
			if (r > n) throw new Z(this.getI18n()("aggregateExceedsSize", {
				sizeAllowed: Ve(n),
				size: Ve(r)
			}));
		}
	}
	validateSingleFile(e) {
		let { maxFileSize: t, minFileSize: n, allowedFileTypes: r } = this.getOpts().restrictions;
		if (r && !r.some((t) => t.includes("/") ? e.type ? (0, Ue.default)(e.type.replace(/;.*?$/, ""), t) : !1 : t[0] === "." && e.extension ? e.extension.toLowerCase() === t.slice(1).toLowerCase() : !1)) {
			let t = r.join(", ");
			throw new Z(this.getI18n()("youCanOnlyUploadFileTypes", { types: t }), { file: e });
		}
		if (t && e.size != null && e.size > t) throw new Z(this.getI18n()("exceedsSize", {
			size: Ve(t),
			file: e.name ?? this.getI18n()("unnamed")
		}), { file: e });
		if (n && e.size != null && e.size < n) throw new Z(this.getI18n()("inferiorSize", { size: Ve(n) }), { file: e });
	}
	validate(e, t) {
		t.forEach((e) => {
			this.validateSingleFile(e);
		}), this.validateAggregateRestrictions(e, t);
	}
	validateMinNumberOfFiles(e) {
		let { minNumberOfFiles: t } = this.getOpts().restrictions;
		if (t && Object.keys(e).length < t) throw new Z(this.getI18n()("youHaveToAtLeastSelectX", { smart_count: t }));
	}
	getMissingRequiredMetaFields(e) {
		let t = new Z(this.getI18n()("missingRequiredMetaFieldOnFile", { fileName: e.name ?? this.getI18n()("unnamed") })), { requiredMetaFields: n } = this.getOpts().restrictions, r = [];
		for (let t of n) (!Object.hasOwn(e.meta, t) || e.meta[t] === "") && r.push(t);
		return {
			missingFields: r,
			error: t
		};
	}
}, Ke = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		var t = typeof e;
		return e != null && (t == "object" || t == "function");
	}
	t.exports = n;
})), qe = /* @__PURE__ */ o(((e, t) => {
	t.exports = typeof global == "object" && global && global.Object === Object && global;
})), Je = /* @__PURE__ */ o(((e, t) => {
	var n = qe(), r = typeof self == "object" && self && self.Object === Object && self;
	t.exports = n || r || Function("return this")();
})), Ye = /* @__PURE__ */ o(((e, t) => {
	var n = Je();
	t.exports = function() {
		return n.Date.now();
	};
})), Xe = /* @__PURE__ */ o(((e, t) => {
	var n = /\s/;
	function r(e) {
		for (var t = e.length; t-- && n.test(e.charAt(t)););
		return t;
	}
	t.exports = r;
})), Ze = /* @__PURE__ */ o(((e, t) => {
	var n = Xe(), r = /^\s+/;
	function i(e) {
		return e && e.slice(0, n(e) + 1).replace(r, "");
	}
	t.exports = i;
})), Qe = /* @__PURE__ */ o(((e, t) => {
	t.exports = Je().Symbol;
})), $e = /* @__PURE__ */ o(((e, t) => {
	var n = Qe(), r = Object.prototype, i = r.hasOwnProperty, a = r.toString, o = n ? n.toStringTag : void 0;
	function s(e) {
		var t = i.call(e, o), n = e[o];
		try {
			e[o] = void 0;
			var r = !0;
		} catch {}
		var s = a.call(e);
		return r && (t ? e[o] = n : delete e[o]), s;
	}
	t.exports = s;
})), et = /* @__PURE__ */ o(((e, t) => {
	var n = Object.prototype.toString;
	function r(e) {
		return n.call(e);
	}
	t.exports = r;
})), tt = /* @__PURE__ */ o(((e, t) => {
	var n = Qe(), r = $e(), i = et(), a = "[object Null]", o = "[object Undefined]", s = n ? n.toStringTag : void 0;
	function c(e) {
		return e == null ? e === void 0 ? o : a : s && s in Object(e) ? r(e) : i(e);
	}
	t.exports = c;
})), nt = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return typeof e == "object" && !!e;
	}
	t.exports = n;
})), rt = /* @__PURE__ */ o(((e, t) => {
	var n = tt(), r = nt(), i = "[object Symbol]";
	function a(e) {
		return typeof e == "symbol" || r(e) && n(e) == i;
	}
	t.exports = a;
})), it = /* @__PURE__ */ o(((e, t) => {
	var n = Ze(), r = Ke(), i = rt(), a = NaN, o = /^[-+]0x[0-9a-f]+$/i, s = /^0b[01]+$/i, c = /^0o[0-7]+$/i, l = parseInt;
	function u(e) {
		if (typeof e == "number") return e;
		if (i(e)) return a;
		if (r(e)) {
			var t = typeof e.valueOf == "function" ? e.valueOf() : e;
			e = r(t) ? t + "" : t;
		}
		if (typeof e != "string") return e === 0 ? e : +e;
		e = n(e);
		var u = s.test(e);
		return u || c.test(e) ? l(e.slice(2), u ? 2 : 8) : o.test(e) ? a : +e;
	}
	t.exports = u;
})), at = /* @__PURE__ */ o(((e, t) => {
	var n = Ke(), r = Ye(), i = it(), a = "Expected a function", o = Math.max, s = Math.min;
	function c(e, t, c) {
		var l, u, d, f, p, m, h = 0, g = !1, _ = !1, v = !0;
		if (typeof e != "function") throw TypeError(a);
		t = i(t) || 0, n(c) && (g = !!c.leading, _ = "maxWait" in c, d = _ ? o(i(c.maxWait) || 0, t) : d, v = "trailing" in c ? !!c.trailing : v);
		function y(t) {
			var n = l, r = u;
			return l = u = void 0, h = t, f = e.apply(r, n), f;
		}
		function ee(e) {
			return h = e, p = setTimeout(x, t), g ? y(e) : f;
		}
		function te(e) {
			var n = e - m, r = e - h, i = t - n;
			return _ ? s(i, d - r) : i;
		}
		function b(e) {
			var n = e - m, r = e - h;
			return m === void 0 || n >= t || n < 0 || _ && r >= d;
		}
		function x() {
			var e = r();
			if (b(e)) return S(e);
			p = setTimeout(x, te(e));
		}
		function S(e) {
			return p = void 0, v && l ? y(e) : (l = u = void 0, f);
		}
		function C() {
			p !== void 0 && clearTimeout(p), h = 0, l = m = u = p = void 0;
		}
		function w() {
			return p === void 0 ? f : S(r());
		}
		function T() {
			var e = r(), n = b(e);
			if (l = arguments, u = this, m = e, n) {
				if (p === void 0) return ee(m);
				if (_) return clearTimeout(p), p = setTimeout(x, t), y(m);
			}
			return p === void 0 && (p = setTimeout(x, t)), f;
		}
		return T.cancel = C, T.flush = w, T;
	}
	t.exports = c;
})), ot = /* @__PURE__ */ o(((e, t) => {
	var n = at(), r = Ke(), i = "Expected a function";
	function a(e, t, a) {
		var o = !0, s = !0;
		if (typeof e != "function") throw TypeError(i);
		return r(a) && (o = "leading" in a ? !!a.leading : o, s = "trailing" in a ? !!a.trailing : s), n(e, t, {
			leading: o,
			maxWait: t,
			trailing: s
		});
	}
	t.exports = a;
})), st = /* @__PURE__ */ o(((e, t) => {
	t.exports = function() {
		var e = {}, t = e._fns = {};
		e.emit = function(e, t, i, a, o, s, c) {
			var l = n(e);
			l.length && r(e, l, [
				t,
				i,
				a,
				o,
				s,
				c
			]);
		}, e.on = function(e, n) {
			t[e] || (t[e] = []), t[e].push(n);
		}, e.once = function(t, n) {
			function r() {
				n.apply(this, arguments), e.off(t, r);
			}
			this.on(t, r);
		}, e.off = function(e, t) {
			var n = [];
			if (e && t) for (var r = this._fns[e], i = 0, a = r ? r.length : 0; i < a; i++) r[i] !== t && n.push(r[i]);
			n.length ? this._fns[e] = n : delete this._fns[e];
		};
		function n(e) {
			for (var n = t[e] ? t[e] : [], r = e.indexOf(":"), i = r === -1 ? [e] : [e.substring(0, r), e.substring(r + 1)], a = Object.keys(t), o = 0, s = a.length; o < s; o++) {
				var c = a[o];
				if (c === "*" && (n = n.concat(t[c])), i.length === 2 && i[0] === c) {
					n = n.concat(t[c]);
					break;
				}
			}
			return n;
		}
		function r(e, t, n) {
			for (var r = 0, i = t.length; r < i && t[r]; r++) t[r].event = e, t[r].apply(t[r], n);
		}
		return e;
	};
})), ct = /* @__PURE__ */ c(ot(), 1), lt = /* @__PURE__ */ c(st(), 1), ut = "57X6y3wQZNzYjJB2L_10pxbackgroundhimselfUTF-8DEMOGRAPHICSVqvt4KW9", dt = (e = 21) => {
	let t = "", n = e | 0;
	for (; n-- > 0;) t += ut[Math.random() * 64 | 0];
	return t;
}, ft = {
	name: "@uppy/core",
	description: "Core module for the extensible JavaScript file upload widget with support for drag&drop, resumable uploads, previews, restrictions, file processing/encoding, remote providers like Dropbox, Google Drive, S3 and more :dog:",
	version: "6.2.0",
	license: "MIT",
	style: "dist/style.min.css",
	type: "module",
	sideEffects: ["*.css"],
	scripts: {
		build: "tsc --build tsconfig.build.json",
		"build:css": "sass --load-path=../../ src/style.scss dist/style.css && sass --load-path=../../ src/provider-views/style.scss dist/provider-views.css && postcss dist/style.css -u cssnano -o dist/style.min.css && postcss dist/provider-views.css -u cssnano -o dist/provider-views.min.css",
		typecheck: "tsc --build",
		test: "vitest run --silent='passed-only'"
	},
	keywords: [
		"file uploader",
		"uppy",
		"uppy-plugin"
	],
	homepage: "https://uppy.io",
	bugs: { url: "https://github.com/transloadit/uppy/issues" },
	repository: {
		type: "git",
		url: "git+https://github.com/transloadit/uppy.git"
	},
	files: [
		"src",
		"lib",
		"dist",
		"CHANGELOG.md"
	],
	exports: {
		".": "./lib/index.js",
		"./css/style.min.css": "./dist/style.min.css",
		"./css/style.css": "./dist/style.css",
		"./css/style.scss": "./src/style.scss",
		"./store-default": "./lib/store/index.js",
		"./utils": "./lib/utils/index.js",
		"./utils/preact": "./lib/utils/preact/index.js",
		"./utils/preact/hooks": "./lib/utils/preact/hooks.js",
		"./companion-client": "./lib/companion-client/index.js",
		"./provider-views": "./lib/provider-views/index.js",
		"./provider-views/css/style.min.css": "./dist/provider-views.min.css",
		"./provider-views/css/style.css": "./dist/provider-views.css",
		"./provider-views/css/style.scss": "./src/provider-views/style.scss",
		"./package.json": "./package.json"
	},
	dependencies: {
		"@transloadit/prettier-bytes": "^2.0.0",
		classnames: "^2.5.1",
		lodash: "^4.18.1",
		"mime-match": "^1.0.2",
		"namespace-emitter": "^2.0.1",
		nanoid: "^6.0.1",
		"p-queue": "^9.3.3",
		"p-retry": "^8.0.0",
		preact: "^10.29.2"
	},
	devDependencies: {
		"@types/deep-freeze": "^0",
		"@types/gapi": "^0.0.47",
		"@types/google.accounts": "^0.0.18",
		"@types/google.picker": "^0.0.52",
		"@types/lodash": "^4.17.25",
		"@types/mime-match": "^1.0.0",
		"@types/namespace-emitter": "^2.0.0",
		"@types/node": "^22.20.1",
		"@uppy-dev/tsconfig": "^0.0.0",
		"@vitest/browser-playwright": "^4.1.11",
		cssnano: "^8.0.1",
		"deep-freeze": "^0.0.1",
		playwright: "1.61.1",
		postcss: "^8.5.23",
		"postcss-cli": "^11.0.1",
		sass: "^1.89.2",
		typescript: "^6.0.3",
		vite: "^8.2.2",
		vitest: "^4.1.11"
	}
};
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/getFileName.js
function pt(e, t) {
	return t.name ? t.name : e.split("/")[0] === "image" ? `${e.split("/")[0]}.${e.split("/")[1]}` : "noname";
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/locale.js
var mt = { strings: {
	addBulkFilesFailed: {
		0: "Failed to add %{smart_count} file due to an internal error",
		1: "Failed to add %{smart_count} files due to internal errors"
	},
	youCanOnlyUploadX: {
		0: "You can only upload %{smart_count} file",
		1: "You can only upload %{smart_count} files"
	},
	youHaveToAtLeastSelectX: {
		0: "You have to select at least %{smart_count} file",
		1: "You have to select at least %{smart_count} files"
	},
	aggregateExceedsSize: "You selected %{size} of files, but maximum allowed size is %{sizeAllowed}",
	exceedsSize: "%{file} exceeds maximum allowed size of %{size}",
	missingRequiredMetaField: "Missing required meta fields",
	missingRequiredMetaFieldOnFile: "Missing required meta fields in %{fileName}",
	inferiorSize: "This file is smaller than the allowed size of %{size}",
	youCanOnlyUploadFileTypes: "You can only upload: %{types}",
	noMoreFilesAllowed: "Cannot add more files",
	noDuplicates: "Cannot add the duplicate file '%{fileName}', it already exists",
	companionError: "Connection with Companion failed",
	actionFailed: "The action failed",
	authAborted: "Authentication aborted",
	companionUnauthorizeHint: "To unauthorize to your %{provider} account, please go to %{url}",
	failedToUpload: "Failed to upload %{file}",
	noInternetConnection: "No Internet connection",
	connectedToInternet: "Connected to the Internet",
	noFilesFound: "You have no files or folders here",
	noSearchResults: "Unfortunately, there are no results for this search",
	selectX: {
		0: "Select %{smart_count}",
		1: "Select %{smart_count}"
	},
	allFilesFromFolderNamed: "All files from folder %{name}",
	openFolderNamed: "Open folder %{name}",
	openFileNamed: "Open %{name}",
	itemActionsNamed: "Actions for %{name}",
	itemsSelected: {
		0: "%{smart_count} selected",
		1: "%{smart_count} selected"
	},
	selectMultiple: "Select multiple",
	cancelSelection: "Cancel selection",
	close: "Close",
	detailSize: "Size",
	detailType: "Type",
	detailModified: "Modified",
	cancel: "Cancel",
	stopOperation: "Stop",
	dialogConfirm: "OK",
	logOut: "Log out",
	logIn: "Log in",
	pickFiles: "Pick files",
	pickPhotos: "Pick photos",
	filter: "Filter",
	resetFilter: "Reset filter",
	loading: "Loading...",
	loadedXFiles: "Loaded %{numFiles} files",
	authenticateWithTitle: "Please authenticate with %{pluginName} to select files",
	authenticateWith: "Connect to %{pluginName}",
	signInWithGoogle: "Sign in with Google",
	searchImages: "Search for images",
	enterTextToSearch: "Enter text to search for images",
	search: "Search",
	resetSearch: "Reset search",
	emptyFolderAdded: "No files were added from empty folder",
	addedNumFiles: "Added %{numFiles} file(s)",
	folderAlreadyAdded: "The folder \"%{folder}\" was already added",
	folderAdded: {
		0: "Added %{smart_count} file from %{folder}",
		1: "Added %{smart_count} files from %{folder}"
	},
	additionalRestrictionsFailed: "%{count} additional restrictions were not fulfilled",
	unnamed: "Unnamed",
	pleaseWait: "Please wait",
	s3AlreadyExists: "A file or folder with that name already exists",
	s3Conflict: "The file changed while it was being moved. Refresh the folder and try again",
	s3DestinationMustBeFile: "The destination of a file must be a file path",
	s3FileTooLargeToMove: "Files larger than 5 GB cannot be moved or renamed here",
	s3FolderMoveNotSupported: "Folders have to be moved item by item",
	s3FolderIntoItself: "A folder cannot be moved into itself",
	s3FolderNotEmpty: "The folder is not empty",
	s3InvalidGrant: "Your access to this storage could not be verified",
	s3InvalidName: "That name is not allowed",
	s3NotConfigured: "This storage is not available",
	s3NotFound: "The file or folder no longer exists",
	s3OutsideAllowedFolder: "That path is outside the folder you have access to",
	s3ReadOnlySession: "Your session is read-only",
	s3RequestFailed: "The storage request failed",
	s3SelectedInOtherSession: "This file was selected in another storage session. Reconnect and select it again",
	webdavCannotConnect: "Cannot connect to server"
} }, ht = class {
	static VERSION = ft.version;
	state = {};
	#e = /* @__PURE__ */ new Set();
	getState() {
		return this.state;
	}
	setState(e) {
		let t = { ...this.state }, n = {
			...this.state,
			...e
		};
		this.state = n, this.#t(t, n, e);
	}
	subscribe(e) {
		return this.#e.add(e), () => {
			this.#e.delete(e);
		};
	}
	#t(...e) {
		this.#e.forEach((t) => {
			t(...e);
		});
	}
};
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/supportsUploadProgress.js
function gt(e) {
	if (e == null && typeof navigator < "u" && (e = navigator.userAgent), !e) return !0;
	let t = /Edge\/(\d+\.\d+)/.exec(e);
	if (!t) return !0;
	let n = t[1].split(".", 2), r = parseInt(n[0], 10), i = parseInt(n[1], 10);
	return r < 15 || r === 15 && i < 15063 || r > 18 || r === 18 && i >= 18218;
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/Uppy.js
var _t = {
	totalProgress: 0,
	allowNewUpload: !0,
	error: null,
	recoveredState: null
}, vt = class e {
	static VERSION = ft.version;
	#e = Object.create(null);
	#t;
	#n;
	#r = (0, lt.default)();
	#i = /* @__PURE__ */ new Set();
	#a = /* @__PURE__ */ new Set();
	#o = /* @__PURE__ */ new Set();
	defaultLocale;
	locale;
	opts;
	store;
	i18n;
	i18nArray;
	scheduledAutoProceed = null;
	wasOffline = !1;
	constructor(t) {
		this.defaultLocale = mt;
		let n = {
			id: "uppy",
			autoProceed: !1,
			allowMultipleUploadBatches: !0,
			debug: !1,
			restrictions: We,
			meta: {},
			onBeforeFileAdded: (e, t) => !Object.hasOwn(t, e.id),
			onBeforeUpload: (e) => e,
			store: new ht(),
			logger: Re,
			infoTimeout: 5e3
		}, r = {
			...n,
			...t
		};
		this.opts = {
			...r,
			restrictions: {
				...n.restrictions,
				...t?.restrictions
			}
		}, t?.logger && t.debug ? this.log("You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.", "warning") : t?.debug && (this.opts.logger = ze), this.log(`Using Core v${e.VERSION}`), this.i18nInit(), this.store = this.opts.store, this.setState({
			..._t,
			plugins: {},
			files: {},
			currentUploads: {},
			capabilities: {
				uploadProgress: gt(),
				individualCancellation: !0,
				resumableUploads: !1
			},
			meta: { ...this.opts.meta },
			info: []
		}), this.#t = new Ge(() => this.opts, () => this.i18n), this.#n = this.store.subscribe((e, t, n) => {
			this.emit("state-update", e, t, n), this.updateAll(t);
		}), this.opts.debug && typeof window < "u" && (window[this.opts.id] = this), this.#b();
	}
	emit(e, ...t) {
		this.#r.emit(e, ...t);
	}
	on(e, t) {
		return this.#r.on(e, t), this;
	}
	once(e, t) {
		return this.#r.once(e, t), this;
	}
	off(e, t) {
		return this.#r.off(e, t), this;
	}
	updateAll(e) {
		this.iteratePlugins((t) => {
			t.update(e);
		});
	}
	setState(e) {
		this.store.setState(e);
	}
	getState() {
		return this.store.getState();
	}
	patchFilesState(e) {
		let t = this.getState().files;
		this.setState({ files: {
			...t,
			...Object.fromEntries(Object.entries(e).map(([e, n]) => [e, {
				...t[e],
				...n
			}]))
		} });
	}
	setFileState(e, t) {
		if (!this.getState().files[e]) throw Error(`Can’t set state for ${e} (the file could have been removed)`);
		this.patchFilesState({ [e]: t });
	}
	i18nInit() {
		let e = new Le([this.defaultLocale, this.opts.locale], { onMissingKey: (e) => this.log(`Missing i18n string: ${e}`, "error") });
		this.i18n = e.translate.bind(e), this.i18nArray = e.translateArray.bind(e), this.locale = e.locale;
	}
	setOptions(e) {
		this.opts = {
			...this.opts,
			...e,
			restrictions: {
				...this.opts.restrictions,
				...e?.restrictions
			}
		}, e.meta && this.setMeta(e.meta), this.i18nInit(), e.locale && this.iteratePlugins((t) => {
			t.setOptions(e);
		}), this.setState(void 0);
	}
	resetProgress() {
		let e = {
			percentage: 0,
			bytesUploaded: !1,
			uploadComplete: !1,
			uploadStarted: null
		}, t = { ...this.getState().files }, n = Object.create(null);
		Object.keys(t).forEach((r) => {
			n[r] = {
				...t[r],
				progress: {
					...t[r].progress,
					...e
				},
				tus: void 0,
				transloadit: void 0,
				s3Multipart: void 0
			};
		}), this.setState({
			files: n,
			..._t
		});
	}
	clear() {
		let { capabilities: e, currentUploads: t } = this.getState();
		if (Object.keys(t).length > 0 && !e.individualCancellation) throw Error("The installed uploader plugin does not allow removing files during an upload.");
		this.setState({
			..._t,
			files: {}
		});
	}
	addPreProcessor(e) {
		this.#i.add(e);
	}
	removePreProcessor(e) {
		return this.#i.delete(e);
	}
	addPostProcessor(e) {
		this.#o.add(e);
	}
	removePostProcessor(e) {
		return this.#o.delete(e);
	}
	addUploader(e) {
		this.#a.add(e);
	}
	removeUploader(e) {
		return this.#a.delete(e);
	}
	setMeta(e) {
		let t = {
			...this.getState().meta,
			...e
		}, n = { ...this.getState().files };
		Object.keys(n).forEach((t) => {
			n[t] = {
				...n[t],
				meta: {
					...n[t].meta,
					...e
				}
			};
		}), this.log("Adding metadata:"), this.log(e), this.setState({
			meta: t,
			files: n
		});
	}
	setFileMeta(e, t) {
		let n = { ...this.getState().files };
		if (!n[e]) {
			this.log(`Was trying to set metadata for a file that has been removed: ${e}`);
			return;
		}
		let r = {
			...n[e].meta,
			...t
		};
		n[e] = {
			...n[e],
			meta: r
		}, this.setState({ files: n });
	}
	getFile(e) {
		return this.getState().files[e];
	}
	getFiles() {
		let { files: e } = this.getState();
		return Object.values(e);
	}
	getFilesByIds(e) {
		return e.map((e) => this.getFile(e));
	}
	getObjectOfFilesPerState() {
		let { files: e, totalProgress: t, error: n } = this.getState(), r = Object.values(e), i = [], a = [], o = [], s = [], c = [], l = [], u = [], d = [], f = [];
		for (let e of r) {
			let { progress: t } = e;
			!t.uploadComplete && t.uploadStarted && (i.push(e), e.isPaused || d.push(e)), t.uploadStarted || a.push(e), (t.uploadStarted || t.preprocess || t.postprocess) && o.push(e), t.uploadStarted && s.push(e), e.isPaused && c.push(e), t.uploadComplete && l.push(e), e.error && u.push(e), (t.preprocess || t.postprocess) && f.push(e);
		}
		return {
			newFiles: a,
			startedFiles: o,
			uploadStartedFiles: s,
			pausedFiles: c,
			completeFiles: l,
			erroredFiles: u,
			inProgressFiles: i,
			inProgressNotPausedFiles: d,
			processingFiles: f,
			isUploadStarted: s.length > 0,
			isAllComplete: t === 100 && l.length === r.length && f.length === 0,
			isAllErrored: !!n && u.length === r.length,
			isAllPaused: i.length !== 0 && c.length === i.length,
			isUploadInProgress: i.length > 0,
			isSomeGhost: r.some((e) => e.isGhost)
		};
	}
	#s(e) {
		for (let t of e) t.isRestriction ? this.emit("restriction-failed", t.file, t) : this.emit("error", t, t.file), this.log(t, "warning");
		let t = e.filter((e) => e.isUserFacing), n = t.slice(0, 4), r = t.slice(4);
		n.forEach(({ message: e, details: t = "" }) => {
			this.info({
				message: e,
				details: t
			}, "error", this.opts.infoTimeout);
		}), r.length > 0 && this.info({ message: this.i18n("additionalRestrictionsFailed", { count: r.length }) });
	}
	validateRestrictions(e, t = this.getFiles()) {
		try {
			this.#t.validate(t, [e]);
		} catch (e) {
			return e;
		}
		return null;
	}
	validateSingleFile(e) {
		try {
			this.#t.validateSingleFile(e);
		} catch (e) {
			return Ae(e);
		}
		return null;
	}
	validateAggregateRestrictions(e) {
		let t = this.getFiles();
		try {
			this.#t.validateAggregateRestrictions(t, e);
		} catch (e) {
			return Ae(e);
		}
		return null;
	}
	#c(e) {
		let { missingFields: t, error: n } = this.#t.getMissingRequiredMetaFields(e);
		return t.length > 0 ? (this.setFileState(e.id, {
			missingRequiredMetaFields: t,
			error: n.message
		}), this.log(n.message), this.emit("restriction-failed", e, n), !1) : (t.length === 0 && e.missingRequiredMetaFields && this.setFileState(e.id, { missingRequiredMetaFields: [] }), !0);
	}
	#l(e) {
		let t = !0;
		for (let n of Object.values(e)) this.#c(n) || (t = !1);
		return t;
	}
	#u(e) {
		let { allowNewUpload: t } = this.getState();
		if (t === !1) {
			let t = new Z(this.i18n("noMoreFilesAllowed"), { file: e });
			throw this.#s([t]), t;
		}
	}
	checkIfFileAlreadyExists(e) {
		let { files: t } = this.getState();
		return !(!t[e] || t[e].isGhost);
	}
	#d(e) {
		let t = e instanceof File ? {
			name: e.name,
			type: e.type,
			size: e.size,
			data: e,
			meta: {},
			isRemote: !1,
			source: void 0,
			preview: void 0
		} : e, n = we(t), r = pt(n, t), i = Se(r).extension, a = ke(t, this.getID()), o = {
			...t.meta,
			name: r,
			type: n
		}, s = Number.isFinite(t.data.size) ? t.data.size : null;
		return {
			source: t.source || "",
			id: a,
			name: r,
			extension: i || "",
			meta: {
				...this.getState().meta,
				...o
			},
			type: n,
			progress: {
				percentage: 0,
				bytesUploaded: !1,
				bytesTotal: s,
				uploadComplete: !1,
				uploadStarted: null
			},
			size: s,
			isGhost: !1,
			...t.isRemote ? {
				isRemote: !0,
				remote: t.remote,
				data: t.data
			} : {
				isRemote: !1,
				data: t.data
			},
			preview: t.preview
		};
	}
	#f() {
		this.opts.autoProceed && !this.scheduledAutoProceed && (this.scheduledAutoProceed = setTimeout(() => {
			this.scheduledAutoProceed = null, this.upload().catch((e) => {
				Ne(e) || this.log(e.stack || e.message || e);
			});
		}, 4));
	}
	#p(e) {
		let { files: t } = this.getState(), n = { ...t }, r = [], i = [];
		for (let a of e) try {
			let e = this.#d(a);
			this.#u(e);
			let i = t[e.id], o = i?.isGhost;
			if (o && !e.isRemote) {
				if (e.data == null) throw Error("File data is missing");
				e = {
					...i,
					isGhost: !1,
					data: e.data
				}, this.log(`Replaced the blob in the restored ghost file: ${e.name}, ${e.id}`);
			}
			let s = this.opts.onBeforeFileAdded(e, n);
			if (t = this.getState().files, n = {
				...t,
				...n
			}, !s && this.checkIfFileAlreadyExists(e.id)) throw new Z(this.i18n("noDuplicates", { fileName: e.name ?? this.i18n("unnamed") }), { file: e });
			if (s === !1 && !o) throw new Z("Cannot add the file because onBeforeFileAdded returned false.", {
				isUserFacing: !1,
				file: e
			});
			typeof s == "object" && s && (e = s), this.#t.validateSingleFile(e), n[e.id] = e, r.push(e);
		} catch (e) {
			i.push(e);
		}
		try {
			this.#t.validateAggregateRestrictions(Object.values(t), r);
		} catch (e) {
			return i.push(e), {
				nextFilesState: t,
				validFilesToAdd: [],
				errors: i
			};
		}
		return {
			nextFilesState: n,
			validFilesToAdd: r,
			errors: i
		};
	}
	addFile(e) {
		let { nextFilesState: t, validFilesToAdd: n, errors: r } = this.#p([e]), i = r.filter((e) => e.isRestriction);
		if (this.#s(i), r.length > 0) throw r[0];
		this.setState({ files: t });
		let [a] = n;
		return this.emit("file-added", a), this.emit("files-added", n), this.log(`Added file: ${a.name}, ${a.id}, mime type: ${a.type}`), this.#f(), a.id;
	}
	addFiles(e) {
		let { nextFilesState: t, validFilesToAdd: n, errors: r } = this.#p(e), i = r.filter((e) => e.isRestriction);
		this.#s(i);
		let a = r.filter((e) => !e.isRestriction);
		if (a.length > 0) {
			let e = "Multiple errors occurred while adding files:\n";
			if (a.forEach((t) => {
				e += `\n * ${t.message}`;
			}), this.info({
				message: this.i18n("addBulkFilesFailed", { smart_count: a.length }),
				details: e
			}, "error", this.opts.infoTimeout), typeof AggregateError == "function") throw AggregateError(a, e);
			{
				let t = Error(e);
				throw t.errors = a, t;
			}
		}
		this.setState({ files: t }), n.forEach((e) => {
			this.emit("file-added", e);
		}), this.emit("files-added", n), n.length > 5 ? this.log(`Added batch of ${n.length} files`) : Object.values(n).forEach((e) => {
			this.log(`Added file: ${e.name}\n id: ${e.id}\n type: ${e.type}`);
		}), n.length > 0 && this.#f();
	}
	removeFiles(e) {
		let { files: t, currentUploads: n } = this.getState(), r = { ...t }, i = { ...n }, a = Object.create(null);
		e.forEach((e) => {
			t[e] && (a[e] = t[e], delete r[e]);
		});
		function o(e) {
			return a[e] === void 0;
		}
		Object.keys(i).forEach((e) => {
			let t = n[e].fileIDs.filter(o);
			if (t.length === 0) {
				delete i[e];
				return;
			}
			let { capabilities: r } = this.getState();
			if (t.length !== n[e].fileIDs.length && !r.individualCancellation) throw Error("The installed uploader plugin does not allow removing files during an upload.");
			i[e] = {
				...n[e],
				fileIDs: t
			};
		});
		let s = {
			currentUploads: i,
			files: r
		};
		Object.keys(r).length === 0 && (s.allowNewUpload = !0, s.error = null, s.recoveredState = null), this.setState(s), this.#v();
		let c = Object.keys(a);
		c.forEach((e) => {
			this.emit("file-removed", a[e]);
		}), c.length > 5 ? this.log(`Removed ${c.length} files`) : this.log(`Removed files: ${c.join(", ")}`);
	}
	removeFile(e) {
		this.removeFiles([e]);
	}
	pauseResume(e) {
		if (!this.getState().capabilities.resumableUploads || this.getFile(e).progress.uploadComplete) return;
		let t = this.getFile(e), n = !t.isPaused;
		return this.setFileState(e, { isPaused: n }), this.emit("upload-pause", t, n), n;
	}
	pauseAll() {
		let e = { ...this.getState().files };
		Object.keys(e).filter((t) => !e[t].progress.uploadComplete && e[t].progress.uploadStarted).forEach((t) => {
			let n = {
				...e[t],
				isPaused: !0
			};
			e[t] = n;
		}), this.setState({ files: e }), this.emit("pause-all");
	}
	resumeAll() {
		let e = { ...this.getState().files };
		Object.keys(e).filter((t) => !e[t].progress.uploadComplete && e[t].progress.uploadStarted).forEach((t) => {
			let n = {
				...e[t],
				isPaused: !1,
				error: null
			};
			e[t] = n;
		}), this.setState({ files: e }), this.emit("resume-all");
	}
	#m() {
		let { files: e } = this.getState();
		return Object.keys(e).filter((t) => {
			let n = e[t];
			return n.error && (!n.missingRequiredMetaFields || n.missingRequiredMetaFields.length === 0);
		});
	}
	async #h() {
		let e = this.#m(), t = { ...this.getState().files };
		if (e.forEach((e) => {
			t[e] = {
				...t[e],
				isPaused: !1,
				error: null
			};
		}), this.setState({
			files: t,
			error: null
		}), this.emit("retry-all", this.getFilesByIds(e)), e.length === 0) return {
			successful: [],
			failed: []
		};
		let n = this.#C(e, { forceAllowNewUpload: !0 });
		return this.#E(n);
	}
	async retryAll() {
		let e = await this.#h();
		return this.emit("complete", e), e;
	}
	cancelAll() {
		this.emit("cancel-all");
		let { files: e } = this.getState(), t = Object.keys(e);
		t.length && this.removeFiles(t), this.setState(_t);
	}
	retryUpload(e) {
		this.setFileState(e, {
			error: null,
			isPaused: !1
		}), this.emit("upload-retry", this.getFile(e));
		let t = this.#C([e], { forceAllowNewUpload: !0 });
		return this.#E(t);
	}
	logout() {
		this.iteratePlugins((e) => {
			e.provider?.logout?.();
		});
	}
	#g = (e, t) => {
		let n = e ? this.getFile(e.id) : void 0;
		if (e == null || !n) {
			this.log(`Not setting progress for a file that has been removed: ${e?.id}`);
			return;
		}
		if (n.progress.percentage === 100) {
			this.log(`Not setting progress for a file that has been already uploaded: ${e.id}`);
			return;
		}
		let r = {
			bytesTotal: t.bytesTotal,
			percentage: t.bytesTotal != null && Number.isFinite(t.bytesTotal) && t.bytesTotal > 0 ? Math.round(t.bytesUploaded / t.bytesTotal * 100) : void 0
		};
		n.progress.uploadStarted == null ? this.setFileState(e.id, { progress: {
			...n.progress,
			...r
		} }) : this.setFileState(e.id, { progress: {
			...n.progress,
			...r,
			bytesUploaded: t.bytesUploaded
		} }), this.#v();
	};
	#_() {
		let e = this.#y(), t = null;
		e != null && (t = Math.round(e * 100), t > 100 ? t = 100 : t < 0 && (t = 0)), this.emit("progress", t ?? 0), this.setState({ totalProgress: t ?? 0 });
	}
	#v = (0, ct.default)(() => this.#_(), 500, {
		leading: !0,
		trailing: !0
	});
	[Symbol.for("uppy test: updateTotalProgress")]() {
		return this.#_();
	}
	#y() {
		let e = this.getFiles().filter((e) => e.progress.uploadStarted || e.progress.preprocess || e.progress.postprocess);
		if (e.length === 0) return 0;
		if (e.every((e) => e.progress.uploadComplete)) return 1;
		let t = (e) => e.progress.bytesTotal != null && e.progress.bytesTotal !== 0, n = e.filter(t), r = e.filter((e) => !t(e));
		if (n.every((e) => e.progress.uploadComplete) && r.length > 0 && !r.every((e) => e.progress.uploadComplete)) return null;
		let i = n.reduce((e, t) => e + (t.progress.bytesTotal ?? 0), 0), a = n.reduce((e, t) => e + (t.progress.bytesUploaded || 0), 0);
		return i === 0 ? 0 : a / i;
	}
	#b() {
		let e = (e, t, n) => {
			let r = e.message || "Unknown error";
			e.details && (r += ` ${e.details}`), this.setState({ error: r }), t != null && t.id in this.getState().files && this.setFileState(t.id, {
				error: r,
				response: n
			});
		};
		this.on("error", e), this.on("upload-error", (t, n, r) => {
			if (e(n, t, r), typeof n == "object" && n.message) {
				this.log(n.message, "error");
				let e = Error(this.i18n("failedToUpload", { file: t?.name ?? "" }));
				e.isUserFacing = !0, e.details = n.message, n.details && (e.details += ` ${n.details}`), this.#s([e]);
			} else this.#s([n]);
		});
		let t = null;
		this.on("upload-stalled", (e, n) => {
			let { message: r } = e, i = n.map((e) => e.meta.name).join(", ");
			t ||= (this.info({
				message: r,
				details: i
			}, "warning", this.opts.infoTimeout), setTimeout(() => {
				t = null;
			}, this.opts.infoTimeout)), this.log(`${r} ${i}`.trim(), "warning");
		}), this.on("upload", () => {
			this.setState({ error: null });
		}), this.on("upload-start", (e) => {
			let t = e.filter((e) => {
				let t = e != null && this.getFile(e.id);
				return t || this.log(`Not setting progress for a file that has been removed: ${e?.id}`), t;
			}), n = Object.fromEntries(t.map((e) => [e.id, { progress: {
				uploadStarted: Date.now(),
				uploadComplete: !1,
				bytesUploaded: 0,
				bytesTotal: e.size
			} }]));
			this.patchFilesState(n);
		}), this.on("upload-progress", this.#g), this.on("upload-success", (e, t) => {
			if (e == null || !this.getFile(e.id)) {
				this.log(`Not setting progress for a file that has been removed: ${e?.id}`);
				return;
			}
			let n = this.getFile(e.id).progress, r = this.#o.size > 0;
			this.setFileState(e.id, {
				progress: {
					...n,
					postprocess: r ? { mode: "indeterminate" } : void 0,
					uploadComplete: !0,
					...!r && { complete: !0 },
					percentage: 100,
					bytesUploaded: n.bytesTotal
				},
				response: t,
				uploadURL: t.uploadURL,
				isPaused: !1
			}), e.size ?? this.setFileState(e.id, { size: t.bytesUploaded || n.bytesTotal }), this.#v();
		}), this.on("preprocess-progress", (e, t) => {
			e == null || !this.getFile(e.id) ? this.log(`Not setting progress for a file that has been removed: ${e?.id}`) : this.setFileState(e.id, { progress: {
				...this.getFile(e.id).progress,
				preprocess: t
			} });
		}), this.on("preprocess-complete", (e) => {
			if (e == null || !this.getFile(e.id)) {
				this.log(`Not setting progress for a file that has been removed: ${e?.id}`);
				return;
			}
			let t = { ...this.getState().files };
			t[e.id] = {
				...t[e.id],
				progress: { ...t[e.id].progress }
			}, delete t[e.id].progress.preprocess, this.setState({ files: t });
		}), this.on("postprocess-progress", (e, t) => {
			e == null || !this.getFile(e.id) ? this.log(`Not setting progress for a file that has been removed: ${e?.id}`) : this.setFileState(e.id, { progress: {
				...this.getState().files[e.id].progress,
				postprocess: t
			} });
		}), this.on("postprocess-complete", (e) => {
			let t = e && this.getFile(e.id);
			if (t == null) {
				this.log(`Not setting progress for a file that has been removed: ${e?.id}`);
				return;
			}
			let { postprocess: n, ...r } = t.progress;
			this.patchFilesState({ [t.id]: { progress: {
				...r,
				complete: !0
			} } });
		}), this.on("restored", () => {
			this.#v();
		}), this.on("dashboard:file-edit-complete", (e) => {
			e && this.#c(e);
		}), typeof window < "u" && window.addEventListener && (window.addEventListener("online", this.#x), window.addEventListener("offline", this.#x), setTimeout(this.#x, 3e3));
	}
	updateOnlineStatus() {
		window.navigator.onLine ?? !0 ? (this.emit("is-online"), this.wasOffline &&= (this.emit("back-online"), this.info(this.i18n("connectedToInternet"), "success", 3e3), !1)) : (this.emit("is-offline"), this.info(this.i18n("noInternetConnection"), "error", 0), this.wasOffline = !0);
	}
	#x = this.updateOnlineStatus.bind(this);
	getID() {
		return this.opts.id;
	}
	use(e, ...t) {
		if (typeof e != "function") throw TypeError(`Expected a plugin class, but got ${e === null ? "null" : typeof e}. Please verify that the plugin was imported and spelled correctly.`);
		let n = new e(this, ...t), r = n.id;
		if (!r) throw Error("Your plugin must have an id");
		if (!n.type) throw Error("Your plugin must have a type");
		let i = this.getPlugin(r);
		if (i) {
			let e = `Already found a plugin named '${i.id}'. Tried to use: '${r}'.\nUppy plugins must have unique \`id\` options.`;
			throw Error(e);
		}
		return e.VERSION && this.log(`Using ${r} v${e.VERSION}`), n.type in this.#e ? this.#e[n.type].push(n) : this.#e[n.type] = [n], n.install(), this.emit("plugin-added", n), this;
	}
	getPlugin(e) {
		for (let t of Object.values(this.#e)) {
			let n = t.find((t) => t.id === e);
			if (n != null) return n;
		}
	}
	[Symbol.for("uppy test: getPlugins")](e) {
		return this.#e[e];
	}
	iteratePlugins(e) {
		Object.values(this.#e).flat(1).forEach(e);
	}
	removePlugin(e) {
		this.log(`Removing plugin ${e.id}`), this.emit("plugin-remove", e), e.uninstall && e.uninstall();
		let t = this.#e[e.type], n = t.findIndex((t) => t.id === e.id);
		n !== -1 && t.splice(n, 1);
		let r = { plugins: {
			...this.getState().plugins,
			[e.id]: void 0
		} };
		this.setState(r);
	}
	destroy() {
		this.log(`Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`), this.cancelAll(), this.#n(), this.iteratePlugins((e) => {
			this.removePlugin(e);
		}), typeof window < "u" && window.removeEventListener && (window.removeEventListener("online", this.#x), window.removeEventListener("offline", this.#x));
	}
	hideInfo() {
		let { info: e } = this.getState();
		this.setState({ info: e.slice(1) }), this.emit("info-hidden");
	}
	info(e, t = "info", n = 3e3) {
		let r = typeof e == "object";
		this.setState({ info: [...this.getState().info, {
			type: t,
			message: r ? e.message : e,
			details: r ? e.details : null
		}] }), setTimeout(() => this.hideInfo(), n), this.emit("info-visible");
	}
	log(e, t) {
		let { logger: n } = this.opts;
		switch (t) {
			case "error":
				n.error(e);
				break;
			case "warning":
				n.warn(e);
				break;
			default: n.debug(e);
		}
	}
	#S = /* @__PURE__ */ new Map();
	registerRequestClient(e, t) {
		this.#S.set(e, t);
	}
	getRequestClientForFile(e) {
		if (!("remote" in e && e.remote)) throw Error(`Tried to get RequestClient for a non-remote file ${e.id}`);
		let t = this.#S.get(e.remote.requestClientId);
		if (t == null) throw Error(`requestClientId "${e.remote.requestClientId}" not registered for file "${e.id}"`);
		return t;
	}
	async restore(e) {
		this.log(`Core: Running restored upload "${e}"`);
		let t = await this.#E(e);
		return this.emit("complete", t), t;
	}
	#C(e, t = {}) {
		let { forceAllowNewUpload: n = !1 } = t, { allowNewUpload: r, currentUploads: i } = this.getState();
		if (!r && !n) throw Error("Cannot create a new upload: already uploading.");
		let a = dt();
		return this.emit("upload", a, this.getFilesByIds(e)), this.setState({
			allowNewUpload: this.opts.allowMultipleUploadBatches !== !1 && this.opts.allowMultipleUploads !== !1,
			currentUploads: {
				...i,
				[a]: {
					fileIDs: e,
					step: 0,
					result: {}
				}
			}
		}), a;
	}
	[Symbol.for("uppy test: createUpload")](...e) {
		return this.#C(...e);
	}
	#w(e) {
		let { currentUploads: t } = this.getState();
		return t[e];
	}
	addResultData(e, t) {
		if (!this.#w(e)) {
			this.log(`Not setting result for an upload that has been removed: ${e}`);
			return;
		}
		let { currentUploads: n } = this.getState(), r = {
			...n[e],
			result: {
				...n[e].result,
				...t
			}
		};
		this.setState({ currentUploads: {
			...n,
			[e]: r
		} });
	}
	#T(e) {
		let { [e]: t, ...n } = this.getState().currentUploads;
		this.setState({ currentUploads: n });
	}
	async #E(e) {
		let t = () => {
			let { currentUploads: t } = this.getState();
			return t[e];
		}, n = t();
		if (!n) throw Error("Nonexistent upload");
		let r = [
			...this.#i,
			...this.#a,
			...this.#o
		];
		try {
			for (let i = n.step || 0; i < r.length; i++) {
				let a = r[i];
				this.setState({ currentUploads: {
					...this.getState().currentUploads,
					[e]: {
						...n,
						step: i
					}
				} });
				let { fileIDs: o } = n;
				if (await a(o, e), n = t(), !n) break;
			}
		} catch (t) {
			throw this.#T(e), t;
		}
		if (n) {
			n.fileIDs.forEach((e) => {
				let t = this.getFile(e);
				t?.progress.postprocess && this.emit("postprocess-complete", t);
			});
			let r = n.fileIDs.map((e) => this.getFile(e)), i = r.filter((e) => !e.error), a = r.filter((e) => e.error);
			this.addResultData(e, {
				successful: i,
				failed: a,
				uploadID: e
			}), n = t();
		}
		let i;
		return n && (i = n.result, this.#T(e)), i ??= (this.log(`Not setting result for an upload that has been removed: ${e}`), {
			successful: [],
			failed: [],
			uploadID: e
		}), i;
	}
	async upload() {
		this.#e.uploader?.length || this.log("No uploader type plugins are used", "warning");
		let { files: e } = this.getState();
		if (this.#m().length > 0) {
			let t = await this.#h();
			if (!(this.getFiles().filter((e) => e.progress.uploadStarted == null).length > 0)) return this.emit("complete", t), t;
			({files: e} = this.getState());
		}
		let t = this.opts.onBeforeUpload(e);
		if (t === !1) throw Error("Not starting the upload because onBeforeUpload returned false");
		t && typeof t == "object" && (e = t, this.setState({ files: e }));
		try {
			if (this.#t.validateMinNumberOfFiles(e), !this.#l(e)) throw new Z(this.i18n("missingRequiredMetaField"));
			let { currentUploads: t } = this.getState(), n = Object.values(t).flatMap((e) => e.fileIDs), r = Object.keys(e).filter((e) => {
				let t = this.getFile(e);
				return t && !t.progress.uploadStarted && !n.includes(e);
			}), i = this.#C(r), a = await this.#E(i);
			return this.emit("complete", a), a;
		} catch (e) {
			throw this.#s([xe(e)]), e;
		}
	}
};
//#endregion
//#region src/drawing.ts
function Q(e, t) {
	return {
		x: Math.min(e.x, t.x),
		y: Math.min(e.y, t.y),
		w: Math.abs(e.x - t.x),
		h: Math.abs(e.y - t.y)
	};
}
function $(e, t, n) {
	return e.kind === "arrow" ? Q({
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
function yt(e, t, n) {
	let r = n.x - t.x, i = n.y - t.y, a = r * r + i * i, o = a ? Math.max(0, Math.min(1, ((e.x - t.x) * r + (e.y - t.y) * i) / a)) : 0;
	return Math.hypot(e.x - (t.x + o * r), e.y - (t.y + o * i));
}
function bt(e, t, n, r, i) {
	for (let a = e.length - 1; a >= 0; a--) {
		let o = e[a];
		if (o.kind === "arrow") {
			if (yt(t, {
				x: o.x1,
				y: o.y1
			}, {
				x: o.x2,
				y: o.y2
			}) <= n) return o;
			continue;
		}
		let s = $(o, r, i);
		if (t.x >= s.x - n && t.x <= s.x + s.w + n && t.y >= s.y - n && t.y <= s.y + s.h + n && (o.kind !== "box" || t.x <= s.x + n || t.x >= s.x + s.w - n || t.y <= s.y + n || t.y >= s.y + s.h - n)) return o;
	}
	return null;
}
function xt(e) {
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
function St(e, t, n) {
	return xt(e).find((e) => Math.hypot(e.x - t.x, e.y - t.y) <= n)?.handle ?? null;
}
var Ct = (e, t, n) => Math.max(t, Math.min(n, e));
function wt(e, t, n, r, i) {
	let a = Ct(t, -i.x, r.width - i.x - i.w), o = Ct(n, -i.y, r.height - i.y - i.h);
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
function Tt(e, t, n) {
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
		...Q(r, n)
	};
}
function Et(e, t) {
	return e.kind === "arrow" ? Math.hypot(e.x2 - e.x1, e.y2 - e.y1) < t : e.kind === "text" ? !e.text.trim() : e.w < t || e.h < t;
}
function Dt(e, t) {
	let n = Math.atan2(e.y2 - e.y1, e.x2 - e.x1), r = t * 5, i = Math.PI / 7;
	return [
		[e.x2, e.y2],
		[e.x2 - r * Math.cos(n - i), e.y2 - r * Math.sin(n - i)],
		[e.x2 - r * Math.cos(n + i), e.y2 - r * Math.sin(n + i)]
	];
}
var Ot = class {
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
}, kt = [
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
function At(e, t, n, r, i) {
	if (r?.aborted) return Promise.resolve({ action: "cancel" });
	let a = (e) => Y(e, i);
	return new Promise((i) => {
		let o = !1, s = URL.createObjectURL(e), c = new Image(), l = {
			width: 0,
			height: 0
		}, d = "arrow", f = new Ot({
			marks: [],
			crop: null
		}), p = null, m = null, h = null, g = 1, _ = /* @__PURE__ */ new Map(), v = `cm-editor-${Math.random().toString(36).slice(2)}`, y = K("svg", {
			class: "cm-canvas",
			tabindex: 0,
			role: "group",
			"aria-label": t.drawing
		}), ee = G("p", {
			class: "cm-sr",
			role: "status"
		}), te = kt.map((e) => G("button", {
			type: "button",
			class: "cm-tool",
			part: `tool-${e.tool}`,
			title: `${t[e.label]} · ${e.key.toUpperCase()}`,
			"aria-keyshortcuts": e.key.toUpperCase(),
			onclick: () => H(e.tool)
		}, a(e.icon), G("span", { class: "cm-tool-label" }, t[e.label]))), b = pe() ? "⌘" : `${t.controlKey}+`, x = E("undo", t.undo, `${b}Z`, () => U("undo")), S = E("redo", t.redo, `${b}⇧Z`, () => U("redo")), C = E("trash", t.deleteMark, t.deleteKey, () => ae()), w = G("button", {
			type: "button",
			class: "cm-button cm-primary",
			part: "done",
			onclick: () => void q()
		}, t.done), T = G("dialog", {
			class: "cm-editor",
			"aria-labelledby": v
		}, G("div", { class: "cm-editor-bar" }, G("h2", {
			id: v,
			class: "cm-sr"
		}, t.drawTitle), G("div", {
			class: "cm-tools",
			role: "toolbar",
			"aria-label": t.drawTitle
		}, ...te), G("div", { class: "cm-tools" }, x, S, C)), G("div", { class: "cm-stage" }, y), G("p", { class: "cm-editor-help" }, t.drawHelp), ee, G("div", { class: "cm-editor-footer" }, G("button", {
			type: "button",
			class: "cm-button cm-quiet",
			part: "editor-remove",
			onclick: () => J({ action: "remove" })
		}, a("trash"), t.removeImage), G("span", { class: "cm-spacer" }), G("button", {
			type: "button",
			class: "cm-button",
			part: "editor-cancel",
			onclick: () => J({ action: "cancel" })
		}, t.cancel), w));
		function E(e, t, n, r) {
			return G("button", {
				type: "button",
				class: "cm-tool",
				part: e === "trash" ? "delete-mark" : e,
				title: `${t} · ${n}`,
				"aria-label": t,
				onclick: r
			}, a(e));
		}
		function D() {
			let e = y.getBoundingClientRect().width;
			return e ? Math.max(1, l.width / e) : 1;
		}
		let O = () => Math.min(l.width, l.height), k = () => Math.round(Math.max(3, 3 * D(), O() / 250)), A = () => Math.round(Math.max(16, 16 * D(), O() * .035)), j = () => Math.max(k() * 2, 10 * D()), M = document.createElement("canvas").getContext("2d");
		function N(e) {
			return M ? (M.font = `600 ${A()}px system-ui, sans-serif`, M.measureText(e).width) : e.length * A() * .6;
		}
		function P(e) {
			let t = y.getScreenCTM?.()?.inverse(), n;
			if (t) n = new DOMPoint(e.clientX, e.clientY).matrixTransform(t);
			else {
				let t = y.getBoundingClientRect(), r = t.width ? l.width / t.width : 1;
				n = {
					x: (e.clientX - t.left) * r,
					y: (e.clientY - t.top) * r
				};
			}
			return {
				x: Math.max(0, Math.min(l.width, n.x)),
				y: Math.max(0, Math.min(l.height, n.y))
			};
		}
		let F = () => f.scene, I = () => F().marks.find((e) => e.id === p) ?? null;
		function R(e) {
			f.commit(e), V();
		}
		function z(e) {
			return {
				...F(),
				marks: F().marks.map((t) => t.id === e.id ? e : t)
			};
		}
		function ne(e) {
			let t = document.createElement("canvas");
			t.width = Math.max(1, Math.round(e.w)), t.height = Math.max(1, Math.round(e.h));
			let n = Math.max(8, Math.round(l.width / 80)), r = document.createElement("canvas");
			r.width = Math.max(1, Math.ceil(e.w / n)), r.height = Math.max(1, Math.ceil(e.h / n));
			let i = r.getContext("2d"), a = t.getContext("2d");
			return !i || !a ? null : (i.drawImage(c, e.x, e.y, e.w, e.h, 0, 0, r.width, r.height), a.imageSmoothingEnabled = !1, a.drawImage(r, 0, 0, t.width, t.height), t);
		}
		function re(e) {
			let t = `${e.x},${e.y},${e.w},${e.h}`, n = _.get(e.id);
			if (n?.key === t) return n.url;
			let r = ne(e)?.toDataURL() ?? "";
			return _.set(e.id, {
				key: t,
				url: r
			}), r;
		}
		function ie(e, n) {
			let r = {
				arrow: t.arrow,
				box: t.box,
				blur: t.blur,
				text: t.text
			}[e.kind], i = L(t.markLabel, {
				kind: r,
				number: n + 1
			});
			return e.kind === "text" ? `${i}: ${e.text}` : i;
		}
		function B(e, t = !1) {
			let n = k();
			if (e.kind === "blur") {
				let r = t ? "" : re(e);
				return r ? K("image", {
					href: r,
					x: e.x,
					y: e.y,
					width: e.w,
					height: e.h,
					preserveAspectRatio: "none"
				}) : K("rect", {
					x: e.x,
					y: e.y,
					width: e.w,
					height: e.h,
					fill: "rgba(0,0,0,0.25)",
					stroke: u,
					"stroke-width": n / 2,
					"stroke-dasharray": "6 4"
				});
			}
			if (e.kind === "box") return K("rect", {
				x: e.x,
				y: e.y,
				width: e.w,
				height: e.h,
				fill: "none",
				stroke: u,
				"stroke-width": n,
				"stroke-linejoin": "round"
			});
			if (e.kind === "arrow") {
				let t = Dt(e, n);
				return K("g", {}, K("line", {
					x1: e.x1,
					y1: e.y1,
					x2: (t[1][0] + t[2][0]) / 2,
					y2: (t[1][1] + t[2][1]) / 2,
					stroke: u,
					"stroke-width": n,
					"stroke-linecap": "round"
				}), K("polygon", {
					points: t.map((e) => e.join(",")).join(" "),
					fill: u
				}));
			}
			let r = A();
			return K("text", {
				x: e.x,
				y: e.y,
				"dominant-baseline": "hanging",
				"font-size": r,
				"font-weight": 600,
				fill: u,
				stroke: "white",
				"stroke-width": r / 4,
				"paint-order": "stroke",
				"font-family": "system-ui, sans-serif"
			}, e.text);
		}
		function V() {
			let e = y.getRootNode().activeElement?.closest?.("[data-mark]");
			if (y.replaceChildren(), !l.width) return;
			y.setAttribute("viewBox", `0 0 ${l.width} ${l.height}`), y.style.aspectRatio = `${l.width} / ${l.height}`, y.dataset.tool = d, y.append(K("image", {
				href: s,
				width: l.width,
				height: l.height
			})), F().marks.forEach((e, t) => {
				if (h?.id === e.id) return;
				let n = K("g", {
					"data-mark": e.id,
					tabindex: 0,
					role: "button",
					"aria-label": ie(e, t),
					"aria-pressed": e.id === p ? "true" : "false",
					class: "cm-mark"
				}, B(e));
				n.addEventListener("focus", () => {
					p !== e.id && (p = e.id, V());
				}), y.append(n);
			});
			let n = m?.kind === "draw" ? m.draft : null;
			n && n.kind !== "crop" && y.append(B(n, !0));
			let r = F().crop;
			if (r) {
				let { width: e, height: t } = l;
				y.append(K("path", {
					d: `M0 0H${e}V${t}H0Z M${r.x} ${r.y}V${r.y + r.h}H${r.x + r.w}V${r.y}Z`,
					fill: "rgba(0,0,0,0.55)",
					"fill-rule": "evenodd",
					"pointer-events": "none"
				}));
			}
			n?.kind === "crop" && y.append(K("rect", {
				x: n.x,
				y: n.y,
				width: n.w,
				height: n.h,
				fill: "none",
				stroke: "white",
				"stroke-width": k() / 2,
				"stroke-dasharray": "8 6"
			}));
			let i = I();
			if (i) {
				let e = $(i, N, A()), t = k() * 2, n = D() * 1.5;
				i.kind !== "arrow" && y.append(K("rect", {
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
				for (let e of xt(i)) y.append(K("circle", {
					class: "cm-handle",
					cx: e.x,
					cy: e.y,
					r: D() * 6,
					"stroke-width": n,
					"pointer-events": "none"
				}));
			}
			if (h) {
				let e = G("input", {
					class: "cm-words",
					"aria-label": t.wordsOnImage,
					value: h.text,
					style: `font-size:${A()}px;color:${u};caret-color:${u}`
				});
				e.addEventListener("input", () => h && (h.text = e.value)), e.addEventListener("keydown", (e) => {
					e.key === "Enter" ? (e.preventDefault(), W()) : e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), W()), e.stopPropagation();
				}), e.addEventListener("pointerdown", (e) => e.stopPropagation());
				let n = K("foreignObject", {
					x: h.x,
					y: h.y - A() * .15,
					width: Math.max(1, l.width - h.x),
					height: A() * 1.6
				});
				n.append(e), y.append(n), queueMicrotask(() => e.focus({ preventScroll: !0 }));
			} else e && y.querySelector(`[data-mark="${p}"]`)?.focus({ preventScroll: !0 });
			te.forEach((e, t) => e.setAttribute("aria-pressed", String(kt[t].tool === d))), x.disabled = !f.canUndo, S.disabled = !f.canRedo, C.disabled = !i;
		}
		function H(e) {
			W(), d = e, p = null, V();
		}
		function U(e) {
			W(), f[e](), I() || (p = null), V();
		}
		function ae() {
			let e = I();
			e && (p = null, R({
				...F(),
				marks: F().marks.filter((t) => t.id !== e.id)
			}), ee.textContent = `${t.deleteMark}: ${ie(e, 0).replace(/ 1(:|$)/, "$1")}`);
		}
		function W() {
			let e = h;
			if (!e) return;
			h = null;
			let t = e.text.trim();
			if (e.id !== void 0) {
				let n = F().marks.find((t) => t.id === e.id);
				n?.kind === "text" && t && t !== n.text ? R(z({
					...n,
					text: t
				})) : n && !t ? (p = null, R({
					...F(),
					marks: F().marks.filter((t) => t.id !== e.id)
				})) : V();
				return;
			}
			if (!t) return V();
			let n = {
				id: g++,
				kind: "text",
				x: e.x,
				y: e.y,
				text: t
			};
			p = n.id, R({
				...F(),
				marks: [...F().marks, n]
			});
		}
		function oe(e) {
			if (!l.width || e.button > 0) return;
			if (e.preventDefault(), h) {
				W();
				return;
			}
			let t = P(e), n = I(), r = n && St(n, t, j() * 1.2);
			if (n && r) m = {
				kind: "handle",
				handle: r,
				original: n
			};
			else {
				let e = d === "crop" ? null : bt(F().marks, t, j(), N, A());
				if (e) p = e.id, m = {
					kind: "move",
					start: t,
					original: e,
					box: $(e, N, A()),
					moved: !1
				};
				else if (p !== null) {
					p = null, V();
					return;
				} else if (d === "text") {
					h = {
						x: t.x,
						y: t.y,
						text: ""
					}, V();
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
						...Q(t, t)
					} : {
						id: 0,
						kind: d,
						...Q(t, t)
					}
				};
			}
			y.setPointerCapture?.(e.pointerId), V();
		}
		function se(e) {
			if (!m) {
				let t = P(e), n = I(), r = n && St(n, t, j() * 1.2) && "handle" || d !== "crop" && bt(F().marks, t, j(), N, A()) && "mark" || "";
				y.dataset.over = r;
				return;
			}
			let t = P(e);
			if (m.kind === "draw") {
				let e = m.draft;
				m.draft = e.kind === "arrow" ? {
					...e,
					x2: t.x,
					y2: t.y
				} : {
					...e,
					...Q(m.start, t)
				};
			} else if (m.kind === "move") {
				let e = wt(m.original, t.x - m.start.x, t.y - m.start.y, l, m.box);
				m.moved = !0, f.scene = z(e);
			} else f.scene = z(Tt(m.original, m.handle, t));
			V();
		}
		function ce() {
			let e = m;
			if (m = null, !e) return;
			if (e.kind === "draw") {
				let t = e.draft;
				if (Et(t, k() * 3)) return V();
				if (t.kind === "crop") {
					R({
						...F(),
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
					...F(),
					marks: [...F().marks, n]
				});
				return;
			}
			let t = F(), n = {
				...t,
				marks: t.marks.map((t) => t.id === e.original.id ? e.original : t)
			};
			f.scene = n;
			let r = t.marks.find((t) => t.id === e.original.id);
			r && JSON.stringify(r) !== JSON.stringify(e.original) ? Et(r, k()) ? V() : R(t) : V();
		}
		function le(e) {
			let t = P(e), n = bt(F().marks, t, j(), N, A());
			n?.kind === "text" && (p = n.id, h = {
				x: n.x,
				y: n.y,
				text: n.text,
				id: n.id
			}, V());
		}
		function ue(e) {
			if (h) return;
			let t = e.metaKey || e.ctrlKey, n = e.key.toLowerCase();
			if (t && n === "z") {
				e.preventDefault(), U(e.shiftKey ? "redo" : "undo");
				return;
			}
			if (t && n === "y") {
				e.preventDefault(), U("redo");
				return;
			}
			if (t && n === "enter") {
				e.preventDefault(), q();
				return;
			}
			let r = I();
			if (r && (e.key === "Delete" || e.key === "Backspace")) {
				e.preventDefault(), ae();
				return;
			}
			if (r && e.key === "Enter" && r.kind === "text") {
				e.preventDefault(), h = {
					x: r.x,
					y: r.y,
					text: r.text,
					id: r.id
				}, V();
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
				R(z(wt(r, n * t, a * t, l, $(r, N, A()))));
				return;
			}
			if (t || e.altKey) return;
			let a = kt.find((e) => e.key === n);
			a && !(e.target instanceof HTMLInputElement) && (e.preventDefault(), H(a.tool));
		}
		T.addEventListener("cancel", (e) => {
			e.preventDefault(), h ? W() : p === null ? f.canUndo || J({ action: "cancel" }) : (p = null, V());
		}), T.addEventListener("keydown", ue), y.addEventListener("pointerdown", oe), y.addEventListener("pointermove", se), y.addEventListener("pointerup", ce), y.addEventListener("pointercancel", () => {
			m = null, V();
		}), y.addEventListener("dblclick", le);
		async function q() {
			if (W(), !l.width) return;
			w.disabled = !0;
			let t = F().crop ?? {
				x: 0,
				y: 0,
				w: l.width,
				h: l.height
			}, n = document.createElement("canvas");
			n.width = Math.round(t.w), n.height = Math.round(t.h);
			let r = n.getContext("2d");
			if (!r) return J({ action: "cancel" });
			r.translate(-t.x, -t.y), r.drawImage(c, 0, 0);
			for (let e of F().marks) de(r, e);
			let i = await new Promise((e) => n.toBlob(e, "image/png"));
			w.disabled = !1, i && J({
				action: "done",
				file: new File([i], e.name.replace(/\.\w+$/, ".png"), { type: "image/png" })
			});
		}
		function de(e, t) {
			if (e.strokeStyle = u, e.fillStyle = u, e.lineWidth = k(), e.lineCap = "round", e.lineJoin = "round", t.kind === "blur") {
				let n = ne(t);
				n && e.drawImage(n, t.x, t.y);
			} else if (t.kind === "box") e.strokeRect(t.x, t.y, t.w, t.h);
			else if (t.kind === "arrow") {
				let n = Dt(t, k());
				e.beginPath(), e.moveTo(t.x1, t.y1), e.lineTo((n[1][0] + n[2][0]) / 2, (n[1][1] + n[2][1]) / 2), e.stroke(), e.beginPath(), n.forEach(([t, n], r) => r ? e.lineTo(t, n) : e.moveTo(t, n)), e.closePath(), e.fill();
			} else e.font = `600 ${A()}px system-ui, sans-serif`, e.textBaseline = "top", e.lineWidth = A() / 4, e.strokeStyle = "white", e.strokeText(t.text, t.x, t.y), e.fillText(t.text, t.x, t.y);
		}
		function J(e) {
			o || (o = !0, r?.removeEventListener("abort", Y), c.onload = null, c.onerror = null, T.open && T.close(), T.remove(), URL.revokeObjectURL(s), _.forEach((e) => URL.revokeObjectURL(e.url)), _.clear(), i(e));
		}
		let Y = () => J({ action: "cancel" });
		r?.addEventListener("abort", Y, { once: !0 }), n.appendChild(T), typeof T.showModal == "function" ? T.showModal() : T.setAttribute("open", ""), c.onload = () => {
			l = {
				width: c.naturalWidth,
				height: c.naturalHeight
			}, V();
		}, c.onerror = () => J({ action: "cancel" }), c.src = s, V(), y.focus({ preventScroll: !0 });
	});
}
//#endregion
//#region src/window.ts
var jt = [
	"image/png",
	"image/jpeg",
	"image/webp"
], Mt = class {
	root;
	host;
	panel;
	body = "";
	nameField;
	kind;
	queue;
	nextId = 1;
	uploadPercent = null;
	uploadProgress = G("progress", {
		max: 100,
		hidden: !0,
		part: "upload-progress"
	});
	sending = !1;
	capturing = !1;
	percent = 0;
	progressLine = G("p", {
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
	openingDialogs = /* @__PURE__ */ new Set();
	cleanups = [];
	titleId = `cm-title-${Math.random().toString(36).slice(2)}`;
	title = G("h2", { class: "cm-title" });
	quote = G("blockquote", { class: "cm-quote" });
	widerButton;
	narrowerButton;
	kindRow;
	field;
	list = G("ul", { class: "cm-images" });
	screenshotButton;
	pickButton = null;
	suspended = !1;
	addButton;
	note = G("p", { class: "cm-small cm-warning" });
	problemLine = G("p", {
		class: "cm-small cm-error",
		role: "alert"
	});
	errorLine = G("p", {
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
		this.queue = new vt({
			autoProceed: !1,
			onBeforeFileAdded: (e) => ({
				...e,
				id: `${e.id}-${this.nextId++}`
			}),
			restrictions: {
				maxNumberOfFiles: t.maxImages,
				maxFileSize: t.maxImageBytes,
				allowedFileTypes: jt
			}
		}), this.kind = t.kinds[0]?.value ?? null, this.nameField = G("input", {
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
		let r = G("div", {
			class: "cm-handle-bar",
			tabindex: 0,
			role: "group",
			"aria-label": n.moveWindow
		}, this.icon("grip"));
		this.kindRow = G("div", {
			class: "cm-kinds",
			role: "radiogroup",
			"aria-label": n.kindLabel
		}), this.field = G("textarea", {
			class: "cm-field",
			part: "body-field",
			rows: 3,
			maxlength: 5e3,
			"aria-labelledby": this.titleId
		}), this.field.addEventListener("input", () => {
			this.body = this.field.value, this.fit(), this.refresh();
		}), this.field.addEventListener("keydown", (e) => {
			e.key === "Enter" && (e.metaKey || e.ctrlKey) && (e.preventDefault(), this.submit());
		}), this.screenshotButton = G("button", {
			type: "button",
			class: "cm-button",
			part: "screenshot",
			onclick: () => void this.screenshot()
		}, this.icon("camera"), G("span", {}, n.screenshot)), this.addButton = G("button", {
			type: "button",
			class: "cm-button",
			part: "add-images",
			onclick: () => this.chooser.click()
		}, this.icon("image"), G("span", {}, n.addImages)), this.chooser = G("input", {
			type: "file",
			multiple: !0,
			accept: jt.join(","),
			hidden: !0,
			tabindex: -1
		}), this.chooser.addEventListener("change", () => {
			[...this.chooser.files ?? []].forEach((e) => this.add(e)), this.chooser.value = "";
		});
		let i = pe() ? "⌘↵" : n.sendShortcut;
		this.sendButton = G("button", {
			type: "button",
			class: "cm-button cm-primary",
			part: "send",
			"aria-keyshortcuts": pe() ? "Meta+Enter" : "Control+Enter"
		}, this.icon("send"), G("span", {}, n.send), me() ? G("kbd", { class: "cm-kbd" }, i) : null), this.footer = G("div", { class: "cm-footer" }, t.finePrint ? G("p", { class: "cm-small cm-fine" }, t.finePrint) : G("span", { class: "cm-spacer" }), G("button", {
			type: "button",
			class: "cm-button cm-quiet",
			part: "cancel",
			onclick: () => this.requestClose()
		}, n.cancel), this.sendButton), this.confirm = G("div", {
			class: "cm-confirm",
			role: "alertdialog",
			"aria-label": n.discardTitle,
			hidden: !0
		}, G("p", { class: "cm-confirm-text" }, n.discardTitle), G("button", {
			type: "button",
			class: "cm-button",
			part: "keep-editing",
			onclick: () => this.keepEditing()
		}, n.keepEditing), G("button", {
			type: "button",
			class: "cm-button cm-danger",
			part: "discard",
			onclick: () => this.close()
		}, n.discard)), this.pickButton = t.pick ? G("button", {
			type: "button",
			class: "cm-button",
			part: "point",
			onclick: () => t.pick?.()
		}, this.icon("pen"), t.pickLabel) : null;
		let a = G("div", { class: "cm-form" }, this.pickButton, this.quote, this.kindRow, this.field, t.name === "off" ? null : G("label", { class: "cm-small" }, t.name === "optional" ? n.nameOptional : n.nameLabel, this.nameField), this.errorLine, this.list, G("div", { class: "cm-picture-actions" }, this.screenshotButton, this.addButton), me() ? G("p", { class: "cm-small" }, n.dropHint) : null, this.note, this.problemLine, this.progressLine, this.uploadProgress, this.chooser);
		this.sendButton.addEventListener("click", () => void this.submit()), this.title.id = this.titleId, this.panel = G("section", {
			class: "cm-window",
			role: "dialog",
			"aria-modal": "false",
			"aria-labelledby": this.titleId,
			popover: "manual",
			hidden: !0
		}, G("header", { class: "cm-header" }, r, this.title, this.widerButton, this.narrowerButton, this.toolButton("close", n.close, n.close, () => this.requestClose())), G("div", { class: "cm-scroll" }, a), this.footer, this.confirm), this.dropZone = G("div", {
			class: "cm-drop",
			popover: "manual",
			hidden: !0,
			"aria-hidden": "true"
		}, n.dropHere), e.append(this.panel, this.dropZone), this.draggable(r);
	}
	get isOpen() {
		return !this.panel.hidden || this.suspended;
	}
	get pictures() {
		let e = (e) => e.taken === "page" ? 0 : e.taken === "element" ? 1 : 2;
		return this.queue.getFiles().map((e) => ({
			...e.meta,
			id: e.id,
			file: e.data
		})).sort((t, n) => e(t) - e(n));
	}
	icon(e) {
		return Y(e, this.host.icons);
	}
	toolButton(e, t, n, r) {
		let i = G("button", {
			type: "button",
			class: "cm-icon-button",
			part: e === "up" ? "wider" : e === "down" ? "narrower" : "close",
			"aria-label": t,
			title: n,
			onclick: r
		}, this.icon(e));
		return i.addEventListener("pointerdown", (e) => e.stopPropagation()), i;
	}
	suspend() {
		return !this.isOpen || !this.acceptsFiles() ? !1 : (this.suspended = !0, this.opening++, this.dragging = 0, X(this.panel), X(this.dropZone), this.panel.hidden = !0, this.dropZone.hidden = !0, this.cleanups.forEach((e) => e()), this.cleanups = [], !0);
	}
	open(e) {
		this.suspended = !1;
		let { strings: t } = this.host;
		this.opening++, this.openingDialogs = new Set(this.visibleDialogs()), this.via = e.via, this.title.textContent = e.via === "pick" && e.name ? e.name : t.title, this.selectedText = e.selectedText ?? "", this.quote.textContent = this.selectedText || e.pickedText || "", this.quote.hidden = !this.quote.textContent, this.quote.setAttribute("aria-label", this.selectedText ? t.selection : t.elementImageName), this.error = null, this.problem = null, this.confirming = !1, this.panel.hidden = !1, fe(this.panel), this.cleanups.forEach((e) => e()), this.cleanups = [], this.listen(), this.refresh(), this.place(), this.fit();
		let n = this.opening;
		requestAnimationFrame(() => {
			n === this.opening && !this.panel.hidden && this.field.focus({ preventScroll: !0 });
		});
	}
	close() {
		this.isOpen && (this.suspended = !1, this.opening++, this.editorController?.abort(), this.editorController = null, this.drawing = !1, this.sending = !1, this.uploadPercent = null, this.body = "", this.field.value = "", this.nameField.value = "", this.kind = this.host.kinds[0]?.value ?? null, this.pictures.forEach((e) => URL.revokeObjectURL(e.url)), this.queue.clear(), this.confirming = !1, this.capturing = !1, X(this.panel), X(this.dropZone), this.dropZone.hidden = !0, this.panel.hidden = !0, this.cleanups.forEach((e) => e()), this.cleanups = [], this.host.closed());
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
				let n = r[e];
				t && n ? this.replace(t, n, !1) : t ? this.remove(t.id) : n && this.add(n, e);
			}
			this.refresh();
		}
	}
	fit() {
		this.field.style.height = "auto", this.field.style.height = `${Math.min(this.field.scrollHeight + 2, 240)}px`;
	}
	refresh() {
		let { strings: e, kinds: t } = this.host;
		this.pickButton && (this.pickButton.disabled = !this.acceptsFiles());
		let n = t.find((e) => e.value === this.kind)?.prompt ?? e.placeholder;
		this.field.placeholder = n, this.field.disabled = this.sending, this.kindRow.hidden = t.length === 0, this.kindRow.replaceChildren(...t.map((e, n) => {
			let r = e.value === this.kind, i = G("button", {
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
		this.screenshotButton.hidden = !this.host.screenshot || i, this.screenshotButton.disabled = this.capturing || this.sending || this.full(), this.screenshotButton.querySelector("span").textContent = this.capturing ? `${e.screenshotTaking} ${this.percent}%` : e.screenshot, this.screenshotButton.setAttribute("aria-busy", String(this.capturing)), this.addButton.disabled = !this.acceptsFiles() || this.full();
		let a = !this.host.screenshot || i ? null : this.host.screenshotNote();
		if (this.note.textContent = a ?? "", this.note.hidden = !a, this.problemLine.textContent = this.problem ?? "", this.problemLine.hidden = !this.problem, this.errorLine.textContent = this.error ?? "", this.errorLine.hidden = !this.error, this.nameField.disabled = this.sending, this.sendButton.disabled = !this.body.trim() || this.host.name === "required" && !this.nameField.value.trim() || this.sending || this.capturing, this.sendButton.querySelector("span").textContent = this.sending ? e.sending : e.send, this.sendButton.setAttribute("aria-busy", String(this.sending)), this.uploadProgress.hidden = !this.sending, this.uploadProgress.setAttribute("aria-label", e.sending), this.uploadPercent === null ? this.uploadProgress.removeAttribute("value") : this.uploadProgress.value = this.uploadPercent, this.sending) {
			let t = this.uploadPercent === null ? e.sending : `${e.sending} ${this.uploadPercent}%`;
			this.sendButton.querySelector("span").textContent = t, this.progressLine.textContent = t;
		}
		this.footer.hidden = this.confirming, this.confirm.hidden = !this.confirming, this.panel.setAttribute("aria-busy", String(this.sending || this.capturing));
	}
	label(e) {
		let { strings: t } = this.host;
		return e.taken === "page" ? t.screenshotName : e.taken === "element" ? t.elementImageName : e.file.name;
	}
	row(e) {
		let { strings: t } = this.host, n = this.label(e), r = () => void this.draw(e);
		return G("li", { class: "cm-image" }, G("button", {
			type: "button",
			class: "cm-thumb",
			tabindex: -1,
			"aria-hidden": "true",
			onclick: r
		}, G("img", {
			src: e.url,
			alt: ""
		})), G("span", { class: "cm-image-name" }, n), this.host.drawing ? G("button", {
			type: "button",
			class: "cm-button cm-quiet",
			part: "draw",
			"aria-label": L(t.drawOn, { name: n }),
			disabled: this.sending,
			onclick: r
		}, this.icon("pen"), G("span", {}, t.draw)) : null, G("button", {
			type: "button",
			class: "cm-icon-button",
			part: "remove-image",
			"aria-label": L(t.removeNamed, { name: n }),
			title: L(t.removeNamed, { name: n }),
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
		if (!this.panel.hidden && this.acceptsFiles()) {
			this.problem = null;
			try {
				let n = this.queue.addFile({
					name: e.name,
					type: e.type,
					data: e,
					source: "luh",
					meta: {
						url: "",
						taken: t
					}
				});
				this.queue.setFileMeta(n, { url: URL.createObjectURL(e) });
			} catch {
				this.rejected(e);
			}
			this.refresh();
		}
	}
	rejected(e, t = this.full()) {
		let { strings: n, maxImages: r, maxImageBytes: i } = this.host;
		this.problem = t ? L(n.tooMany, { max: r }) : L(n.wrongImage, {
			name: e.name,
			size: Math.round(i / 1024 / 1024)
		});
	}
	replace(e, t, n) {
		let r = this.queue.getFiles().filter((t) => t.id !== e.id);
		if (this.queue.validateRestrictions({
			name: t.name,
			type: t.type,
			size: t.size,
			extension: t.name.split(".").pop() ?? ""
		}, r)) {
			this.rejected(t, !1);
			return;
		}
		let i = URL.createObjectURL(t);
		this.queue.setFileState(e.id, {
			data: t,
			name: t.name,
			type: t.type,
			size: t.size,
			extension: t.name.split(".").pop() ?? "",
			meta: {
				...this.queue.getFile(e.id).meta,
				name: t.name,
				type: t.type,
				url: i,
				drawn: n
			}
		}), URL.revokeObjectURL(e.url), this.problem = null;
	}
	remove(e) {
		let t = this.pictures.find((t) => t.id === e);
		t && URL.revokeObjectURL(t.url), this.queue.removeFile(e);
	}
	captureProgress(e) {
		this.capturing && !this.panel.hidden && (this.percent = e, this.progressLine.textContent = `${this.host.strings.screenshotTaking} ${e}%`, this.screenshotButton.querySelector("span").textContent = `${this.host.strings.screenshotTaking} ${e}%`);
	}
	async screenshot() {
		if (!this.host.screenshot || this.panel.hidden || !this.acceptsFiles() || this.capturing) return;
		this.capturing = !0, this.percent = 0, this.problem = null, this.refresh();
		let e = this.opening;
		if (await new Promise((e) => requestAnimationFrame(() => setTimeout(e, 0))), !this.isOpen || e !== this.opening) return;
		let { page: t, element: n } = await this.host.capture();
		e === this.opening && (this.capturing = !1, this.isOpen && (t ? (this.add(t, "page"), n && !this.full() && this.add(n, "element")) : this.problem = this.host.strings.screenshotFailed, this.refresh(), this.list.querySelector(".cm-image .cm-button")?.focus()));
	}
	async draw(e) {
		if (!this.host.drawing || this.panel.hidden || !this.acceptsFiles()) return;
		let t = this.opening;
		this.drawing = !0;
		let n = new AbortController();
		this.editorController = n;
		let r = await At(e.file, this.host.strings, this.root, n.signal, this.host.icons);
		if (t !== this.opening || !this.isOpen) return;
		this.editorController = null, this.drawing = !1, r.action === "done" ? this.replace(e, r.file, !0) : r.action === "remove" && this.remove(e.id), this.refresh();
		let i = this.pictures.findIndex((t) => t.id === e.id);
		(i >= 0 ? this.list.children[i]?.querySelector(".cm-button") : this.addButton)?.focus();
	}
	get editing() {
		return this.drawing;
	}
	async submit() {
		if (!this.body.trim() || this.panel.hidden || this.sending || this.capturing) return;
		if (this.host.name === "required" && !this.nameField.value.trim()) {
			this.error = this.host.strings.nameRequired, this.refresh(), this.nameField.focus();
			return;
		}
		let e = this.opening;
		this.sending = !0, this.uploadPercent = null, this.queue.setState({ totalProgress: 0 }), this.error = null, this.refresh();
		let t = this.pictures.find((e) => e.taken === "page"), n = this.pictures.filter((e) => e.id !== t?.id).map((e) => e.taken === "element" ? Nt(e.file, "element.png") : e.file), r = { onProgress: (t) => {
			e === this.opening && !this.panel.hidden && this.sending && Number.isFinite(t) && (this.uploadPercent = Math.round(Math.max(0, Math.min(100, t))), this.queue.setState({ totalProgress: this.uploadPercent }), this.refresh());
		} }, i;
		try {
			i = await this.host.send({
				body: this.body.trim(),
				name: this.host.name === "off" ? null : this.nameField.value.trim() || null,
				kind: this.kind,
				screenshot: t ? Nt(t.file, "page.png") : null,
				images: n
			}, r);
		} catch {
			i = this.host.strings.failed;
		}
		e === this.opening && this.isOpen && (this.sending = !1, i === null ? this.close() : (this.error = i, this.refresh(), this.field.focus()));
	}
	dispose() {
		this.queue.destroy();
	}
	visibleDialogs() {
		return [...document.querySelectorAll("dialog:modal, [role=\"dialog\"][aria-modal=\"true\"], [role=\"alertdialog\"][aria-modal=\"true\"]")].filter((e) => e.getClientRects().length > 0);
	}
	ownsInput() {
		return this.isOpen ? this.visibleDialogs().every((e) => this.openingDialogs.has(e) || e.contains(this.root.host)) : !1;
	}
	acceptsFiles() {
		return !this.suspended && !this.drawing && !this.sending && !this.capturing && !this.confirming;
	}
	listen() {
		let e = (e, t) => {
			let n = (e) => {
				this.ownsInput() ? t(e) : (this.dragging = 0, this.dropZone.hidden = !0, X(this.dropZone));
			};
			document.addEventListener(e, n, !0), this.cleanups.push(() => document.removeEventListener(e, n, !0));
		}, t = (e) => [...e.dataTransfer?.types ?? []].includes("Files"), n = (e) => {
			this.dropZone.hidden = !e, e ? fe(this.dropZone) : X(this.dropZone);
		};
		e("paste", (e) => {
			let t = [...e.clipboardData?.files ?? []].filter((e) => e.type.startsWith("image/"));
			t.length && (e.preventDefault(), e.stopImmediatePropagation(), this.acceptsFiles() && t.forEach((e) => this.add(e)));
		}), e("dragenter", (e) => {
			t(e) && (e.stopImmediatePropagation(), this.acceptsFiles() ? (this.dragging++, n(!0)) : (this.dragging = 0, n(!1)));
		}), e("dragleave", (e) => {
			t(e) && (this.dragging = Math.max(0, this.dragging - 1), this.dragging || n(!1));
		}), e("dragover", (e) => {
			t(e) && (e.preventDefault(), e.stopImmediatePropagation(), this.acceptsFiles() || n(!1));
		}), e("drop", (e) => {
			this.dragging = 0, n(!1);
			let r = [...e.dataTransfer?.files ?? []];
			(r.length || t(e)) && (e.preventDefault(), e.stopImmediatePropagation(), this.acceptsFiles() && r.forEach((e) => this.add(e)));
		});
		let r = () => this.place();
		window.addEventListener("resize", r), this.cleanups.push(() => window.removeEventListener("resize", r));
	}
	viewport() {
		return {
			width: document.documentElement.clientWidth || window.innerWidth,
			height: document.documentElement.clientHeight || window.innerHeight
		};
	}
	width() {
		return Math.min(400, this.viewport().width - 32);
	}
	place() {
		let e = this.width(), t = this.viewport(), n = this.host.anchor(), r = t.width - e - 16, i = 16, a = t.height - 32, o = n ? null : this.host.opener();
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
	apply(e = this.width(), t = this.viewport().height - this.position.y - 16) {
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
			x: Math.max(8, Math.min(e, this.viewport().width - n - 8)),
			y: Math.max(8, Math.min(t, this.viewport().height - 120))
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
function Nt(e, t) {
	return e.name === t ? e : new File([e], t, { type: e.type });
}
//#endregion
//#region src/element.ts
var Pt = "[data-luh]", Ft = "luh-surface";
function It() {
	customElements.get(Ft) || customElements.define(Ft, class extends HTMLElement {});
	let e = document.createElement(Ft);
	return e.setAttribute("data-luh", "window"), e;
}
var Lt = class extends HTMLElement {
	static observedAttributes = [
		"submit-url",
		"key",
		"app-version",
		"ignore"
	];
	settings = {};
	strings = I;
	picker;
	window;
	windowHost = It();
	announcer = G("p", {
		class: "cm-sr",
		role: "status"
	});
	toast = G("p", {
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
		return this.picking && !t && this.resume(), t || (this.active = !1), this.window?.pickButton && (this.window.pickButton.hidden = !t || !this.settings.pickLabel), this.applyTheme(), this.strings = z(this.settings.language ?? document.documentElement.lang ?? "en", this.settings.languages, this.settings.strings), this.ready && this.isOpen ? this.stale = !0 : this.ready && this.build(), this;
	}
	get options() {
		return this.settings;
	}
	get ignore() {
		return [Pt, this.settings.ignore ?? this.getAttribute("ignore")].filter(Boolean).join(", ");
	}
	connectedCallback() {
		if (!this.ready) {
			if (this.ready = !0, this.setAttribute("data-luh", ""), !document.getElementById("luh-page-style")) {
				let e = G("style", { id: "luh-page-style" });
				e.textContent = ye, document.head.append(e);
			}
			this.themeQuery = window.matchMedia("(prefers-color-scheme: dark)"), this.themeQuery.addEventListener("change", this.onThemeChange), this.applyTheme(), this.build(), document.addEventListener("keydown", this.onKey, { capture: !0 });
		}
	}
	disconnectedCallback() {
		queueMicrotask(() => {
			this.isConnected || (this.active = !1, this.window?.close(), this.window?.dispose(), this.themeQuery?.removeEventListener("change", this.onThemeChange), this.themeQuery = null, window.clearTimeout(this.toastTimer), X(this.toast), this.windowHost.remove(), document.removeEventListener("keydown", this.onKey, { capture: !0 }), this.ready = !1);
		});
	}
	attributeChangedCallback() {
		this.ready && this.isOpen ? this.stale = !0 : this.ready && this.build();
	}
	shadow() {
		let e = this.shadowRoot ?? this.attachShadow({ mode: "open" });
		e.replaceChildren(G("style", {}, ve), this.announcer, this.toast);
		let t = this.windowHost.shadowRoot ?? this.windowHost.attachShadow({ mode: "open" });
		return t.replaceChildren(G("style", {}, ve)), {
			root: e,
			windowRoot: t
		};
	}
	build() {
		this.stale = !1, this.window?.dispose();
		let e = this.picker?.active ?? !1;
		this.picker && (this.picker.active = !1);
		let { root: t, windowRoot: n } = this.shadow();
		this.picker = new ge(t, {
			strings: this.strings,
			ignore: this.ignore,
			paused: () => this.isOpen && !this.picking || this.capturing,
			pick: (e, t) => this.open({
				element: e,
				selectedText: t
			})
		});
		let r = this.settings.language ?? document.documentElement.lang ?? "en";
		n.host.setAttribute("lang", r), this.setAttribute("lang", r), this.settings.trigger && t.append(G("button", {
			type: "button",
			class: "cm-button cm-trigger",
			onclick: (e) => this.open({ from: e })
		}, Y("pen", this.settings.icons), this.strings.trigger)), this.window = new Mt(n, {
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
			send: (e, t) => this.send(e, t),
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
		this.allowed && this.settings.elementPicking !== !1 && this.isOpen && !this.capturing && this.window.suspend() && (this.pickWasActive = this.active, this.picking = !0, this.picker.pin(null), this.returnFocus?.focus({ preventScroll: !0 }), this.active = !0, this.changed());
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
		if (this.picking && (!e.element || !this.allowed || this.settings.elementPicking === !1)) {
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
		let i = e.element ?? null, a = ae(i ?? n, this.ignore);
		(a ?? document.body).append(this.windowHost), this.lineage = [];
		for (let e = i; e && e !== document.body; e = e.parentElement) this.lineage.push({
			element: e,
			bounds: e.getBoundingClientRect()
		});
		this.step = 0, this.shot = null, this.via = i ? "pick" : "write";
		let o = e.selectedText ?? "", s = this.picking && this.context ? { ...this.context } : W({
			appVersion: this.settings.appVersion ?? this.getAttribute("app-version") ?? void 0,
			extra: this.settings.context?.() ?? {},
			dialog: a
		});
		delete s.selectedText, this.context = {
			...s,
			...i ? { element: H(i, this.strings) } : {},
			...o ? { selectedText: o } : {}
		}, this.picking && (this.picking = !1, this.active = this.pickWasActive), this.window.open({
			via: this.via,
			name: i ? V(i, this.strings) : void 0,
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
			element: H(t, this.strings)
		}, this.picker.pin(t), V(t, this.strings));
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
			let r = await f(this.ignore, (e) => this.window.captureProgress(e));
			return !r || this.context !== t || e !== this.captureSequence ? {
				page: null,
				element: null
			} : (this.shot = {
				raw: r,
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
		let { raw: e, viewport: t } = this.shot, n = this.lineage[this.step]?.bounds, [r, i] = n ? await Promise.all([_(e, n, t), g(e, n, t)]) : [e, null], a = (e, t) => e ? new File([e], t, { type: "image/png" }) : null;
		return {
			page: a(r ?? e, "page.png"),
			element: a(i, "element.png")
		};
	}
	async send(e, t) {
		if (!this.allowed) return this.strings.notAllowed;
		if (!this.context) return this.strings.failed;
		let n = {
			via: this.via,
			...e,
			context: this.context
		}, r = this.settings.onSubmit ? await this.settings.onSubmit(n, t) : await Rt(this.settings.submitUrl ?? this.getAttribute("submit-url"), n, this.strings);
		return r && typeof r == "object" && "error" in r ? r.error || this.strings.failed : (this.context === n.context && this.settings.deactivateOnSubmit !== !1 && (this.active = !1), this.context === n.context && this.settings.thanks !== !1 && this.say(this.strings.sent), this.dispatchEvent(new CustomEvent("sent", { detail: n })), null);
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
		if (t && n && typeof t == "string" && e.key.toLowerCase() === t.toLowerCase() && !_e(e.composedPath()[0] ?? e.target)) e.preventDefault(), this.toggle();
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
		window.clearTimeout(this.toastTimer), this.toast.textContent = e, this.toast.hidden = !1, fe(this.toast), this.toastTimer = window.setTimeout(() => {
			this.toast.hidden = !0, X(this.toast);
		}, 3e3);
	}
};
async function Rt(e, t, n) {
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
var zt = "luh-notes";
function Bt(e = zt) {
	return customElements.get(e) || customElements.define(e, class extends Lt {}), customElements.get(e);
}
function Vt(e = {}) {
	Bt();
	let t = document.createElement(zt);
	return t.configure(e), document.body.append(t), t;
}
function Ht(e, t = {}) {
	return V(e, {
		...I,
		...t
	});
}
//#endregion
export { Lt as a, se as c, L as d, z as f, Ht as i, R as l, l as m, Vt as n, Pt as o, u as p, Bt as r, Ft as s, zt as t, I as u };

//# sourceMappingURL=src-D8-uIXgF.js.map