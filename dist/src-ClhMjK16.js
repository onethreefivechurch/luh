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
}) : o, n)), l = "luh", u = [
	"input:not([type=\"button\"], [type=\"submit\"], [type=\"reset\"], [type=\"image\"], [type=\"hidden\"], [type=\"checkbox\"], [type=\"radio\"], [type=\"range\"], [type=\"color\"])",
	"textarea",
	"select",
	"[contenteditable]:not([contenteditable=\"false\"])"
].join(", "), d = (e) => (Array.isArray(e) ? e : e ? [e] : []).map((e) => e.trim()).filter(Boolean);
function f(e) {
	let t = Number(e.blurStrength ?? 12);
	return {
		attribute: e.privacyAttribute?.trim() || "data-luh",
		blur: d(e.redact?.blur),
		hide: d(e.redact?.hide),
		maskInputs: e.maskInputs !== !1,
		blurStrength: Number.isFinite(t) ? Math.max(6, t) : 12,
		hideColor: e.hideColor || "#d4d4d8",
		pages: e.pages ?? []
	};
}
function p(e) {
	let t = e.includes("://"), n = e.split("*").map((e) => e.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*"), r = RegExp(`^${n}$`);
	return (e) => r.test(t ? e.href : e.pathname);
}
function m(e, t = location.href) {
	let n;
	try {
		n = new URL(t);
	} catch {
		return null;
	}
	for (let t of e) try {
		let { match: e } = t;
		if (typeof e == "function" ? e(n) : e instanceof RegExp ? new RegExp(e.source, e.flags.replace("g", "")).test(n.href) : p(e)(n)) return t.mode;
	} catch {
		return "off";
	}
	return null;
}
function h(e) {
	return e.filter((e) => {
		try {
			return document.createDocumentFragment().querySelector(e), !0;
		} catch {
			return !1;
		}
	});
}
function g(e, t) {
	return [
		`[${e.attribute}="${t}"]`,
		...h(t === "blur" ? e.blur : e.hide),
		...t === "hide" && e.maskInputs ? [u] : []
	];
}
function _(e, t) {
	return g(t, "hide").some((t) => e.closest(t)) ? "hide" : g(t, "blur").some((t) => e.closest(t)) ? "blur" : null;
}
function v(e) {
	return [...g(e, "hide"), ...g(e, "blur")].join(", ");
}
function y(e, t = document.getSelection()) {
	if (!t || t.isCollapsed) return !1;
	if (m(e.pages)) return !0;
	for (let n = 0; n < t.rangeCount; n++) {
		let r = t.getRangeAt(n), i = r.startContainer, a = i instanceof Element ? i : i.parentElement;
		if (a && _(a, e)) return !0;
		let o = r.endContainer, s = o instanceof Element ? o : o.parentElement;
		if (s && _(s, e)) return !0;
		let c = r.commonAncestorContainer, l = c instanceof Element ? c : c.parentElement;
		if (l) {
			for (let t of l.querySelectorAll(v(e))) if (r.intersectsNode(t)) return !0;
		}
	}
	return !1;
}
function ee(e, t) {
	let n = {
		width: window.innerWidth,
		height: window.innerHeight
	}, r = [];
	for (let i of ["blur", "hide"]) for (let a of document.querySelectorAll(g(e, i).join(", "))) {
		if (t(a) || i === "blur" && _(a, e) === "hide") continue;
		let o = S(a);
		if (!o) continue;
		let s = Math.max(0, Math.floor(o.left)), c = Math.max(0, Math.floor(o.top)), l = Math.min(n.width, Math.ceil(o.right)), u = Math.min(n.height, Math.ceil(o.bottom));
		l > s && u > c && r.push({
			treatment: i,
			left: s,
			top: c,
			width: l - s,
			height: u - c
		});
	}
	return r;
}
function b(e, t) {
	let n = { ...e };
	for (let e = t; e && e !== document.documentElement; e = e.parentElement) {
		let t = getComputedStyle(e);
		if (t.overflowX === "visible" && t.overflowY === "visible") continue;
		let r = e.getBoundingClientRect();
		t.overflowX !== "visible" && (n.left = Math.max(n.left, r.left), n.right = Math.min(n.right, r.right)), t.overflowY !== "visible" && (n.top = Math.max(n.top, r.top), n.bottom = Math.min(n.bottom, r.bottom));
	}
	return n.right > n.left && n.bottom > n.top ? n : null;
}
var x = 400;
function S(e) {
	if (e.getClientRects().length === 0) return null;
	let t = [e.getBoundingClientRect()], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), r = document.createRange(), i = 0;
	for (let a = n.nextNode(); a; a = n.nextNode()) {
		if (!a.nodeValue?.trim()) continue;
		if (++i > x) {
			r.selectNodeContents(e), t.push(r.getBoundingClientRect());
			break;
		}
		r.selectNodeContents(a);
		let n = b(r.getBoundingClientRect(), a.parentElement);
		n && t.push(n);
	}
	let a = t.filter((e) => e.right - e.left > 0 || e.bottom - e.top > 0);
	return a.length === 0 ? null : b({
		left: Math.min(...a.map((e) => e.left)),
		top: Math.min(...a.map((e) => e.top)),
		right: Math.max(...a.map((e) => e.right)),
		bottom: Math.max(...a.map((e) => e.bottom))
	}, e);
}
function C(e) {
	return e.replace(/[\p{L}\p{M}\p{N}]/gu, (e) => /\p{N}/u.test(e) ? "0" : /\p{Lu}/u.test(e) ? "X" : "x");
}
function te(e, t) {
	let n = e.ownerDocument.createTreeWalker(e, NodeFilter.SHOW_TEXT);
	for (let e = n.nextNode(); e; e = n.nextNode()) e.nodeValue = C(e.nodeValue ?? "");
	let r = [e, ...e.querySelectorAll("input, textarea, select, option, img, picture, video, canvas, svg")];
	for (let n of r) n instanceof HTMLInputElement || n instanceof HTMLTextAreaElement ? (n.value = C(n.value), n.setAttribute("value", n.value), n.removeAttribute("placeholder")) : n instanceof HTMLOptionElement ? n.label = C(n.label) : t === "hide" && n !== e && n.remove();
	for (let t of [
		"title",
		"aria-label",
		"alt",
		"placeholder"
	]) e.removeAttribute(t);
}
function w(e, t, n) {
	let r = Math.max(0, Math.floor(t.x)), i = Math.max(0, Math.floor(t.y)), a = Math.min(e.canvas.width - r, Math.ceil(t.width)), o = Math.min(e.canvas.height - i, Math.ceil(t.height));
	if (a <= 0 || o <= 0) return;
	let s = Math.max(2, Math.round(n)), c = document.createElement("canvas");
	c.width = Math.max(1, Math.ceil(a / s)), c.height = Math.max(1, Math.ceil(o / s));
	let l = c.getContext("2d");
	if (!l) throw Error("No canvas");
	l.imageSmoothingEnabled = !0, l.imageSmoothingQuality = "high", l.drawImage(e.canvas, r, i, a, o, 0, 0, c.width, c.height), e.save(), e.imageSmoothingEnabled = !1, e.clearRect(r, i, a, o), e.drawImage(c, 0, 0, c.width, c.height, r, i, c.width * s, c.height * s), e.restore();
}
async function T(e, t, n, r, i) {
	if (t.length === 0 && !i) return e;
	try {
		let a = await createImageBitmap(e), o = a.width / r.width, s = document.createElement("canvas");
		s.width = a.width, s.height = a.height;
		let c = s.getContext("2d");
		if (!c) return null;
		c.drawImage(a, 0, 0), a.close();
		let l = n.blurStrength * o, u = 2 * o, d = (e) => ({
			x: e.left * o - u,
			y: e.top * o - u,
			width: e.width * o + u * 2,
			height: e.height * o + u * 2
		});
		if (i) w(c, {
			x: 0,
			y: 0,
			width: s.width,
			height: s.height
		}, l);
		else for (let e of t) e.treatment === "blur" && w(c, d(e), l);
		c.fillStyle = n.hideColor;
		for (let e of t) {
			if (e.treatment !== "hide") continue;
			let { x: t, y: n, width: r, height: i } = d(e);
			c.fillRect(t, n, r, i);
		}
		return await new Promise((e) => s.toBlob(e, "image/png"));
	} catch {
		return null;
	}
}
function ne(e, t) {
	if (m(t.pages) || _(e, t)) return "";
	let n = [], r = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
	for (let i = r.nextNode(); i; i = r.nextNode()) {
		let r = i.parentElement;
		r && r !== e && _(r, t) || n.push(i.nodeValue ?? "");
	}
	return n.join("").replace(/\s+/g, " ").trim();
}
function E(e, t, n) {
	if (m(t.pages)) return "";
	let r = {
		...t,
		maskInputs: !1
	}, i = [...g(r, "hide"), ...g(r, "blur")].join(", "), a = [...document.querySelectorAll(i)].filter((e) => !n(e)).map((e) => (e.textContent ?? "").replace(/\s+/g, " ").trim().toLowerCase()).filter((e) => e.length >= 3);
	if (a.length === 0) return e;
	let o = e.toLowerCase(), s = o.split(/\s+[-–—|·:]\s+/).map((e) => e.trim()).filter((e) => e.length >= 3);
	return a.some((e) => o.includes(e) || s.some((t) => e.includes(t))) ? "" : e;
}
//#endregion
//#region src/capture.ts
var D = "#e5484d", re = /* @__PURE__ */ new Map();
async function O(e, t, n = () => {}) {
	let r = document.documentElement;
	try {
		let i = m(t.pages);
		if (i === "off") return null;
		let a = i === "blur", o = {
			width: window.innerWidth,
			height: window.innerHeight
		}, s = ee(t, (t) => !!t.closest(e)), { createContext: c, destroyContext: l, domToBlob: u } = await import("./dist-DhYexWcW.js");
		await document.fonts?.ready;
		let d = [r], f = 0, p = await c(r, {
			filter: (e) => {
				if (e instanceof Element) {
					if (e === p.sandbox || getComputedStyle(e).display === "none") return !1;
					d.push(e);
				}
				return !0;
			},
			width: window.innerWidth,
			height: window.innerHeight,
			scale: Math.min(window.devicePixelRatio || 1, 2),
			backgroundColor: getComputedStyle(document.body).backgroundColor,
			type: "image/png",
			progress: (e, t) => n(t === 0 ? 90 : Math.round(e / t * 90)),
			features: { restoreScrollPosition: !0 },
			onCloneNode: () => n(0),
			onEmbedNode: () => n(95),
			onCloneEachNode: (n) => {
				if (!(n instanceof Element)) return;
				let i = d.pop();
				if (!(n instanceof HTMLElement) || !(i instanceof HTMLElement)) return;
				n instanceof HTMLInputElement && n.type === "password" && (n.value = "", n.setAttribute("value", "")), i.matches(e) && (n.style.opacity = "0");
				let o = a && i === r ? "blur" : _(i, t), s = i.parentElement;
				o && (!s || _(s, t) !== o) && te(n, o), n instanceof HTMLImageElement && i instanceof HTMLImageElement && k(i, n);
				let c = getComputedStyle(i);
				if (n.matches("input, textarea")) {
					let e = getComputedStyle(i, "::placeholder"), t = `luh-placeholder-${f++}`;
					n.classList.add(t), p.svgStyleElement?.appendChild(document.createTextNode(`.${t}::placeholder { color: ${e.color}; -webkit-text-fill-color: ${e.webkitTextFillColor}; opacity: ${e.opacity}; }`));
				}
				let l = i.offsetWidth - i.clientWidth - parseFloat(c.borderLeftWidth) - parseFloat(c.borderRightWidth), u = i.offsetHeight - i.clientHeight - parseFloat(c.borderTopWidth) - parseFloat(c.borderBottomWidth);
				[
					"auto",
					"scroll",
					"overlay"
				].includes(n.style.overflowX) && u < 1 && (n.style.overflowX = "hidden"), [
					"auto",
					"scroll",
					"overlay"
				].includes(n.style.overflowY) && l < 1 && (n.style.overflowY = "hidden");
			}
		});
		p.fontCssTexts = new Map(re);
		try {
			let e = await T(await u(p), s, t, o, a);
			return e ? (n(100), {
				blob: e,
				redacted: s.length,
				wholePage: a
			}) : null;
		} finally {
			p.fontCssTexts.forEach((e, t) => re.set(t, e)), l(p);
		}
	} catch {
		return null;
	}
}
function k(e, t) {
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
function A(e, t) {
	let n = Math.max(0, e.left), r = Math.max(0, e.top), i = Math.min(t.width, e.left + e.width) - n, a = Math.min(t.height, e.top + e.height) - r;
	return i > 0 && a > 0 ? {
		left: n,
		top: r,
		width: i,
		height: a
	} : null;
}
async function j(e, t, n) {
	try {
		let r = await createImageBitmap(e), i = n(r, r.width / t.width);
		return r.close(), i ? await new Promise((e) => i.toBlob(e, "image/png")) : null;
	} catch {
		return null;
	}
}
function M(e, t, n) {
	return j(e, n, (e, r) => {
		let i = A(t, n);
		if (!i) return null;
		let a = document.createElement("canvas");
		return a.width = Math.ceil(i.width * r), a.height = Math.ceil(i.height * r), a.getContext("2d")?.drawImage(e, i.left * r, i.top * r, i.width * r, i.height * r, 0, 0, a.width, a.height), a;
	});
}
function N(e, t, n) {
	return j(e, n, (e, r) => {
		let i = document.createElement("canvas");
		i.width = e.width, i.height = e.height;
		let a = i.getContext("2d");
		if (!a) return null;
		a.drawImage(e, 0, 0);
		let o = A(t, n);
		if (!o) return i;
		let s = 3 * r, c = [
			o.left * r - s,
			o.top * r - s,
			o.width * r + s * 2,
			o.height * r + s * 2
		];
		return a.lineJoin = "round", a.strokeStyle = "rgba(255, 255, 255, 0.9)", a.lineWidth = 6 * r, a.strokeRect(...c), a.strokeStyle = D, a.lineWidth = 3 * r, a.strokeRect(...c), i;
	});
}
//#endregion
//#region node_modules/.pnpm/@medv+finder@4.0.2/node_modules/@medv/finder/finder.js
var P = /* @__PURE__ */ new Set([
	"role",
	"name",
	"aria-label",
	"rel",
	"href"
]);
function F(e, t) {
	let n = P.has(e);
	n ||= e.startsWith("data-") && R(e);
	let r = R(t) && t.length < 100;
	return r ||= t.startsWith("#") && R(t.slice(1)), n && r;
}
function I(e) {
	return R(e);
}
function L(e) {
	return R(e);
}
function ie(e) {
	return !0;
}
function ae(e, t) {
	if (e.nodeType !== Node.ELEMENT_NODE) throw Error("Can't generate CSS selector for non-element node type.");
	if (e.tagName.toLowerCase() === "html") return "html";
	let n = {
		root: document.body,
		idName: I,
		className: L,
		tagName: ie,
		attr: F,
		timeoutMs: 1e3,
		seedMinLength: 3,
		optimizedMinLength: 2,
		maxNumberOfPathChecks: Infinity
	}, r = /* @__PURE__ */ new Date(), i = {
		...n,
		...t
	}, a = de(i.root, n), o, s = 0;
	for (let t of oe(e, i, a)) {
		if ((/* @__PURE__ */ new Date()).getTime() - r.getTime() > i.timeoutMs || s >= i.maxNumberOfPathChecks) {
			let t = se(e, a);
			if (!t) throw Error(`Timeout: Can't find a unique selector after ${i.timeoutMs}ms`);
			return B(t);
		}
		if (s++, W(t, a)) {
			o = t;
			break;
		}
	}
	if (!o) throw Error("Selector was not found.");
	let c = [...fe(o, e, i, a, r)];
	return c.sort(H), c.length > 0 ? B(c[0]) : B(o);
}
function* oe(e, t, n) {
	let r = [], i = [], a = e, o = 0;
	for (; a && a !== n;) {
		let e = z(a, t);
		for (let t of e) t.level = o;
		if (r.push(e), a = a.parentElement, o++, i.push(...ue(r)), o >= t.seedMinLength) {
			i.sort(H);
			for (let e of i) yield e;
			i = [];
		}
	}
	i.sort(H);
	for (let e of i) yield e;
}
function R(e) {
	if (/^[a-z\-]{3,}$/i.test(e)) {
		let t = e.split(/-|[A-Z]/);
		for (let e of t) if (e.length <= 2 || /[^aeiou]{4,}/i.test(e)) return !1;
		return !0;
	}
	return !1;
}
function z(e, t) {
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
		let t = U(e, i);
		t !== void 0 && n.push({
			name: le(i, t),
			penalty: 10
		});
	}
	let a = U(e);
	return a !== void 0 && n.push({
		name: ce(i, a),
		penalty: 50
	}), n;
}
function B(e) {
	let t = e[0], n = t.name;
	for (let r = 1; r < e.length; r++) {
		let i = e[r].level || 0;
		n = t.level === i - 1 ? `${e[r].name} > ${n}` : `${e[r].name} ${n}`, t = e[r];
	}
	return n;
}
function V(e) {
	return e.map((e) => e.penalty).reduce((e, t) => e + t, 0);
}
function H(e, t) {
	return V(e) - V(t);
}
function U(e, t) {
	let n = e.parentNode;
	if (!n) return;
	let r = n.firstChild;
	if (!r) return;
	let i = 0;
	for (; r && (r.nodeType === Node.ELEMENT_NODE && (t === void 0 || r.tagName.toLowerCase() === t) && i++, r !== e);) r = r.nextSibling;
	return i;
}
function se(e, t) {
	let n = 0, r = e, i = [];
	for (; r && r !== t;) {
		let e = r.tagName.toLowerCase(), t = U(r, e);
		if (t === void 0) return;
		i.push({
			name: le(e, t),
			penalty: NaN,
			level: n
		}), r = r.parentElement, n++;
	}
	if (W(i, t)) return i;
}
function ce(e, t) {
	return e === "html" ? "html" : `${e}:nth-child(${t})`;
}
function le(e, t) {
	return e === "html" ? "html" : `${e}:nth-of-type(${t})`;
}
function* ue(e, t = []) {
	if (e.length > 0) for (let n of e[0]) yield* ue(e.slice(1, e.length), t.concat(n));
	else yield t;
}
function de(e, t) {
	return e.nodeType === Node.DOCUMENT_NODE ? e : e === t.root ? e.ownerDocument : e;
}
function W(e, t) {
	let n = B(e);
	switch (t.querySelectorAll(n).length) {
		case 0: throw Error(`Can't select any node with this selector: ${n}`);
		case 1: return !0;
		default: return !1;
	}
}
function* fe(e, t, n, r, i) {
	if (e.length > 2 && e.length > n.optimizedMinLength) for (let a = 1; a < e.length - 1; a++) {
		if ((/* @__PURE__ */ new Date()).getTime() - i.getTime() > n.timeoutMs) return;
		let o = [...e];
		o.splice(a, 1), W(o, r) && r.querySelector(B(o)) === t && (yield o, yield* fe(o, t, n, r, i));
	}
}
//#endregion
//#region src/strings.ts
var G = {
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
	blurMore: "Blur",
	blurMoreOn: "Blur more on {name}",
	coveredOne: "1 private area covered. Check the picture before sending.",
	coveredMany: "{number} private areas covered. Check the picture before sending.",
	coveredPage: "This page is private, so the whole screenshot is blurred.",
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
function K(e, t = {}) {
	return e.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : e);
}
var pe = { en: G };
function me(e = "en", t = {}, n = {}) {
	let r = e.toLowerCase().replace(/_/g, "-"), i = Object.fromEntries(Object.entries({
		...pe,
		...t
	}).map(([e, t]) => [e.toLowerCase().replace(/_/g, "-"), t]));
	return {
		...G,
		...i[r.split("-")[0]],
		...i[r],
		...n
	};
}
//#endregion
//#region src/context.ts
var he = {
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
}, ge = {
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
}, _e = (e) => e.matches("input, textarea, select"), q = (e) => (e ?? "").replace(/\s+/g, " ").trim();
function ve(e, t, n) {
	let r = n === void 0 ? e.getAttribute("aria-label") ?? (_e(e) ? "" : q(e.textContent)) : q(n), i = e.getAttribute("role"), a = i ? t[ge[i.toLowerCase()] ?? "area"] : t[he[e.tagName.toLowerCase()] ?? "area"], o = r.length > 32 ? `${r.slice(0, 31)}…` : r;
	return o ? K(t.named, {
		kind: a,
		label: o
	}) : a;
}
function ye(e, t, n) {
	let r = "";
	try {
		r = ae(e, {
			timeoutMs: 100,
			attr: (e, t) => [
				"data-testid",
				"role",
				"aria-label"
			].includes(e) || e === "id" && !/\d/.test(t),
			className: () => !1
		});
	} catch {
		r = e.id ? `#${CSS.escape(e.id)}` : e.tagName.toLowerCase();
	}
	return {
		selector: r.slice(0, 1e3),
		id: e.id.slice(0, 300),
		text: n === void 0 ? _e(e) ? (e.getAttribute("aria-label") ?? "").slice(0, 300) : q(e.textContent).slice(0, 300) : q(n).slice(0, 300),
		role: e.getAttribute("role") ?? e.tagName.toLowerCase(),
		name: ve(e, t, n)
	};
}
function be(e) {
	if (!e) return;
	let t = e.getAttribute("aria-labelledby");
	return q(t ? e.ownerDocument.getElementById(t)?.textContent : e.getAttribute("aria-label")).slice(0, 100) || void 0;
}
function xe(e, t) {
	let n = "dialog[open], [role=\"dialog\"][aria-modal=\"true\"], [role=\"dialog\"][data-state=\"open\"]", r = e, i = null;
	for (; r && !i;) {
		i = r.closest(n);
		let e = r.getRootNode();
		r = e instanceof ShadowRoot ? e.host : null;
	}
	return i instanceof HTMLElement && !i.closest(t) ? i : [...document.querySelectorAll(n)].filter((e) => !e.closest(t) && e.getClientRects().length > 0).at(-1) ?? null;
}
function Se(e) {
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
		...be(e.dialog) ? { dialog: be(e.dialog) } : {},
		extra: e.extra
	};
}
function Ce() {
	let e = document.getSelection();
	return e && !e.isCollapsed ? q(e.toString()).slice(0, 1e3) : "";
}
//#endregion
//#region src/parts.ts
var we = {
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
}, Te = {
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
function Ee(e) {
	let t = new Set((e.getAttribute("part") ?? "").split(/\s+/).filter(Boolean)), n = Te[e.localName.toLowerCase()];
	n && t.add(n);
	for (let n of e.classList) {
		let e = we[n];
		e && t.add(e);
	}
	t.size && e.setAttribute("part", [...t].join(" "));
}
//#endregion
//#region src/dom.ts
function J(e, t = {}, ...n) {
	let r = document.createElement(e);
	return Oe(r, t), ke(r, n), Ee(r), r;
}
var De = "http://www.w3.org/2000/svg";
function Y(e, t = {}, ...n) {
	let r = document.createElementNS(De, e);
	return Oe(r, t), ke(r, n), Ee(r), r;
}
function Oe(e, t) {
	for (let [n, r] of Object.entries(t)) typeof r == "function" ? e.addEventListener(n.slice(2), r) : r === !0 ? e.setAttribute(n, "") : r !== !1 && r != null && e.setAttribute(n, String(r));
}
function ke(e, t) {
	for (let n of t) (n || n === "") && e.append(n);
}
var Ae = {
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
function je(e, t) {
	let n = t?.[e]?.();
	if (n && (n.namespaceURI !== De || n.localName !== "svg")) throw TypeError(`Luh icon "${e}" must be an SVG root element`);
	let r = n ? n.cloneNode(!0) : Y("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": 2,
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"aria-hidden": "true",
		class: "cm-icon"
	}, Y("path", { d: Ae[e] }));
	return r.classList.add("cm-icon"), r.setAttribute("aria-hidden", "true"), r.setAttribute("focusable", "false"), r.setAttribute("part", `icon icon-${e}`), r.querySelectorAll("*").forEach(Ee), r;
}
function Me(e) {
	if (typeof e.showPopover == "function" && !e.matches(":popover-open")) try {
		e.showPopover();
	} catch {}
}
function X(e) {
	if (typeof e.hidePopover == "function") try {
		e.matches(":popover-open") && e.hidePopover();
	} catch {}
}
var Ne = () => /Mac|iPhone|iPad/.test(navigator.platform), Pe = () => window.matchMedia?.("(pointer: fine)").matches ?? !0, Fe = "button, a, input, textarea, select, label, summary, [role=\"button\"], [role=\"tab\"], [role=\"checkbox\"], [role=\"radio\"], [role=\"switch\"], [role=\"menuitem\"], [role=\"option\"], [role=\"link\"]", Ie = class {
	host;
	hovered = null;
	narrower = [];
	pinned = null;
	on = !1;
	outline = J("div", {
		class: "cm-outline",
		popover: "manual",
		hidden: !0,
		"aria-hidden": "true"
	});
	name = J("span", { class: "cm-outline-name" });
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
		return !(e instanceof Element) || e.closest(this.host.ignore) ? null : e.closest(Fe) ?? (e instanceof SVGElement ? e.closest("svg")?.parentElement ?? e : e);
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
		let n = this.pinned ? "" : ve(e, this.host.strings);
		this.name.textContent = n && Pe() ? `${n} · ${this.host.strings.pickHint}` : n, this.name.hidden = !n, this.name.classList.toggle("cm-below", t.top < 28), this.outline.hidden = !1, Me(this.outline);
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
			r && (e.type === "pointerdown" && (n = Ce(), t = !0), e.stopImmediatePropagation(), (r.matches(Fe) || r.closest("[draggable=\"true\"]")) && e.preventDefault());
		};
		e("pointerdown", r), e("mousedown", r), e("touchstart", r), e("click", (e) => {
			if (!this.picking) return;
			let t = this.target(e.target);
			if (!t) return;
			e.preventDefault(), e.stopImmediatePropagation();
			let r = document.getSelection(), i = Ce();
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
		return e.key === "ArrowUp" && t?.parentElement && t.parentElement !== document.body ? (this.narrower = [...this.narrower, t], this.hovered = t.parentElement, this.draw(), !0) : e.key === "ArrowDown" && this.narrower.length ? (this.hovered = this.narrower.at(-1), this.narrower = this.narrower.slice(0, -1), this.draw(), !0) : (e.key === "Enter" || e.key === " ") && t && !Le(e.composedPath()[0] ?? e.target) ? (this.choose(t), !0) : !1;
	}
};
function Le(e) {
	return e instanceof HTMLElement && (e.isContentEditable || e.matches("input, textarea, select"));
}
//#endregion
//#region src/styles.ts
var Re = String.raw`
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
.cm-image .cm-button { padding-inline: 8px; }
.cm-thumb { padding: 0; border: 1px solid var(--cm-border); border-radius: 6px; background: var(--cm-raised); cursor: pointer; flex: none; overflow: hidden; }
.cm-thumb img { display: block; width: 40px; height: 40px; object-fit: cover; object-position: top; }
.cm-image-name { flex: 1; min-width: 5.5em; overflow-wrap: anywhere; font-weight: 500; }
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
.cm-covered { margin: 0; }
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
`, ze = String.raw`
html.${"luh"}-picking, html.${"luh"}-picking *:not([data-${"luh"}]) {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z' fill='%23fff' stroke='%2318181b' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E") 3 21, crosshair !important;
}
`;
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/toError.js
function Be(e) {
	return e instanceof Error || typeof e == "object" && !!e && "message" in e && typeof e.message == "string";
}
function Ve(e) {
	return Be(e) ? e : Error(String(e));
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/getFileNameAndExtension.js
function He(e) {
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
var Ue = {
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
function We(e) {
	if (e.type) return e.type;
	let t = e.name ? He(e.name).extension?.toLowerCase() : null;
	return t && t in Ue ? Ue[t] : "application/octet-stream";
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/generateFileID.js
function Ge(e) {
	return e.charCodeAt(0).toString(32);
}
function Ke(e) {
	let t = "";
	return e.replace(/[^A-Z0-9]/gi, (e) => (t += `-${Ge(e)}`, "/")) + t;
}
function qe(e, t) {
	let n = t || "uppy";
	return typeof e.name == "string" && (n += `-${Ke(e.name.toLowerCase())}`), e.type !== void 0 && (n += `-${e.type}`), e.meta && typeof e.meta.relativePath == "string" && (n += `-${Ke(e.meta.relativePath.toLowerCase())}`), e.data?.size !== void 0 && (n += `-${e.data.size}`), e.data.lastModified !== void 0 && (n += `-${e.data.lastModified}`), n;
}
function Je(e) {
	return !e.isRemote || !e.remote ? !1 : (/* @__PURE__ */ new Set([
		"box",
		"dropbox",
		"drive",
		"facebook",
		"unsplash"
	])).has(e.remote.provider);
}
function Ye(e, t) {
	if (Je(e)) return e.id;
	let n = We(e);
	return qe({
		...e,
		type: n
	}, t);
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/getErrorMessage.js
function Xe(e) {
	return Be(e) ? e.message : String(e);
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/getTimeStamp.js
function Ze(e) {
	return e < 10 ? `0${e}` : e.toString();
}
function Qe() {
	let e = /* @__PURE__ */ new Date();
	return `${Ze(e.getHours())}:${Ze(e.getMinutes())}:${Ze(e.getSeconds())}`;
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/isRestrictionError.js
function $e(e) {
	return e instanceof Error && "isRestriction" in e && e.isRestriction === !0;
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/utils/Translator.js
function et(e, t, n) {
	let r = [];
	return e.forEach((e) => {
		typeof e == "string" ? t[Symbol.split](e).forEach((e, t, i) => {
			e !== "" && r.push(e), t < i.length - 1 && r.push(n);
		}) : r.push(e);
	}), r;
}
function tt(e, t) {
	let n = /\$/g, r = [e];
	if (t == null) return r;
	for (let e of Object.keys(t)) if (e !== "_") {
		let i = t[e];
		typeof i == "string" && (i = n[Symbol.replace](i, "$$$$")), r = et(r, RegExp(`%\\{${e}\\}`, "g"), i);
	}
	return r;
}
var nt = (e) => {
	throw Error(`missing string: ${e}`);
}, rt = class {
	locale;
	constructor(e, { onMissingKey: t = nt } = {}) {
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
				return tt(n[e], t);
			}
			throw Error("Attempted to use a string with plural forms, but no value was given for %{smart_count}");
		}
		if (typeof n != "string") throw Error("string was not a string");
		return tt(n, t);
	}
}, it = {
	debug: () => {},
	warn: () => {},
	error: (...e) => console.error(`[Uppy] [${Qe()}]`, ...e)
}, at = {
	debug: (...e) => console.debug(`[Uppy] [${Qe()}]`, ...e),
	warn: (...e) => console.warn(`[Uppy] [${Qe()}]`, ...e),
	error: (...e) => console.error(`[Uppy] [${Qe()}]`, ...e)
}, ot = [
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
function st(e, t) {
	if (typeof e != "number" || Number.isNaN(e)) throw TypeError(`Expected a number, got ${typeof e}`);
	let n = e < 0, r = Math.abs(e);
	if (n && (r = -r), r === 0) return "0 B";
	let i = t ? ot.indexOf(t) : Math.min(Math.floor(Math.log(r) / Math.log(1024)), ot.length - 1), a = Number(r / 1024 ** i), o = ot[i];
	return i >= 3 ? a % 1 == 0 ? `${Math.round(a)} ${o}` : `${a.toFixed(2)} ${o}` : `${a >= 10 || a % 1 == 0 ? Math.round(a) : a.toFixed(1)} ${o}`;
}
//#endregion
//#region node_modules/.pnpm/wildcard@1.1.2/node_modules/wildcard/index.js
var ct = /* @__PURE__ */ o(((e, t) => {
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
})), lt = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	var n = ct(), r = /[\/\+\.]/;
	t.exports = function(e, t) {
		function i(t) {
			var i = n(t, e, r);
			return i && i.length >= 2;
		}
		return t ? i(t.split(";")[0]) : i;
	};
})))(), 1), ut = {
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
}, dt = class {
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
				sizeAllowed: st(n),
				size: st(r)
			}));
		}
	}
	validateSingleFile(e) {
		let { maxFileSize: t, minFileSize: n, allowedFileTypes: r } = this.getOpts().restrictions;
		if (r && !r.some((t) => t.includes("/") ? e.type ? (0, lt.default)(e.type.replace(/;.*?$/, ""), t) : !1 : t[0] === "." && e.extension ? e.extension.toLowerCase() === t.slice(1).toLowerCase() : !1)) {
			let t = r.join(", ");
			throw new Z(this.getI18n()("youCanOnlyUploadFileTypes", { types: t }), { file: e });
		}
		if (t && e.size != null && e.size > t) throw new Z(this.getI18n()("exceedsSize", {
			size: st(t),
			file: e.name ?? this.getI18n()("unnamed")
		}), { file: e });
		if (n && e.size != null && e.size < n) throw new Z(this.getI18n()("inferiorSize", { size: st(n) }), { file: e });
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
}, ft = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		var t = typeof e;
		return e != null && (t == "object" || t == "function");
	}
	t.exports = n;
})), pt = /* @__PURE__ */ o(((e, t) => {
	t.exports = typeof global == "object" && global && global.Object === Object && global;
})), mt = /* @__PURE__ */ o(((e, t) => {
	var n = pt(), r = typeof self == "object" && self && self.Object === Object && self;
	t.exports = n || r || Function("return this")();
})), ht = /* @__PURE__ */ o(((e, t) => {
	var n = mt();
	t.exports = function() {
		return n.Date.now();
	};
})), gt = /* @__PURE__ */ o(((e, t) => {
	var n = /\s/;
	function r(e) {
		for (var t = e.length; t-- && n.test(e.charAt(t)););
		return t;
	}
	t.exports = r;
})), _t = /* @__PURE__ */ o(((e, t) => {
	var n = gt(), r = /^\s+/;
	function i(e) {
		return e && e.slice(0, n(e) + 1).replace(r, "");
	}
	t.exports = i;
})), vt = /* @__PURE__ */ o(((e, t) => {
	t.exports = mt().Symbol;
})), yt = /* @__PURE__ */ o(((e, t) => {
	var n = vt(), r = Object.prototype, i = r.hasOwnProperty, a = r.toString, o = n ? n.toStringTag : void 0;
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
})), bt = /* @__PURE__ */ o(((e, t) => {
	var n = Object.prototype.toString;
	function r(e) {
		return n.call(e);
	}
	t.exports = r;
})), xt = /* @__PURE__ */ o(((e, t) => {
	var n = vt(), r = yt(), i = bt(), a = "[object Null]", o = "[object Undefined]", s = n ? n.toStringTag : void 0;
	function c(e) {
		return e == null ? e === void 0 ? o : a : s && s in Object(e) ? r(e) : i(e);
	}
	t.exports = c;
})), St = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return typeof e == "object" && !!e;
	}
	t.exports = n;
})), Ct = /* @__PURE__ */ o(((e, t) => {
	var n = xt(), r = St(), i = "[object Symbol]";
	function a(e) {
		return typeof e == "symbol" || r(e) && n(e) == i;
	}
	t.exports = a;
})), wt = /* @__PURE__ */ o(((e, t) => {
	var n = _t(), r = ft(), i = Ct(), a = NaN, o = /^[-+]0x[0-9a-f]+$/i, s = /^0b[01]+$/i, c = /^0o[0-7]+$/i, l = parseInt;
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
})), Tt = /* @__PURE__ */ o(((e, t) => {
	var n = ft(), r = ht(), i = wt(), a = "Expected a function", o = Math.max, s = Math.min;
	function c(e, t, c) {
		var l, u, d, f, p, m, h = 0, g = !1, _ = !1, v = !0;
		if (typeof e != "function") throw TypeError(a);
		t = i(t) || 0, n(c) && (g = !!c.leading, _ = "maxWait" in c, d = _ ? o(i(c.maxWait) || 0, t) : d, v = "trailing" in c ? !!c.trailing : v);
		function y(t) {
			var n = l, r = u;
			return l = u = void 0, h = t, f = e.apply(r, n), f;
		}
		function ee(e) {
			return h = e, p = setTimeout(S, t), g ? y(e) : f;
		}
		function b(e) {
			var n = e - m, r = e - h, i = t - n;
			return _ ? s(i, d - r) : i;
		}
		function x(e) {
			var n = e - m, r = e - h;
			return m === void 0 || n >= t || n < 0 || _ && r >= d;
		}
		function S() {
			var e = r();
			if (x(e)) return C(e);
			p = setTimeout(S, b(e));
		}
		function C(e) {
			return p = void 0, v && l ? y(e) : (l = u = void 0, f);
		}
		function te() {
			p !== void 0 && clearTimeout(p), h = 0, l = m = u = p = void 0;
		}
		function w() {
			return p === void 0 ? f : C(r());
		}
		function T() {
			var e = r(), n = x(e);
			if (l = arguments, u = this, m = e, n) {
				if (p === void 0) return ee(m);
				if (_) return clearTimeout(p), p = setTimeout(S, t), y(m);
			}
			return p === void 0 && (p = setTimeout(S, t)), f;
		}
		return T.cancel = te, T.flush = w, T;
	}
	t.exports = c;
})), Et = /* @__PURE__ */ o(((e, t) => {
	var n = Tt(), r = ft(), i = "Expected a function";
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
})), Dt = /* @__PURE__ */ o(((e, t) => {
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
})), Ot = /* @__PURE__ */ c(Et(), 1), kt = /* @__PURE__ */ c(Dt(), 1), At = "57X6y3wQZNzYjJB2L_10pxbackgroundhimselfUTF-8DEMOGRAPHICSVqvt4KW9", jt = (e = 21) => {
	let t = "", n = e | 0;
	for (; n-- > 0;) t += At[Math.random() * 64 | 0];
	return t;
}, Mt = {
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
function Nt(e, t) {
	return t.name ? t.name : e.split("/")[0] === "image" ? `${e.split("/")[0]}.${e.split("/")[1]}` : "noname";
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/locale.js
var Pt = { strings: {
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
} }, Ft = class {
	static VERSION = Mt.version;
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
function It(e) {
	if (e == null && typeof navigator < "u" && (e = navigator.userAgent), !e) return !0;
	let t = /Edge\/(\d+\.\d+)/.exec(e);
	if (!t) return !0;
	let n = t[1].split(".", 2), r = parseInt(n[0], 10), i = parseInt(n[1], 10);
	return r < 15 || r === 15 && i < 15063 || r > 18 || r === 18 && i >= 18218;
}
//#endregion
//#region node_modules/.pnpm/@uppy+core@6.2.0/node_modules/@uppy/core/lib/Uppy.js
var Lt = {
	totalProgress: 0,
	allowNewUpload: !0,
	error: null,
	recoveredState: null
}, Rt = class e {
	static VERSION = Mt.version;
	#e = Object.create(null);
	#t;
	#n;
	#r = (0, kt.default)();
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
		this.defaultLocale = Pt;
		let n = {
			id: "uppy",
			autoProceed: !1,
			allowMultipleUploadBatches: !0,
			debug: !1,
			restrictions: ut,
			meta: {},
			onBeforeFileAdded: (e, t) => !Object.hasOwn(t, e.id),
			onBeforeUpload: (e) => e,
			store: new Ft(),
			logger: it,
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
		}, t?.logger && t.debug ? this.log("You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.", "warning") : t?.debug && (this.opts.logger = at), this.log(`Using Core v${e.VERSION}`), this.i18nInit(), this.store = this.opts.store, this.setState({
			...Lt,
			plugins: {},
			files: {},
			currentUploads: {},
			capabilities: {
				uploadProgress: It(),
				individualCancellation: !0,
				resumableUploads: !1
			},
			meta: { ...this.opts.meta },
			info: []
		}), this.#t = new dt(() => this.opts, () => this.i18n), this.#n = this.store.subscribe((e, t, n) => {
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
		let e = new rt([this.defaultLocale, this.opts.locale], { onMissingKey: (e) => this.log(`Missing i18n string: ${e}`, "error") });
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
			...Lt
		});
	}
	clear() {
		let { capabilities: e, currentUploads: t } = this.getState();
		if (Object.keys(t).length > 0 && !e.individualCancellation) throw Error("The installed uploader plugin does not allow removing files during an upload.");
		this.setState({
			...Lt,
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
			return Xe(e);
		}
		return null;
	}
	validateAggregateRestrictions(e) {
		let t = this.getFiles();
		try {
			this.#t.validateAggregateRestrictions(t, e);
		} catch (e) {
			return Xe(e);
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
		} : e, n = We(t), r = Nt(n, t), i = He(r).extension, a = Ye(t, this.getID()), o = {
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
				$e(e) || this.log(e.stack || e.message || e);
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
		t.length && this.removeFiles(t), this.setState(Lt);
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
	#v = (0, Ot.default)(() => this.#_(), 500, {
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
		let a = jt();
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
			throw this.#s([Ve(e)]), e;
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
function zt(e, t, n) {
	let r = n.x - t.x, i = n.y - t.y, a = r * r + i * i, o = a ? Math.max(0, Math.min(1, ((e.x - t.x) * r + (e.y - t.y) * i) / a)) : 0;
	return Math.hypot(e.x - (t.x + o * r), e.y - (t.y + o * i));
}
function Bt(e, t, n, r, i) {
	for (let a = e.length - 1; a >= 0; a--) {
		let o = e[a];
		if (o.kind === "arrow") {
			if (zt(t, {
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
function Vt(e) {
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
function Ht(e, t, n) {
	return Vt(e).find((e) => Math.hypot(e.x - t.x, e.y - t.y) <= n)?.handle ?? null;
}
var Ut = (e, t, n) => Math.max(t, Math.min(n, e));
function Wt(e, t, n, r, i) {
	let a = Ut(t, -i.x, r.width - i.x - i.w), o = Ut(n, -i.y, r.height - i.y - i.h);
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
function Gt(e, t, n) {
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
function Kt(e, t) {
	return e.kind === "arrow" ? Math.hypot(e.x2 - e.x1, e.y2 - e.y1) < t : e.kind === "text" ? !e.text.trim() : e.w < t || e.h < t;
}
function qt(e, t) {
	let n = Math.atan2(e.y2 - e.y1, e.x2 - e.x1), r = t * 5, i = Math.PI / 7;
	return [
		[e.x2, e.y2],
		[e.x2 - r * Math.cos(n - i), e.y2 - r * Math.sin(n - i)],
		[e.x2 - r * Math.cos(n + i), e.y2 - r * Math.sin(n + i)]
	];
}
var Jt = class {
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
}, Yt = [
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
function Xt(e, t, n, r, i, a = "arrow") {
	if (r?.aborted) return Promise.resolve({ action: "cancel" });
	let o = (e) => je(e, i);
	return new Promise((i) => {
		let s = !1, c = URL.createObjectURL(e), l = new Image(), u = {
			width: 0,
			height: 0
		}, d = a, f = new Jt({
			marks: [],
			crop: null
		}), p = null, m = null, h = null, g = 1, _ = /* @__PURE__ */ new Map(), v = `cm-editor-${Math.random().toString(36).slice(2)}`, y = Y("svg", {
			class: "cm-canvas",
			tabindex: 0,
			role: "group",
			"aria-label": t.drawing
		}), ee = J("p", {
			class: "cm-sr",
			role: "status"
		}), b = Yt.map((e) => J("button", {
			type: "button",
			class: "cm-tool",
			part: `tool-${e.tool}`,
			title: `${t[e.label]} · ${e.key.toUpperCase()}`,
			"aria-keyshortcuts": e.key.toUpperCase(),
			onclick: () => B(e.tool)
		}, o(e.icon), J("span", { class: "cm-tool-label" }, t[e.label]))), x = Ne() ? "⌘" : `${t.controlKey}+`, S = ne("undo", t.undo, `${x}Z`, () => V("undo")), C = ne("redo", t.redo, `${x}⇧Z`, () => V("redo")), te = ne("trash", t.deleteMark, t.deleteKey, () => H()), w = J("button", {
			type: "button",
			class: "cm-button cm-primary",
			part: "done",
			onclick: () => void W()
		}, t.done), T = J("dialog", {
			class: "cm-editor",
			"aria-labelledby": v
		}, J("div", { class: "cm-editor-bar" }, J("h2", {
			id: v,
			class: "cm-sr"
		}, t.drawTitle), J("div", {
			class: "cm-tools",
			role: "toolbar",
			"aria-label": t.drawTitle
		}, ...b), J("div", { class: "cm-tools" }, S, C, te)), J("div", { class: "cm-stage" }, y), J("p", { class: "cm-editor-help" }, t.drawHelp), ee, J("div", { class: "cm-editor-footer" }, J("button", {
			type: "button",
			class: "cm-button cm-quiet",
			part: "editor-remove",
			onclick: () => G({ action: "remove" })
		}, o("trash"), t.removeImage), J("span", { class: "cm-spacer" }), J("button", {
			type: "button",
			class: "cm-button",
			part: "editor-cancel",
			onclick: () => G({ action: "cancel" })
		}, t.cancel), w));
		function ne(e, t, n, r) {
			return J("button", {
				type: "button",
				class: "cm-tool",
				part: e === "trash" ? "delete-mark" : e,
				title: `${t} · ${n}`,
				"aria-label": t,
				onclick: r
			}, o(e));
		}
		function E() {
			let e = y.getBoundingClientRect().width;
			return e ? Math.max(1, u.width / e) : 1;
		}
		let re = () => Math.min(u.width, u.height), O = () => Math.round(Math.max(3, 3 * E(), re() / 250)), k = () => Math.round(Math.max(16, 16 * E(), re() * .035)), A = () => Math.max(O() * 2, 10 * E()), j = document.createElement("canvas").getContext("2d");
		function M(e) {
			return j ? (j.font = `600 ${k()}px system-ui, sans-serif`, j.measureText(e).width) : e.length * k() * .6;
		}
		function N(e) {
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
		let P = () => f.scene, F = () => P().marks.find((e) => e.id === p) ?? null;
		function I(e) {
			f.commit(e), z();
		}
		function L(e) {
			return {
				...P(),
				marks: P().marks.map((t) => t.id === e.id ? e : t)
			};
		}
		function ie(e) {
			let t = document.createElement("canvas");
			t.width = Math.max(1, Math.round(e.w)), t.height = Math.max(1, Math.round(e.h));
			let n = Math.max(8, Math.round(u.width / 80)), r = document.createElement("canvas");
			r.width = Math.max(1, Math.ceil(e.w / n)), r.height = Math.max(1, Math.ceil(e.h / n));
			let i = r.getContext("2d"), a = t.getContext("2d");
			return !i || !a ? null : (i.drawImage(l, e.x, e.y, e.w, e.h, 0, 0, r.width, r.height), a.imageSmoothingEnabled = !1, a.drawImage(r, 0, 0, t.width, t.height), t);
		}
		function ae(e) {
			let t = `${e.x},${e.y},${e.w},${e.h}`, n = _.get(e.id);
			if (n?.key === t) return n.url;
			let r = ie(e)?.toDataURL() ?? "";
			return _.set(e.id, {
				key: t,
				url: r
			}), r;
		}
		function oe(e, n) {
			let r = {
				arrow: t.arrow,
				box: t.box,
				blur: t.blur,
				text: t.text
			}[e.kind], i = K(t.markLabel, {
				kind: r,
				number: n + 1
			});
			return e.kind === "text" ? `${i}: ${e.text}` : i;
		}
		function R(e, t = !1) {
			let n = O();
			if (e.kind === "blur") {
				let r = t ? "" : ae(e);
				return r ? Y("image", {
					href: r,
					x: e.x,
					y: e.y,
					width: e.w,
					height: e.h,
					preserveAspectRatio: "none"
				}) : Y("rect", {
					x: e.x,
					y: e.y,
					width: e.w,
					height: e.h,
					fill: "rgba(0,0,0,0.25)",
					stroke: D,
					"stroke-width": n / 2,
					"stroke-dasharray": "6 4"
				});
			}
			if (e.kind === "box") return Y("rect", {
				x: e.x,
				y: e.y,
				width: e.w,
				height: e.h,
				fill: "none",
				stroke: D,
				"stroke-width": n,
				"stroke-linejoin": "round"
			});
			if (e.kind === "arrow") {
				let t = qt(e, n);
				return Y("g", {}, Y("line", {
					x1: e.x1,
					y1: e.y1,
					x2: (t[1][0] + t[2][0]) / 2,
					y2: (t[1][1] + t[2][1]) / 2,
					stroke: D,
					"stroke-width": n,
					"stroke-linecap": "round"
				}), Y("polygon", {
					points: t.map((e) => e.join(",")).join(" "),
					fill: D
				}));
			}
			let r = k();
			return Y("text", {
				x: e.x,
				y: e.y,
				"dominant-baseline": "hanging",
				"font-size": r,
				"font-weight": 600,
				fill: D,
				stroke: "white",
				"stroke-width": r / 4,
				"paint-order": "stroke",
				"font-family": "system-ui, sans-serif"
			}, e.text);
		}
		function z() {
			let e = y.getRootNode().activeElement?.closest?.("[data-mark]");
			if (y.replaceChildren(), !u.width) return;
			y.setAttribute("viewBox", `0 0 ${u.width} ${u.height}`), y.style.aspectRatio = `${u.width} / ${u.height}`, y.dataset.tool = d, y.append(Y("image", {
				href: c,
				width: u.width,
				height: u.height
			})), P().marks.forEach((e, t) => {
				if (h?.id === e.id) return;
				let n = Y("g", {
					"data-mark": e.id,
					tabindex: 0,
					role: "button",
					"aria-label": oe(e, t),
					"aria-pressed": e.id === p ? "true" : "false",
					class: "cm-mark"
				}, R(e));
				n.addEventListener("focus", () => {
					p !== e.id && (p = e.id, z());
				}), y.append(n);
			});
			let n = m?.kind === "draw" ? m.draft : null;
			n && n.kind !== "crop" && y.append(R(n, !0));
			let r = P().crop;
			if (r) {
				let { width: e, height: t } = u;
				y.append(Y("path", {
					d: `M0 0H${e}V${t}H0Z M${r.x} ${r.y}V${r.y + r.h}H${r.x + r.w}V${r.y}Z`,
					fill: "rgba(0,0,0,0.55)",
					"fill-rule": "evenodd",
					"pointer-events": "none"
				}));
			}
			n?.kind === "crop" && y.append(Y("rect", {
				x: n.x,
				y: n.y,
				width: n.w,
				height: n.h,
				fill: "none",
				stroke: "white",
				"stroke-width": O() / 2,
				"stroke-dasharray": "8 6"
			}));
			let i = F();
			if (i) {
				let e = $(i, M, k()), t = O() * 2, n = E() * 1.5;
				i.kind !== "arrow" && y.append(Y("rect", {
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
				for (let e of Vt(i)) y.append(Y("circle", {
					class: "cm-handle",
					cx: e.x,
					cy: e.y,
					r: E() * 6,
					"stroke-width": n,
					"pointer-events": "none"
				}));
			}
			if (h) {
				let e = J("input", {
					class: "cm-words",
					"aria-label": t.wordsOnImage,
					value: h.text,
					style: `font-size:${k()}px;color:${D};caret-color:${D}`
				});
				e.addEventListener("input", () => h && (h.text = e.value)), e.addEventListener("keydown", (e) => {
					e.key === "Enter" ? (e.preventDefault(), U()) : e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), U()), e.stopPropagation();
				}), e.addEventListener("pointerdown", (e) => e.stopPropagation());
				let n = Y("foreignObject", {
					x: h.x,
					y: h.y - k() * .15,
					width: Math.max(1, u.width - h.x),
					height: k() * 1.6
				});
				n.append(e), y.append(n), queueMicrotask(() => e.focus({ preventScroll: !0 }));
			} else e && y.querySelector(`[data-mark="${p}"]`)?.focus({ preventScroll: !0 });
			b.forEach((e, t) => e.setAttribute("aria-pressed", String(Yt[t].tool === d))), S.disabled = !f.canUndo, C.disabled = !f.canRedo, te.disabled = !i;
		}
		function B(e) {
			U(), d = e, p = null, z();
		}
		function V(e) {
			U(), f[e](), F() || (p = null), z();
		}
		function H() {
			let e = F();
			e && (p = null, I({
				...P(),
				marks: P().marks.filter((t) => t.id !== e.id)
			}), ee.textContent = `${t.deleteMark}: ${oe(e, 0).replace(/ 1(:|$)/, "$1")}`);
		}
		function U() {
			let e = h;
			if (!e) return;
			h = null;
			let t = e.text.trim();
			if (e.id !== void 0) {
				let n = P().marks.find((t) => t.id === e.id);
				n?.kind === "text" && t && t !== n.text ? I(L({
					...n,
					text: t
				})) : n && !t ? (p = null, I({
					...P(),
					marks: P().marks.filter((t) => t.id !== e.id)
				})) : z();
				return;
			}
			if (!t) return z();
			let n = {
				id: g++,
				kind: "text",
				x: e.x,
				y: e.y,
				text: t
			};
			p = n.id, I({
				...P(),
				marks: [...P().marks, n]
			});
		}
		function se(e) {
			if (!u.width || e.button > 0) return;
			if (e.preventDefault(), h) {
				U();
				return;
			}
			let t = N(e), n = F(), r = n && Ht(n, t, A() * 1.2);
			if (n && r) m = {
				kind: "handle",
				handle: r,
				original: n
			};
			else {
				let e = d === "crop" ? null : Bt(P().marks, t, A(), M, k());
				if (e) p = e.id, m = {
					kind: "move",
					start: t,
					original: e,
					box: $(e, M, k()),
					moved: !1
				};
				else if (p !== null) {
					p = null, z();
					return;
				} else if (d === "text") {
					h = {
						x: t.x,
						y: t.y,
						text: ""
					}, z();
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
			y.setPointerCapture?.(e.pointerId), z();
		}
		function ce(e) {
			if (!m) {
				let t = N(e), n = F(), r = n && Ht(n, t, A() * 1.2) && "handle" || d !== "crop" && Bt(P().marks, t, A(), M, k()) && "mark" || "";
				y.dataset.over = r;
				return;
			}
			let t = N(e);
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
				let e = Wt(m.original, t.x - m.start.x, t.y - m.start.y, u, m.box);
				m.moved = !0, f.scene = L(e);
			} else f.scene = L(Gt(m.original, m.handle, t));
			z();
		}
		function le() {
			let e = m;
			if (m = null, !e) return;
			if (e.kind === "draw") {
				let t = e.draft;
				if (Kt(t, O() * 3)) return z();
				if (t.kind === "crop") {
					I({
						...P(),
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
				p = n.id, I({
					...P(),
					marks: [...P().marks, n]
				});
				return;
			}
			let t = P(), n = {
				...t,
				marks: t.marks.map((t) => t.id === e.original.id ? e.original : t)
			};
			f.scene = n;
			let r = t.marks.find((t) => t.id === e.original.id);
			r && JSON.stringify(r) !== JSON.stringify(e.original) ? Kt(r, O()) ? z() : I(t) : z();
		}
		function ue(e) {
			let t = N(e), n = Bt(P().marks, t, A(), M, k());
			n?.kind === "text" && (p = n.id, h = {
				x: n.x,
				y: n.y,
				text: n.text,
				id: n.id
			}, z());
		}
		function de(e) {
			if (h) return;
			let t = e.metaKey || e.ctrlKey, n = e.key.toLowerCase();
			if (t && n === "z") {
				e.preventDefault(), V(e.shiftKey ? "redo" : "undo");
				return;
			}
			if (t && n === "y") {
				e.preventDefault(), V("redo");
				return;
			}
			if (t && n === "enter") {
				e.preventDefault(), W();
				return;
			}
			let r = F();
			if (r && (e.key === "Delete" || e.key === "Backspace")) {
				e.preventDefault(), H();
				return;
			}
			if (r && e.key === "Enter" && r.kind === "text") {
				e.preventDefault(), h = {
					x: r.x,
					y: r.y,
					text: r.text,
					id: r.id
				}, z();
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
				let t = (e.shiftKey ? 10 : 1) * E(), [n, a] = i[e.key];
				I(L(Wt(r, n * t, a * t, u, $(r, M, k()))));
				return;
			}
			if (t || e.altKey) return;
			let a = Yt.find((e) => e.key === n);
			a && !(e.target instanceof HTMLInputElement) && (e.preventDefault(), B(a.tool));
		}
		T.addEventListener("cancel", (e) => {
			e.preventDefault(), h ? U() : p === null ? f.canUndo || G({ action: "cancel" }) : (p = null, z());
		}), T.addEventListener("keydown", de), y.addEventListener("pointerdown", se), y.addEventListener("pointermove", ce), y.addEventListener("pointerup", le), y.addEventListener("pointercancel", () => {
			m = null, z();
		}), y.addEventListener("dblclick", ue);
		async function W() {
			if (U(), !u.width) return;
			w.disabled = !0;
			let t = P().crop ?? {
				x: 0,
				y: 0,
				w: u.width,
				h: u.height
			}, n = document.createElement("canvas");
			n.width = Math.round(t.w), n.height = Math.round(t.h);
			let r = n.getContext("2d");
			if (!r) return G({ action: "cancel" });
			r.translate(-t.x, -t.y), r.drawImage(l, 0, 0);
			for (let e of P().marks) fe(r, e);
			let i = await new Promise((e) => n.toBlob(e, "image/png"));
			w.disabled = !1, i && G({
				action: "done",
				file: new File([i], e.name.replace(/\.\w+$/, ".png"), { type: "image/png" })
			});
		}
		function fe(e, t) {
			if (e.strokeStyle = D, e.fillStyle = D, e.lineWidth = O(), e.lineCap = "round", e.lineJoin = "round", t.kind === "blur") {
				let n = ie(t);
				n && e.drawImage(n, t.x, t.y);
			} else if (t.kind === "box") e.strokeRect(t.x, t.y, t.w, t.h);
			else if (t.kind === "arrow") {
				let n = qt(t, O());
				e.beginPath(), e.moveTo(t.x1, t.y1), e.lineTo((n[1][0] + n[2][0]) / 2, (n[1][1] + n[2][1]) / 2), e.stroke(), e.beginPath(), n.forEach(([t, n], r) => r ? e.lineTo(t, n) : e.moveTo(t, n)), e.closePath(), e.fill();
			} else e.font = `600 ${k()}px system-ui, sans-serif`, e.textBaseline = "top", e.lineWidth = k() / 4, e.strokeStyle = "white", e.strokeText(t.text, t.x, t.y), e.fillText(t.text, t.x, t.y);
		}
		function G(e) {
			s || (s = !0, r?.removeEventListener("abort", pe), l.onload = null, l.onerror = null, T.open && T.close(), T.remove(), URL.revokeObjectURL(c), _.forEach((e) => URL.revokeObjectURL(e.url)), _.clear(), i(e));
		}
		let pe = () => G({ action: "cancel" });
		r?.addEventListener("abort", pe, { once: !0 }), n.appendChild(T), typeof T.showModal == "function" ? T.showModal() : T.setAttribute("open", ""), l.onload = () => {
			u = {
				width: l.naturalWidth,
				height: l.naturalHeight
			}, z();
		}, l.onerror = () => G({ action: "cancel" }), l.src = c, z(), y.focus({ preventScroll: !0 });
	});
}
//#endregion
//#region src/window.ts
var Zt = [
	"image/png",
	"image/jpeg",
	"image/webp"
], Qt = class {
	root;
	host;
	panel;
	body = "";
	nameField;
	kind;
	queue;
	nextId = 1;
	uploadPercent = null;
	uploadProgress = J("progress", {
		max: 100,
		hidden: !0,
		part: "upload-progress"
	});
	sending = !1;
	capturing = !1;
	percent = 0;
	progressLine = J("p", {
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
	title = J("h2", { class: "cm-title" });
	quote = J("blockquote", { class: "cm-quote" });
	widerButton;
	narrowerButton;
	kindRow;
	field;
	list = J("ul", { class: "cm-images" });
	screenshotButton;
	pickButton = null;
	suspended = !1;
	addButton;
	note = J("p", { class: "cm-small cm-warning" });
	coveredLine = J("p", {
		class: "cm-small cm-covered",
		part: "covered"
	});
	problemLine = J("p", {
		class: "cm-small cm-error",
		role: "alert"
	});
	errorLine = J("p", {
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
		this.queue = new Rt({
			autoProceed: !1,
			onBeforeFileAdded: (e) => ({
				...e,
				id: `${e.id}-${this.nextId++}`
			}),
			restrictions: {
				maxNumberOfFiles: t.maxImages,
				maxFileSize: t.maxImageBytes,
				allowedFileTypes: Zt
			}
		}), this.kind = t.kinds[0]?.value ?? null, this.nameField = J("input", {
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
		let r = J("div", {
			class: "cm-handle-bar",
			tabindex: 0,
			role: "group",
			"aria-label": n.moveWindow
		}, this.icon("grip"));
		this.kindRow = J("div", {
			class: "cm-kinds",
			role: "radiogroup",
			"aria-label": n.kindLabel
		}), this.field = J("textarea", {
			class: "cm-field",
			part: "body-field",
			rows: 3,
			maxlength: 5e3,
			"aria-labelledby": this.titleId
		}), this.field.addEventListener("input", () => {
			this.body = this.field.value, this.fit(), this.refresh();
		}), this.field.addEventListener("keydown", (e) => {
			e.key === "Enter" && (e.metaKey || e.ctrlKey) && (e.preventDefault(), this.submit());
		}), this.screenshotButton = J("button", {
			type: "button",
			class: "cm-button",
			part: "screenshot",
			onclick: () => void this.screenshot()
		}, this.icon("camera"), J("span", {}, n.screenshot)), this.addButton = J("button", {
			type: "button",
			class: "cm-button",
			part: "add-images",
			onclick: () => this.chooser.click()
		}, this.icon("image"), J("span", {}, n.addImages)), this.chooser = J("input", {
			type: "file",
			multiple: !0,
			accept: Zt.join(","),
			hidden: !0,
			tabindex: -1
		}), this.chooser.addEventListener("change", () => {
			[...this.chooser.files ?? []].forEach((e) => this.add(e)), this.chooser.value = "";
		});
		let i = Ne() ? "⌘↵" : n.sendShortcut;
		this.sendButton = J("button", {
			type: "button",
			class: "cm-button cm-primary",
			part: "send",
			"aria-keyshortcuts": Ne() ? "Meta+Enter" : "Control+Enter"
		}, this.icon("send"), J("span", {}, n.send), Pe() ? J("kbd", { class: "cm-kbd" }, i) : null), this.footer = J("div", { class: "cm-footer" }, t.finePrint ? J("p", { class: "cm-small cm-fine" }, t.finePrint) : J("span", { class: "cm-spacer" }), J("button", {
			type: "button",
			class: "cm-button cm-quiet",
			part: "cancel",
			onclick: () => this.requestClose()
		}, n.cancel), this.sendButton), this.confirm = J("div", {
			class: "cm-confirm",
			role: "alertdialog",
			"aria-label": n.discardTitle,
			hidden: !0
		}, J("p", { class: "cm-confirm-text" }, n.discardTitle), J("button", {
			type: "button",
			class: "cm-button",
			part: "keep-editing",
			onclick: () => this.keepEditing()
		}, n.keepEditing), J("button", {
			type: "button",
			class: "cm-button cm-danger",
			part: "discard",
			onclick: () => this.close()
		}, n.discard)), this.pickButton = t.pick ? J("button", {
			type: "button",
			class: "cm-button",
			part: "point",
			onclick: () => t.pick?.()
		}, this.icon("pen"), t.pickLabel) : null;
		let a = J("div", { class: "cm-form" }, this.pickButton, this.quote, this.kindRow, this.field, t.name === "off" ? null : J("label", { class: "cm-small" }, t.name === "optional" ? n.nameOptional : n.nameLabel, this.nameField), this.errorLine, this.list, this.coveredLine, J("div", { class: "cm-picture-actions" }, this.screenshotButton, this.addButton), Pe() ? J("p", { class: "cm-small" }, n.dropHint) : null, this.note, this.problemLine, this.progressLine, this.uploadProgress, this.chooser);
		this.sendButton.addEventListener("click", () => void this.submit()), this.title.id = this.titleId, this.panel = J("section", {
			class: "cm-window",
			role: "dialog",
			"aria-modal": "false",
			"aria-labelledby": this.titleId,
			popover: "manual",
			hidden: !0
		}, J("header", { class: "cm-header" }, r, this.title, this.widerButton, this.narrowerButton, this.toolButton("close", n.close, n.close, () => this.requestClose())), J("div", { class: "cm-scroll" }, a), this.footer, this.confirm), this.dropZone = J("div", {
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
		return je(e, this.host.icons);
	}
	toolButton(e, t, n, r) {
		let i = J("button", {
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
		this.opening++, this.openingDialogs = new Set(this.visibleDialogs()), this.via = e.via, this.title.textContent = e.via === "pick" && e.name ? e.name : t.title, this.selectedText = e.selectedText ?? "", this.quote.textContent = this.selectedText || e.pickedText || "", this.quote.hidden = !this.quote.textContent, this.quote.setAttribute("aria-label", this.selectedText ? t.selection : t.elementImageName), this.error = null, this.problem = null, this.confirming = !1, this.panel.hidden = !1, Me(this.panel), this.cleanups.forEach((e) => e()), this.cleanups = [], this.listen(), this.refresh(), this.place(), this.fit();
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
			let r = e.value === this.kind, i = J("button", {
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
		this.note.textContent = a ?? "", this.note.hidden = !a;
		let o = i ? this.host.covered() : null, s = o ? o.wholePage ? e.coveredPage : o.count === 1 ? e.coveredOne : o.count > 1 ? K(e.coveredMany, { number: o.count }) : "" : "";
		if (this.coveredLine.textContent = s, this.coveredLine.hidden = !s, this.problemLine.textContent = this.problem ?? "", this.problemLine.hidden = !this.problem, this.errorLine.textContent = this.error ?? "", this.errorLine.hidden = !this.error, this.nameField.disabled = this.sending, this.sendButton.disabled = !this.body.trim() || this.host.name === "required" && !this.nameField.value.trim() || this.sending || this.capturing, this.sendButton.querySelector("span").textContent = this.sending ? e.sending : e.send, this.sendButton.setAttribute("aria-busy", String(this.sending)), this.uploadProgress.hidden = !this.sending, this.uploadProgress.setAttribute("aria-label", e.sending), this.uploadPercent === null ? this.uploadProgress.removeAttribute("value") : this.uploadProgress.value = this.uploadPercent, this.sending) {
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
		return J("li", { class: "cm-image" }, J("button", {
			type: "button",
			class: "cm-thumb",
			tabindex: -1,
			"aria-hidden": "true",
			onclick: r
		}, J("img", {
			src: e.url,
			alt: ""
		})), J("span", { class: "cm-image-name" }, n), this.host.drawing ? J("button", {
			type: "button",
			class: "cm-button cm-quiet",
			part: "draw",
			"aria-label": K(t.drawOn, { name: n }),
			disabled: this.sending,
			onclick: r
		}, this.icon("pen"), J("span", {}, t.draw)) : null, this.host.drawing ? J("button", {
			type: "button",
			class: "cm-button cm-quiet",
			part: "blur-more",
			"aria-label": K(t.blurMoreOn, { name: n }),
			disabled: this.sending,
			onclick: () => void this.draw(e, "blur")
		}, this.icon("blur"), J("span", {}, t.blurMore)) : null, J("button", {
			type: "button",
			class: "cm-icon-button",
			part: "remove-image",
			"aria-label": K(t.removeNamed, { name: n }),
			title: K(t.removeNamed, { name: n }),
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
		this.problem = t ? K(n.tooMany, { max: r }) : K(n.wrongImage, {
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
	async draw(e, t = "arrow") {
		if (!this.host.drawing || this.panel.hidden || !this.acceptsFiles()) return;
		let n = this.opening;
		this.drawing = !0;
		let r = new AbortController();
		this.editorController = r;
		let i = await Xt(e.file, this.host.strings, this.root, r.signal, this.host.icons, t);
		if (n !== this.opening || !this.isOpen) return;
		this.editorController = null, this.drawing = !1, i.action === "done" ? this.replace(e, i.file, !0) : i.action === "remove" && this.remove(e.id), this.refresh();
		let a = this.pictures.findIndex((t) => t.id === e.id);
		(a >= 0 ? this.list.children[a]?.querySelector(".cm-button") : this.addButton)?.focus();
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
		let t = this.pictures.find((e) => e.taken === "page"), n = this.pictures.filter((e) => e.id !== t?.id).map((e) => e.taken === "element" ? $t(e.file, "element.png") : e.file), r = { onProgress: (t) => {
			e === this.opening && !this.panel.hidden && this.sending && Number.isFinite(t) && (this.uploadPercent = Math.round(Math.max(0, Math.min(100, t))), this.queue.setState({ totalProgress: this.uploadPercent }), this.refresh());
		} }, i;
		try {
			i = await this.host.send({
				body: this.body.trim(),
				name: this.host.name === "off" ? null : this.nameField.value.trim() || null,
				kind: this.kind,
				screenshot: t ? $t(t.file, "page.png") : null,
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
			this.dropZone.hidden = !e, e ? Me(this.dropZone) : X(this.dropZone);
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
function $t(e, t) {
	return e.name === t ? e : new File([e], t, { type: e.type });
}
//#endregion
//#region src/element.ts
var en = "[data-luh]:not([data-luh=\"blur\"]):not([data-luh=\"hide\"])", tn = "luh-surface";
function nn() {
	customElements.get(tn) || customElements.define(tn, class extends HTMLElement {});
	let e = document.createElement(tn);
	return e.setAttribute("data-luh", "window"), e;
}
var rn = class extends HTMLElement {
	static observedAttributes = [
		"submit-url",
		"key",
		"app-version",
		"ignore"
	];
	settings = {};
	strings = G;
	picker;
	window;
	windowHost = nn();
	announcer = J("p", {
		class: "cm-sr",
		role: "status"
	});
	toast = J("p", {
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
	covered = null;
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
			return m(this.privacy.pages) === "off" ? !1 : typeof this.settings.allowed == "function" ? this.settings.allowed() : this.settings.allowed !== !1;
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
		return this.picking && !t && this.resume(), t || (this.active = !1), this.window?.pickButton && (this.window.pickButton.hidden = !t || !this.settings.pickLabel), this.applyTheme(), this.strings = me(this.settings.language ?? document.documentElement.lang ?? "en", this.settings.languages, this.settings.strings), this.ready && this.isOpen ? this.stale = !0 : this.ready && this.build(), this;
	}
	get privacy() {
		return f(this.settings);
	}
	describe(e) {
		let t = this.privacy, n = _(e, {
			...t,
			maskInputs: !1
		}), r = e.matches("input, textarea, select"), i = m(t.pages) || n ? "" : r ? void 0 : ne(e, t);
		return ye(e, this.strings, i);
	}
	get options() {
		return this.settings;
	}
	get ignore() {
		return [en, this.settings.ignore ?? this.getAttribute("ignore")].filter(Boolean).join(", ");
	}
	connectedCallback() {
		if (!this.ready) {
			if (this.ready = !0, this.setAttribute("data-luh", ""), !document.getElementById("luh-page-style")) {
				let e = J("style", { id: "luh-page-style" });
				e.textContent = ze, document.head.append(e);
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
		e.replaceChildren(J("style", {}, Re), this.announcer, this.toast);
		let t = this.windowHost.shadowRoot ?? this.windowHost.attachShadow({ mode: "open" });
		return t.replaceChildren(J("style", {}, Re)), {
			root: e,
			windowRoot: t
		};
	}
	build() {
		this.stale = !1, this.window?.dispose();
		let e = this.picker?.active ?? !1;
		this.picker && (this.picker.active = !1);
		let { root: t, windowRoot: n } = this.shadow();
		this.picker = new Ie(t, {
			strings: this.strings,
			ignore: this.ignore,
			paused: () => this.isOpen && !this.picking || this.capturing,
			pick: (e, t) => this.open({
				element: e,
				selectedText: t
			})
		});
		let r = this.settings.language ?? document.documentElement.lang ?? "en";
		n.host.setAttribute("lang", r), this.setAttribute("lang", r), this.settings.trigger && t.append(J("button", {
			type: "button",
			class: "cm-button cm-trigger",
			onclick: (e) => this.open({ from: e })
		}, je("pen", this.settings.icons), this.strings.trigger)), this.window = new Qt(n, {
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
			covered: () => this.covered,
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
		let i = e.element ?? null, a = xe(i ?? n, this.ignore);
		(a ?? document.body).append(this.windowHost), this.lineage = [];
		for (let e = i; e && e !== document.body; e = e.parentElement) this.lineage.push({
			element: e,
			bounds: e.getBoundingClientRect()
		});
		this.step = 0, this.shot = null, this.via = i ? "pick" : "write";
		let o = e.selectedText && !y(this.privacy) && !(i && m(this.privacy.pages)) && !(i && _(i, this.privacy)) ? e.selectedText : "", s = this.picking && this.context ? { ...this.context } : Se({
			appVersion: this.settings.appVersion ?? this.getAttribute("app-version") ?? void 0,
			extra: this.settings.context?.() ?? {},
			dialog: a
		});
		delete s.selectedText, this.picking || (s.title = E(s.title, this.privacy, (e) => !!e.closest(this.ignore))), this.context = {
			...s,
			...i ? { element: this.describe(i) } : {},
			...o ? { selectedText: o } : {}
		}, this.picking && (this.picking = !1, this.active = this.pickWasActive), this.window.open({
			via: this.via,
			name: i ? this.context.element?.name : void 0,
			selectedText: o || void 0,
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
		this.picking && (this.picking = !1, this.active = this.isConnected && this.pickWasActive), this.watcher?.disconnect(), this.watcher = null, this.picker.pin(null), this.lineage = [], this.shot = null, this.covered = null, this.context = null, document.body.append(this.windowHost);
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
			element: this.describe(t)
		}, this.picker.pin(t), this.context.element.name);
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
			let r = await O(this.ignore, this.privacy, (e) => this.window.captureProgress(e));
			return !r || this.context !== t || e !== this.captureSequence ? {
				page: null,
				element: null
			} : (this.shot = {
				raw: r.blob,
				viewport: n
			}, this.covered = {
				count: r.redacted,
				wholePage: r.wholePage
			}, await this.marked());
		} finally {
			e === this.captureSequence && (this.capturing = !1, this.changed());
		}
	}
	remark() {
		return this.shot ? this.marked() : Promise.resolve(null);
	}
	async marked() {
		let { raw: e, viewport: t } = this.shot, n = this.lineage[this.step]?.bounds, [r, i] = n ? await Promise.all([N(e, n, t), M(e, n, t)]) : [e, null], a = (e, t) => e ? new File([e], t, { type: "image/png" }) : null;
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
		}, r = this.settings.onSubmit ? await this.settings.onSubmit(n, t) : await an(this.settings.submitUrl ?? this.getAttribute("submit-url"), n, this.strings);
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
		if (t && n && typeof t == "string" && e.key.toLowerCase() === t.toLowerCase() && !Le(e.composedPath()[0] ?? e.target)) e.preventDefault(), this.toggle();
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
		window.clearTimeout(this.toastTimer), this.toast.textContent = e, this.toast.hidden = !1, Me(this.toast), this.toastTimer = window.setTimeout(() => {
			this.toast.hidden = !0, X(this.toast);
		}, 3e3);
	}
};
async function an(e, t, n) {
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
var on = "luh-notes";
function sn(e = on) {
	return customElements.get(e) || customElements.define(e, class extends rn {}), customElements.get(e);
}
function cn(e = {}) {
	sn();
	let t = document.createElement(on);
	return t.configure(e), document.body.append(t), t;
}
function ln(e, t = {}) {
	return ve(e, {
		...G,
		...t
	});
}
//#endregion
export { rn as a, we as c, K as d, me as f, l as h, ln as i, pe as l, m, cn as n, en as o, D as p, sn as r, tn as s, on as t, G as u };

//# sourceMappingURL=src-ClhMjK16.js.map