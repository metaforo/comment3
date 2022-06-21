// import { isMobile } from "is-mobile";
// import i18n from "@vue-i18n";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

export const DEFAULT_GROUP_ICON_PATH = "/img/default_group_icon.png";
export const DEFAULT_AVATAR_PATH = "/img/default_avatar_{i}.png";
export const DEFAULT_AVATAR_TOTAL = 24;
export const NAV_BAR_HEIGHT: number = 56;
export const LOGO_SIZE: number = 36;
export const LOGO_BORDER_RADIUS: number = 8;
export const USERNAME_MIN_LENGTH = 3;
export const USRENAME_MAX_LENGTH = 32;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 32;
export const MAX_AVATAR_SIZE = 5; // MB
export const SORT_BY: string[] = [
	'new',
	'hot',
	'like',
	// 	i18n.tc("new"),
	// 	i18n.tc("hot"),
	// 	i18n.tc("like"),
];
export const SORT_BY_GROUP: string[] = [
	// i18n.tc("all"),
	// i18n.tc("relevant"),
	// i18n.tc("participated"),
	// i18n.tc("hot"),
	"all",
	"relevant",
	"participated",
	"hot",
];
export const SORT_BY_SUBSCRIBE: string[] = [
	'all',
	'relevant',
	'participated',
	'subscribed',
	'hot',
	// 	i18n.tc("all"),
	// 	i18n.tc("relevant"),
	// 	i18n.tc("participated"),
	// 	i18n.tc("subscribed"),
	// 	i18n.tc("hot"),
];
export const SORT_BY_THREAD: string[] = [
	'all',
	'relevant',
	'hot',
	// 	i18n.tc("all"),
	// 	i18n.tc("relevant"),
	// 	i18n.tc("hot"),
];
export const SORT_BY_MEMBER_ADMIN: string[] = [
	"all",
	"banned",
	"active",
	"online",
	"pending",
	// 	i18n.tc("all"),
	// 	i18n.tc("banned"),
	// 	i18n.tc("active"),
	// 	i18n.tc("online"),
	// 	i18n.tc("pending"),
];
export const SORT_BY_MEMBER: string[] = [
	'all',
	'active',
	'online',
	// 	i18n.tc("all"),
	// 	i18n.tc("active"),
	// 	i18n.tc("online"),
];

export const ALL_POST_ID: number = -2;
export const LOGIN_TYPE_EMAIL: number = 0;
export const LOGIN_TYPE_METAMASK: number = 1;
export const LOGIN_TYPE_WALLET: number = 2;
export const LOGIN_TYPE_PHANTOM: number = 3;
export const CHAIN_TYPE_SOLANA: number = 1;
export const CHAIN_TYPE_ERC20: number = 0;
export const LOGIN_TYPE_LEDGER: number = 4;
export const LOGIN_TYPE_AR: number = 5;
export const LEDGER_KEY: number = 2;
export const AR_KEY: number = 3;
export const WEB3_KEY: number = 0;
export const PHANTOM_KEY: number = 1;
export const SIGN_TYPE_POST: number = 1;
export const SIGN_TYPE_LOGIN: number = 2;
export const SIGN_TYPE_BIND: number = 3;
export const SIGN_TYPE_POLL: number = 4;
export const LABEL_TYPE_ADMIN: number = 1;
export const LABEL_TYPE_EVERONE: number = 0;
export const MODAL_POPUP_HEIGHT_RATIO: number = 0.84;
export const SUPPORTED_IMAGE_TYPE =
	/^image\/(gif|jpe?g|a?png|svg|webp|heic|bmp|vnd\.microsoft\.icon)/i;
export const COMMON_IMAGE_TYPE = /^image\/(gif|jpe?g|a?png|webp|bmp)/i;
export const UNSUPPORTED_ATTACH_FILES_TYPE = [
	".ADE",
	".ADP",
	".BAT",
	".CHM",
	".CMD",
	".COM",
	".CPL",
	".EXE",
	".HTA",
	".INS",
	".ISP",
	".JAR",
	".JS",
	".JSE",
	".LIB",
	".LNK",
	".MDE",
	".MSC",
	".MSI",
	".MSP",
	".MST",
	".NSH",
	".PIF",
	".SCR",
	".SCT",
	".SHB",
	".SYS",
	".VB",
	".VBE",
	".VBS",
	".VXD",
	".WSC",
	".WSF",
	".WSH",
];
export const FLAG_REASON_MAPPING = [
	{ value: 1, text: "flag_post_reason1" },
	{ value: 2, text: "flag_post_reason2" },
	{ value: 3, text: "flag_post_reason3" },
	{ value: 4, text: "flag_post_reason4" },
];
export const CATEGORY_SYMBOL = "";
export const LANGUAGE_LIST = [
	{ value: "en", text: "English (United States)" },
	{ value: "nl_NL", text: "Dutch" },
];

/**
 * whether current url is a custom domain
 * @returns Boolean
 */
export function getCustomType() {
	const indexHref = window.location.href;

	if (indexHref.startsWith("http://localhost")) {
		return false;
	}

	return (
		indexHref.indexOf(import.meta.env.VITE_APP_DOMAIN) == -1 &&
		indexHref.indexOf(import.meta.env.VITE_APP_CUSTOM_DOMAIN) == -1
	);
}

/**
 * return true if in app web view
 */
export function isInApp(): boolean {
	return (
		typeof navigator !== "undefined" &&
		navigator.userAgent.includes("everforo")
	);
}

/**
 * does the device have touch event
 */
export function isTouchDevice(): boolean {
	return (
		!!(
			typeof window !== "undefined" &&
			("ontouchstart" in window ||
				((window as any).DocumentTouch &&
					typeof document !== "undefined" &&
					document instanceof (window as any).DocumentTouch))
		) ||
		!!(
			typeof navigator !== "undefined" &&
			(navigator.maxTouchPoints || navigator.msMaxTouchPoints)
		)
	);
}

/**
 * get the object which has property clientX, clientY
 * @param event
 */
export function getPositionEvent(
	event: MouseEvent | TouchEvent
): Touch | MouseEvent {
	if (event instanceof MouseEvent) {
		return event;
	}

	if (event.changedTouches.length > 0) {
		return event.changedTouches[0];
	} else if (event.targetTouches.length > 0) {
		return event.changedTouches[0];
	}

	return event.touches[0];
}

export const browserSupport = {
	passiveSupported: false,
};

try {
	const options = {
		get passive() {
			// This function will be called when the browser
			//   attempts to access the passive property.
			return (browserSupport.passiveSupported = true);
		},
	} as AddEventListenerOptions;

	const lis = () => {};

	window.addEventListener("scroll", lis, options);
	window.removeEventListener("scroll", lis, options);
} catch (err) {
	browserSupport.passiveSupported = false;
}

/**
 * AddEventListenerOptions
 *
 * capture: indicating that events of this type will be dispatched to the registered listener
 * before being dispatched to any EventTarget beneath it in the DOM tree.
 * Events that are bubbling upward through the tree will not trigger a listener designated to use capture.
 * Event bubbling and capturing are two ways of propagating events which occur in an element
 * that is nested within another element,
 * when both elements have registered a handle for that event.
 * The event propagation mode determines the order in which elements receive the event.
 *
 * once: indicating that the listener should be invoked at most once after being added.
 * If true, the listener would be automatically removed when invoked.
 *
 * passive: if true, indicates that the function specified by listener will never call preventDefault().
 * If a passive listener does call preventDefault(),
 * the user agent will do nothing other than generate a console warning.
 * set it to true can improve scroll listener. for more detail
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * #Improving_scrolling_performance_with_passive_listeners
 */
export function bindEvent(
	target: EventTarget,
	type: string,
	callback: EventListener,
	options: AddEventListenerOptions = {}
): void {
	// detect event model
	// for IE 6 thru 10, it's "attachEvent/detachEvent" and event name has a prefix "on"
	// IE sucks
	// if (window.addEventListener) {
	if (true) {
		target.addEventListener(
			type,
			callback,
			browserSupport.passiveSupported ? options : false
		);
	} else {
		// target.attachEvent('on' + type, callback, browserSupport.passiveSupported ? options : false);
	}
}

export function removeEvent(
	target: EventTarget,
	type: string,
	callback: EventListener,
	options: AddEventListenerOptions = {}
): void {
	// if (window.addEventListener) {
	if (true) {
		target.removeEventListener(
			type,
			callback,
			browserSupport.passiveSupported ? options : false
		);
	} else {
		// target.detachEvent('on' + type, callback, browserSupport.passiveSupported ? options : false);
	}
}

/**
 * width includes scrollbar width
 */
export function windowHeight(): number {
	return window.innerHeight;
}

/**
 * width doesn't includes scrollbar width
 */
export function windowWidth(): number {
	return window.innerWidth;
}

export function documentWidth(): number {
	return document.documentElement.clientWidth;
}

/**
 * random int in a range
 * @param max
 * @param min
 */
export function randomInt(max: number, min: number = 0): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * same as php/python range function
 * @param start
 * @param end
 */
export function arrRange(start: number, end: number): Array<number> {
	return Array.from({ length: end - start }, (v, k) => k + start);
}

/**
 * generator function returns random item in an array
 * @param range
 */
export function* randomNonRepeatInt(range: Array<number>): Iterator<number> {
	let i = range.length;

	while (i--) {
		yield range.splice(randomInt(i), 1)[0];
	}
}

/**
 * map mime type to file extension
 * @param mime
 */
export function mimeToExt(mime: string): string {
	switch (mime) {
		case "image/bmp":
			return ".bmp";
		case "image/gif":
			return ".gif";
		case "image/vnd.microsoft.icon":
			return ".ico";
		case "image/jpeg":
			return ".jpg";
		case "image/png":
			return ".png";
		case "image/svg+xml":
			return ".svg";
		case "image/tiff":
			return ".tif";
		case "image/webp":
			return ".webp";
		default:
			return "";
	}
}

/**
 * convert a vase64 string to file(Blob) object
 * @param image
 */
export function convertBase64ToFile(image: string): Blob | false {
	// first, decode base64
	let byteString = "";
	try {
		byteString = atob(image.split(",")[1]);
	} catch (e) {
		console.error("image data is not a valid base64", image);
		return false;
	}
	const ab = new ArrayBuffer(byteString.length);
	// You cannot directly manipulate the contents of an ArrayBuffer;
	// instead, you create one of the typed array objects or a DataView object
	// which represents the buffer in a specific format,
	// and use that to read and write the contents of the buffer.
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i += 1) {
		// an integer between 0 and 65535 representing the UTF-16 code unit at the given index
		ia[i] = byteString.charCodeAt(i);
	}
	// not using new File, because of compatibility issue
	const newBlob = new Blob([ab], {
		type: "image/jpeg",
	});
	return newBlob;
}

export function thumbToOrigin(src: string): string {
	return src.replace(/_thumb(\.[\w\d]+)/, "$1");
}

/**
 * swap two items in an array, ECMAScript 6 style
 * @param array
 * @param index1
 * @param index2
 */
export function swapArrayItem<T extends any[]>(
	array: T,
	index1: number,
	index2: number
) {
	// const swap = array[index1];
	//
	// array[index1] = array[index2];
	// array[index2] = swap;

	[array[index1], array[index2]] = [array[index2], array[index1]];
}

export function isGroupFollowed(groups: any[], group_id: number): boolean {
	for (let i = 0; i < groups.length; i++) {
		if (group_id == groups[i].id) {
			return true;
		}
	}

	return false;
}

function storageFactory(getStorage: () => Storage): Storage {
	let inMemoryStorage: { [key: string]: string } = {};

	function isSupported() {
		try {
			const testKey = "e";
			getStorage().setItem(testKey, testKey);
			getStorage().removeItem(testKey);
			return true;
		} catch (e) {
			return false;
		}
	}

	function clear(): void {
		if (isSupported()) {
			getStorage().clear();
		} else {
			inMemoryStorage = {};
		}
	}

	function getItem(name: string): string | null {
		if (isSupported()) {
			return getStorage().getItem(name);
		}
		if (inMemoryStorage.hasOwnProperty(name)) {
			return inMemoryStorage[name];
		}
		return null;
	}

	function key(index: number): string | null {
		if (isSupported()) {
			return getStorage().key(index);
		} else {
			return Object.keys(inMemoryStorage)[index] || null;
		}
	}

	function removeItem(name: string): void {
		if (isSupported()) {
			getStorage().removeItem(name);
		} else {
			delete inMemoryStorage[name];
		}
	}

	function setItem(name: string, value: string): void {
		if (isSupported()) {
			getStorage().setItem(name, value);
		} else {
			inMemoryStorage[name] = String(value);
		}
	}

	function length(): number {
		if (isSupported()) {
			return getStorage().length;
		} else {
			return Object.keys(inMemoryStorage).length;
		}
	}

	return {
		getItem,
		setItem,
		removeItem,
		clear,
		key,
		get length() {
			return length();
		},
	};
}

export const StorageLocal = storageFactory(() => localStorage);

export async function sleep(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function thousandComma(n: number) {
	const parts = n.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}

/**
 * save to file
 * @param data
 * @param fileName
 */
export function saveData(data: any, fileName: string) {
	const a = document.createElement("a");
	document.body.appendChild(a);

	const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
	const url = window.URL.createObjectURL(blob);

	a.href = url;
	a.download = fileName;
	a.click();
	window.URL.revokeObjectURL(url);
}

export function loadScript(src: string): Promise<any> {
	return new Promise(function (resolve, reject) {
		let shouldAppend = false;
		let el: HTMLScriptElement | null = document.querySelector(
			'script[src="' + src + '"]'
		);
		if (!el) {
			el = document.createElement("script");
			el.type = "text/javascript";
			el.async = true;
			el.src = src;
			shouldAppend = true;
		} else if (el.hasAttribute("data-loaded")) {
			resolve(el);
			return;
		}

		el.addEventListener("error", reject);
		el.addEventListener("abort", reject);
		el.addEventListener("load", function loadScriptHandler() {
			el!.setAttribute("data-loaded", "data-loaded");
			resolve(el);
		});

		if (shouldAppend) document.head.appendChild(el);
	});
}

export function scientificToDecimal(num: string): string {
	const sign = Math.sign(Number(num));
	//if the number is in scientific notation remove it
	if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
		const zero = "0";
		const parts = String(num).toLowerCase().split("e"); //split into coeff and exponent
		const e = Number(parts.pop()); //store the exponential part
		let l = Math.abs(e); //get the number of zeros
		const direction = e / l; // use to determine the zeroes on the left or right
		const coeff_array = parts[0].split(".");

		if (direction === -1) {
			coeff_array[0] = Math.abs(Number(coeff_array[0])) + "";
			num = zero + "." + new Array(l).join(zero) + coeff_array.join("");
		} else {
			const dec = coeff_array[1];
			if (dec) l = l - dec.length;
			num = coeff_array.join("") + new Array(l + 1).join(zero);
		}
	}

	if (sign < 0) {
		num = "-" + num;
	}

	return num;
}

export function parseUnicode(string: string): string {
	const code: number[] = string.split("-").map((str) => parseInt(str, 16));
	return String.fromCodePoint(...code);
}

export function formatBytes(bytes: number, decimals = 2) {
	if (bytes === 0) return "0";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function removeListItemByIndex(arr: any[], index: number) {
	arr.splice(index, 1);

	return arr;
}

export function getFileExtension(filename: string) {
	return "." + filename.split(".").pop();
}

export function convertQuillDeltaToHTML(content: string) {
	try {
		// post content is always a json string of Delta, we need to convert it to html
		// const QuillDeltaToHtmlConverter =
		// 	require("quill-delta-to-html").QuillDeltaToHtmlConverter;

		let converter: any = new QuillDeltaToHtmlConverter(
			JSON.parse(content),
			{}
		);

		// console.log(JSON.parse(content));

		// customOp is your custom blot op
		// contextOp is the block op that wraps this op, if any.
		// If, for example, your custom blot is located inside a list item,
		// then contextOp would provide that op.
		converter.renderCustomWith(function (customOp: any, contextOp: any) {
			if (customOp.insert.type === "emoji") {
				return `<span>${parseUnicode(
					customOp.insert.value.unicode
				)}</span>`;
			} else if (customOp.insert.type === "mention") {
				return `<span><a class="mention_link" data-target="${customOp.insert.value.target}" data-id="${customOp.insert.value.id}" href="javascript:void(0)">${customOp.insert.value.denotationChar}${customOp.insert.value.value}</a></span>`;
			} else {
				return "";
			}
		});
		const html = converter.convert();

		converter = null;

		return html;
	} catch (e) {
		console.log(e);

		return "";
	}
}

export function insertCard(
	content: HTMLDivElement,
	link: string,
	data: { title: string; image: string; description: string }
) {
	let image = data.image ? data.image : "";
	let title = data.title ? data.title : "";
	let description = data.description ? data.description : "";

	if (!image && !title) {
		return;
	}

	if (title.length > 50) {
		title = title.substring(0, 50) + "...";
	}

	if (description.length > 128) {
		description = description.substring(0, 128) + "...";
	}

	if (!content) {
		return;
	}

	const p = content.querySelector("p") as HTMLParagraphElement;

	const a_link = 'href="' + link + '"';

	let ind = p.innerHTML.indexOf(a_link);

	let linkLength = 0;

	if (ind !== -1) {
		let newInd = p.innerHTML.substring(ind).indexOf("</a>");

		if (newInd !== -1) {
			ind = ind + newInd;
			linkLength = 4;
		}
	} else {
		ind = p.innerHTML.indexOf(link);
		if (ind === -1) {
			const link_a = link.replaceAll("&", "&amp;");
			ind = p.innerHTML.indexOf(link_a);
			linkLength = link_a.length;
		}
	}

	if (ind !== -1) {
		let imagePreview = '<div class="img-loading"></div>';
		if (image) {
			if (image.indexOf("discord") != -1) {
				image = "/img/discords.png";
			}
			imagePreview = `<div><img  src="${image}" /></div>`;
		}

		const card = description
			? `<a href="${link}" class="link-preview" target="_blank">${imagePreview}<div><p>${title}</p><p>${description}</p></div></a>`
			: `<a href="${link}" class="link-preview" target="_blank">${imagePreview}<div><p>${title}</p></div></a>`;

		ind = ind + (linkLength ? linkLength : link.length);

		let newHTML =
			p.innerHTML.substring(0, ind) +
			card +
			p.innerHTML.substring(ind, p.innerHTML.length);

		p.innerHTML = newHTML;
	}
}

export function insertCardNew(
	content: HTMLDivElement,
	link: string,
	data: { title: string; image: string; description: string },
	post: any,
	is_post: boolean
) {
	let image = data.image ? data.image : "";
	let title = data.title ? data.title : "";
	let description = data.description ? data.description : "";

	if (!image && !title) {
		return;
	}

	if (title.length > 50) {
		title = title.substring(0, 50) + "...";
	}

	if (description.length > 80) {
		description = description.substring(0, 80) + "...";
	}

	if (!content) {
		return;
	}
	let parent = content.parentElement;
	if (!parent) {
		return;
	}

	let linkPreviewBlock: Element | null =
		parent.getElementsByClassName("link-preview-block")[0];
	if (is_post) {
		linkPreviewBlock = parent.nextElementSibling;
	}
	if (!linkPreviewBlock) {
		return;
	}
	let block = linkPreviewBlock.querySelector(
		"#t-" + post.id + "-" + hashFunc(link, true)
	);

	if (!block) {
		return;
	}
	let imagePreview = '<div class="img-loading"></div>';

	if (image) {
		if (image.indexOf("discord") != -1) {
			image = "/img/discords.png";
		}
		imagePreview = `<div><img src="${image}" onerror="imgError(this)"/></div>`;
	}

	const card = description
		? `<a href="${link}" class="link-preview" target="_blank">${imagePreview}<div><p>${title}</p><p class="desc">${description}</p><p>` +
		  getDomain(link) +
		  `</p></div></a>`
		: `<a href="${link}" class="link-preview" target="_blank">${imagePreview}<div><p>${title}</p><p>` +
		  getDomain(link) +
		  `</p></div></a>`;

	block.innerHTML = card;
}

export function getDomain(url: string) {
	let domain = url.split("/");

	if (domain[2]) {
		return domain[2];
	}
	return url;
}

export function hashFunc(str: string, caseSensitive: boolean) {
	if (!caseSensitive) {
		str = str.toLowerCase();
	}
	// 1315423911=b'1001110011001111100011010100111'
	let hash = 1315423911,
		i,
		ch;
	for (i = str.length - 1; i >= 0; i--) {
		ch = str.charCodeAt(i);
		hash ^= (hash << 5) + ch + (hash >> 2);
	}

	return hash & 0x7fffffff;
}

export function twitterWidget(htmlBox: HTMLDivElement, twitter_link: string) {
	(window as any).twttr = (function (d, s, id) {
		var js,
			fjs = d.getElementsByTagName(s)[0],
			t = (window as any).twttr || {};
		if (d.getElementById(id)) return t;
		js = d.createElement(s) as HTMLScriptElement;
		js.id = id;
		js.src = "https://platform.twitter.com/widgets.js";
		fjs.parentNode!.insertBefore(js, fjs);

		t._e = [];
		t.ready = function (f: any) {
			t._e.push(f);
		};

		return t;
	})(document, "script", "twitter-wjs");

	(window as any).twttr.ready(() => {
		const regex =
			/https?:\/\/twitter\.com\/(?:\#!\/)?(\w+)\/status(es)?\/(\d+)/is;

		const match = twitter_link.match(regex);

		if (match && match[3]) {
			const p = htmlBox.querySelector("p") as HTMLParagraphElement;

			const a_link = 'href="' + twitter_link + '"';

			let ind = p.innerHTML.indexOf(a_link);
			let linkLength = 0;

			if (ind !== -1) {
				let newInd = p.innerHTML.substring(ind).indexOf("</a>");

				if (newInd !== -1) {
					ind = ind + newInd;
					linkLength = 4;
				}
			} else {
				ind = p.innerHTML.indexOf(twitter_link);

				if (ind === -1) {
					const link_a = twitter_link.replaceAll("&", "&amp;");
					ind = p.innerHTML.indexOf(link_a);
					linkLength = link_a.length;
				}
			}

			if (ind !== -1) {
				const card = `<div id='tweet${match[3]}'></div>`;

				ind = ind + (linkLength ? linkLength : twitter_link.length);

				let newHTML =
					p.innerHTML.substring(0, ind) +
					card +
					p.innerHTML.substring(ind, p.innerHTML.length);

				p.innerHTML = newHTML;
			}

			(window as any).twttr.widgets.createTweet(
				match[3],
				document.getElementById(`tweet${match[3]}`),
				{
					theme: "light",
				}
			);
		}
	});
}

export function facebookSDK(htmlBox: HTMLDivElement, fb_link: string) {
	(window as any).fbAsyncInit = function () {
		(window as any).FB.init({
			appId: import.meta.env.VITE_APP_ID,
			autoLogAppEvents: true,
			xfbml: true,
			version: "v9.0",
		});

		const regex =
			/(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/;

		const match = fb_link.match(regex);

		if (match && match[1]) {
			(window as any).FB.api(`/${match[1]}`, function (response: any) {
				if (response && !response.error) {
				}
			});
		}
	};

	(function (d, s, id) {
		var js,
			fjs = d.getElementsByTagName(s)[0],
			t = (window as any).twttr || {};
		if (d.getElementById(id)) return t;
		js = d.createElement(s) as HTMLScriptElement;
		js.id = id;
		js.setAttribute("async", "async");
		js.setAttribute("defer", "defer");
		js.setAttribute("crossorigin", "anonymous");
		js.src = "https://connect.facebook.net/en_US/sdk.js";
		fjs.parentNode!.insertBefore(js, fjs);

		// t._e = [];
		// t.ready = function(f: any) {
		// t._e.push(f);
		// };

		return t;
	})(document, "script", "fb-sdk");
}

export function switchDarkMode(darkmode: boolean) {
	if (darkmode) {
		document.body.style.setProperty("--body-bg", "#1a1d20");
		document.body.style.setProperty("--navbar-bg", "#24272b");
		document.body.style.setProperty("--dropdown-bg", "#191B1D");
		document.body.style.setProperty("--input-bg", "#24272b");
		document.body.style.setProperty("--hover-bg", "#0a0b0c");
		document.body.style.setProperty("--home-bg", "#242526");
		document.body.style.setProperty("--group-bg", "#24272b");
		document.body.style.setProperty("--active-bg", "#232527");
		document.body.style.setProperty("--font-color1", "#DDDADA");
		document.body.style.setProperty("--font-color2", "#8C97AD");
		document.body.style.setProperty("--font-color3", "#DDDADA");
		document.body.style.setProperty("--font-color6", "#8c97ad");
		document.body.style.setProperty("--font-color7", "#FFF");
		document.body.style.setProperty("--hover-font-color1", "#DDDADA");

		document.body.style.setProperty("--desc-color", "#606878");
		document.body.style.setProperty("--not-online-color", "#606878");
		document.body.style.setProperty("--not-online-name-color", "#DDDADA");
		document.body.style.setProperty("--theme-color", "#6F9FFF");
		document.body.style.setProperty("--theme-backgroud-color", "#272F49");
		document.body.style.setProperty("--high-color", "#494f53");
		document.body.style.setProperty("--daiload-color", "#6F9FFF");
		document.body.style.setProperty("--box-shadow-color", "#00000026");
		document.body.style.setProperty("--avatar-shadow-color", "#8c97ad");
		document.body.style.setProperty("--border-color1", "#24272b");
		document.body.style.setProperty("--border-color2", "#24272b");
		document.body.style.setProperty("--border-color3", "#24272b");
		document.body.style.setProperty("--border-color4", "#8c97ad");
		document.body.style.setProperty("--border-color5", "#484D53");
		document.body.style.setProperty("--border-color6", "#484D53");
		document.body.style.setProperty("--border-color7", "#3a3d3f");
		document.body.style.setProperty("--qipao", "#2c2f31");
		document.body.style.setProperty("--category-color", "#dddada");
		document.body.style.setProperty("--btn-disabled-bg", "#24272b");
		document.body.style.setProperty("--btn-disabled", "#8c8c8c");
		document.body.style.setProperty("--btn-disabled-border", "#8c8c8c");
		document.body.style.setProperty("--skeleton-color1", "#24272b");
		document.body.style.setProperty("--skeleton-color2", "#484D53");
		document.body.style.setProperty("--not-online-color", "#606878");
		document.body.style.setProperty("--not-online-name-color", "#DDDADA");
		document.body.style.setProperty("--profile-upper-bg", "#242526");
		document.body.style.setProperty("--search-unactive-bg", "#35383c");
		document.body.style.setProperty("--poll-card-title-bg", "#3a3d3f");
		document.body.style.setProperty("--poll-card-content-bg", "#2c2f31");

		// document.body.style.setProperty('--read-more', '#f8f8f2');
		document.body.style.setProperty("--mark-down-code-block-bg", "#f8f8f2");
		document.body.style.setProperty(
			"--mark-down-code-block-color",
			"#23241f"
		);
	} else {
		document.body.style.setProperty("--poll-card-title-bg", "#F4F6F9");
		document.body.style.setProperty(
			"--poll-card-content-bg",
			"transparent"
		);
		document.body.style.setProperty("--body-bg", "#ffffff");
		document.body.style.setProperty("--navbar-bg", "#ffffff");
		document.body.style.setProperty("--dropdown-bg", "#ffffff");
		document.body.style.setProperty("--input-bg", "#f8f8f8");
		document.body.style.setProperty("--hover-bg", "#fafafe");
		document.body.style.setProperty("--home-bg", "#fafafe");
		document.body.style.setProperty("--group-bg", "#fafafe");
		document.body.style.setProperty("--active-bg", "#EAF3FF");
		document.body.style.setProperty("--font-color1", "#333333");
		document.body.style.setProperty("--font-color2", "#606878");
		document.body.style.setProperty("--font-color3", "#8C97AD");
		document.body.style.setProperty("--font-color6", "#606878");
		document.body.style.setProperty("--font-color7", "#3d72de");
		document.body.style.setProperty("--hover-font-color1", "#fff");

		document.body.style.setProperty("--desc-color", "#8C97AD");
		document.body.style.setProperty("--theme-color", "#3d72de");
		document.body.style.setProperty("--theme-backgroud-color", "#EAF3FF");

		document.body.style.setProperty("--high-color", "#c0d4fa");
		document.body.style.setProperty("--daiload-color", "#f8f8f8");
		document.body.style.setProperty(
			"--box-shadow-color",
			"rgba(100, 100, 100, 0.45)"
		);
		// border separate the main layouts
		document.body.style.setProperty("--border-color1", "#f2f2f2");
		// border separate the contents, for now it's the same as var(--border-color1).
		// but you should use them differently, in case we need to change them in the future
		document.body.style.setProperty("--border-color2", "#dadce0");
		// ant vue design input border color
		document.body.style.setProperty("--border-color3", "#f2f2f2");
		document.body.style.setProperty("--border-color4", "#f2f2f2");
		document.body.style.setProperty("--border-color5", "#dadce0");
		document.body.style.setProperty("--border-color7", "#dfe2e7");
		document.body.style.setProperty("--qipao", "#f1f3f7");
		document.body.style.setProperty("--category-color", "#606878");
		document.body.style.setProperty("--btn-disabled-bg", "#f5f5f5");
		document.body.style.setProperty(
			"--btn-disabled",
			"rgba(0, 0, 0, 0.25)"
		);
		document.body.style.setProperty("--btn-disabled-border", "#f2f2f2");
		document.body.style.setProperty("--skeleton-color1", "#f2f2f2");
		document.body.style.setProperty("--skeleton-color2", "#e6e6e6");
		document.body.style.setProperty("--not-online-color", "#CCCCCC");
		document.body.style.setProperty("--not-online-name-color", "#CCCCCC");
		document.body.style.setProperty("--profile-upper-bg", "#fafafe");
		document.body.style.setProperty("--search-unactive-bg", "#f0f1f4");

		// document.body.style.setProperty('--read-more', '#23241f');
		document.body.style.setProperty("--mark-down-code-block-bg", "#23241f");
		document.body.style.setProperty(
			"--mark-down-code-block-color",
			"#f8f8f2"
		);
	}
}

export function color16() {
	//十六进制颜色随机
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	//var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
	var color =
		"#" +
		(
			Array(6).join("0") +
			(r.toString(16) + g.toString(16) + b.toString(16))
		).slice(-6);
	return color;
}

export function tranTokenNumber(num: string) {
	let fixedTipAmount = parseFloat(num);
	num = fixedTipAmount.toString();
	// 将数字转换为字符串,然后通过split方法用.分隔,取到第0个
	let num_array = num.split(".");
	let numStr = num_array[0];
	let decimalStr = num_array[1] ?? "";
	if (numStr.length <= 6) {
		// 判断数字有多长,如果小于6,表示10万以内的数字,让其直接显示
		var reg =
			numStr.indexOf(".") > -1
				? /(\d)(?=(\d{3})+\.)/g
				: /(\d)(?=(?:\d{3})+$)/g;
		numStr.replace(reg, "$1,");
		if (decimalStr != "") {
			// if(num.length <=7){
			//     return num;
			// }
			// return num.substring(0,7)
			return numStr + "." + decimalStr;
		}
		return numStr;
	} else if (numStr.length > 6 && numStr.length < 10) {
		// 如果数字大于8位,让其数字后面加单位 billion
		let numPart = numStr.substring(0, numStr.length - 6);
		if (numStr.length - 6 <= 4) {
			let decimal = numStr.substring(numStr.length - 6, 4);
			return numPart + "." + decimal + "M";
		} else {
			return numPart + "M";
		}
	} else if (numStr.length >= 10 && numStr.length < 14) {
		// 如果数字大于10位,让其数字后面加单位 billion
		let numPart = numStr.substring(0, numStr.length - 9);
		if (numStr.length - 9 <= 4) {
			let decimal = numStr.substring(numStr.length - 9, 4);
			return numPart + "." + decimal + "B";
		} else {
			return numPart + "B";
		}
	} else {
		let numPart = numStr.substring(0, numStr.length - 12);
		if (numStr.length - 12 <= 4) {
			let decimal = numStr.substring(numStr.length - 12, 4);
			return numPart + "." + decimal + "T";
		} else {
			return numPart + "T";
		}
	}
}

export function UTCDateToLocalDate(dateStr: string) {
	let date1 = new Date();
	let offsetMinute = date1.getTimezoneOffset();
	let offsetHours = offsetMinute / 60;
	let date2 = new Date(dateStr);
	date2.setHours(date2.getHours() - offsetHours);
	return date2;
}
