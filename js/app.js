(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerClose.classList.remove("_spoller-active");
                    _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                }));
            }));
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    function ssr_window_esm_isObject(obj) {
        return null !== obj && "object" === typeof obj && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target = {}, src = {}) {
        Object.keys(src).forEach((key => {
            if ("undefined" === typeof target[key]) target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = "undefined" !== typeof document ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if ("undefined" === typeof setTimeout) {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if ("undefined" === typeof setTimeout) return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = "undefined" !== typeof window ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function makeReactive(obj) {
        const proto = obj.__proto__;
        Object.defineProperty(obj, "__proto__", {
            get() {
                return proto;
            },
            set(value) {
                proto.__proto__ = value;
            }
        });
    }
    class Dom7 extends Array {
        constructor(items) {
            if ("number" === typeof items) super(items); else {
                super(...items || []);
                makeReactive(this);
            }
        }
    }
    function arrayFlat(arr = []) {
        const res = [];
        arr.forEach((el => {
            if (Array.isArray(el)) res.push(...arrayFlat(el)); else res.push(el);
        }));
        return res;
    }
    function arrayFilter(arr, callback) {
        return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
        const uniqueArray = [];
        for (let i = 0; i < arr.length; i += 1) if (-1 === uniqueArray.indexOf(arr[i])) uniqueArray.push(arr[i]);
        return uniqueArray;
    }
    function qsa(selector, context) {
        if ("string" !== typeof selector) return [ selector ];
        const a = [];
        const res = context.querySelectorAll(selector);
        for (let i = 0; i < res.length; i += 1) a.push(res[i]);
        return a;
    }
    function dom7_esm_$(selector, context) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        let arr = [];
        if (!context && selector instanceof Dom7) return selector;
        if (!selector) return new Dom7(arr);
        if ("string" === typeof selector) {
            const html = selector.trim();
            if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                let toCreate = "div";
                if (0 === html.indexOf("<li")) toCreate = "ul";
                if (0 === html.indexOf("<tr")) toCreate = "tbody";
                if (0 === html.indexOf("<td") || 0 === html.indexOf("<th")) toCreate = "tr";
                if (0 === html.indexOf("<tbody")) toCreate = "table";
                if (0 === html.indexOf("<option")) toCreate = "select";
                const tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (let i = 0; i < tempParent.childNodes.length; i += 1) arr.push(tempParent.childNodes[i]);
            } else arr = qsa(selector.trim(), context || document);
        } else if (selector.nodeType || selector === window || selector === document) arr.push(selector); else if (Array.isArray(selector)) {
            if (selector instanceof Dom7) return selector;
            arr = selector;
        }
        return new Dom7(arrayUnique(arr));
    }
    dom7_esm_$.fn = Dom7.prototype;
    function addClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.add(...classNames);
        }));
        return this;
    }
    function removeClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.remove(...classNames);
        }));
        return this;
    }
    function toggleClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            classNames.forEach((className => {
                el.classList.toggle(className);
            }));
        }));
    }
    function hasClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        return arrayFilter(this, (el => classNames.filter((className => el.classList.contains(className))).length > 0)).length > 0;
    }
    function attr(attrs, value) {
        if (1 === arguments.length && "string" === typeof attrs) {
            if (this[0]) return this[0].getAttribute(attrs);
            return;
        }
        for (let i = 0; i < this.length; i += 1) if (2 === arguments.length) this[i].setAttribute(attrs, value); else for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
        }
        return this;
    }
    function removeAttr(attr) {
        for (let i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
        return this;
    }
    function transform(transform) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transform = transform;
        return this;
    }
    function transition(duration) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transitionDuration = "string" !== typeof duration ? `${duration}ms` : duration;
        return this;
    }
    function on(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        function handleLiveEvent(e) {
            const target = e.target;
            if (!target) return;
            const eventData = e.target.dom7EventData || [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            if (dom7_esm_$(target).is(targetSelector)) listener.apply(target, eventData); else {
                const parents = dom7_esm_$(target).parents();
                for (let k = 0; k < parents.length; k += 1) if (dom7_esm_$(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
            }
        }
        function handleEvent(e) {
            const eventData = e && e.target ? e.target.dom7EventData || [] : [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            listener.apply(this, eventData);
        }
        const events = eventType.split(" ");
        let j;
        for (let i = 0; i < this.length; i += 1) {
            const el = this[i];
            if (!targetSelector) for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7Listeners) el.dom7Listeners = {};
                if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
                el.dom7Listeners[event].push({
                    listener,
                    proxyListener: handleEvent
                });
                el.addEventListener(event, handleEvent, capture);
            } else for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
                if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
                el.dom7LiveListeners[event].push({
                    listener,
                    proxyListener: handleLiveEvent
                });
                el.addEventListener(event, handleLiveEvent, capture);
            }
        }
        return this;
    }
    function off(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        const events = eventType.split(" ");
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                let handlers;
                if (!targetSelector && el.dom7Listeners) handlers = el.dom7Listeners[event]; else if (targetSelector && el.dom7LiveListeners) handlers = el.dom7LiveListeners[event];
                if (handlers && handlers.length) for (let k = handlers.length - 1; k >= 0; k -= 1) {
                    const handler = handlers[k];
                    if (listener && handler.listener === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (!listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    }
                }
            }
        }
        return this;
    }
    function trigger(...args) {
        const window = ssr_window_esm_getWindow();
        const events = args[0].split(" ");
        const eventData = args[1];
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                if (window.CustomEvent) {
                    const evt = new window.CustomEvent(event, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dom7EventData = args.filter(((data, dataIndex) => dataIndex > 0));
                    el.dispatchEvent(evt);
                    el.dom7EventData = [];
                    delete el.dom7EventData;
                }
            }
        }
        return this;
    }
    function transitionEnd(callback) {
        const dom = this;
        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            dom.off("transitionend", fireCallBack);
        }
        if (callback) dom.on("transitionend", fireCallBack);
        return this;
    }
    function dom7_esm_outerWidth(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue("margin-right")) + parseFloat(styles.getPropertyValue("margin-left"));
            }
            return this[0].offsetWidth;
        }
        return null;
    }
    function dom7_esm_outerHeight(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue("margin-top")) + parseFloat(styles.getPropertyValue("margin-bottom"));
            }
            return this[0].offsetHeight;
        }
        return null;
    }
    function offset() {
        if (this.length > 0) {
            const window = ssr_window_esm_getWindow();
            const document = ssr_window_esm_getDocument();
            const el = this[0];
            const box = el.getBoundingClientRect();
            const body = document.body;
            const clientTop = el.clientTop || body.clientTop || 0;
            const clientLeft = el.clientLeft || body.clientLeft || 0;
            const scrollTop = el === window ? window.scrollY : el.scrollTop;
            const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        return null;
    }
    function styles() {
        const window = ssr_window_esm_getWindow();
        if (this[0]) return window.getComputedStyle(this[0], null);
        return {};
    }
    function css(props, value) {
        const window = ssr_window_esm_getWindow();
        let i;
        if (1 === arguments.length) if ("string" === typeof props) {
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
            for (i = 0; i < this.length; i += 1) for (const prop in props) this[i].style[prop] = props[prop];
            return this;
        }
        if (2 === arguments.length && "string" === typeof props) {
            for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
            return this;
        }
        return this;
    }
    function each(callback) {
        if (!callback) return this;
        this.forEach(((el, index) => {
            callback.apply(el, [ el, index ]);
        }));
        return this;
    }
    function filter(callback) {
        const result = arrayFilter(this, callback);
        return dom7_esm_$(result);
    }
    function html(html) {
        if ("undefined" === typeof html) return this[0] ? this[0].innerHTML : null;
        for (let i = 0; i < this.length; i += 1) this[i].innerHTML = html;
        return this;
    }
    function dom7_esm_text(text) {
        if ("undefined" === typeof text) return this[0] ? this[0].textContent.trim() : null;
        for (let i = 0; i < this.length; i += 1) this[i].textContent = text;
        return this;
    }
    function is(selector) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        const el = this[0];
        let compareWith;
        let i;
        if (!el || "undefined" === typeof selector) return false;
        if ("string" === typeof selector) {
            if (el.matches) return el.matches(selector);
            if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            compareWith = dom7_esm_$(selector);
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        if (selector === document) return el === document;
        if (selector === window) return el === window;
        if (selector.nodeType || selector instanceof Dom7) {
            compareWith = selector.nodeType ? [ selector ] : selector;
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        return false;
    }
    function index() {
        let child = this[0];
        let i;
        if (child) {
            i = 0;
            while (null !== (child = child.previousSibling)) if (1 === child.nodeType) i += 1;
            return i;
        }
        return;
    }
    function eq(index) {
        if ("undefined" === typeof index) return this;
        const length = this.length;
        if (index > length - 1) return dom7_esm_$([]);
        if (index < 0) {
            const returnIndex = length + index;
            if (returnIndex < 0) return dom7_esm_$([]);
            return dom7_esm_$([ this[returnIndex] ]);
        }
        return dom7_esm_$([ this[index] ]);
    }
    function append(...els) {
        let newChild;
        const document = ssr_window_esm_getDocument();
        for (let k = 0; k < els.length; k += 1) {
            newChild = els[k];
            for (let i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) this[i].appendChild(tempDiv.firstChild);
            } else if (newChild instanceof Dom7) for (let j = 0; j < newChild.length; j += 1) this[i].appendChild(newChild[j]); else this[i].appendChild(newChild);
        }
        return this;
    }
    function prepend(newChild) {
        const document = ssr_window_esm_getDocument();
        let i;
        let j;
        for (i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7) for (j = 0; j < newChild.length; j += 1) this[i].insertBefore(newChild[j], this[i].childNodes[0]); else this[i].insertBefore(newChild, this[i].childNodes[0]);
        return this;
    }
    function next(selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && dom7_esm_$(this[0].nextElementSibling).is(selector)) return dom7_esm_$([ this[0].nextElementSibling ]);
                return dom7_esm_$([]);
            }
            if (this[0].nextElementSibling) return dom7_esm_$([ this[0].nextElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function nextAll(selector) {
        const nextEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (dom7_esm_$(next).is(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return dom7_esm_$(nextEls);
    }
    function prev(selector) {
        if (this.length > 0) {
            const el = this[0];
            if (selector) {
                if (el.previousElementSibling && dom7_esm_$(el.previousElementSibling).is(selector)) return dom7_esm_$([ el.previousElementSibling ]);
                return dom7_esm_$([]);
            }
            if (el.previousElementSibling) return dom7_esm_$([ el.previousElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function prevAll(selector) {
        const prevEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (dom7_esm_$(prev).is(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return dom7_esm_$(prevEls);
    }
    function dom7_esm_parent(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) if (null !== this[i].parentNode) if (selector) {
            if (dom7_esm_$(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else parents.push(this[i].parentNode);
        return dom7_esm_$(parents);
    }
    function parents(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) {
            let parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if (dom7_esm_$(parent).is(selector)) parents.push(parent);
                } else parents.push(parent);
                parent = parent.parentNode;
            }
        }
        return dom7_esm_$(parents);
    }
    function closest(selector) {
        let closest = this;
        if ("undefined" === typeof selector) return dom7_esm_$([]);
        if (!closest.is(selector)) closest = closest.parents(selector).eq(0);
        return closest;
    }
    function find(selector) {
        const foundElements = [];
        for (let i = 0; i < this.length; i += 1) {
            const found = this[i].querySelectorAll(selector);
            for (let j = 0; j < found.length; j += 1) foundElements.push(found[j]);
        }
        return dom7_esm_$(foundElements);
    }
    function children(selector) {
        const children = [];
        for (let i = 0; i < this.length; i += 1) {
            const childNodes = this[i].children;
            for (let j = 0; j < childNodes.length; j += 1) if (!selector || dom7_esm_$(childNodes[j]).is(selector)) children.push(childNodes[j]);
        }
        return dom7_esm_$(children);
    }
    function remove() {
        for (let i = 0; i < this.length; i += 1) if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        return this;
    }
    const noTrigger = "resize scroll".split(" ");
    function shortcut(name) {
        function eventHandler(...args) {
            if ("undefined" === typeof args[0]) {
                for (let i = 0; i < this.length; i += 1) if (noTrigger.indexOf(name) < 0) if (name in this[i]) this[i][name](); else dom7_esm_$(this[i]).trigger(name);
                return this;
            }
            return this.on(name, ...args);
        }
        return eventHandler;
    }
    shortcut("click");
    shortcut("blur");
    shortcut("focus");
    shortcut("focusin");
    shortcut("focusout");
    shortcut("keyup");
    shortcut("keydown");
    shortcut("keypress");
    shortcut("submit");
    shortcut("change");
    shortcut("mousedown");
    shortcut("mousemove");
    shortcut("mouseup");
    shortcut("mouseenter");
    shortcut("mouseleave");
    shortcut("mouseout");
    shortcut("mouseover");
    shortcut("touchstart");
    shortcut("touchend");
    shortcut("touchmove");
    shortcut("resize");
    shortcut("scroll");
    const Methods = {
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        attr,
        removeAttr,
        transform,
        transition,
        on,
        off,
        trigger,
        transitionEnd,
        outerWidth: dom7_esm_outerWidth,
        outerHeight: dom7_esm_outerHeight,
        styles,
        offset,
        css,
        each,
        html,
        text: dom7_esm_text,
        is,
        index,
        eq,
        append,
        prepend,
        next,
        nextAll,
        prev,
        prevAll,
        parent: dom7_esm_parent,
        parents,
        closest,
        find,
        children,
        filter,
        remove
    };
    Object.keys(Methods).forEach((methodName => {
        Object.defineProperty(dom7_esm_$.fn, methodName, {
            value: Methods[methodName],
            writable: true
        });
    }));
    const dom = dom7_esm_$;
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay) {
        if (void 0 === delay) delay = 0;
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis) {
        if (void 0 === axis) axis = "x";
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if ("x" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (16 === matrix.length) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if ("y" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (16 === matrix.length) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return "object" === typeof o && null !== o && o.constructor && "Object" === Object.prototype.toString.call(o).slice(8, -1);
    }
    function isNode(node) {
        if ("undefined" !== typeof window && "undefined" !== typeof window.HTMLElement) return node instanceof HTMLElement;
        return node && (1 === node.nodeType || 11 === node.nodeType);
    }
    function utils_extend() {
        const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < arguments.length; i += 1) {
            const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
            if (void 0 !== nextSource && null !== nextSource && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (void 0 !== desc && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll(_ref) {
        let {swiper, targetPosition, side} = _ref;
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => "next" === dir && current >= target || "prev" === dir && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (null === startTime) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            passiveListener: function checkPassiveListener() {
                let supportsPassive = false;
                try {
                    const opts = Object.defineProperty({}, "passive", {
                        get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassiveListener", null, opts);
                } catch (e) {}
                return supportsPassive;
            }(),
            gestures: function checkGestures() {
                return "ongesturestart" in window;
            }()
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice(_temp) {
        let {userAgent} = void 0 === _temp ? {} : _temp;
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = "Win32" === platform;
        let macos = "MacIntel" === platform;
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides) {
        if (void 0 === overrides) overrides = {};
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        return {
            isSafari: isSafari(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize(_ref) {
        let {swiper, on, emit} = _ref;
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((_ref2 => {
                        let {contentBoxSize, contentRect, target} = _ref2;
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && "undefined" !== typeof window.ResizeObserver) {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = function(target, options) {
            if (void 0 === options) options = {};
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (1 === mutations.length) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: "undefined" === typeof options.attributes ? true : options.attributes,
                childList: "undefined" === typeof options.childList ? true : options.childList,
                characterData: "undefined" === typeof options.characterData ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = swiper.$el.parents();
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.$wrapperEl[0], {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    const events_emitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            function onceHandler() {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if ("undefined" === typeof handler) self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit() {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            if ("string" === typeof args[0] || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const $el = swiper.$el;
        if ("undefined" !== typeof swiper.params.width && null !== swiper.params.width) width = swiper.params.width; else width = $el[0].clientWidth;
        if ("undefined" !== typeof swiper.params.height && null !== swiper.params.height) height = swiper.params.height; else height = $el[0].clientHeight;
        if (0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical()) return;
        width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
        height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {$wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if ("function" === typeof offsetBefore) offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if ("function" === typeof offsetAfter) offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if ("undefined" === typeof swiperSize) return;
        if ("string" === typeof spaceBetween && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        if (rtl) slides.css({
            marginLeft: "",
            marginBottom: "",
            marginTop: ""
        }); else slides.css({
            marginRight: "",
            marginBottom: "",
            marginTop: ""
        });
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slidesLength);
        let slideSize;
        const shouldResetSlideSize = "auto" === params.slidesPerView && params.breakpoints && Object.keys(params.breakpoints).filter((key => "undefined" !== typeof params.breakpoints[key].slidesPerView)).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            const slide = slides.eq(i);
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
            if ("none" === slide.css("display")) continue;
            if ("auto" === params.slidesPerView) {
                if (shouldResetSlideSize) slides[i].style[getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide[0]);
                const currentTransform = slide[0].style.transform;
                const currentWebKitTransform = slide[0].style.webkitTransform;
                if (currentTransform) slide[0].style.transform = "none";
                if (currentWebKitTransform) slide[0].style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && "border-box" === boxSizing) slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide[0];
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide[0].style.transform = currentTransform;
                if (currentWebKitTransform) slide[0].style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (0 === prevSlideSize && 0 !== i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (0 === i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && ("slide" === params.effect || "coverflow" === params.effect)) $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (params.setWrapperSize) $wrapperEl.css({
            [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (0 === snapGrid.length) snapGrid = [ 0 ];
        if (0 !== params.spaceBetween) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).css({
                [key]: `${spaceBetween}px`
            });
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            const maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((snap => {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            if (allSlidesSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (!isVirtual && !params.cssMode && ("slide" === params.effect || "fade" === params.effect)) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.$el.removeClass(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if ("number" === typeof speed) swiper.setTransition(speed); else if (true === speed) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides.filter((el => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index))[0];
            return swiper.slides.eq(index)[0];
        };
        if ("auto" !== swiper.params.slidesPerView && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || dom([])).each((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if ("undefined" !== typeof activeSlides[i]) {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || 0 === newHeight) swiper.$wrapperEl.css("height", `${newHeight}px`);
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
    function updateSlidesProgress(translate) {
        if (void 0 === translate) translate = this && this.translate || 0;
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (0 === slides.length) return;
        if ("undefined" === typeof slides[0].swiperSlideOffset) swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.removeClass(params.slideVisibleClass);
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
                slides.eq(i).addClass(params.slideVisibleClass);
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
        swiper.visibleSlides = dom(swiper.visibleSlides);
    }
    function updateProgress(translate) {
        const swiper = this;
        if ("undefined" === typeof translate) {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (0 === translatesDiff) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            isBeginning = progress <= 0;
            isEnd = progress >= 1;
        }
        Object.assign(swiper, {
            progress,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, $wrapperEl, activeIndex, realIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
        let activeSlide;
        if (isVirtual) activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`); else activeSlide = slides.eq(activeIndex);
        activeSlide.addClass(params.slideActiveClass);
        if (params.loop) if (activeSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
        if (params.loop && 0 === nextSlide.length) {
            nextSlide = slides.eq(0);
            nextSlide.addClass(params.slideNextClass);
        }
        let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
        if (params.loop && 0 === prevSlide.length) {
            prevSlide = slides.eq(-1);
            prevSlide.addClass(params.slidePrevClass);
        }
        if (params.loop) {
            if (nextSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
            if (prevSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        if ("undefined" === typeof activeIndex) {
            for (let i = 0; i < slidesGrid.length; i += 1) if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || "undefined" === typeof activeIndex) activeIndex = 0;
        }
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
        Object.assign(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        const swiper = this;
        const params = swiper.params;
        const slide = dom(e).closest(`.${params.slideClass}`)[0];
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(dom(slide).attr("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && void 0 !== swiper.clickedIndex && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis) {
        if (void 0 === axis) axis = this.isHorizontal() ? "x" : "y";
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, $wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate($wrapperEl[0], axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
        if (void 0 === translate) translate = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if (void 0 === translateBounds) translateBounds = true;
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (0 === speed) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (0 === speed) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) swiper.$wrapperEl.transition(duration);
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit(_ref) {
        let {swiper, runCallbacks, direction, step} = _ref;
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if ("reset" === dir) {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if ("next" === dir) swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks, direction) {
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd_transitionEnd(runCallbacks, direction) {
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    const core_transition = {
        setTransition,
        transitionStart,
        transitionEnd: transitionEnd_transitionEnd
    };
    function slideTo(index, speed, runCallbacks, internal, initial) {
        if (void 0 === index) index = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if ("number" !== typeof index && "string" !== typeof index) throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        const translate = -snapGrid[snapIndex];
        swiper.updateProgress(translate);
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(100 * translate);
            const normalizedGrid = Math.floor(100 * slidesGrid[i]);
            const normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
            if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if ("slide" !== params.effect) swiper.setTranslate(translate);
            if ("reset" !== direction) {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (0 === speed) {
                const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._swiperImmediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (0 === speed) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index, speed, runCallbacks, internal) {
        if (void 0 === index) index = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let newIndex = index;
        if (swiper.params.loop) newIndex += swiper.loopedSlides;
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {animating, enabled, params} = swiper;
        if (!enabled) return swiper;
        let perGroup = params.slidesPerGroup;
        if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params, animating, snapGrid, slidesGrid, rtlTranslate, enabled} = swiper;
        if (!enabled) return swiper;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if ("undefined" === typeof prevSnap && params.cssMode) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if ("undefined" !== typeof prevSnapIndex) prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if ("undefined" !== typeof prevSnap) {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed, runCallbacks, internal, threshold) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if (void 0 === threshold) threshold = .5;
        const swiper = this;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        const {params, $wrapperEl} = swiper;
        const slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(dom(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, $wrapperEl} = swiper;
        const $selector = $wrapperEl.children().length > 0 ? dom($wrapperEl.children()[0].parentNode) : $wrapperEl;
        $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
        let slides = $selector.children(`.${params.slideClass}`);
        if (params.loopFillGroupWithBlank) {
            const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
            if (blankSlidesNum !== params.slidesPerGroup) {
                for (let i = 0; i < blankSlidesNum; i += 1) {
                    const blankNode = dom(document.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
                    $selector.append(blankNode);
                }
                slides = $selector.children(`.${params.slideClass}`);
            }
        }
        if ("auto" === params.slidesPerView && !params.loopedSlides) params.loopedSlides = slides.length;
        swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
        swiper.loopedSlides += params.loopAdditionalSlides;
        if (swiper.loopedSlides > slides.length && swiper.params.loopedSlidesLimit) swiper.loopedSlides = slides.length;
        const prependSlides = [];
        const appendSlides = [];
        slides.each(((el, index) => {
            dom(el).attr("data-swiper-slide-index", index);
        }));
        for (let i = 0; i < swiper.loopedSlides; i += 1) {
            const index = i - Math.floor(i / slides.length) * slides.length;
            appendSlides.push(slides.eq(index)[0]);
            prependSlides.unshift(slides.eq(slides.length - index - 1)[0]);
        }
        for (let i = 0; i < appendSlides.length; i += 1) $selector.append(dom(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
        for (let i = prependSlides.length - 1; i >= 0; i -= 1) $selector.prepend(dom(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    function loopFix() {
        const swiper = this;
        swiper.emit("beforeLoopFix");
        const {activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl} = swiper;
        let newIndex;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        const snapTranslate = -snapGrid[activeIndex];
        const diff = snapTranslate - swiper.getTranslate();
        if (activeIndex < loopedSlides) {
            newIndex = slides.length - 3 * loopedSlides + activeIndex;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        } else if (activeIndex >= slides.length - loopedSlides) {
            newIndex = -slides.length + activeIndex + loopedSlides;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {$wrapperEl, params, slides} = swiper;
        $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
        slides.removeAttr("data-swiper-slide-index");
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = "container" === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        swiper["container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "";
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base) {
        if (void 0 === base) base = this;
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const window = ssr_window_esm_getWindow();
        const data = swiper.touchEventsData;
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let $targetEl = dom(e.target);
        if ("wrapper" === params.touchEventsTarget) if (!$targetEl.closest(swiper.wrapperEl).length) return;
        data.isTouchEvent = "touchstart" === e.type;
        if (!data.isTouchEvent && "which" in e && 3 === e.which) return;
        if (!data.isTouchEvent && "button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && "" !== params.noSwipingClass;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) $targetEl = dom(event.path[0]);
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!$targetEl.closest(params.swipeHandler)[0]) return;
        touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX;
        touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if ("prevent" === edgeSwipeDetection) event.preventDefault(); else return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        if ("touchstart" !== e.type) {
            let preventDefault = true;
            if ($targetEl.is(data.focusableElements)) {
                preventDefault = false;
                if ("SELECT" === $targetEl[0].nodeName) data.isTouched = false;
            }
            if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) document.activeElement.blur();
            const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) e.preventDefault();
        }
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        if (data.isTouchEvent && "touchmove" !== e.type) return;
        const targetTouch = "touchmove" === e.type && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
        const pageX = "touchmove" === e.type ? targetTouch.pageX : e.pageX;
        const pageY = "touchmove" === e.type ? targetTouch.pageY : e.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!dom(e.target).is(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (data.isTouchEvent && document.activeElement) if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if ("undefined" === typeof data.isScrolling) {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = 180 * Math.atan2(Math.abs(diffY), Math.abs(diffX)) / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if ("undefined" === typeof data.startMoving) if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        if (!data.isMoved) {
            if (params.loop && !params.cssMode) swiper.loopFix();
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
            data.allowMomentumBounce = false;
            if (params.grabCursor && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        let diff = swiper.isHorizontal() ? diffX : diffY;
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) diff = -diff;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && "next" === swiper.swipeDirection && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && "prev" === swiper.swipeDirection && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (swiper.params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if ("undefined" !== typeof slidesGrid[i + increment]) {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if ("next" === swiper.swipeDirection) if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if ("prev" === swiper.swipeDirection) if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (null !== rewindLastIndex && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if ("next" === swiper.swipeDirection) swiper.slideTo(null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment);
                if ("prev" === swiper.swipeDirection) swiper.slideTo(null !== rewindLastIndex ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && 0 === el.offsetWidth) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        if (("auto" === params.slidesPerView || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.run();
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (0 === swiper.translate) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    let dummyEventAttached = false;
    function dummyEventListener() {}
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, touchEvents, el, wrapperEl, device, support} = swiper;
        const capture = !!params.nested;
        const domMethod = "on" === method ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!support.touch) {
            el[domMethod](touchEvents.start, swiper.onTouchStart, false);
            document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
            document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
        } else {
            const passiveListener = "touchstart" === touchEvents.start && support.passiveListener && params.passiveListeners ? {
                passive: true,
                capture: false
            } : false;
            el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
            el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
                passive: false,
                capture
            } : capture);
            el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
            if (touchEvents.cancel) el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
    };
    function attachEvents() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, support} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        if (support.touch && !dummyEventAttached) {
            document.addEventListener("touchstart", dummyEventListener);
            dummyEventAttached = true;
        }
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    const core_events = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {activeIndex, initialized, loopedSlides = 0, params, $el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && 0 === Object.keys(breakpoints).length) return;
        const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            $el.addClass(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && "column" === breakpointParams.grid.fill || !breakpointParams.grid.fill && "column" === params.grid.fill) $el.addClass(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateSlides();
            swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base, containerEl) {
        if (void 0 === base) base = "window";
        if (!breakpoints || "container" === base && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = "window" === base ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if ("string" === typeof point && 0 === point.indexOf("@")) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if ("window" === base) {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if ("object" === typeof item) Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if ("string" === typeof item) resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, $el, device, support} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "pointer-events": !support.touch
        }, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && "column" === params.grid.fill
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        }, {
            "watch-progress": params.watchSlidesProgress
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        $el.addClass([ ...classNames ].join(" "));
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        const swiper = this;
        const {$el, classNames} = swiper;
        $el.removeClass(classNames.join(" "));
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
        const window = ssr_window_esm_getWindow();
        let image;
        function onReady() {
            if (callback) callback();
        }
        const isPicture = dom(imageEl).parent("picture")[0];
        if (!isPicture && (!imageEl.complete || !checkForComplete)) if (src) {
            image = new window.Image;
            image.onload = onReady;
            image.onerror = onReady;
            if (sizes) image.sizes = sizes;
            if (srcset) image.srcset = srcset;
            if (src) image.src = src;
        } else onReady(); else onReady();
    }
    function preloadImages() {
        const swiper = this;
        swiper.imagesToLoad = swiper.$el.find("img");
        function onReady() {
            if ("undefined" === typeof swiper || null === swiper || !swiper || swiper.destroyed) return;
            if (void 0 !== swiper.imagesLoaded) swiper.imagesLoaded += 1;
            if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
                if (swiper.params.updateOnImagesReady) swiper.update();
                swiper.emit("imagesReady");
            }
        }
        for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
            const imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
        }
    }
    const core_images = {
        loadImage,
        preloadImages
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + 2 * slidesOffsetBefore;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = 1 === swiper.snapGrid.length;
        if (true === params.allowSlideNext) swiper.allowSlideNext = !swiper.isLocked;
        if (true === params.allowSlidePrev) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 0,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        preloadImages: true,
        updateOnImagesReady: true,
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopedSlidesLimit: true,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj) {
            if (void 0 === obj) obj = {};
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if ("object" !== typeof moduleParams || null === moduleParams) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if ([ "navigation", "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && true === params[moduleParamName]) params[moduleParamName] = {
                auto: true
            };
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (true === params[moduleParamName]) params[moduleParamName] = {
                enabled: true
            };
            if ("object" === typeof params[moduleParamName] && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter: events_emitter,
        update,
        translate,
        transition: core_transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        events: core_events,
        breakpoints,
        checkOverflow: check_overflow,
        classes,
        images: core_images
    };
    const extendedDefaults = {};
    class core_Swiper {
        constructor() {
            let el;
            let params;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            if (1 === args.length && args[0].constructor && "Object" === Object.prototype.toString.call(args[0]).slice(8, -1)) params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            if (params.el && dom(params.el).length > 1) {
                const swipers = [];
                dom(params.el).each((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            swiper.$ = dom;
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: dom(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return "horizontal" === swiper.params.direction;
                },
                isVertical() {
                    return "vertical" === swiper.params.direction;
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEvents: function touchEvents() {
                    const touch = [ "touchstart", "touchmove", "touchend", "touchcancel" ];
                    const desktop = [ "pointerdown", "pointermove", "pointerup" ];
                    swiper.touchEventsTouch = {
                        start: touch[0],
                        move: touch[1],
                        end: touch[2],
                        cancel: touch[3]
                    };
                    swiper.touchEventsDesktop = {
                        start: desktop[0],
                        move: desktop[1],
                        end: desktop[2]
                    };
                    return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: utils_now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, "undefined" === typeof speed ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => 0 === className.indexOf("swiper") || 0 === className.indexOf(swiper.params.containerModifierClass)));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => 0 === className.indexOf("swiper-slide") || 0 === className.indexOf(swiper.params.slideClass))).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.each((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view, exact) {
            if (void 0 === view) view = "current";
            if (void 0 === exact) exact = false;
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex].swiperSlideSize;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if ("current" === view) for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? -1 * swiper.translate : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if (("auto" === swiper.params.slidesPerView || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate) {
            if (void 0 === needUpdate) needUpdate = true;
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = "horizontal" === currentDirection ? "vertical" : "horizontal";
            if (newDirection === currentDirection || "horizontal" !== newDirection && "vertical" !== newDirection) return swiper;
            swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.each((slideEl => {
                if ("vertical" === newDirection) slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && "rtl" === direction || !swiper.rtl && "ltr" === direction) return;
            swiper.rtl = "rtl" === direction;
            swiper.rtlTranslate = "horizontal" === swiper.params.direction && swiper.rtl;
            if (swiper.rtl) {
                swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(el) {
            const swiper = this;
            if (swiper.mounted) return true;
            const $el = dom(el || swiper.params.el);
            el = $el[0];
            if (!el) return false;
            el.swiper = swiper;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = dom(el.shadowRoot.querySelector(getWrapperSelector()));
                    res.children = options => $el.children(options);
                    return res;
                }
                if (!$el.children) return dom($el).children(getWrapperSelector());
                return $el.children(getWrapperSelector());
            };
            let $wrapperEl = getWrapper();
            if (0 === $wrapperEl.length && swiper.params.createElements) {
                const document = ssr_window_esm_getDocument();
                const wrapper = document.createElement("div");
                $wrapperEl = dom(wrapper);
                wrapper.className = swiper.params.wrapperClass;
                $el.append(wrapper);
                $el.children(`.${swiper.params.slideClass}`).each((slideEl => {
                    $wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                $el,
                el,
                $wrapperEl,
                wrapperEl: $wrapperEl[0],
                mounted: true,
                rtl: "rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction"),
                rtlTranslate: "horizontal" === swiper.params.direction && ("rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction")),
                wrongRTL: "-webkit-box" === $wrapperEl.css("display")
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (false === mounted) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            if (swiper.params.loop) swiper.loopCreate();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.preloadImages) swiper.preloadImages();
            if (swiper.params.loop) swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            swiper.attachEvents();
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance, cleanStyles) {
            if (void 0 === deleteInstance) deleteInstance = true;
            if (void 0 === cleanStyles) cleanStyles = true;
            const swiper = this;
            const {params, $el, $wrapperEl, slides} = swiper;
            if ("undefined" === typeof swiper.params || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                $el.removeAttr("style");
                $wrapperEl.removeAttr("style");
                if (slides && slides.length) slides.removeClass([ params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (false !== deleteInstance) {
                swiper.$el[0].swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!core_Swiper.prototype.__modules__) core_Swiper.prototype.__modules__ = [];
            const modules = core_Swiper.prototype.__modules__;
            if ("function" === typeof mod && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => core_Swiper.installModule(m)));
                return core_Swiper;
            }
            core_Swiper.installModule(module);
            return core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    core_Swiper.use([ Resize, Observer ]);
    const core = core_Swiper;
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        const document = ssr_window_esm_getDocument();
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && true === params.auto) {
                let element = swiper.$el.children(`.${checkProps[key]}`)[0];
                if (!element) {
                    element = document.createElement("div");
                    element.className = checkProps[key];
                    swiper.$el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function classes_to_selector_classesToSelector(classes) {
        if (void 0 === classes) classes = "";
        return `.${classes.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")}`;
    }
    function Pagination(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const pfx = "swiper-pagination";
        extendParams({
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: false,
                hideOnClick: false,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: false,
                type: "bullets",
                dynamicBullets: false,
                dynamicMainBullets: 1,
                formatFractionCurrent: number => number,
                formatFractionTotal: number => number,
                bulletClass: `${pfx}-bullet`,
                bulletActiveClass: `${pfx}-bullet-active`,
                modifierClass: `${pfx}-`,
                currentClass: `${pfx}-current`,
                totalClass: `${pfx}-total`,
                hiddenClass: `${pfx}-hidden`,
                progressbarFillClass: `${pfx}-progressbar-fill`,
                progressbarOppositeClass: `${pfx}-progressbar-opposite`,
                clickableClass: `${pfx}-clickable`,
                lockClass: `${pfx}-lock`,
                horizontalClass: `${pfx}-horizontal`,
                verticalClass: `${pfx}-vertical`,
                paginationDisabledClass: `${pfx}-disabled`
            }
        });
        swiper.pagination = {
            el: null,
            $el: null,
            bullets: []
        };
        let bulletSize;
        let dynamicBulletIndex = 0;
        function isPaginationDisabled() {
            return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || 0 === swiper.pagination.$el.length;
        }
        function setSideBullets($bulletEl, position) {
            const {bulletActiveClass} = swiper.params.pagination;
            $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
        }
        function update() {
            const rtl = swiper.rtl;
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const $el = swiper.pagination.$el;
            let current;
            const total = swiper.params.loop ? Math.ceil((slidesLength - 2 * swiper.loopedSlides) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
            if (swiper.params.loop) {
                current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);
                if (current > slidesLength - 1 - 2 * swiper.loopedSlides) current -= slidesLength - 2 * swiper.loopedSlides;
                if (current > total - 1) current -= total;
                if (current < 0 && "bullets" !== swiper.params.paginationType) current = total + current;
            } else if ("undefined" !== typeof swiper.snapIndex) current = swiper.snapIndex; else current = swiper.activeIndex || 0;
            if ("bullets" === params.type && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
                const bullets = swiper.pagination.bullets;
                let firstIndex;
                let lastIndex;
                let midIndex;
                if (params.dynamicBullets) {
                    bulletSize = bullets.eq(0)[swiper.isHorizontal() ? "outerWidth" : "outerHeight"](true);
                    $el.css(swiper.isHorizontal() ? "width" : "height", `${bulletSize * (params.dynamicMainBullets + 4)}px`);
                    if (params.dynamicMainBullets > 1 && void 0 !== swiper.previousIndex) {
                        dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);
                        if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1; else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
                    }
                    firstIndex = Math.max(current - dynamicBulletIndex, 0);
                    lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
                    midIndex = (lastIndex + firstIndex) / 2;
                }
                bullets.removeClass([ "", "-next", "-next-next", "-prev", "-prev-prev", "-main" ].map((suffix => `${params.bulletActiveClass}${suffix}`)).join(" "));
                if ($el.length > 1) bullets.each((bullet => {
                    const $bullet = dom(bullet);
                    const bulletIndex = $bullet.index();
                    if (bulletIndex === current) $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) $bullet.addClass(`${params.bulletActiveClass}-main`);
                        if (bulletIndex === firstIndex) setSideBullets($bullet, "prev");
                        if (bulletIndex === lastIndex) setSideBullets($bullet, "next");
                    }
                })); else {
                    const $bullet = bullets.eq(current);
                    const bulletIndex = $bullet.index();
                    $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        const $firstDisplayedBullet = bullets.eq(firstIndex);
                        const $lastDisplayedBullet = bullets.eq(lastIndex);
                        for (let i = firstIndex; i <= lastIndex; i += 1) bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
                        if (swiper.params.loop) if (bulletIndex >= bullets.length) {
                            for (let i = params.dynamicMainBullets; i >= 0; i -= 1) bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
                            bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
                        } else {
                            setSideBullets($firstDisplayedBullet, "prev");
                            setSideBullets($lastDisplayedBullet, "next");
                        } else {
                            setSideBullets($firstDisplayedBullet, "prev");
                            setSideBullets($lastDisplayedBullet, "next");
                        }
                    }
                }
                if (params.dynamicBullets) {
                    const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
                    const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
                    const offsetProp = rtl ? "right" : "left";
                    bullets.css(swiper.isHorizontal() ? offsetProp : "top", `${bulletsOffset}px`);
                }
            }
            if ("fraction" === params.type) {
                $el.find(classes_to_selector_classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
                $el.find(classes_to_selector_classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
            }
            if ("progressbar" === params.type) {
                let progressbarDirection;
                if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal"; else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
                const scale = (current + 1) / total;
                let scaleX = 1;
                let scaleY = 1;
                if ("horizontal" === progressbarDirection) scaleX = scale; else scaleY = scale;
                $el.find(classes_to_selector_classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
            }
            if ("custom" === params.type && params.renderCustom) {
                $el.html(params.renderCustom(swiper, current + 1, total));
                emit("paginationRender", $el[0]);
            } else emit("paginationUpdate", $el[0]);
            if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
        }
        function render() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const $el = swiper.pagination.$el;
            let paginationHTML = "";
            if ("bullets" === params.type) {
                let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - 2 * swiper.loopedSlides) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
                if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
                for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass); else paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
                $el.html(paginationHTML);
                swiper.pagination.bullets = $el.find(classes_to_selector_classesToSelector(params.bulletClass));
            }
            if ("fraction" === params.type) {
                if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass); else paginationHTML = `<span class="${params.currentClass}"></span>` + " / " + `<span class="${params.totalClass}"></span>`;
                $el.html(paginationHTML);
            }
            if ("progressbar" === params.type) {
                if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass); else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
                $el.html(paginationHTML);
            }
            if ("custom" !== params.type) emit("paginationRender", swiper.pagination.$el[0]);
        }
        function init() {
            swiper.params.pagination = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
                el: "swiper-pagination"
            });
            const params = swiper.params.pagination;
            if (!params.el) return;
            let $el = dom(params.el);
            if (0 === $el.length) return;
            if (swiper.params.uniqueNavElements && "string" === typeof params.el && $el.length > 1) {
                $el = swiper.$el.find(params.el);
                if ($el.length > 1) $el = $el.filter((el => {
                    if (dom(el).parents(".swiper")[0] !== swiper.el) return false;
                    return true;
                }));
            }
            if ("bullets" === params.type && params.clickable) $el.addClass(params.clickableClass);
            $el.addClass(params.modifierClass + params.type);
            $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if ("bullets" === params.type && params.dynamicBullets) {
                $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
                dynamicBulletIndex = 0;
                if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
            }
            if ("progressbar" === params.type && params.progressbarOpposite) $el.addClass(params.progressbarOppositeClass);
            if (params.clickable) $el.on("click", classes_to_selector_classesToSelector(params.bulletClass), (function onClick(e) {
                e.preventDefault();
                let index = dom(this).index() * swiper.params.slidesPerGroup;
                if (swiper.params.loop) index += swiper.loopedSlides;
                swiper.slideTo(index);
            }));
            Object.assign(swiper.pagination, {
                $el,
                el: $el[0]
            });
            if (!swiper.enabled) $el.addClass(params.lockClass);
        }
        function destroy() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const $el = swiper.pagination.$el;
            $el.removeClass(params.hiddenClass);
            $el.removeClass(params.modifierClass + params.type);
            $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);
            if (params.clickable) $el.off("click", classes_to_selector_classesToSelector(params.bulletClass));
        }
        on("init", (() => {
            if (false === swiper.params.pagination.enabled) disable(); else {
                init();
                render();
                update();
            }
        }));
        on("activeIndexChange", (() => {
            if (swiper.params.loop) update(); else if ("undefined" === typeof swiper.snapIndex) update();
        }));
        on("snapIndexChange", (() => {
            if (!swiper.params.loop) update();
        }));
        on("slidesLengthChange", (() => {
            if (swiper.params.loop) {
                render();
                update();
            }
        }));
        on("snapGridLengthChange", (() => {
            if (!swiper.params.loop) {
                render();
                update();
            }
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$el} = swiper.pagination;
            if ($el) $el[swiper.enabled ? "removeClass" : "addClass"](swiper.params.pagination.lockClass);
        }));
        on("lock unlock", (() => {
            update();
        }));
        on("click", ((_s, e) => {
            const targetEl = e.target;
            const {$el} = swiper.pagination;
            if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el && $el.length > 0 && !dom(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
                if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
                const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);
                if (true === isHidden) emit("paginationShow"); else emit("paginationHide");
                $el.toggleClass(swiper.params.pagination.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
            if (swiper.pagination.$el) swiper.pagination.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
            init();
            render();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.pagination.paginationDisabledClass);
            if (swiper.pagination.$el) swiper.pagination.$el.addClass(swiper.params.pagination.paginationDisabledClass);
            destroy();
        };
        Object.assign(swiper.pagination, {
            enable,
            disable,
            render,
            update,
            init,
            destroy
        });
    }
    function Autoplay(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        let timeout;
        swiper.autoplay = {
            running: false,
            paused: false
        };
        extendParams({
            autoplay: {
                enabled: false,
                delay: 3e3,
                waitForTransition: true,
                disableOnInteraction: true,
                stopOnLastSlide: false,
                reverseDirection: false,
                pauseOnMouseEnter: false
            }
        });
        function run() {
            if (!swiper.size) {
                swiper.autoplay.running = false;
                swiper.autoplay.paused = false;
                return;
            }
            const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
            let delay = swiper.params.autoplay.delay;
            if ($activeSlideEl.attr("data-swiper-autoplay")) delay = $activeSlideEl.attr("data-swiper-autoplay") || swiper.params.autoplay.delay;
            clearTimeout(timeout);
            timeout = utils_nextTick((() => {
                let autoplayResult;
                if (swiper.params.autoplay.reverseDirection) if (swiper.params.loop) {
                    swiper.loopFix();
                    autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
                    emit("autoplay");
                } else if (!swiper.isBeginning) {
                    autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
                    emit("autoplay");
                } else if (!swiper.params.autoplay.stopOnLastSlide) {
                    autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
                    emit("autoplay");
                } else stop(); else if (swiper.params.loop) {
                    swiper.loopFix();
                    autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
                    emit("autoplay");
                } else if (!swiper.isEnd) {
                    autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
                    emit("autoplay");
                } else if (!swiper.params.autoplay.stopOnLastSlide) {
                    autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
                    emit("autoplay");
                } else stop();
                if (swiper.params.cssMode && swiper.autoplay.running) run(); else if (false === autoplayResult) run();
            }), delay);
        }
        function start() {
            if ("undefined" !== typeof timeout) return false;
            if (swiper.autoplay.running) return false;
            swiper.autoplay.running = true;
            emit("autoplayStart");
            run();
            return true;
        }
        function stop() {
            if (!swiper.autoplay.running) return false;
            if ("undefined" === typeof timeout) return false;
            if (timeout) {
                clearTimeout(timeout);
                timeout = void 0;
            }
            swiper.autoplay.running = false;
            emit("autoplayStop");
            return true;
        }
        function pause(speed) {
            if (!swiper.autoplay.running) return;
            if (swiper.autoplay.paused) return;
            if (timeout) clearTimeout(timeout);
            swiper.autoplay.paused = true;
            if (0 === speed || !swiper.params.autoplay.waitForTransition) {
                swiper.autoplay.paused = false;
                run();
            } else [ "transitionend", "webkitTransitionEnd" ].forEach((event => {
                swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
            }));
        }
        function onVisibilityChange() {
            const document = ssr_window_esm_getDocument();
            if ("hidden" === document.visibilityState && swiper.autoplay.running) pause();
            if ("visible" === document.visibilityState && swiper.autoplay.paused) {
                run();
                swiper.autoplay.paused = false;
            }
        }
        function onTransitionEnd(e) {
            if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
            if (e.target !== swiper.$wrapperEl[0]) return;
            [ "transitionend", "webkitTransitionEnd" ].forEach((event => {
                swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
            }));
            swiper.autoplay.paused = false;
            if (!swiper.autoplay.running) stop(); else run();
        }
        function onMouseEnter() {
            if (swiper.params.autoplay.disableOnInteraction) stop(); else {
                emit("autoplayPause");
                pause();
            }
            [ "transitionend", "webkitTransitionEnd" ].forEach((event => {
                swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
            }));
        }
        function onMouseLeave() {
            if (swiper.params.autoplay.disableOnInteraction) return;
            swiper.autoplay.paused = false;
            emit("autoplayResume");
            run();
        }
        function attachMouseEvents() {
            if (swiper.params.autoplay.pauseOnMouseEnter) {
                swiper.$el.on("mouseenter", onMouseEnter);
                swiper.$el.on("mouseleave", onMouseLeave);
            }
        }
        function detachMouseEvents() {
            swiper.$el.off("mouseenter", onMouseEnter);
            swiper.$el.off("mouseleave", onMouseLeave);
        }
        on("init", (() => {
            if (swiper.params.autoplay.enabled) {
                start();
                const document = ssr_window_esm_getDocument();
                document.addEventListener("visibilitychange", onVisibilityChange);
                attachMouseEvents();
            }
        }));
        on("beforeTransitionStart", ((_s, speed, internal) => {
            if (swiper.autoplay.running) if (internal || !swiper.params.autoplay.disableOnInteraction) swiper.autoplay.pause(speed); else stop();
        }));
        on("sliderFirstMove", (() => {
            if (swiper.autoplay.running) if (swiper.params.autoplay.disableOnInteraction) stop(); else pause();
        }));
        on("touchEnd", (() => {
            if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) run();
        }));
        on("destroy", (() => {
            detachMouseEvents();
            if (swiper.autoplay.running) stop();
            const document = ssr_window_esm_getDocument();
            document.removeEventListener("visibilitychange", onVisibilityChange);
        }));
        Object.assign(swiper.autoplay, {
            pause,
            run,
            start,
            stop
        });
    }
    function initSliders() {
        if (document.querySelector(".swiper")) {
            new core(".news-top__slider", {
                modules: [ Pagination, Autoplay ],
                observer: true,
                observeParents: true,
                slidesPerView: 4,
                spaceBetween: 13,
                autoHeight: true,
                speed: 800,
                slidesPerGroup: 4,
                lazy: true,
                effect: "fade",
                autoplay: {
                    delay: 7e3,
                    disableOnInteraction: false
                },
                pagination: {
                    el: ".news-top__slider-pagination",
                    clickable: true
                },
                navigation: {
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next"
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 4,
                        autoHeight: true,
                        slidesPerGroup: 1
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                        slidesPerGroup: 2
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                        slidesPerGroup: 3
                    },
                    1268: {
                        slidesPerView: 4,
                        spaceBetween: 13,
                        slidesPerGroup: 4
                    }
                },
                on: {}
            });
            new core(".special-theme__slider", {
                modules: [ Pagination, Autoplay ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 13,
                autoHeight: true,
                speed: 800,
                slidesPerGroup: 1,
                lazy: true,
                effect: "fade",
                autoplay: {
                    delay: 7e3,
                    disableOnInteraction: false
                },
                pagination: {
                    el: ".special-theme__slider-pagination",
                    clickable: true
                },
                navigation: {
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next"
                },
                on: {}
            });
            new core(".main-news__slider", {
                modules: [ Pagination, Autoplay ],
                observer: true,
                observeParents: true,
                slidesPerView: 5,
                spaceBetween: 13,
                autoHeight: true,
                speed: 800,
                slidesPerGroup: 5,
                lazy: true,
                effect: "fade",
                autoplay: {
                    delay: 7e3,
                    disableOnInteraction: false
                },
                pagination: {
                    el: ".main-news__slider-pagination",
                    clickable: true
                },
                navigation: {
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next"
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 4,
                        autoHeight: true,
                        slidesPerGroup: 1
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                        slidesPerGroup: 2
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                        slidesPerGroup: 3
                    },
                    1268: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                        slidesPerGroup: 4
                    },
                    1440: {
                        slidesPerView: 5,
                        spaceBetween: 13,
                        slidesPerGroup: 5
                    }
                },
                on: {}
            });
        }
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    const isPlainObject = obj => "object" === typeof obj && null !== obj && obj.constructor === Object && "[object Object]" === Object.prototype.toString.call(obj);
    const extend_extend = (...args) => {
        let deep = false;
        if ("boolean" == typeof args[0]) deep = args.shift();
        let result = args[0];
        if (!result || "object" !== typeof result) throw new Error("extendee must be an object");
        const extenders = args.slice(1);
        const len = extenders.length;
        for (let i = 0; i < len; i++) {
            const extender = extenders[i];
            for (let key in extender) if (extender.hasOwnProperty(key)) {
                const value = extender[key];
                if (deep && (Array.isArray(value) || isPlainObject(value))) {
                    const base = Array.isArray(value) ? [] : {};
                    result[key] = extend_extend(true, result.hasOwnProperty(key) ? result[key] : base, value);
                } else result[key] = value;
            }
        }
        return result;
    };
    const canUseDOM = !!("undefined" !== typeof window && window.document && window.document.createElement);
    let preventScrollSupported = null;
    const FOCUSABLE_ELEMENTS = [ "a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"]):not([disabled]):not([aria-hidden])' ];
    const setFocusOn = node => {
        if (!node || !canUseDOM) return;
        if (null === preventScrollSupported) document.createElement("div").focus({
            get preventScroll() {
                preventScrollSupported = true;
                return false;
            }
        });
        try {
            if (node.setActive) node.setActive(); else if (preventScrollSupported) node.focus({
                preventScroll: true
            }); else {
                const scrollTop = window.pageXOffset || document.body.scrollTop;
                const scrollLeft = window.pageYOffset || document.body.scrollLeft;
                node.focus();
                document.body.scrollTo({
                    top: scrollTop,
                    left: scrollLeft,
                    behavior: "auto"
                });
            }
        } catch (e) {}
    };
    const resolve = function(path, obj) {
        return path.split(".").reduce((function(prev, curr) {
            return prev && prev[curr];
        }), obj);
    };
    class Base {
        constructor(options = {}) {
            this.options = extend_extend(true, {}, options);
            this.plugins = [];
            this.events = {};
            for (const type of [ "on", "once" ]) for (const args of Object.entries(this.options[type] || {})) this[type](...args);
        }
        option(key, fallback, ...rest) {
            key = String(key);
            let value = resolve(key, this.options);
            if ("function" === typeof value) value = value.call(this, this, ...rest);
            return void 0 === value ? fallback : value;
        }
        localize(str, params = []) {
            str = String(str).replace(/\{\{(\w+).?(\w+)?\}\}/g, ((match, key, subkey) => {
                let rez = "";
                if (subkey) rez = this.option(`${key[0] + key.toLowerCase().substring(1)}.l10n.${subkey}`); else if (key) rez = this.option(`l10n.${key}`);
                if (!rez) rez = match;
                for (let index = 0; index < params.length; index++) rez = rez.split(params[index][0]).join(params[index][1]);
                return rez;
            }));
            str = str.replace(/\{\{(.*)\}\}/, ((match, key) => key));
            return str;
        }
        on(name, callback) {
            if (isPlainObject(name)) {
                for (const args of Object.entries(name)) this.on(...args);
                return this;
            }
            String(name).split(" ").forEach((item => {
                const listeners = this.events[item] = this.events[item] || [];
                if (-1 == listeners.indexOf(callback)) listeners.push(callback);
            }));
            return this;
        }
        once(name, callback) {
            if (isPlainObject(name)) {
                for (const args of Object.entries(name)) this.once(...args);
                return this;
            }
            String(name).split(" ").forEach((item => {
                const listener = (...details) => {
                    this.off(item, listener);
                    callback.call(this, this, ...details);
                };
                listener._ = callback;
                this.on(item, listener);
            }));
            return this;
        }
        off(name, callback) {
            if (isPlainObject(name)) {
                for (const args of Object.entries(name)) this.off(...args);
                return;
            }
            name.split(" ").forEach((item => {
                const listeners = this.events[item];
                if (!listeners || !listeners.length) return this;
                let index = -1;
                for (let i = 0, len = listeners.length; i < len; i++) {
                    const listener = listeners[i];
                    if (listener && (listener === callback || listener._ === callback)) {
                        index = i;
                        break;
                    }
                }
                if (-1 != index) listeners.splice(index, 1);
            }));
            return this;
        }
        trigger(name, ...details) {
            for (const listener of [ ...this.events[name] || [] ].slice()) if (listener && false === listener.call(this, this, ...details)) return false;
            for (const listener of [ ...this.events["*"] || [] ].slice()) if (listener && false === listener.call(this, name, this, ...details)) return false;
            return true;
        }
        attachPlugins(plugins) {
            const newPlugins = {};
            for (const [key, Plugin] of Object.entries(plugins || {})) if (false !== this.options[key] && !this.plugins[key]) {
                this.options[key] = extend_extend({}, Plugin.defaults || {}, this.options[key]);
                newPlugins[key] = new Plugin(this);
            }
            for (const [key, plugin] of Object.entries(newPlugins)) plugin.attach(this);
            this.plugins = Object.assign({}, this.plugins, newPlugins);
            return this;
        }
        detachPlugins() {
            for (const key in this.plugins) {
                let plugin;
                if ((plugin = this.plugins[key]) && "function" === typeof plugin.detach) plugin.detach(this);
            }
            this.plugins = {};
            return this;
        }
    }
    const round = (value, precision = 1e4) => {
        value = parseFloat(value) || 0;
        return Math.round((value + Number.EPSILON) * precision) / precision;
    };
    const hasScrollbars = function(node) {
        const overflowY = getComputedStyle(node)["overflow-y"], overflowX = getComputedStyle(node)["overflow-x"], vertical = ("scroll" === overflowY || "auto" === overflowY) && Math.abs(node.scrollHeight - node.clientHeight) > 1, horizontal = ("scroll" === overflowX || "auto" === overflowX) && Math.abs(node.scrollWidth - node.clientWidth) > 1;
        return vertical || horizontal;
    };
    const isScrollable = function(node) {
        if (!node || !("object" === typeof node && node instanceof Element) || node === document.body) return false;
        if (node.__Panzoom) return false;
        if (hasScrollbars(node)) return node;
        return isScrollable(node.parentNode);
    };
    const ResizeObserver_ResizeObserver = "undefined" !== typeof window && window.ResizeObserver || class {
        constructor(callback) {
            this.observables = [];
            this.boundCheck = this.check.bind(this);
            this.boundCheck();
            this.callback = callback;
        }
        observe(el) {
            if (this.observables.some((observable => observable.el === el))) return;
            const newObservable = {
                el,
                size: {
                    height: el.clientHeight,
                    width: el.clientWidth
                }
            };
            this.observables.push(newObservable);
        }
        unobserve(el) {
            this.observables = this.observables.filter((obj => obj.el !== el));
        }
        disconnect() {
            this.observables = [];
        }
        check() {
            const changedEntries = this.observables.filter((obj => {
                const currentHeight = obj.el.clientHeight;
                const currentWidth = obj.el.clientWidth;
                if (obj.size.height !== currentHeight || obj.size.width !== currentWidth) {
                    obj.size.height = currentHeight;
                    obj.size.width = currentWidth;
                    return true;
                }
            })).map((obj => obj.el));
            if (changedEntries.length > 0) this.callback(changedEntries);
            window.requestAnimationFrame(this.boundCheck);
        }
    };
    class Pointer {
        constructor(nativePointer) {
            this.id = self.Touch && nativePointer instanceof Touch ? nativePointer.identifier : -1;
            this.pageX = nativePointer.pageX;
            this.pageY = nativePointer.pageY;
            this.clientX = nativePointer.clientX;
            this.clientY = nativePointer.clientY;
        }
    }
    const getDistance = (a, b) => {
        if (!b) return 0;
        return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2);
    };
    const getMidpoint = (a, b) => {
        if (!b) return a;
        return {
            clientX: (a.clientX + b.clientX) / 2,
            clientY: (a.clientY + b.clientY) / 2
        };
    };
    const isTouchEvent = event => "changedTouches" in event;
    class PointerTracker {
        constructor(_element, {start = () => true, move = () => {}, end = () => {}} = {}) {
            this._element = _element;
            this.startPointers = [];
            this.currentPointers = [];
            this._pointerStart = event => {
                if (event.buttons > 0 && 0 !== event.button) return;
                const pointer = new Pointer(event);
                if (this.currentPointers.some((p => p.id === pointer.id))) return;
                if (!this._triggerPointerStart(pointer, event)) return;
                window.addEventListener("mousemove", this._move);
                window.addEventListener("mouseup", this._pointerEnd);
            };
            this._touchStart = event => {
                for (const touch of Array.from(event.changedTouches || [])) this._triggerPointerStart(new Pointer(touch), event);
            };
            this._move = event => {
                const previousPointers = this.currentPointers.slice();
                const changedPointers = isTouchEvent(event) ? Array.from(event.changedTouches).map((t => new Pointer(t))) : [ new Pointer(event) ];
                const trackedChangedPointers = [];
                for (const pointer of changedPointers) {
                    const index = this.currentPointers.findIndex((p => p.id === pointer.id));
                    if (index < 0) continue;
                    trackedChangedPointers.push(pointer);
                    this.currentPointers[index] = pointer;
                }
                this._moveCallback(previousPointers, this.currentPointers.slice(), event);
            };
            this._triggerPointerEnd = (pointer, event) => {
                const index = this.currentPointers.findIndex((p => p.id === pointer.id));
                if (index < 0) return false;
                this.currentPointers.splice(index, 1);
                this.startPointers.splice(index, 1);
                this._endCallback(pointer, event);
                return true;
            };
            this._pointerEnd = event => {
                if (event.buttons > 0 && 0 !== event.button) return;
                if (!this._triggerPointerEnd(new Pointer(event), event)) return;
                window.removeEventListener("mousemove", this._move, {
                    passive: false
                });
                window.removeEventListener("mouseup", this._pointerEnd, {
                    passive: false
                });
            };
            this._touchEnd = event => {
                for (const touch of Array.from(event.changedTouches || [])) this._triggerPointerEnd(new Pointer(touch), event);
            };
            this._startCallback = start;
            this._moveCallback = move;
            this._endCallback = end;
            this._element.addEventListener("mousedown", this._pointerStart, {
                passive: false
            });
            this._element.addEventListener("touchstart", this._touchStart, {
                passive: false
            });
            this._element.addEventListener("touchmove", this._move, {
                passive: false
            });
            this._element.addEventListener("touchend", this._touchEnd);
            this._element.addEventListener("touchcancel", this._touchEnd);
        }
        stop() {
            this._element.removeEventListener("mousedown", this._pointerStart, {
                passive: false
            });
            this._element.removeEventListener("touchstart", this._touchStart, {
                passive: false
            });
            this._element.removeEventListener("touchmove", this._move, {
                passive: false
            });
            this._element.removeEventListener("touchend", this._touchEnd);
            this._element.removeEventListener("touchcancel", this._touchEnd);
            window.removeEventListener("mousemove", this._move);
            window.removeEventListener("mouseup", this._pointerEnd);
        }
        _triggerPointerStart(pointer, event) {
            if (!this._startCallback(pointer, event)) return false;
            this.currentPointers.push(pointer);
            this.startPointers.push(pointer);
            return true;
        }
    }
    const getTextNodeFromPoint = (element, x, y) => {
        const nodes = element.childNodes;
        const range = document.createRange();
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.nodeType !== Node.TEXT_NODE) continue;
            range.selectNodeContents(node);
            const rect = range.getBoundingClientRect();
            if (x >= rect.left && y >= rect.top && x <= rect.right && y <= rect.bottom) return node;
        }
        return false;
    };
    const getFullWidth = elem => Math.max(parseFloat(elem.naturalWidth || 0), parseFloat(elem.width && elem.width.baseVal && elem.width.baseVal.value || 0), parseFloat(elem.offsetWidth || 0), parseFloat(elem.scrollWidth || 0));
    const getFullHeight = elem => Math.max(parseFloat(elem.naturalHeight || 0), parseFloat(elem.height && elem.height.baseVal && elem.height.baseVal.value || 0), parseFloat(elem.offsetHeight || 0), parseFloat(elem.scrollHeight || 0));
    const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
        const ratio = Math.min(maxWidth / srcWidth || 0, maxHeight / srcHeight);
        return {
            width: srcWidth * ratio || 0,
            height: srcHeight * ratio || 0
        };
    };
    const Plugins = {};
    const Panzoom_defaults = {
        touch: true,
        zoom: true,
        pinchToZoom: true,
        panOnlyZoomed: false,
        lockAxis: false,
        friction: .64,
        decelFriction: .88,
        zoomFriction: .74,
        bounceForce: .2,
        baseScale: 1,
        minScale: 1,
        maxScale: 2,
        step: .5,
        textSelection: false,
        click: "toggleZoom",
        wheel: "zoom",
        wheelFactor: 42,
        wheelLimit: 5,
        draggableClass: "is-draggable",
        draggingClass: "is-dragging",
        ratio: 1
    };
    class Panzoom extends Base {
        constructor($container, options = {}) {
            super(extend_extend(true, {}, Panzoom_defaults, options));
            this.state = "init";
            this.$container = $container;
            for (const methodName of [ "onLoad", "onWheel", "onClick" ]) this[methodName] = this[methodName].bind(this);
            this.initLayout();
            this.resetValues();
            this.attachPlugins(Panzoom.Plugins);
            this.trigger("init");
            this.updateMetrics();
            this.attachEvents();
            this.trigger("ready");
            if (false === this.option("centerOnStart")) this.state = "ready"; else this.panTo({
                friction: 0
            });
            $container.__Panzoom = this;
        }
        initLayout() {
            const $container = this.$container;
            if (!($container instanceof HTMLElement)) throw new Error("Panzoom: Container not found");
            const $content = this.option("content") || $container.querySelector(".panzoom__content");
            if (!$content) throw new Error("Panzoom: Content not found");
            this.$content = $content;
            let $viewport = this.option("viewport") || $container.querySelector(".panzoom__viewport");
            if (!$viewport && false !== this.option("wrapInner")) {
                $viewport = document.createElement("div");
                $viewport.classList.add("panzoom__viewport");
                $viewport.append(...$container.childNodes);
                $container.appendChild($viewport);
            }
            this.$viewport = $viewport || $content.parentNode;
        }
        resetValues() {
            this.updateRate = this.option("updateRate", /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 250 : 24);
            this.container = {
                width: 0,
                height: 0
            };
            this.viewport = {
                width: 0,
                height: 0
            };
            this.content = {
                origWidth: 0,
                origHeight: 0,
                width: 0,
                height: 0,
                x: this.option("x", 0),
                y: this.option("y", 0),
                scale: this.option("baseScale")
            };
            this.transform = {
                x: 0,
                y: 0,
                scale: 1
            };
            this.resetDragPosition();
        }
        onLoad(event) {
            this.updateMetrics();
            this.panTo({
                scale: this.option("baseScale"),
                friction: 0
            });
            this.trigger("load", event);
        }
        onClick(event) {
            if (event.defaultPrevented) return;
            if (document.activeElement && document.activeElement.closest("[contenteditable]")) return;
            if (this.option("textSelection") && window.getSelection().toString().length && !(event.target && event.target.hasAttribute("data-fancybox-close"))) {
                event.stopPropagation();
                return;
            }
            const rect = this.$content.getClientRects()[0];
            if ("ready" !== this.state) if (this.dragPosition.midPoint || Math.abs(rect.top - this.dragStart.rect.top) > 1 || Math.abs(rect.left - this.dragStart.rect.left) > 1) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            if (false === this.trigger("click", event)) return;
            if (this.option("zoom") && "toggleZoom" === this.option("click")) {
                event.preventDefault();
                event.stopPropagation();
                this.zoomWithClick(event);
            }
        }
        onWheel(event) {
            if (false === this.trigger("wheel", event)) return;
            if (this.option("zoom") && this.option("wheel")) this.zoomWithWheel(event);
        }
        zoomWithWheel(event) {
            if (void 0 === this.changedDelta) this.changedDelta = 0;
            const delta = Math.max(-1, Math.min(1, -event.deltaY || -event.deltaX || event.wheelDelta || -event.detail));
            const scale = this.content.scale;
            let newScale = scale * (100 + delta * this.option("wheelFactor")) / 100;
            if (delta < 0 && Math.abs(scale - this.option("minScale")) < .01 || delta > 0 && Math.abs(scale - this.option("maxScale")) < .01) {
                this.changedDelta += Math.abs(delta);
                newScale = scale;
            } else {
                this.changedDelta = 0;
                newScale = Math.max(Math.min(newScale, this.option("maxScale")), this.option("minScale"));
            }
            if (this.changedDelta > this.option("wheelLimit")) return;
            event.preventDefault();
            if (newScale === scale) return;
            const rect = this.$content.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.zoomTo(newScale, {
                x,
                y
            });
        }
        zoomWithClick(event) {
            const rect = this.$content.getClientRects()[0];
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.toggleZoom({
                x,
                y
            });
        }
        attachEvents() {
            this.$content.addEventListener("load", this.onLoad);
            this.$container.addEventListener("wheel", this.onWheel, {
                passive: false
            });
            this.$container.addEventListener("click", this.onClick, {
                passive: false
            });
            this.initObserver();
            const pointerTracker = new PointerTracker(this.$container, {
                start: (pointer, event) => {
                    if (!this.option("touch")) return false;
                    if (this.velocity.scale < 0) return false;
                    const target = event.composedPath()[0];
                    if (!pointerTracker.currentPointers.length) {
                        const ignoreClickedElement = -1 !== [ "BUTTON", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO" ].indexOf(target.nodeName);
                        if (ignoreClickedElement) return false;
                        if (this.option("textSelection") && getTextNodeFromPoint(target, pointer.clientX, pointer.clientY)) return false;
                    }
                    if (isScrollable(target)) return false;
                    if (false === this.trigger("touchStart", event)) return false;
                    if ("mousedown" === event.type) event.preventDefault();
                    this.state = "pointerdown";
                    this.resetDragPosition();
                    this.dragPosition.midPoint = null;
                    this.dragPosition.time = Date.now();
                    return true;
                },
                move: (previousPointers, currentPointers, event) => {
                    if ("pointerdown" !== this.state) return;
                    if (false === this.trigger("touchMove", event)) {
                        event.preventDefault();
                        return;
                    }
                    if (currentPointers.length < 2 && true === this.option("panOnlyZoomed") && this.content.width <= this.viewport.width && this.content.height <= this.viewport.height && this.transform.scale <= this.option("baseScale")) return;
                    if (currentPointers.length > 1 && (!this.option("zoom") || false === this.option("pinchToZoom"))) return;
                    const prevMidpoint = getMidpoint(previousPointers[0], previousPointers[1]);
                    const newMidpoint = getMidpoint(currentPointers[0], currentPointers[1]);
                    const panX = newMidpoint.clientX - prevMidpoint.clientX;
                    const panY = newMidpoint.clientY - prevMidpoint.clientY;
                    const prevDistance = getDistance(previousPointers[0], previousPointers[1]);
                    const newDistance = getDistance(currentPointers[0], currentPointers[1]);
                    const scaleDiff = prevDistance && newDistance ? newDistance / prevDistance : 1;
                    this.dragOffset.x += panX;
                    this.dragOffset.y += panY;
                    this.dragOffset.scale *= scaleDiff;
                    this.dragOffset.time = Date.now() - this.dragPosition.time;
                    const axisToLock = 1 === this.dragStart.scale && this.option("lockAxis");
                    if (axisToLock && !this.lockAxis) {
                        if (Math.abs(this.dragOffset.x) < 6 && Math.abs(this.dragOffset.y) < 6) {
                            event.preventDefault();
                            return;
                        }
                        const angle = Math.abs(180 * Math.atan2(this.dragOffset.y, this.dragOffset.x) / Math.PI);
                        this.lockAxis = angle > 45 && angle < 135 ? "y" : "x";
                    }
                    if ("xy" !== axisToLock && "y" === this.lockAxis) return;
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    if (this.lockAxis) this.dragOffset["x" === this.lockAxis ? "y" : "x"] = 0;
                    this.$container.classList.add(this.option("draggingClass"));
                    if (!(this.transform.scale === this.option("baseScale") && "y" === this.lockAxis)) this.dragPosition.x = this.dragStart.x + this.dragOffset.x;
                    if (!(this.transform.scale === this.option("baseScale") && "x" === this.lockAxis)) this.dragPosition.y = this.dragStart.y + this.dragOffset.y;
                    this.dragPosition.scale = this.dragStart.scale * this.dragOffset.scale;
                    if (currentPointers.length > 1) {
                        const startPoint = getMidpoint(pointerTracker.startPointers[0], pointerTracker.startPointers[1]);
                        const xPos = startPoint.clientX - this.dragStart.rect.x;
                        const yPos = startPoint.clientY - this.dragStart.rect.y;
                        const {deltaX, deltaY} = this.getZoomDelta(this.content.scale * this.dragOffset.scale, xPos, yPos);
                        this.dragPosition.x -= deltaX;
                        this.dragPosition.y -= deltaY;
                        this.dragPosition.midPoint = newMidpoint;
                    } else this.setDragResistance();
                    this.transform = {
                        x: this.dragPosition.x,
                        y: this.dragPosition.y,
                        scale: this.dragPosition.scale
                    };
                    this.startAnimation();
                },
                end: (pointer, event) => {
                    if ("pointerdown" !== this.state) return;
                    this._dragOffset = {
                        ...this.dragOffset
                    };
                    if (pointerTracker.currentPointers.length) {
                        this.resetDragPosition();
                        return;
                    }
                    this.state = "decel";
                    this.friction = this.option("decelFriction");
                    this.recalculateTransform();
                    this.$container.classList.remove(this.option("draggingClass"));
                    if (false === this.trigger("touchEnd", event)) return;
                    if ("decel" !== this.state) return;
                    const minScale = this.option("minScale");
                    if (this.transform.scale < minScale) {
                        this.zoomTo(minScale, {
                            friction: .64
                        });
                        return;
                    }
                    const maxScale = this.option("maxScale");
                    if (this.transform.scale - maxScale > .01) {
                        const last = this.dragPosition.midPoint || pointer;
                        const rect = this.$content.getClientRects()[0];
                        this.zoomTo(maxScale, {
                            friction: .64,
                            x: last.clientX - rect.left,
                            y: last.clientY - rect.top
                        });
                        return;
                    }
                }
            });
            this.pointerTracker = pointerTracker;
        }
        initObserver() {
            if (this.resizeObserver) return;
            this.resizeObserver = new ResizeObserver_ResizeObserver((() => {
                if (this.updateTimer) return;
                this.updateTimer = setTimeout((() => {
                    const rect = this.$container.getBoundingClientRect();
                    if (!(rect.width && rect.height)) {
                        this.updateTimer = null;
                        return;
                    }
                    if (Math.abs(rect.width - this.container.width) > 1 || Math.abs(rect.height - this.container.height) > 1) {
                        if (this.isAnimating()) this.endAnimation(true);
                        this.updateMetrics();
                        this.panTo({
                            x: this.content.x,
                            y: this.content.y,
                            scale: this.option("baseScale"),
                            friction: 0
                        });
                    }
                    this.updateTimer = null;
                }), this.updateRate);
            }));
            this.resizeObserver.observe(this.$container);
        }
        resetDragPosition() {
            this.lockAxis = null;
            this.friction = this.option("friction");
            this.velocity = {
                x: 0,
                y: 0,
                scale: 0
            };
            const {x, y, scale} = this.content;
            this.dragStart = {
                rect: this.$content.getBoundingClientRect(),
                x,
                y,
                scale
            };
            this.dragPosition = {
                ...this.dragPosition,
                x,
                y,
                scale
            };
            this.dragOffset = {
                x: 0,
                y: 0,
                scale: 1,
                time: 0
            };
        }
        updateMetrics(silently) {
            if (true !== silently) this.trigger("beforeUpdate");
            const $container = this.$container;
            const $content = this.$content;
            const $viewport = this.$viewport;
            const contentIsImage = $content instanceof HTMLImageElement;
            const contentIsZoomable = this.option("zoom");
            const shouldResizeParent = this.option("resizeParent", contentIsZoomable);
            let width = this.option("width");
            let height = this.option("height");
            let origWidth = width || getFullWidth($content);
            let origHeight = height || getFullHeight($content);
            Object.assign($content.style, {
                width: width ? `${width}px` : "",
                height: height ? `${height}px` : "",
                maxWidth: "",
                maxHeight: ""
            });
            if (shouldResizeParent) Object.assign($viewport.style, {
                width: "",
                height: ""
            });
            const ratio = this.option("ratio");
            origWidth = round(origWidth * ratio);
            origHeight = round(origHeight * ratio);
            width = origWidth;
            height = origHeight;
            const contentRect = $content.getBoundingClientRect();
            const viewportRect = $viewport.getBoundingClientRect();
            const containerRect = $viewport == $container ? viewportRect : $container.getBoundingClientRect();
            let viewportWidth = Math.max($viewport.offsetWidth, round(viewportRect.width));
            let viewportHeight = Math.max($viewport.offsetHeight, round(viewportRect.height));
            let viewportStyles = window.getComputedStyle($viewport);
            viewportWidth -= parseFloat(viewportStyles.paddingLeft) + parseFloat(viewportStyles.paddingRight);
            viewportHeight -= parseFloat(viewportStyles.paddingTop) + parseFloat(viewportStyles.paddingBottom);
            this.viewport.width = viewportWidth;
            this.viewport.height = viewportHeight;
            if (contentIsZoomable) {
                if (Math.abs(origWidth - contentRect.width) > .1 || Math.abs(origHeight - contentRect.height) > .1) {
                    const rez = calculateAspectRatioFit(origWidth, origHeight, Math.min(origWidth, contentRect.width), Math.min(origHeight, contentRect.height));
                    width = round(rez.width);
                    height = round(rez.height);
                }
                Object.assign($content.style, {
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: ""
                });
            }
            if (shouldResizeParent) {
                Object.assign($viewport.style, {
                    width: `${width}px`,
                    height: `${height}px`
                });
                this.viewport = {
                    ...this.viewport,
                    width,
                    height
                };
            }
            if (contentIsImage && contentIsZoomable && "function" !== typeof this.options.maxScale) {
                const maxScale = this.option("maxScale");
                this.options.maxScale = function() {
                    return this.content.origWidth > 0 && this.content.fitWidth > 0 ? this.content.origWidth / this.content.fitWidth : maxScale;
                };
            }
            this.content = {
                ...this.content,
                origWidth,
                origHeight,
                fitWidth: width,
                fitHeight: height,
                width,
                height,
                scale: 1,
                isZoomable: contentIsZoomable
            };
            this.container = {
                width: containerRect.width,
                height: containerRect.height
            };
            if (true !== silently) this.trigger("afterUpdate");
        }
        zoomIn(step) {
            this.zoomTo(this.content.scale + (step || this.option("step")));
        }
        zoomOut(step) {
            this.zoomTo(this.content.scale - (step || this.option("step")));
        }
        toggleZoom(props = {}) {
            const maxScale = this.option("maxScale");
            const baseScale = this.option("baseScale");
            const scale = this.content.scale > baseScale + .5 * (maxScale - baseScale) ? baseScale : maxScale;
            this.zoomTo(scale, props);
        }
        zoomTo(scale = this.option("baseScale"), {x = null, y = null} = {}) {
            scale = Math.max(Math.min(scale, this.option("maxScale")), this.option("minScale"));
            const currentScale = round(this.content.scale / (this.content.width / this.content.fitWidth), 1e7);
            if (null === x) x = this.content.width * currentScale * .5;
            if (null === y) y = this.content.height * currentScale * .5;
            const {deltaX, deltaY} = this.getZoomDelta(scale, x, y);
            x = this.content.x - deltaX;
            y = this.content.y - deltaY;
            this.panTo({
                x,
                y,
                scale,
                friction: this.option("zoomFriction")
            });
        }
        getZoomDelta(scale, x = 0, y = 0) {
            const currentWidth = this.content.fitWidth * this.content.scale;
            const currentHeight = this.content.fitHeight * this.content.scale;
            const percentXInCurrentBox = x > 0 && currentWidth ? x / currentWidth : 0;
            const percentYInCurrentBox = y > 0 && currentHeight ? y / currentHeight : 0;
            const nextWidth = this.content.fitWidth * scale;
            const nextHeight = this.content.fitHeight * scale;
            const deltaX = (nextWidth - currentWidth) * percentXInCurrentBox;
            const deltaY = (nextHeight - currentHeight) * percentYInCurrentBox;
            return {
                deltaX,
                deltaY
            };
        }
        panTo({x = this.content.x, y = this.content.y, scale, friction = this.option("friction"), ignoreBounds = false} = {}) {
            scale = scale || this.content.scale || 1;
            if (!ignoreBounds) {
                const {boundX, boundY} = this.getBounds(scale);
                if (boundX) x = Math.max(Math.min(x, boundX.to), boundX.from);
                if (boundY) y = Math.max(Math.min(y, boundY.to), boundY.from);
            }
            this.friction = friction;
            this.transform = {
                ...this.transform,
                x,
                y,
                scale
            };
            if (friction) {
                this.state = "panning";
                this.velocity = {
                    x: (1 / this.friction - 1) * (x - this.content.x),
                    y: (1 / this.friction - 1) * (y - this.content.y),
                    scale: (1 / this.friction - 1) * (scale - this.content.scale)
                };
                this.startAnimation();
            } else this.endAnimation();
        }
        startAnimation() {
            if (!this.rAF) this.trigger("startAnimation"); else cancelAnimationFrame(this.rAF);
            this.rAF = requestAnimationFrame((() => this.animate()));
        }
        animate() {
            this.setEdgeForce();
            this.setDragForce();
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.velocity.scale *= this.friction;
            this.content.x += this.velocity.x;
            this.content.y += this.velocity.y;
            this.content.scale += this.velocity.scale;
            if (this.isAnimating()) this.setTransform(); else if ("pointerdown" !== this.state) {
                this.endAnimation();
                return;
            }
            this.rAF = requestAnimationFrame((() => this.animate()));
        }
        getBounds(scale) {
            let boundX = this.boundX;
            let boundY = this.boundY;
            if (void 0 !== boundX && void 0 !== boundY) return {
                boundX,
                boundY
            };
            boundX = {
                from: 0,
                to: 0
            };
            boundY = {
                from: 0,
                to: 0
            };
            scale = scale || this.transform.scale;
            const width = this.content.fitWidth * scale;
            const height = this.content.fitHeight * scale;
            const viewportWidth = this.viewport.width;
            const viewportHeight = this.viewport.height;
            if (width < viewportWidth) {
                const deltaX = round(.5 * (viewportWidth - width));
                boundX.from = deltaX;
                boundX.to = deltaX;
            } else boundX.from = round(viewportWidth - width);
            if (height < viewportHeight) {
                const deltaY = .5 * (viewportHeight - height);
                boundY.from = deltaY;
                boundY.to = deltaY;
            } else boundY.from = round(viewportHeight - height);
            return {
                boundX,
                boundY
            };
        }
        setEdgeForce() {
            if ("decel" !== this.state) return;
            const bounceForce = this.option("bounceForce");
            const {boundX, boundY} = this.getBounds(Math.max(this.transform.scale, this.content.scale));
            let pastLeft, pastRight, pastTop, pastBottom;
            if (boundX) {
                pastLeft = this.content.x < boundX.from;
                pastRight = this.content.x > boundX.to;
            }
            if (boundY) {
                pastTop = this.content.y < boundY.from;
                pastBottom = this.content.y > boundY.to;
            }
            if (pastLeft || pastRight) {
                const bound = pastLeft ? boundX.from : boundX.to;
                const distance = bound - this.content.x;
                let force = distance * bounceForce;
                const restX = this.content.x + (this.velocity.x + force) / this.friction;
                if (restX >= boundX.from && restX <= boundX.to) force += this.velocity.x;
                this.velocity.x = force;
                this.recalculateTransform();
            }
            if (pastTop || pastBottom) {
                const bound = pastTop ? boundY.from : boundY.to;
                const distance = bound - this.content.y;
                let force = distance * bounceForce;
                const restY = this.content.y + (force + this.velocity.y) / this.friction;
                if (restY >= boundY.from && restY <= boundY.to) force += this.velocity.y;
                this.velocity.y = force;
                this.recalculateTransform();
            }
        }
        setDragResistance() {
            if ("pointerdown" !== this.state) return;
            const {boundX, boundY} = this.getBounds(this.dragPosition.scale);
            let pastLeft, pastRight, pastTop, pastBottom;
            if (boundX) {
                pastLeft = this.dragPosition.x < boundX.from;
                pastRight = this.dragPosition.x > boundX.to;
            }
            if (boundY) {
                pastTop = this.dragPosition.y < boundY.from;
                pastBottom = this.dragPosition.y > boundY.to;
            }
            if ((pastLeft || pastRight) && !(pastLeft && pastRight)) {
                const bound = pastLeft ? boundX.from : boundX.to;
                const distance = bound - this.dragPosition.x;
                this.dragPosition.x = bound - .3 * distance;
            }
            if ((pastTop || pastBottom) && !(pastTop && pastBottom)) {
                const bound = pastTop ? boundY.from : boundY.to;
                const distance = bound - this.dragPosition.y;
                this.dragPosition.y = bound - .3 * distance;
            }
        }
        setDragForce() {
            if ("pointerdown" === this.state) {
                this.velocity.x = this.dragPosition.x - this.content.x;
                this.velocity.y = this.dragPosition.y - this.content.y;
                this.velocity.scale = this.dragPosition.scale - this.content.scale;
            }
        }
        recalculateTransform() {
            this.transform.x = this.content.x + this.velocity.x / (1 / this.friction - 1);
            this.transform.y = this.content.y + this.velocity.y / (1 / this.friction - 1);
            this.transform.scale = this.content.scale + this.velocity.scale / (1 / this.friction - 1);
        }
        isAnimating() {
            return !!(this.friction && (Math.abs(this.velocity.x) > .05 || Math.abs(this.velocity.y) > .05 || Math.abs(this.velocity.scale) > .05));
        }
        setTransform(final) {
            let x, y, scale;
            if (final) {
                x = round(this.transform.x);
                y = round(this.transform.y);
                scale = this.transform.scale;
                this.content = {
                    ...this.content,
                    x,
                    y,
                    scale
                };
            } else {
                x = round(this.content.x);
                y = round(this.content.y);
                scale = this.content.scale / (this.content.width / this.content.fitWidth);
                this.content = {
                    ...this.content,
                    x,
                    y
                };
            }
            this.trigger("beforeTransform");
            x = round(this.content.x);
            y = round(this.content.y);
            if (final && this.option("zoom")) {
                let width;
                let height;
                width = round(this.content.fitWidth * scale);
                height = round(this.content.fitHeight * scale);
                this.content.width = width;
                this.content.height = height;
                this.transform = {
                    ...this.transform,
                    width,
                    height,
                    scale
                };
                Object.assign(this.$content.style, {
                    width: `${width}px`,
                    height: `${height}px`,
                    maxWidth: "none",
                    maxHeight: "none",
                    transform: `translate3d(${x}px, ${y}px, 0) scale(1)`
                });
            } else this.$content.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
            this.trigger("afterTransform");
        }
        endAnimation(silently) {
            cancelAnimationFrame(this.rAF);
            this.rAF = null;
            this.velocity = {
                x: 0,
                y: 0,
                scale: 0
            };
            this.setTransform(true);
            this.state = "ready";
            this.handleCursor();
            if (true !== silently) this.trigger("endAnimation");
        }
        handleCursor() {
            const draggableClass = this.option("draggableClass");
            if (!draggableClass || !this.option("touch")) return;
            if (true == this.option("panOnlyZoomed") && this.content.width <= this.viewport.width && this.content.height <= this.viewport.height && this.transform.scale <= this.option("baseScale")) this.$container.classList.remove(draggableClass); else this.$container.classList.add(draggableClass);
        }
        detachEvents() {
            this.$content.removeEventListener("load", this.onLoad);
            this.$container.removeEventListener("wheel", this.onWheel, {
                passive: false
            });
            this.$container.removeEventListener("click", this.onClick, {
                passive: false
            });
            if (this.pointerTracker) {
                this.pointerTracker.stop();
                this.pointerTracker = null;
            }
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
                this.resizeObserver = null;
            }
        }
        destroy() {
            if ("destroy" === this.state) return;
            this.state = "destroy";
            clearTimeout(this.updateTimer);
            this.updateTimer = null;
            cancelAnimationFrame(this.rAF);
            this.rAF = null;
            this.detachEvents();
            this.detachPlugins();
            this.resetDragPosition();
        }
    }
    Panzoom.version = "__VERSION__";
    Panzoom.Plugins = Plugins;
    const throttle = (func, limit) => {
        let lastCall = 0;
        return function(...args) {
            const now = (new Date).getTime();
            if (now - lastCall < limit) return;
            lastCall = now;
            return func(...args);
        };
    };
    const Navigation_defaults = {
        prevTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M15 3l-9 9 9 9"/></svg>',
        nextTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M9 3l9 9-9 9"/></svg>',
        classNames: {
            main: "carousel__nav",
            button: "carousel__button",
            next: "is-next",
            prev: "is-prev"
        }
    };
    class Navigation_Navigation {
        constructor(carousel) {
            this.$container = null;
            this.$prev = null;
            this.$next = null;
            this.carousel = carousel;
            this.onRefresh = this.onRefresh.bind(this);
        }
        option(name) {
            return this.carousel.option(`Navigation.${name}`);
        }
        createButton(type) {
            const $btn = document.createElement("button");
            $btn.setAttribute("title", this.carousel.localize(`{{${type.toUpperCase()}}}`));
            const classNames = this.option("classNames.button") + " " + this.option(`classNames.${type}`);
            $btn.classList.add(...classNames.split(" "));
            $btn.setAttribute("tabindex", "0");
            $btn.innerHTML = this.carousel.localize(this.option(`${type}Tpl`));
            $btn.addEventListener("click", (event => {
                event.preventDefault();
                event.stopPropagation();
                this.carousel[`slide${"next" === type ? "Next" : "Prev"}`]();
            }));
            return $btn;
        }
        build() {
            if (!this.$container) {
                this.$container = document.createElement("div");
                this.$container.classList.add(...this.option("classNames.main").split(" "));
                this.carousel.$container.appendChild(this.$container);
            }
            if (!this.$next) {
                this.$next = this.createButton("next");
                this.$container.appendChild(this.$next);
            }
            if (!this.$prev) {
                this.$prev = this.createButton("prev");
                this.$container.appendChild(this.$prev);
            }
        }
        onRefresh() {
            const pageCount = this.carousel.pages.length;
            if (pageCount <= 1 || pageCount > 1 && this.carousel.elemDimWidth < this.carousel.wrapDimWidth && !Number.isInteger(this.carousel.option("slidesPerPage"))) {
                this.cleanup();
                return;
            }
            this.build();
            this.$prev.removeAttribute("disabled");
            this.$next.removeAttribute("disabled");
            if (this.carousel.option("infiniteX", this.carousel.option("infinite"))) return;
            if (this.carousel.page <= 0) this.$prev.setAttribute("disabled", "");
            if (this.carousel.page >= pageCount - 1) this.$next.setAttribute("disabled", "");
        }
        cleanup() {
            if (this.$prev) this.$prev.remove();
            this.$prev = null;
            if (this.$next) this.$next.remove();
            this.$next = null;
            if (this.$container) this.$container.remove();
            this.$container = null;
        }
        attach() {
            this.carousel.on("refresh change", this.onRefresh);
        }
        detach() {
            this.carousel.off("refresh change", this.onRefresh);
            this.cleanup();
        }
    }
    Navigation_Navigation.defaults = Navigation_defaults;
    class Dots {
        constructor(carousel) {
            this.carousel = carousel;
            this.$list = null;
            this.events = {
                change: this.onChange.bind(this),
                refresh: this.onRefresh.bind(this)
            };
        }
        buildList() {
            if (this.carousel.pages.length < this.carousel.option("Dots.minSlideCount")) return;
            const $list = document.createElement("ol");
            $list.classList.add("carousel__dots");
            $list.addEventListener("click", (e => {
                if (!("page" in e.target.dataset)) return;
                e.preventDefault();
                e.stopPropagation();
                const page = parseInt(e.target.dataset.page, 10);
                const carousel = this.carousel;
                if (page === carousel.page) return;
                if (carousel.pages.length < 3 && carousel.option("infinite")) carousel[0 == page ? "slidePrev" : "slideNext"](); else carousel.slideTo(page);
            }));
            this.$list = $list;
            this.carousel.$container.appendChild($list);
            this.carousel.$container.classList.add("has-dots");
            return $list;
        }
        removeList() {
            if (this.$list) {
                this.$list.parentNode.removeChild(this.$list);
                this.$list = null;
            }
            this.carousel.$container.classList.remove("has-dots");
        }
        rebuildDots() {
            let $list = this.$list;
            const listExists = !!$list;
            const pagesCount = this.carousel.pages.length;
            if (pagesCount < 2) {
                if (listExists) this.removeList();
                return;
            }
            if (!listExists) $list = this.buildList();
            const dotCount = this.$list.children.length;
            if (dotCount > pagesCount) {
                for (let i = pagesCount; i < dotCount; i++) this.$list.removeChild(this.$list.lastChild);
                return;
            }
            for (let index = dotCount; index < pagesCount; index++) {
                const $dot = document.createElement("li");
                $dot.classList.add("carousel__dot");
                $dot.dataset.page = index;
                $dot.setAttribute("role", "button");
                $dot.setAttribute("tabindex", "0");
                $dot.setAttribute("title", this.carousel.localize("{{GOTO}}", [ [ "%d", index + 1 ] ]));
                $dot.addEventListener("keydown", (event => {
                    const code = event.code;
                    let $el;
                    if ("Enter" === code || "NumpadEnter" === code) $el = $dot; else if ("ArrowRight" === code) $el = $dot.nextSibling; else if ("ArrowLeft" === code) $el = $dot.previousSibling;
                    $el && $el.click();
                }));
                this.$list.appendChild($dot);
            }
            this.setActiveDot();
        }
        setActiveDot() {
            if (!this.$list) return;
            this.$list.childNodes.forEach(($dot => {
                $dot.classList.remove("is-selected");
            }));
            const $activeDot = this.$list.childNodes[this.carousel.page];
            if ($activeDot) $activeDot.classList.add("is-selected");
        }
        onChange() {
            this.setActiveDot();
        }
        onRefresh() {
            this.rebuildDots();
        }
        attach() {
            this.carousel.on(this.events);
        }
        detach() {
            this.removeList();
            this.carousel.off(this.events);
            this.carousel = null;
        }
    }
    const Sync_defaults = {
        friction: .92
    };
    class Sync {
        constructor(carousel) {
            this.carousel = carousel;
            this.selectedIndex = null;
            this.friction = 0;
            this.onNavReady = this.onNavReady.bind(this);
            this.onNavClick = this.onNavClick.bind(this);
            this.onNavCreateSlide = this.onNavCreateSlide.bind(this);
            this.onTargetChange = this.onTargetChange.bind(this);
        }
        addAsTargetFor(nav) {
            this.target = this.carousel;
            this.nav = nav;
            this.attachEvents();
        }
        addAsNavFor(target) {
            this.target = target;
            this.nav = this.carousel;
            this.attachEvents();
        }
        attachEvents() {
            this.nav.options.initialSlide = this.target.options.initialPage;
            this.nav.on("ready", this.onNavReady);
            this.nav.on("createSlide", this.onNavCreateSlide);
            this.nav.on("Panzoom.click", this.onNavClick);
            this.target.on("change", this.onTargetChange);
            this.target.on("Panzoom.afterUpdate", this.onTargetChange);
        }
        onNavReady() {
            this.onTargetChange(true);
        }
        onNavClick(carousel, panzoom, event) {
            const clickedNavSlide = event.target.closest(".carousel__slide");
            if (!clickedNavSlide) return;
            event.stopPropagation();
            const selectedNavIndex = parseInt(clickedNavSlide.dataset.index, 10);
            const selectedSyncPage = this.target.findPageForSlide(selectedNavIndex);
            if (this.target.page !== selectedSyncPage) this.target.slideTo(selectedSyncPage, {
                friction: this.friction
            });
            this.markSelectedSlide(selectedNavIndex);
        }
        onNavCreateSlide(carousel, slide) {
            if (slide.index === this.selectedIndex) this.markSelectedSlide(slide.index);
        }
        onTargetChange() {
            const targetIndex = this.target.pages[this.target.page].indexes[0];
            const selectedNavPage = this.nav.findPageForSlide(targetIndex);
            this.nav.slideTo(selectedNavPage);
            this.markSelectedSlide(targetIndex);
        }
        markSelectedSlide(selectedIndex) {
            this.selectedIndex = selectedIndex;
            [ ...this.nav.slides ].filter((slide => slide.$el && slide.$el.classList.remove("is-nav-selected")));
            const slide = this.nav.slides[selectedIndex];
            if (slide && slide.$el) slide.$el.classList.add("is-nav-selected");
        }
        attach(carousel) {
            const sync = carousel.options.Sync;
            if (!sync.target && !sync.nav) return;
            if (sync.target) this.addAsNavFor(sync.target); else if (sync.nav) this.addAsTargetFor(sync.nav);
            this.friction = sync.friction;
        }
        detach() {
            if (this.nav) {
                this.nav.off("ready", this.onNavReady);
                this.nav.off("Panzoom.click", this.onNavClick);
                this.nav.off("createSlide", this.onNavCreateSlide);
            }
            if (this.target) {
                this.target.off("Panzoom.afterUpdate", this.onTargetChange);
                this.target.off("change", this.onTargetChange);
            }
        }
    }
    Sync.defaults = Sync_defaults;
    const plugins_Plugins = {
        Navigation: Navigation_Navigation,
        Dots,
        Sync
    };
    const en = {
        NEXT: "Next slide",
        PREV: "Previous slide",
        GOTO: "Go to slide #%d"
    };
    const Carousel_defaults = {
        slides: [],
        preload: 0,
        slidesPerPage: "auto",
        initialPage: null,
        initialSlide: null,
        friction: .92,
        center: true,
        infinite: true,
        fill: true,
        dragFree: false,
        prefix: "",
        classNames: {
            viewport: "carousel__viewport",
            track: "carousel__track",
            slide: "carousel__slide",
            slideSelected: "is-selected"
        },
        l10n: en
    };
    class Carousel extends Base {
        constructor($container, options = {}) {
            options = extend_extend(true, {}, Carousel_defaults, options);
            super(options);
            this.state = "init";
            this.$container = $container;
            if (!(this.$container instanceof HTMLElement)) throw new Error("No root element provided");
            this.slideNext = throttle(this.slideNext.bind(this), 250, true);
            this.slidePrev = throttle(this.slidePrev.bind(this), 250, true);
            this.init();
            $container.__Carousel = this;
        }
        init() {
            this.pages = [];
            this.page = this.pageIndex = null;
            this.prevPage = this.prevPageIndex = null;
            this.attachPlugins(Carousel.Plugins);
            this.trigger("init");
            this.initLayout();
            this.initSlides();
            this.updateMetrics();
            if (this.$track && this.pages.length) this.$track.style.transform = `translate3d(${-1 * this.pages[this.page].left}px, 0px, 0) scale(1)`;
            this.manageSlideVisiblity();
            this.initPanzoom();
            this.state = "ready";
            this.trigger("ready");
        }
        initLayout() {
            const prefix = this.option("prefix");
            const classNames = this.option("classNames");
            this.$viewport = this.option("viewport") || this.$container.querySelector(`.${prefix}${classNames.viewport}`);
            if (!this.$viewport) {
                this.$viewport = document.createElement("div");
                this.$viewport.classList.add(...(prefix + classNames.viewport).split(" "));
                this.$viewport.append(...this.$container.childNodes);
                this.$container.appendChild(this.$viewport);
            }
            this.$track = this.option("track") || this.$container.querySelector(`.${prefix}${classNames.track}`);
            if (!this.$track) {
                this.$track = document.createElement("div");
                this.$track.classList.add(...(prefix + classNames.track).split(" "));
                this.$track.append(...this.$viewport.childNodes);
                this.$viewport.appendChild(this.$track);
            }
        }
        initSlides() {
            this.slides = [];
            const elems = this.$viewport.querySelectorAll(`.${this.option("prefix")}${this.option("classNames.slide")}`);
            elems.forEach((el => {
                const slide = {
                    $el: el,
                    isDom: true
                };
                this.slides.push(slide);
                this.trigger("createSlide", slide, this.slides.length);
            }));
            if (Array.isArray(this.options.slides)) this.slides = extend_extend(true, [ ...this.slides ], this.options.slides);
        }
        updateMetrics() {
            let contentWidth = 0;
            let indexes = [];
            let lastSlideWidth;
            this.slides.forEach(((slide, index) => {
                const $el = slide.$el;
                const slideWidth = slide.isDom || !lastSlideWidth ? this.getSlideMetrics($el) : lastSlideWidth;
                slide.index = index;
                slide.width = slideWidth;
                slide.left = contentWidth;
                lastSlideWidth = slideWidth;
                contentWidth += slideWidth;
                indexes.push(index);
            }));
            let viewportWidth = Math.max(this.$track.offsetWidth, round(this.$track.getBoundingClientRect().width));
            let viewportStyles = getComputedStyle(this.$track);
            viewportWidth -= parseFloat(viewportStyles.paddingLeft) + parseFloat(viewportStyles.paddingRight);
            this.contentWidth = contentWidth;
            this.viewportWidth = viewportWidth;
            const pages = [];
            const slidesPerPage = this.option("slidesPerPage");
            if (Number.isInteger(slidesPerPage) && contentWidth > viewportWidth) for (let i = 0; i < this.slides.length; i += slidesPerPage) pages.push({
                indexes: indexes.slice(i, i + slidesPerPage),
                slides: this.slides.slice(i, i + slidesPerPage)
            }); else {
                let currentPage = 0;
                let currentWidth = 0;
                for (let i = 0; i < this.slides.length; i += 1) {
                    let slide = this.slides[i];
                    if (!pages.length || currentWidth + slide.width > viewportWidth) {
                        pages.push({
                            indexes: [],
                            slides: []
                        });
                        currentPage = pages.length - 1;
                        currentWidth = 0;
                    }
                    currentWidth += slide.width;
                    pages[currentPage].indexes.push(i);
                    pages[currentPage].slides.push(slide);
                }
            }
            const shouldCenter = this.option("center");
            const shouldFill = this.option("fill");
            pages.forEach(((page, index) => {
                page.index = index;
                page.width = page.slides.reduce(((sum, slide) => sum + slide.width), 0);
                page.left = page.slides[0].left;
                if (shouldCenter) page.left += .5 * (viewportWidth - page.width) * -1;
                if (shouldFill && !this.option("infiniteX", this.option("infinite")) && contentWidth > viewportWidth) {
                    page.left = Math.max(page.left, 0);
                    page.left = Math.min(page.left, contentWidth - viewportWidth);
                }
            }));
            const rez = [];
            let prevPage;
            pages.forEach((page2 => {
                const page = {
                    ...page2
                };
                if (prevPage && page.left === prevPage.left) {
                    prevPage.width += page.width;
                    prevPage.slides = [ ...prevPage.slides, ...page.slides ];
                    prevPage.indexes = [ ...prevPage.indexes, ...page.indexes ];
                } else {
                    page.index = rez.length;
                    prevPage = page;
                    rez.push(page);
                }
            }));
            this.pages = rez;
            let page = this.page;
            if (null === page) {
                const initialSlide = this.option("initialSlide");
                if (null !== initialSlide) page = this.findPageForSlide(initialSlide); else page = parseInt(this.option("initialPage", 0), 10) || 0;
                if (!rez[page]) page = rez.length && page > rez.length ? rez[rez.length - 1].index : 0;
                this.page = page;
                this.pageIndex = page;
            }
            this.updatePanzoom();
            this.trigger("refresh");
        }
        getSlideMetrics(node) {
            if (!node) {
                const firstSlide = this.slides[0];
                node = document.createElement("div");
                node.dataset.isTestEl = 1;
                node.style.visibility = "hidden";
                node.classList.add(...(this.option("prefix") + this.option("classNames.slide")).split(" "));
                if (firstSlide.customClass) node.classList.add(...firstSlide.customClass.split(" "));
                this.$track.prepend(node);
            }
            let width = Math.max(node.offsetWidth, round(node.getBoundingClientRect().width));
            const style = node.currentStyle || window.getComputedStyle(node);
            width = width + (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
            if (node.dataset.isTestEl) node.remove();
            return width;
        }
        findPageForSlide(index) {
            index = parseInt(index, 10) || 0;
            const page = this.pages.find((page => page.indexes.indexOf(index) > -1));
            return page ? page.index : null;
        }
        slideNext() {
            this.slideTo(this.pageIndex + 1);
        }
        slidePrev() {
            this.slideTo(this.pageIndex - 1);
        }
        slideTo(page, params = {}) {
            const {x = -1 * this.setPage(page, true), y = 0, friction = this.option("friction")} = params;
            if (this.Panzoom.content.x === x && !this.Panzoom.velocity.x && friction) return;
            this.Panzoom.panTo({
                x,
                y,
                friction,
                ignoreBounds: true
            });
            if ("ready" === this.state && "ready" === this.Panzoom.state) this.trigger("settle");
        }
        initPanzoom() {
            if (this.Panzoom) this.Panzoom.destroy();
            const options = extend_extend(true, {}, {
                content: this.$track,
                wrapInner: false,
                resizeParent: false,
                zoom: false,
                click: false,
                lockAxis: "x",
                x: this.pages.length ? -1 * this.pages[this.page].left : 0,
                centerOnStart: false,
                textSelection: () => this.option("textSelection", false),
                panOnlyZoomed: function() {
                    return this.content.width <= this.viewport.width;
                }
            }, this.option("Panzoom"));
            this.Panzoom = new Panzoom(this.$container, options);
            this.Panzoom.on({
                "*": (name, ...details) => this.trigger(`Panzoom.${name}`, ...details),
                afterUpdate: () => {
                    this.updatePage();
                },
                beforeTransform: this.onBeforeTransform.bind(this),
                touchEnd: this.onTouchEnd.bind(this),
                endAnimation: () => {
                    this.trigger("settle");
                }
            });
            this.updateMetrics();
            this.manageSlideVisiblity();
        }
        updatePanzoom() {
            if (!this.Panzoom) return;
            this.Panzoom.content = {
                ...this.Panzoom.content,
                fitWidth: this.contentWidth,
                origWidth: this.contentWidth,
                width: this.contentWidth
            };
            if (this.pages.length > 1 && this.option("infiniteX", this.option("infinite"))) this.Panzoom.boundX = null; else if (this.pages.length) this.Panzoom.boundX = {
                from: -1 * this.pages[this.pages.length - 1].left,
                to: -1 * this.pages[0].left
            };
            if (this.option("infiniteY", this.option("infinite"))) this.Panzoom.boundY = null; else this.Panzoom.boundY = {
                from: 0,
                to: 0
            };
            this.Panzoom.handleCursor();
        }
        manageSlideVisiblity() {
            const contentWidth = this.contentWidth;
            const viewportWidth = this.viewportWidth;
            let currentX = this.Panzoom ? -1 * this.Panzoom.content.x : this.pages.length ? this.pages[this.page].left : 0;
            const preload = this.option("preload");
            const infinite = this.option("infiniteX", this.option("infinite"));
            const paddingLeft = parseFloat(getComputedStyle(this.$viewport, null).getPropertyValue("padding-left"));
            const paddingRight = parseFloat(getComputedStyle(this.$viewport, null).getPropertyValue("padding-right"));
            this.slides.forEach((slide => {
                let leftBoundary, rightBoundary;
                let hasDiff = 0;
                leftBoundary = currentX - paddingLeft;
                rightBoundary = currentX + viewportWidth + paddingRight;
                leftBoundary -= preload * (viewportWidth + paddingLeft + paddingRight);
                rightBoundary += preload * (viewportWidth + paddingLeft + paddingRight);
                const insideCurrentInterval = slide.left + slide.width > leftBoundary && slide.left < rightBoundary;
                leftBoundary = currentX + contentWidth - paddingLeft;
                rightBoundary = currentX + contentWidth + viewportWidth + paddingRight;
                leftBoundary -= preload * (viewportWidth + paddingLeft + paddingRight);
                const insidePrevInterval = infinite && slide.left + slide.width > leftBoundary && slide.left < rightBoundary;
                leftBoundary = currentX - contentWidth - paddingLeft;
                rightBoundary = currentX - contentWidth + viewportWidth + paddingRight;
                leftBoundary -= preload * (viewportWidth + paddingLeft + paddingRight);
                const insideNextInterval = infinite && slide.left + slide.width > leftBoundary && slide.left < rightBoundary;
                if (insidePrevInterval || insideCurrentInterval || insideNextInterval) {
                    this.createSlideEl(slide);
                    if (insideCurrentInterval) hasDiff = 0;
                    if (insidePrevInterval) hasDiff = -1;
                    if (insideNextInterval) hasDiff = 1;
                    if (slide.left + slide.width > currentX && slide.left <= currentX + viewportWidth + paddingRight) hasDiff = 0;
                } else this.removeSlideEl(slide);
                slide.hasDiff = hasDiff;
            }));
            let nextIndex = 0;
            let nextPos = 0;
            this.slides.forEach(((slide, index) => {
                let updatedX = 0;
                if (slide.$el) {
                    if (index !== nextIndex || slide.hasDiff) updatedX = nextPos + slide.hasDiff * contentWidth; else nextPos = 0;
                    slide.$el.style.left = Math.abs(updatedX) > .1 ? `${nextPos + slide.hasDiff * contentWidth}px` : "";
                    nextIndex++;
                } else nextPos += slide.width;
            }));
            this.markSelectedSlides();
        }
        createSlideEl(slide) {
            if (!slide) return;
            if (slide.$el) {
                let curentIndex = slide.$el.dataset.index;
                if (!curentIndex || parseInt(curentIndex, 10) !== slide.index) {
                    slide.$el.dataset.index = slide.index;
                    slide.$el.querySelectorAll("[data-lazy-srcset]").forEach((node => {
                        node.srcset = node.dataset.lazySrcset;
                    }));
                    slide.$el.querySelectorAll("[data-lazy-src]").forEach((node => {
                        let lazySrc = node.dataset.lazySrc;
                        if (node instanceof HTMLImageElement) node.src = lazySrc; else node.style.backgroundImage = `url('${lazySrc}')`;
                    }));
                    let lazySrc;
                    if (lazySrc = slide.$el.dataset.lazySrc) slide.$el.style.backgroundImage = `url('${lazySrc}')`;
                    slide.state = "ready";
                }
                return;
            }
            const div = document.createElement("div");
            div.dataset.index = slide.index;
            div.classList.add(...(this.option("prefix") + this.option("classNames.slide")).split(" "));
            if (slide.customClass) div.classList.add(...slide.customClass.split(" "));
            if (slide.html) div.innerHTML = slide.html;
            const allElelements = [];
            this.slides.forEach(((slide, index) => {
                if (slide.$el) allElelements.push(index);
            }));
            const goal = slide.index;
            let refSlide = null;
            if (allElelements.length) {
                let refIndex = allElelements.reduce(((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev));
                refSlide = this.slides[refIndex];
            }
            this.$track.insertBefore(div, refSlide && refSlide.$el ? refSlide.index < slide.index ? refSlide.$el.nextSibling : refSlide.$el : null);
            slide.$el = div;
            this.trigger("createSlide", slide, goal);
            return slide;
        }
        removeSlideEl(slide) {
            if (slide.$el && !slide.isDom) {
                this.trigger("removeSlide", slide);
                slide.$el.remove();
                slide.$el = null;
            }
        }
        markSelectedSlides() {
            const selectedClass = this.option("classNames.slideSelected");
            const attr = "aria-hidden";
            this.slides.forEach(((slide, index) => {
                const $el = slide.$el;
                if (!$el) return;
                const page = this.pages[this.page];
                if (page && page.indexes && page.indexes.indexOf(index) > -1) {
                    if (selectedClass && !$el.classList.contains(selectedClass)) {
                        $el.classList.add(selectedClass);
                        this.trigger("selectSlide", slide);
                    }
                    $el.removeAttribute(attr);
                } else {
                    if (selectedClass && $el.classList.contains(selectedClass)) {
                        $el.classList.remove(selectedClass);
                        this.trigger("unselectSlide", slide);
                    }
                    $el.setAttribute(attr, true);
                }
            }));
        }
        updatePage() {
            this.updateMetrics();
            this.slideTo(this.page, {
                friction: 0
            });
        }
        onBeforeTransform() {
            if (this.option("infiniteX", this.option("infinite"))) this.manageInfiniteTrack();
            this.manageSlideVisiblity();
        }
        manageInfiniteTrack() {
            const contentWidth = this.contentWidth;
            const viewportWidth = this.viewportWidth;
            if (!this.option("infiniteX", this.option("infinite")) || this.pages.length < 2 || contentWidth < viewportWidth) return;
            const panzoom = this.Panzoom;
            let isFlipped = false;
            if (panzoom.content.x < -1 * (contentWidth - viewportWidth)) {
                panzoom.content.x += contentWidth;
                this.pageIndex = this.pageIndex - this.pages.length;
                isFlipped = true;
            }
            if (panzoom.content.x > viewportWidth) {
                panzoom.content.x -= contentWidth;
                this.pageIndex = this.pageIndex + this.pages.length;
                isFlipped = true;
            }
            if (isFlipped && "pointerdown" === panzoom.state) panzoom.resetDragPosition();
            return isFlipped;
        }
        onTouchEnd(panzoom, event) {
            const dragFree = this.option("dragFree");
            if (!dragFree && this.pages.length > 1 && panzoom.dragOffset.time < 350 && Math.abs(panzoom.dragOffset.y) < 1 && Math.abs(panzoom.dragOffset.x) > 5) {
                this[panzoom.dragOffset.x < 0 ? "slideNext" : "slidePrev"]();
                return;
            }
            if (dragFree) {
                const [, nextPageIndex] = this.getPageFromPosition(-1 * panzoom.transform.x);
                this.setPage(nextPageIndex);
            } else this.slideToClosest();
        }
        slideToClosest(params = {}) {
            let [, nextPageIndex] = this.getPageFromPosition(-1 * this.Panzoom.content.x);
            this.slideTo(nextPageIndex, params);
        }
        getPageFromPosition(xPos) {
            const pageCount = this.pages.length;
            const center = this.option("center");
            if (center) xPos += .5 * this.viewportWidth;
            const interval = Math.floor(xPos / this.contentWidth);
            xPos -= interval * this.contentWidth;
            let slide = this.slides.find((slide => slide.left <= xPos && slide.left + slide.width > xPos));
            if (slide) {
                let pageIndex = this.findPageForSlide(slide.index);
                return [ pageIndex, pageIndex + interval * pageCount ];
            }
            return [ 0, 0 ];
        }
        setPage(page, toClosest) {
            let nextPosition = 0;
            let pageIndex = parseInt(page, 10) || 0;
            const prevPage = this.page, prevPageIndex = this.pageIndex, pageCount = this.pages.length;
            const contentWidth = this.contentWidth;
            const viewportWidth = this.viewportWidth;
            page = (pageIndex % pageCount + pageCount) % pageCount;
            if (this.option("infiniteX", this.option("infinite")) && contentWidth > viewportWidth) {
                const nextInterval = Math.floor(pageIndex / pageCount) || 0, elemDimWidth = contentWidth;
                nextPosition = this.pages[page].left + nextInterval * elemDimWidth;
                if (true === toClosest && pageCount > 2) {
                    let currPosition = -1 * this.Panzoom.content.x;
                    const decreasedPosition = nextPosition - elemDimWidth, increasedPosition = nextPosition + elemDimWidth, diff1 = Math.abs(currPosition - nextPosition), diff2 = Math.abs(currPosition - decreasedPosition), diff3 = Math.abs(currPosition - increasedPosition);
                    if (diff3 < diff1 && diff3 <= diff2) {
                        nextPosition = increasedPosition;
                        pageIndex += pageCount;
                    } else if (diff2 < diff1 && diff2 < diff3) {
                        nextPosition = decreasedPosition;
                        pageIndex -= pageCount;
                    }
                }
            } else {
                page = pageIndex = Math.max(0, Math.min(pageIndex, pageCount - 1));
                nextPosition = this.pages.length ? this.pages[page].left : 0;
            }
            this.page = page;
            this.pageIndex = pageIndex;
            if (null !== prevPage && page !== prevPage) {
                this.prevPage = prevPage;
                this.prevPageIndex = prevPageIndex;
                this.trigger("change", page, prevPage);
            }
            return nextPosition;
        }
        destroy() {
            this.state = "destroy";
            this.slides.forEach((slide => {
                this.removeSlideEl(slide);
            }));
            this.slides = [];
            this.Panzoom.destroy();
            this.detachPlugins();
        }
    }
    Carousel.version = "__VERSION__";
    Carousel.Plugins = plugins_Plugins;
    class ScrollLock {
        constructor(fancybox) {
            this.fancybox = fancybox;
            this.viewport = null;
            this.pendingUpdate = null;
            for (const methodName of [ "onReady", "onResize", "onTouchstart", "onTouchmove" ]) this[methodName] = this[methodName].bind(this);
        }
        onReady() {
            const viewport = window.visualViewport;
            if (viewport) {
                this.viewport = viewport;
                this.startY = 0;
                viewport.addEventListener("resize", this.onResize);
                this.updateViewport();
            }
            window.addEventListener("touchstart", this.onTouchstart, {
                passive: false
            });
            window.addEventListener("touchmove", this.onTouchmove, {
                passive: false
            });
            window.addEventListener("wheel", this.onWheel, {
                passive: false
            });
        }
        onResize() {
            this.updateViewport();
        }
        updateViewport() {
            const fancybox = this.fancybox, viewport = this.viewport, scale = viewport.scale || 1, $container = fancybox.$container;
            if (!$container) return;
            let width = "", height = "", transform = "";
            if (scale - 1 > .1) {
                width = `${viewport.width * scale}px`;
                height = `${viewport.height * scale}px`;
                transform = `translate3d(${viewport.offsetLeft}px, ${viewport.offsetTop}px, 0) scale(${1 / scale})`;
            }
            $container.style.width = width;
            $container.style.height = height;
            $container.style.transform = transform;
        }
        onTouchstart(event) {
            this.startY = event.touches ? event.touches[0].screenY : event.screenY;
        }
        onTouchmove(event) {
            const startY = this.startY;
            const zoom = window.innerWidth / window.document.documentElement.clientWidth;
            if (!event.cancelable) return;
            if (event.touches.length > 1 || 1 !== zoom) return;
            const el = isScrollable(event.composedPath()[0]);
            if (!el) {
                event.preventDefault();
                return;
            }
            const style = window.getComputedStyle(el);
            const height = parseInt(style.getPropertyValue("height"), 10);
            const curY = event.touches ? event.touches[0].screenY : event.screenY;
            const isAtTop = startY <= curY && 0 === el.scrollTop;
            const isAtBottom = startY >= curY && el.scrollHeight - el.scrollTop === height;
            if (isAtTop || isAtBottom) event.preventDefault();
        }
        onWheel(event) {
            if (!isScrollable(event.composedPath()[0])) event.preventDefault();
        }
        cleanup() {
            if (this.pendingUpdate) {
                cancelAnimationFrame(this.pendingUpdate);
                this.pendingUpdate = null;
            }
            const viewport = this.viewport;
            if (viewport) {
                viewport.removeEventListener("resize", this.onResize);
                this.viewport = null;
            }
            window.removeEventListener("touchstart", this.onTouchstart, false);
            window.removeEventListener("touchmove", this.onTouchmove, false);
            window.removeEventListener("wheel", this.onWheel, {
                passive: false
            });
        }
        attach() {
            this.fancybox.on("initLayout", this.onReady);
        }
        detach() {
            this.fancybox.off("initLayout", this.onReady);
            this.cleanup();
        }
    }
    const Thumbs_defaults = {
        minSlideCount: 2,
        minScreenHeight: 500,
        autoStart: true,
        key: "t",
        Carousel: {},
        tpl: `<div class="fancybox__thumb" style="background-image:url('{{src}}')"></div>`
    };
    class Thumbs {
        constructor(fancybox) {
            this.fancybox = fancybox;
            this.$container = null;
            this.state = "init";
            for (const methodName of [ "onPrepare", "onClosing", "onKeydown" ]) this[methodName] = this[methodName].bind(this);
            this.events = {
                prepare: this.onPrepare,
                closing: this.onClosing,
                keydown: this.onKeydown
            };
        }
        onPrepare() {
            const slides = this.getSlides();
            if (slides.length < this.fancybox.option("Thumbs.minSlideCount")) {
                this.state = "disabled";
                return;
            }
            if (true === this.fancybox.option("Thumbs.autoStart") && this.fancybox.Carousel.Panzoom.content.height >= this.fancybox.option("Thumbs.minScreenHeight")) this.build();
        }
        onClosing() {
            if (this.Carousel) this.Carousel.Panzoom.detachEvents();
        }
        onKeydown(fancybox, key) {
            if (key === fancybox.option("Thumbs.key")) this.toggle();
        }
        build() {
            if (this.$container) return;
            const $container = document.createElement("div");
            $container.classList.add("fancybox__thumbs");
            this.fancybox.$carousel.parentNode.insertBefore($container, this.fancybox.$carousel.nextSibling);
            this.Carousel = new Carousel($container, extend_extend(true, {
                Dots: false,
                Navigation: false,
                Sync: {
                    friction: 0
                },
                infinite: false,
                center: true,
                fill: true,
                dragFree: true,
                slidesPerPage: 1,
                preload: 1
            }, this.fancybox.option("Thumbs.Carousel"), {
                Sync: {
                    target: this.fancybox.Carousel
                },
                slides: this.getSlides()
            }));
            this.Carousel.Panzoom.on("wheel", ((panzoom, event) => {
                event.preventDefault();
                this.fancybox[event.deltaY < 0 ? "prev" : "next"]();
            }));
            this.$container = $container;
            this.state = "visible";
        }
        getSlides() {
            const slides = [];
            for (const slide of this.fancybox.items) {
                const thumb = slide.thumb;
                if (thumb) slides.push({
                    html: this.fancybox.option("Thumbs.tpl").replace(/\{\{src\}\}/gi, thumb),
                    customClass: `has-thumb has-${slide.type || "image"}`
                });
            }
            return slides;
        }
        toggle() {
            if ("visible" === this.state) this.hide(); else if ("hidden" === this.state) this.show(); else this.build();
        }
        show() {
            if ("hidden" === this.state) {
                this.$container.style.display = "";
                this.Carousel.Panzoom.attachEvents();
                this.state = "visible";
            }
        }
        hide() {
            if ("visible" === this.state) {
                this.Carousel.Panzoom.detachEvents();
                this.$container.style.display = "none";
                this.state = "hidden";
            }
        }
        cleanup() {
            if (this.Carousel) {
                this.Carousel.destroy();
                this.Carousel = null;
            }
            if (this.$container) {
                this.$container.remove();
                this.$container = null;
            }
            this.state = "init";
        }
        attach() {
            this.fancybox.on(this.events);
        }
        detach() {
            this.fancybox.off(this.events);
            this.cleanup();
        }
    }
    Thumbs.defaults = Thumbs_defaults;
    const buildURLQuery = (src, obj) => {
        const url = new URL(src);
        const params = new URLSearchParams(url.search);
        let rez = new URLSearchParams;
        for (const [key, value] of [ ...params, ...Object.entries(obj) ]) if ("t" === key) rez.set("start", parseInt(value)); else rez.set(key, value);
        rez = rez.toString();
        let matches = src.match(/#t=((.*)?\d+s)/);
        if (matches) rez += `#t=${matches[1]}`;
        return rez;
    };
    const Html_defaults = {
        video: {
            autoplay: true,
            ratio: 16 / 9
        },
        youtube: {
            autohide: 1,
            fs: 1,
            rel: 0,
            hd: 1,
            wmode: "transparent",
            enablejsapi: 1,
            html5: 1
        },
        vimeo: {
            hd: 1,
            show_title: 1,
            show_byline: 1,
            show_portrait: 0,
            fullscreen: 1
        },
        html5video: {
            tpl: `<video class="fancybox__html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">\n  <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.</video>`,
            format: ""
        }
    };
    class Html {
        constructor(fancybox) {
            this.fancybox = fancybox;
            for (const methodName of [ "onInit", "onReady", "onCreateSlide", "onRemoveSlide", "onSelectSlide", "onUnselectSlide", "onRefresh", "onMessage" ]) this[methodName] = this[methodName].bind(this);
            this.events = {
                init: this.onInit,
                ready: this.onReady,
                "Carousel.createSlide": this.onCreateSlide,
                "Carousel.removeSlide": this.onRemoveSlide,
                "Carousel.selectSlide": this.onSelectSlide,
                "Carousel.unselectSlide": this.onUnselectSlide,
                "Carousel.refresh": this.onRefresh
            };
        }
        onInit() {
            for (const slide of this.fancybox.items) this.processType(slide);
        }
        processType(slide) {
            if (slide.html) {
                slide.src = slide.html;
                slide.type = "html";
                delete slide.html;
                return;
            }
            const src = slide.src || "";
            let type = slide.type || this.fancybox.options.type, rez = null;
            if (src && "string" !== typeof src) return;
            if (rez = src.match(/(?:youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i)) {
                const params = buildURLQuery(src, this.fancybox.option("Html.youtube"));
                const videoId = encodeURIComponent(rez[1]);
                slide.videoId = videoId;
                slide.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
                slide.thumb = slide.thumb || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
                slide.vendor = "youtube";
                type = "video";
            } else if (rez = src.match(/^.+vimeo.com\/(?:\/)?([\d]+)(.*)?/)) {
                const params = buildURLQuery(src, this.fancybox.option("Html.vimeo"));
                const videoId = encodeURIComponent(rez[1]);
                slide.videoId = videoId;
                slide.src = `https://player.vimeo.com/video/${videoId}?${params}`;
                slide.vendor = "vimeo";
                type = "video";
            } else if (rez = src.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i)) {
                slide.src = `//maps.google.${rez[1]}/?ll=${(rez[2] ? rez[2] + "&z=" + Math.floor(rez[3]) + (rez[4] ? rez[4].replace(/^\//, "&") : "") : rez[4] + "").replace(/\?/, "&")}&output=${rez[4] && rez[4].indexOf("layer=c") > 0 ? "svembed" : "embed"}`;
                type = "map";
            } else if (rez = src.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i)) {
                slide.src = `//maps.google.${rez[1]}/maps?q=${rez[2].replace("query=", "q=").replace("api=1", "")}&output=embed`;
                type = "map";
            }
            if (!type) if ("#" === src.charAt(0)) type = "inline"; else if (rez = src.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) {
                type = "html5video";
                slide.format = slide.format || "video/" + ("ogv" === rez[1] ? "ogg" : rez[1]);
            } else if (src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)) type = "image"; else if (src.match(/\.(pdf)((\?|#).*)?$/i)) type = "pdf";
            slide.type = type || this.fancybox.option("defaultType", "image");
            if ("html5video" === type || "video" === type) {
                slide.video = extend_extend({}, this.fancybox.option("Html.video"), slide.video);
                if (slide._width && slide._height) slide.ratio = parseFloat(slide._width) / parseFloat(slide._height); else slide.ratio = slide.ratio || slide.video.ratio || Html_defaults.video.ratio;
            }
        }
        onReady() {
            this.fancybox.Carousel.slides.forEach((slide => {
                if (slide.$el) {
                    this.setContent(slide);
                    if (slide.index === this.fancybox.getSlide().index) this.playVideo(slide);
                }
            }));
        }
        onCreateSlide(fancybox, carousel, slide) {
            if ("ready" !== this.fancybox.state) return;
            this.setContent(slide);
        }
        loadInlineContent(slide) {
            let $content;
            if (slide.src instanceof HTMLElement) $content = slide.src; else if ("string" === typeof slide.src) {
                const tmp = slide.src.split("#", 2);
                const id = 2 === tmp.length && "" === tmp[0] ? tmp[1] : tmp[0];
                $content = document.getElementById(id);
            }
            if ($content) {
                if ("clone" === slide.type || $content.$placeHolder) {
                    $content = $content.cloneNode(true);
                    let attrId = $content.getAttribute("id");
                    attrId = attrId ? `${attrId}--clone` : `clone-${this.fancybox.id}-${slide.index}`;
                    $content.setAttribute("id", attrId);
                } else {
                    const $placeHolder = document.createElement("div");
                    $placeHolder.classList.add("fancybox-placeholder");
                    $content.parentNode.insertBefore($placeHolder, $content);
                    $content.$placeHolder = $placeHolder;
                }
                this.fancybox.setContent(slide, $content);
            } else this.fancybox.setError(slide, "{{ELEMENT_NOT_FOUND}}");
        }
        loadAjaxContent(slide) {
            const fancybox = this.fancybox;
            const xhr = new XMLHttpRequest;
            fancybox.showLoading(slide);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) if ("ready" === fancybox.state) {
                    fancybox.hideLoading(slide);
                    if (200 === xhr.status) fancybox.setContent(slide, xhr.responseText); else fancybox.setError(slide, 404 === xhr.status ? "{{AJAX_NOT_FOUND}}" : "{{AJAX_FORBIDDEN}}");
                }
            };
            const data = slide.ajax || null;
            xhr.open(data ? "POST" : "GET", slide.src);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.send(data);
            slide.xhr = xhr;
        }
        loadIframeContent(slide) {
            const fancybox = this.fancybox;
            const $iframe = document.createElement("iframe");
            $iframe.className = "fancybox__iframe";
            $iframe.setAttribute("id", `fancybox__iframe_${fancybox.id}_${slide.index}`);
            $iframe.setAttribute("allow", "autoplay; fullscreen");
            $iframe.setAttribute("scrolling", "auto");
            slide.$iframe = $iframe;
            if ("iframe" !== slide.type || false === slide.preload) {
                $iframe.setAttribute("src", slide.src);
                this.fancybox.setContent(slide, $iframe);
                this.resizeIframe(slide);
                return;
            }
            fancybox.showLoading(slide);
            const $content = document.createElement("div");
            $content.style.visibility = "hidden";
            this.fancybox.setContent(slide, $content);
            $content.appendChild($iframe);
            $iframe.onerror = () => {
                fancybox.setError(slide, "{{IFRAME_ERROR}}");
            };
            $iframe.onload = () => {
                fancybox.hideLoading(slide);
                let isFirstLoad = false;
                if (!$iframe.isReady) {
                    $iframe.isReady = true;
                    isFirstLoad = true;
                }
                if (!$iframe.src.length) return;
                $iframe.parentNode.style.visibility = "";
                this.resizeIframe(slide);
                if (isFirstLoad) fancybox.revealContent(slide);
            };
            $iframe.setAttribute("src", slide.src);
        }
        setAspectRatio(slide) {
            const $content = slide.$content;
            const ratio = slide.ratio;
            if (!$content) return;
            let width = slide._width;
            let height = slide._height;
            if (ratio || width && height) {
                Object.assign($content.style, {
                    width: width && height ? "100%" : "",
                    height: width && height ? "100%" : "",
                    maxWidth: "",
                    maxHeight: ""
                });
                let maxWidth = $content.offsetWidth;
                let maxHeight = $content.offsetHeight;
                width = width || maxWidth;
                height = height || maxHeight;
                if (width > maxWidth || height > maxHeight) {
                    let maxRatio = Math.min(maxWidth / width, maxHeight / height);
                    width *= maxRatio;
                    height *= maxRatio;
                }
                if (Math.abs(width / height - ratio) > .01) if (ratio < width / height) width = height * ratio; else height = width / ratio;
                Object.assign($content.style, {
                    width: `${width}px`,
                    height: `${height}px`
                });
            }
        }
        resizeIframe(slide) {
            const $iframe = slide.$iframe;
            if (!$iframe) return;
            let width_ = slide._width || 0;
            let height_ = slide._height || 0;
            if (width_ && height_) slide.autoSize = false;
            const $parent = $iframe.parentNode;
            const parentStyle = $parent && $parent.style;
            if (false !== slide.preload && false !== slide.autoSize && parentStyle) try {
                const compStyles = window.getComputedStyle($parent), paddingX = parseFloat(compStyles.paddingLeft) + parseFloat(compStyles.paddingRight), paddingY = parseFloat(compStyles.paddingTop) + parseFloat(compStyles.paddingBottom);
                const document = $iframe.contentWindow.document, $html = document.getElementsByTagName("html")[0], $body = document.body;
                parentStyle.width = "";
                $body.style.overflow = "hidden";
                width_ = width_ || $html.scrollWidth + paddingX;
                parentStyle.width = `${width_}px`;
                $body.style.overflow = "";
                parentStyle.flex = "0 0 auto";
                parentStyle.height = `${$body.scrollHeight}px`;
                height_ = $html.scrollHeight + paddingY;
            } catch (error) {}
            if (width_ || height_) {
                const newStyle = {
                    flex: "0 1 auto"
                };
                if (width_) newStyle.width = `${width_}px`;
                if (height_) newStyle.height = `${height_}px`;
                Object.assign(parentStyle, newStyle);
            }
        }
        onRefresh(fancybox, carousel) {
            carousel.slides.forEach((slide => {
                if (!slide.$el) return;
                if (slide.$iframe) this.resizeIframe(slide);
                if (slide.ratio) this.setAspectRatio(slide);
            }));
        }
        setContent(slide) {
            if (!slide || slide.isDom) return;
            switch (slide.type) {
              case "html":
                this.fancybox.setContent(slide, slide.src);
                break;

              case "html5video":
                this.fancybox.setContent(slide, this.fancybox.option("Html.html5video.tpl").replace(/\{\{src\}\}/gi, slide.src).replace("{{format}}", slide.format || slide.html5video && slide.html5video.format || "").replace("{{poster}}", slide.poster || slide.thumb || ""));
                break;

              case "inline":
              case "clone":
                this.loadInlineContent(slide);
                break;

              case "ajax":
                this.loadAjaxContent(slide);
                break;

              case "pdf":
              case "video":
              case "map":
                slide.preload = false;

              case "iframe":
                this.loadIframeContent(slide);
                break;
            }
            if (slide.ratio) this.setAspectRatio(slide);
        }
        onSelectSlide(fancybox, carousel, slide) {
            if ("ready" === fancybox.state) this.playVideo(slide);
        }
        playVideo(slide) {
            if ("html5video" === slide.type && slide.video.autoplay) try {
                const $video = slide.$el.querySelector("video");
                if ($video) {
                    const promise = $video.play();
                    if (void 0 !== promise) promise.then((() => {})).catch((error => {
                        $video.muted = true;
                        $video.play();
                    }));
                }
            } catch (err) {}
            if ("video" !== slide.type || !(slide.$iframe && slide.$iframe.contentWindow)) return;
            const poller = () => {
                if ("done" === slide.state && slide.$iframe && slide.$iframe.contentWindow) {
                    let command;
                    if (slide.$iframe.isReady) {
                        if (slide.video && slide.video.autoplay) if ("youtube" == slide.vendor) command = {
                            event: "command",
                            func: "playVideo"
                        }; else command = {
                            method: "play",
                            value: "true"
                        };
                        if (command) slide.$iframe.contentWindow.postMessage(JSON.stringify(command), "*");
                        return;
                    }
                    if ("youtube" === slide.vendor) {
                        command = {
                            event: "listening",
                            id: slide.$iframe.getAttribute("id")
                        };
                        slide.$iframe.contentWindow.postMessage(JSON.stringify(command), "*");
                    }
                }
                slide.poller = setTimeout(poller, 250);
            };
            poller();
        }
        onUnselectSlide(fancybox, carousel, slide) {
            if ("html5video" === slide.type) {
                try {
                    slide.$el.querySelector("video").pause();
                } catch (error) {}
                return;
            }
            let command = false;
            if ("vimeo" == slide.vendor) command = {
                method: "pause",
                value: "true"
            }; else if ("youtube" === slide.vendor) command = {
                event: "command",
                func: "pauseVideo"
            };
            if (command && slide.$iframe && slide.$iframe.contentWindow) slide.$iframe.contentWindow.postMessage(JSON.stringify(command), "*");
            clearTimeout(slide.poller);
        }
        onRemoveSlide(fancybox, carousel, slide) {
            if (slide.xhr) {
                slide.xhr.abort();
                slide.xhr = null;
            }
            if (slide.$iframe) {
                slide.$iframe.onload = slide.$iframe.onerror = null;
                slide.$iframe.src = "//about:blank";
                slide.$iframe = null;
            }
            const $content = slide.$content;
            if ("inline" === slide.type && $content) {
                $content.classList.remove("fancybox__content");
                if ("none" !== $content.style.display) $content.style.display = "none";
            }
            if (slide.$closeButton) {
                slide.$closeButton.remove();
                slide.$closeButton = null;
            }
            const $placeHolder = $content && $content.$placeHolder;
            if ($placeHolder) {
                $placeHolder.parentNode.insertBefore($content, $placeHolder);
                $placeHolder.remove();
                $content.$placeHolder = null;
            }
        }
        onMessage(e) {
            try {
                let data = JSON.parse(e.data);
                if ("https://player.vimeo.com" === e.origin) {
                    if ("ready" === data.event) for (let $iframe of document.getElementsByClassName("fancybox__iframe")) if ($iframe.contentWindow === e.source) $iframe.isReady = 1;
                } else if ("https://www.youtube-nocookie.com" === e.origin) if ("onReady" === data.event) document.getElementById(data.id).isReady = 1;
            } catch (ex) {}
        }
        attach() {
            this.fancybox.on(this.events);
            window.addEventListener("message", this.onMessage, false);
        }
        detach() {
            this.fancybox.off(this.events);
            window.removeEventListener("message", this.onMessage, false);
        }
    }
    Html.defaults = Html_defaults;
    const Image_defaults = {
        canZoomInClass: "can-zoom_in",
        canZoomOutClass: "can-zoom_out",
        zoom: true,
        zoomOpacity: "auto",
        zoomFriction: .82,
        ignoreCoveredThumbnail: false,
        touch: true,
        click: "toggleZoom",
        doubleClick: null,
        wheel: "zoom",
        fit: "contain",
        wrap: false,
        Panzoom: {
            ratio: 1
        }
    };
    class Image_Image {
        constructor(fancybox) {
            this.fancybox = fancybox;
            for (const methodName of [ "onReady", "onClosing", "onDone", "onPageChange", "onCreateSlide", "onRemoveSlide", "onImageStatusChange" ]) this[methodName] = this[methodName].bind(this);
            this.events = {
                ready: this.onReady,
                closing: this.onClosing,
                done: this.onDone,
                "Carousel.change": this.onPageChange,
                "Carousel.createSlide": this.onCreateSlide,
                "Carousel.removeSlide": this.onRemoveSlide
            };
        }
        onReady() {
            this.fancybox.Carousel.slides.forEach((slide => {
                if (slide.$el) this.setContent(slide);
            }));
        }
        onDone(fancybox, slide) {
            this.handleCursor(slide);
        }
        onClosing(fancybox) {
            clearTimeout(this.clickTimer);
            this.clickTimer = null;
            fancybox.Carousel.slides.forEach((slide => {
                if (slide.$image) slide.state = "destroy";
                if (slide.Panzoom) slide.Panzoom.detachEvents();
            }));
            if ("closing" === this.fancybox.state && this.canZoom(fancybox.getSlide())) this.zoomOut();
        }
        onCreateSlide(fancybox, carousel, slide) {
            if ("ready" !== this.fancybox.state) return;
            this.setContent(slide);
        }
        onRemoveSlide(fancybox, carousel, slide) {
            if (slide.$image) {
                slide.$el.classList.remove(fancybox.option("Image.canZoomInClass"));
                slide.$image.remove();
                slide.$image = null;
            }
            if (slide.Panzoom) {
                slide.Panzoom.destroy();
                slide.Panzoom = null;
            }
            if (slide.$el && slide.$el.dataset) delete slide.$el.dataset.imageFit;
        }
        setContent(slide) {
            if (slide.isDom || slide.html || slide.type && "image" !== slide.type) return;
            if (slide.$image) return;
            slide.type = "image";
            slide.state = "loading";
            const $content = document.createElement("div");
            $content.style.visibility = "hidden";
            const $image = document.createElement("img");
            $image.addEventListener("load", (event => {
                event.stopImmediatePropagation();
                this.onImageStatusChange(slide);
            }));
            $image.addEventListener("error", (() => {
                this.onImageStatusChange(slide);
            }));
            $image.src = slide.src;
            $image.alt = "";
            $image.draggable = false;
            $image.classList.add("fancybox__image");
            if (slide.srcset) $image.setAttribute("srcset", slide.srcset);
            if (slide.sizes) $image.setAttribute("sizes", slide.sizes);
            slide.$image = $image;
            const shouldWrap = this.fancybox.option("Image.wrap");
            if (shouldWrap) {
                const $wrap = document.createElement("div");
                $wrap.classList.add("string" === typeof shouldWrap ? shouldWrap : "fancybox__image-wrap");
                $wrap.appendChild($image);
                $content.appendChild($wrap);
                slide.$wrap = $wrap;
            } else $content.appendChild($image);
            slide.$el.dataset.imageFit = this.fancybox.option("Image.fit");
            this.fancybox.setContent(slide, $content);
            if ($image.complete || $image.error) this.onImageStatusChange(slide); else this.fancybox.showLoading(slide);
        }
        onImageStatusChange(slide) {
            const $image = slide.$image;
            if (!$image || "loading" !== slide.state) return;
            if (!($image.complete && $image.naturalWidth && $image.naturalHeight)) {
                this.fancybox.setError(slide, "{{IMAGE_ERROR}}");
                return;
            }
            this.fancybox.hideLoading(slide);
            if ("contain" === this.fancybox.option("Image.fit")) this.initSlidePanzoom(slide);
            slide.$el.addEventListener("wheel", (event => this.onWheel(slide, event)), {
                passive: false
            });
            slide.$content.addEventListener("click", (event => this.onClick(slide, event)), {
                passive: false
            });
            this.revealContent(slide);
        }
        initSlidePanzoom(slide) {
            if (slide.Panzoom) return;
            slide.Panzoom = new Panzoom(slide.$el, extend_extend(true, this.fancybox.option("Image.Panzoom", {}), {
                viewport: slide.$wrap,
                content: slide.$image,
                width: slide._width,
                height: slide._height,
                wrapInner: false,
                textSelection: true,
                touch: this.fancybox.option("Image.touch"),
                panOnlyZoomed: true,
                click: false,
                wheel: false
            }));
            slide.Panzoom.on("startAnimation", (() => {
                this.fancybox.trigger("Image.startAnimation", slide);
            }));
            slide.Panzoom.on("endAnimation", (() => {
                if ("zoomIn" === slide.state) this.fancybox.done(slide);
                this.handleCursor(slide);
                this.fancybox.trigger("Image.endAnimation", slide);
            }));
            slide.Panzoom.on("afterUpdate", (() => {
                this.handleCursor(slide);
                this.fancybox.trigger("Image.afterUpdate", slide);
            }));
        }
        revealContent(slide) {
            if (null === this.fancybox.Carousel.prevPage && slide.index === this.fancybox.options.startIndex && this.canZoom(slide)) this.zoomIn(); else this.fancybox.revealContent(slide);
        }
        getZoomInfo(slide) {
            const $thumb = slide.$thumb, thumbRect = $thumb.getBoundingClientRect(), thumbWidth = thumbRect.width, thumbHeight = thumbRect.height, contentRect = slide.$content.getBoundingClientRect(), contentWidth = contentRect.width, contentHeight = contentRect.height, shiftedTop = contentRect.top - thumbRect.top, shiftedLeft = contentRect.left - thumbRect.left;
            let opacity = this.fancybox.option("Image.zoomOpacity");
            if ("auto" === opacity) opacity = Math.abs(thumbWidth / thumbHeight - contentWidth / contentHeight) > .1;
            return {
                top: shiftedTop,
                left: shiftedLeft,
                scale: contentWidth && thumbWidth ? thumbWidth / contentWidth : 1,
                opacity
            };
        }
        canZoom(slide) {
            const fancybox = this.fancybox, $container = fancybox.$container;
            if (window.visualViewport && 1 !== window.visualViewport.scale) return false;
            if (slide.Panzoom && !slide.Panzoom.content.width) return false;
            if (!fancybox.option("Image.zoom") || "contain" !== fancybox.option("Image.fit")) return false;
            const $thumb = slide.$thumb;
            if (!$thumb || "loading" === slide.state) return false;
            $container.classList.add("fancybox__no-click");
            const rect = $thumb.getBoundingClientRect();
            let rez;
            if (this.fancybox.option("Image.ignoreCoveredThumbnail")) {
                const visibleTopLeft = document.elementFromPoint(rect.left + 1, rect.top + 1) === $thumb;
                const visibleBottomRight = document.elementFromPoint(rect.right - 1, rect.bottom - 1) === $thumb;
                rez = visibleTopLeft && visibleBottomRight;
            } else rez = document.elementFromPoint(rect.left + .5 * rect.width, rect.top + .5 * rect.height) === $thumb;
            $container.classList.remove("fancybox__no-click");
            return rez;
        }
        zoomIn() {
            const fancybox = this.fancybox, slide = fancybox.getSlide(), Panzoom = slide.Panzoom;
            const {top, left, scale, opacity} = this.getZoomInfo(slide);
            fancybox.trigger("reveal", slide);
            Panzoom.panTo({
                x: -1 * left,
                y: -1 * top,
                scale,
                friction: 0,
                ignoreBounds: true
            });
            slide.$content.style.visibility = "";
            slide.state = "zoomIn";
            if (true === opacity) Panzoom.on("afterTransform", (panzoom => {
                if ("zoomIn" === slide.state || "zoomOut" === slide.state) panzoom.$content.style.opacity = Math.min(1, 1 - (1 - panzoom.content.scale) / (1 - scale));
            }));
            Panzoom.panTo({
                x: 0,
                y: 0,
                scale: 1,
                friction: this.fancybox.option("Image.zoomFriction")
            });
        }
        zoomOut() {
            const fancybox = this.fancybox, slide = fancybox.getSlide(), Panzoom = slide.Panzoom;
            if (!Panzoom) return;
            slide.state = "zoomOut";
            fancybox.state = "customClosing";
            if (slide.$caption) slide.$caption.style.visibility = "hidden";
            let friction = this.fancybox.option("Image.zoomFriction");
            const animatePosition = event => {
                const {top, left, scale, opacity} = this.getZoomInfo(slide);
                if (!event && !opacity) friction *= .82;
                Panzoom.panTo({
                    x: -1 * left,
                    y: -1 * top,
                    scale,
                    friction,
                    ignoreBounds: true
                });
                friction *= .98;
            };
            window.addEventListener("scroll", animatePosition);
            Panzoom.once("endAnimation", (() => {
                window.removeEventListener("scroll", animatePosition);
                fancybox.destroy();
            }));
            animatePosition();
        }
        handleCursor(slide) {
            if ("image" !== slide.type || !slide.$el) return;
            const panzoom = slide.Panzoom;
            const clickAction = this.fancybox.option("Image.click", false, slide);
            const touchIsEnabled = this.fancybox.option("Image.touch");
            const classList = slide.$el.classList;
            const zoomInClass = this.fancybox.option("Image.canZoomInClass");
            const zoomOutClass = this.fancybox.option("Image.canZoomOutClass");
            classList.remove(zoomOutClass);
            classList.remove(zoomInClass);
            if (panzoom && "toggleZoom" === clickAction) {
                const canZoomIn = panzoom && 1 === panzoom.content.scale && panzoom.option("maxScale") - panzoom.content.scale > .01;
                if (canZoomIn) classList.add(zoomInClass); else if (panzoom.content.scale > 1 && !touchIsEnabled) classList.add(zoomOutClass);
            } else if ("close" === clickAction) classList.add(zoomOutClass);
        }
        onWheel(slide, event) {
            if ("ready" !== this.fancybox.state) return;
            if (false === this.fancybox.trigger("Image.wheel", event)) return;
            switch (this.fancybox.option("Image.wheel")) {
              case "zoom":
                if ("done" === slide.state) slide.Panzoom && slide.Panzoom.zoomWithWheel(event);
                break;

              case "close":
                this.fancybox.close();
                break;

              case "slide":
                this.fancybox[event.deltaY < 0 ? "prev" : "next"]();
                break;
            }
        }
        onClick(slide, event) {
            if ("ready" !== this.fancybox.state) return;
            const panzoom = slide.Panzoom;
            if (panzoom && (panzoom.dragPosition.midPoint || 0 !== panzoom.dragOffset.x || 0 !== panzoom.dragOffset.y || 1 !== panzoom.dragOffset.scale)) return;
            if (this.fancybox.Carousel.Panzoom.lockAxis) return false;
            const process = action => {
                switch (action) {
                  case "toggleZoom":
                    event.stopPropagation();
                    slide.Panzoom && slide.Panzoom.zoomWithClick(event);
                    break;

                  case "close":
                    this.fancybox.close();
                    break;

                  case "next":
                    event.stopPropagation();
                    this.fancybox.next();
                    break;
                }
            };
            const clickAction = this.fancybox.option("Image.click");
            const dblclickAction = this.fancybox.option("Image.doubleClick");
            if (dblclickAction) if (this.clickTimer) {
                clearTimeout(this.clickTimer);
                this.clickTimer = null;
                process(dblclickAction);
            } else this.clickTimer = setTimeout((() => {
                this.clickTimer = null;
                process(clickAction);
            }), 300); else process(clickAction);
        }
        onPageChange(fancybox, carousel) {
            const currSlide = fancybox.getSlide();
            carousel.slides.forEach((slide => {
                if (!slide.Panzoom || "done" !== slide.state) return;
                if (slide.index !== currSlide.index) slide.Panzoom.panTo({
                    x: 0,
                    y: 0,
                    scale: 1,
                    friction: .8
                });
            }));
        }
        attach() {
            this.fancybox.on(this.events);
        }
        detach() {
            this.fancybox.off(this.events);
        }
    }
    Image_Image.defaults = Image_defaults;
    class Hash {
        constructor(fancybox) {
            this.fancybox = fancybox;
            for (const methodName of [ "onChange", "onClosing" ]) this[methodName] = this[methodName].bind(this);
            this.events = {
                initCarousel: this.onChange,
                "Carousel.change": this.onChange,
                closing: this.onClosing
            };
            this.hasCreatedHistory = false;
            this.origHash = "";
            this.timer = null;
        }
        onChange(fancybox) {
            const carousel = fancybox.Carousel;
            if (this.timer) clearTimeout(this.timer);
            const firstRun = null === carousel.prevPage;
            const currentSlide = fancybox.getSlide();
            const currentHash = new URL(document.URL).hash;
            let newHash = false;
            if (currentSlide.slug) newHash = "#" + currentSlide.slug; else {
                const dataset = currentSlide.$trigger && currentSlide.$trigger.dataset;
                const slug = fancybox.option("slug") || dataset && dataset.fancybox;
                if (slug && slug.length && "true" !== slug) newHash = "#" + slug + (carousel.slides.length > 1 ? "-" + (currentSlide.index + 1) : "");
            }
            if (firstRun) this.origHash = currentHash !== newHash ? currentHash : "";
            if (newHash && currentHash !== newHash) this.timer = setTimeout((() => {
                try {
                    window.history[firstRun ? "pushState" : "replaceState"]({}, document.title, window.location.pathname + window.location.search + newHash);
                    if (firstRun) this.hasCreatedHistory = true;
                } catch (e) {}
            }), 300);
        }
        onClosing() {
            if (this.timer) clearTimeout(this.timer);
            if (true === this.hasSilentClose) return;
            try {
                window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (this.origHash || ""));
                return;
            } catch (e) {}
        }
        attach(fancybox) {
            fancybox.on(this.events);
        }
        detach(fancybox) {
            fancybox.off(this.events);
        }
        static startFromUrl() {
            const Fancybox = Hash.Fancybox;
            if (!Fancybox || Fancybox.getInstance() || false === Fancybox.defaults.Hash) return;
            const {hash, slug, index} = Hash.getParsedURL();
            if (!slug) return;
            let selectedElem = document.querySelector(`[data-slug="${hash}"]`);
            if (selectedElem) selectedElem.dispatchEvent(new CustomEvent("click", {
                bubbles: true,
                cancelable: true
            }));
            if (Fancybox.getInstance()) return;
            const groupElems = document.querySelectorAll(`[data-fancybox="${slug}"]`);
            if (!groupElems.length) return;
            if (null === index && 1 === groupElems.length) selectedElem = groupElems[0]; else if (index) selectedElem = groupElems[index - 1];
            if (selectedElem) selectedElem.dispatchEvent(new CustomEvent("click", {
                bubbles: true,
                cancelable: true
            }));
        }
        static onHashChange() {
            const {slug, index} = Hash.getParsedURL();
            const Fancybox = Hash.Fancybox;
            const instance = Fancybox && Fancybox.getInstance();
            if (instance && instance.plugins.Hash) {
                if (slug) {
                    const carousel = instance.Carousel;
                    if (slug === instance.option("slug")) return carousel.slideTo(index - 1);
                    for (let slide of carousel.slides) if (slide.slug && slide.slug === slug) return carousel.slideTo(slide.index);
                    const slide = instance.getSlide();
                    const dataset = slide.$trigger && slide.$trigger.dataset;
                    if (dataset && dataset.fancybox === slug) return carousel.slideTo(index - 1);
                }
                instance.plugins.Hash.hasSilentClose = true;
                instance.close();
            }
            Hash.startFromUrl();
        }
        static create(Fancybox) {
            Hash.Fancybox = Fancybox;
            function proceed() {
                window.addEventListener("hashchange", Hash.onHashChange, false);
                Hash.startFromUrl();
            }
            if (canUseDOM) window.requestAnimationFrame((() => {
                if (/complete|interactive|loaded/.test(document.readyState)) proceed(); else document.addEventListener("DOMContentLoaded", proceed);
            }));
        }
        static destroy() {
            window.removeEventListener("hashchange", Hash.onHashChange, false);
        }
        static getParsedURL() {
            const hash = window.location.hash.substr(1), tmp = hash.split("-"), index = tmp.length > 1 && /^\+?\d+$/.test(tmp[tmp.length - 1]) ? parseInt(tmp.pop(-1), 10) || null : null, slug = tmp.join("-");
            return {
                hash,
                slug,
                index
            };
        }
    }
    const Fullscreen = {
        pageXOffset: 0,
        pageYOffset: 0,
        element() {
            return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        },
        activate(element) {
            Fullscreen.pageXOffset = window.pageXOffset;
            Fullscreen.pageYOffset = window.pageYOffset;
            if (element.requestFullscreen) element.requestFullscreen(); else if (element.mozRequestFullScreen) element.mozRequestFullScreen(); else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen(); else if (element.msRequestFullscreen) element.msRequestFullscreen();
        },
        deactivate() {
            if (document.exitFullscreen) document.exitFullscreen(); else if (document.mozCancelFullScreen) document.mozCancelFullScreen(); else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    };
    class Slideshow {
        constructor(fancybox) {
            this.fancybox = fancybox;
            this.active = false;
            this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        }
        isActive() {
            return this.active;
        }
        setTimer() {
            if (!this.active || this.timer) return;
            const delay = this.fancybox.option("slideshow.delay", 3e3);
            this.timer = setTimeout((() => {
                this.timer = null;
                if (!this.fancybox.option("infinite") && this.fancybox.getSlide().index === this.fancybox.Carousel.slides.length - 1) this.fancybox.jumpTo(0, {
                    friction: 0
                }); else this.fancybox.next();
            }), delay);
            let $progress = this.$progress;
            if (!$progress) {
                $progress = document.createElement("div");
                $progress.classList.add("fancybox__progress");
                this.fancybox.$carousel.parentNode.insertBefore($progress, this.fancybox.$carousel);
                this.$progress = $progress;
                $progress.offsetHeight;
            }
            $progress.style.transitionDuration = `${delay}ms`;
            $progress.style.transform = "scaleX(1)";
        }
        clearTimer() {
            clearTimeout(this.timer);
            this.timer = null;
            if (this.$progress) {
                this.$progress.style.transitionDuration = "";
                this.$progress.style.transform = "";
                this.$progress.offsetHeight;
            }
        }
        activate() {
            if (this.active) return;
            this.active = true;
            this.fancybox.$container.classList.add("has-slideshow");
            if ("done" === this.fancybox.getSlide().state) this.setTimer();
            document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
        }
        handleVisibilityChange() {
            this.deactivate();
        }
        deactivate() {
            this.active = false;
            this.clearTimer();
            this.fancybox.$container.classList.remove("has-slideshow");
            document.removeEventListener("visibilitychange", this.handleVisibilityChange, false);
        }
        toggle() {
            if (this.active) this.deactivate(); else if (this.fancybox.Carousel.slides.length > 1) this.activate();
        }
    }
    const Toolbar_defaults = {
        display: [ "counter", "zoom", "slideshow", "fullscreen", "thumbs", "close" ],
        autoEnable: true,
        items: {
            counter: {
                position: "left",
                type: "div",
                class: "fancybox__counter",
                html: '<span data-fancybox-index=""></span>&nbsp;/&nbsp;<span data-fancybox-count=""></span>',
                attr: {
                    tabindex: -1
                }
            },
            prev: {
                type: "button",
                class: "fancybox__button--prev",
                label: "PREV",
                html: '<svg viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8"/></svg>',
                attr: {
                    "data-fancybox-prev": ""
                }
            },
            next: {
                type: "button",
                class: "fancybox__button--next",
                label: "NEXT",
                html: '<svg viewBox="0 0 24 24"><path d="M8 4l8 8-8 8"/></svg>',
                attr: {
                    "data-fancybox-next": ""
                }
            },
            fullscreen: {
                type: "button",
                class: "fancybox__button--fullscreen",
                label: "TOGGLE_FULLSCREEN",
                html: `<svg viewBox="0 0 24 24">\n                <g><path d="M3 8 V3h5"></path><path d="M21 8V3h-5"></path><path d="M8 21H3v-5"></path><path d="M16 21h5v-5"></path></g>\n                <g><path d="M7 2v5H2M17 2v5h5M2 17h5v5M22 17h-5v5"/></g>\n            </svg>`,
                click: function(event) {
                    event.preventDefault();
                    if (Fullscreen.element()) Fullscreen.deactivate(); else Fullscreen.activate(this.fancybox.$container);
                }
            },
            slideshow: {
                type: "button",
                class: "fancybox__button--slideshow",
                label: "TOGGLE_SLIDESHOW",
                html: `<svg viewBox="0 0 24 24">\n                <g><path d="M6 4v16"/><path d="M20 12L6 20"/><path d="M20 12L6 4"/></g>\n                <g><path d="M7 4v15M17 4v15"/></g>\n            </svg>`,
                click: function(event) {
                    event.preventDefault();
                    this.Slideshow.toggle();
                }
            },
            zoom: {
                type: "button",
                class: "fancybox__button--zoom",
                label: "TOGGLE_ZOOM",
                html: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"></circle><path d="M16 16 L21 21"></svg>',
                click: function(event) {
                    event.preventDefault();
                    const panzoom = this.fancybox.getSlide().Panzoom;
                    if (panzoom) panzoom.toggleZoom();
                }
            },
            download: {
                type: "link",
                label: "DOWNLOAD",
                class: "fancybox__button--download",
                html: '<svg viewBox="0 0 24 24"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.62 2.48A2 2 0 004.56 21h14.88a2 2 0 001.94-1.51L22 17"/></svg>',
                click: function(event) {
                    event.stopPropagation();
                }
            },
            thumbs: {
                type: "button",
                label: "TOGGLE_THUMBS",
                class: "fancybox__button--thumbs",
                html: '<svg viewBox="0 0 24 24"><circle cx="4" cy="4" r="1" /><circle cx="12" cy="4" r="1" transform="rotate(90 12 4)"/><circle cx="20" cy="4" r="1" transform="rotate(90 20 4)"/><circle cx="4" cy="12" r="1" transform="rotate(90 4 12)"/><circle cx="12" cy="12" r="1" transform="rotate(90 12 12)"/><circle cx="20" cy="12" r="1" transform="rotate(90 20 12)"/><circle cx="4" cy="20" r="1" transform="rotate(90 4 20)"/><circle cx="12" cy="20" r="1" transform="rotate(90 12 20)"/><circle cx="20" cy="20" r="1" transform="rotate(90 20 20)"/></svg>',
                click: function(event) {
                    event.stopPropagation();
                    const thumbs = this.fancybox.plugins.Thumbs;
                    if (thumbs) thumbs.toggle();
                }
            },
            close: {
                type: "button",
                label: "CLOSE",
                class: "fancybox__button--close",
                html: '<svg viewBox="0 0 24 24"><path d="M20 20L4 4m16 0L4 20"></path></svg>',
                attr: {
                    "data-fancybox-close": "",
                    tabindex: 0
                }
            }
        }
    };
    class Toolbar {
        constructor(fancybox) {
            this.fancybox = fancybox;
            this.$container = null;
            this.state = "init";
            for (const methodName of [ "onInit", "onPrepare", "onDone", "onKeydown", "onClosing", "onChange", "onSettle", "onRefresh" ]) this[methodName] = this[methodName].bind(this);
            this.events = {
                init: this.onInit,
                prepare: this.onPrepare,
                done: this.onDone,
                keydown: this.onKeydown,
                closing: this.onClosing,
                "Carousel.change": this.onChange,
                "Carousel.settle": this.onSettle,
                "Carousel.Panzoom.touchStart": () => this.onRefresh(),
                "Image.startAnimation": (fancybox, slide) => this.onRefresh(slide),
                "Image.afterUpdate": (fancybox, slide) => this.onRefresh(slide)
            };
        }
        onInit() {
            if (this.fancybox.option("Toolbar.autoEnable")) {
                let hasImage = false;
                for (const item of this.fancybox.items) if ("image" === item.type) {
                    hasImage = true;
                    break;
                }
                if (!hasImage) {
                    this.state = "disabled";
                    return;
                }
            }
            for (const key of this.fancybox.option("Toolbar.display")) {
                const id = isPlainObject(key) ? key.id : key;
                if ("close" === id) {
                    this.fancybox.options.closeButton = false;
                    break;
                }
            }
        }
        onPrepare() {
            const fancybox = this.fancybox;
            if ("init" !== this.state) return;
            this.build();
            this.update();
            this.Slideshow = new Slideshow(fancybox);
            if (!fancybox.Carousel.prevPage) {
                if (fancybox.option("slideshow.autoStart")) this.Slideshow.activate();
                if (fancybox.option("fullscreen.autoStart") && !Fullscreen.element()) try {
                    Fullscreen.activate(fancybox.$container);
                } catch (error) {}
            }
        }
        onFsChange() {
            window.scrollTo(Fullscreen.pageXOffset, Fullscreen.pageYOffset);
        }
        onSettle() {
            const fancybox = this.fancybox;
            const slideshow = this.Slideshow;
            if (slideshow && slideshow.isActive()) if (fancybox.getSlide().index === fancybox.Carousel.slides.length - 1 && !fancybox.option("infinite")) slideshow.deactivate(); else if ("done" === fancybox.getSlide().state) slideshow.setTimer();
        }
        onChange() {
            this.update();
            if (this.Slideshow && this.Slideshow.isActive()) this.Slideshow.clearTimer();
        }
        onDone(fancybox, slide) {
            const slideshow = this.Slideshow;
            if (slide.index === fancybox.getSlide().index) {
                this.update();
                if (slideshow && slideshow.isActive()) if (!fancybox.option("infinite") && slide.index === fancybox.Carousel.slides.length - 1) slideshow.deactivate(); else slideshow.setTimer();
            }
        }
        onRefresh(slide) {
            if (!slide || slide.index === this.fancybox.getSlide().index) {
                this.update();
                if (this.Slideshow && this.Slideshow.isActive() && (!slide || "done" === slide.state)) this.Slideshow.deactivate();
            }
        }
        onKeydown(fancybox, key, event) {
            if (" " === key && this.Slideshow) {
                this.Slideshow.toggle();
                event.preventDefault();
            }
        }
        onClosing() {
            if (this.Slideshow) this.Slideshow.deactivate();
            document.removeEventListener("fullscreenchange", this.onFsChange);
        }
        createElement(obj) {
            let $el;
            if ("div" === obj.type) $el = document.createElement("div"); else {
                $el = document.createElement("link" === obj.type ? "a" : "button");
                $el.classList.add("carousel__button");
            }
            $el.innerHTML = obj.html;
            $el.setAttribute("tabindex", obj.tabindex || 0);
            if (obj.class) $el.classList.add(...obj.class.split(" "));
            for (const prop in obj.attr) $el.setAttribute(prop, obj.attr[prop]);
            if (obj.label) $el.setAttribute("title", this.fancybox.localize(`{{${obj.label}}}`));
            if (obj.click) $el.addEventListener("click", obj.click.bind(this));
            if ("prev" === obj.id) $el.setAttribute("data-fancybox-prev", "");
            if ("next" === obj.id) $el.setAttribute("data-fancybox-next", "");
            const $svg = $el.querySelector("svg");
            if ($svg) {
                $svg.setAttribute("role", "img");
                $svg.setAttribute("tabindex", "-1");
                $svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            }
            return $el;
        }
        build() {
            this.cleanup();
            const all_items = this.fancybox.option("Toolbar.items");
            const all_groups = [ {
                position: "left",
                items: []
            }, {
                position: "center",
                items: []
            }, {
                position: "right",
                items: []
            } ];
            const thumbs = this.fancybox.plugins.Thumbs;
            for (const key of this.fancybox.option("Toolbar.display")) {
                let id, item;
                if (isPlainObject(key)) {
                    id = key.id;
                    item = extend_extend({}, all_items[id], key);
                } else {
                    id = key;
                    item = all_items[id];
                }
                if ([ "counter", "next", "prev", "slideshow" ].includes(id) && this.fancybox.items.length < 2) continue;
                if ("fullscreen" === id) {
                    if (!document.fullscreenEnabled || window.fullScreen) continue;
                    document.addEventListener("fullscreenchange", this.onFsChange);
                }
                if ("thumbs" === id && (!thumbs || "disabled" === thumbs.state)) continue;
                if (!item) continue;
                let position = item.position || "right";
                let group = all_groups.find((obj => obj.position === position));
                if (group) group.items.push(item);
            }
            const $container = document.createElement("div");
            $container.classList.add("fancybox__toolbar");
            for (const group of all_groups) if (group.items.length) {
                const $wrap = document.createElement("div");
                $wrap.classList.add("fancybox__toolbar__items");
                $wrap.classList.add(`fancybox__toolbar__items--${group.position}`);
                for (const obj of group.items) $wrap.appendChild(this.createElement(obj));
                $container.appendChild($wrap);
            }
            this.fancybox.$carousel.parentNode.insertBefore($container, this.fancybox.$carousel);
            this.$container = $container;
        }
        update() {
            const slide = this.fancybox.getSlide();
            const idx = slide.index;
            const cnt = this.fancybox.items.length;
            const src = slide.downloadSrc || ("image" === slide.type && !slide.error ? slide.src : null);
            for (const $el of this.fancybox.$container.querySelectorAll("a.fancybox__button--download")) if (src) {
                $el.removeAttribute("disabled");
                $el.removeAttribute("tabindex");
                $el.setAttribute("href", src);
                $el.setAttribute("download", src);
                $el.setAttribute("target", "_blank");
            } else {
                $el.setAttribute("disabled", "");
                $el.setAttribute("tabindex", -1);
                $el.removeAttribute("href");
                $el.removeAttribute("download");
            }
            const panzoom = slide.Panzoom;
            const canZoom = panzoom && panzoom.option("maxScale") > panzoom.option("baseScale");
            for (const $el of this.fancybox.$container.querySelectorAll(".fancybox__button--zoom")) if (canZoom) $el.removeAttribute("disabled"); else $el.setAttribute("disabled", "");
            for (const $el of this.fancybox.$container.querySelectorAll("[data-fancybox-index]")) $el.innerHTML = slide.index + 1;
            for (const $el of this.fancybox.$container.querySelectorAll("[data-fancybox-count]")) $el.innerHTML = cnt;
            if (!this.fancybox.option("infinite")) {
                for (const $el of this.fancybox.$container.querySelectorAll("[data-fancybox-prev]")) if (0 === idx) $el.setAttribute("disabled", ""); else $el.removeAttribute("disabled");
                for (const $el of this.fancybox.$container.querySelectorAll("[data-fancybox-next]")) if (idx === cnt - 1) $el.setAttribute("disabled", ""); else $el.removeAttribute("disabled");
            }
        }
        cleanup() {
            if (this.Slideshow && this.Slideshow.isActive()) this.Slideshow.clearTimer();
            if (this.$container) this.$container.remove();
            this.$container = null;
        }
        attach() {
            this.fancybox.on(this.events);
        }
        detach() {
            this.fancybox.off(this.events);
            this.cleanup();
        }
    }
    Toolbar.defaults = Toolbar_defaults;
    const Fancybox_plugins_Plugins = {
        ScrollLock,
        Thumbs,
        Html,
        Toolbar,
        Image: Image_Image,
        Hash
    };
    const l10n_en = {
        CLOSE: "Close",
        NEXT: "Next",
        PREV: "Previous",
        MODAL: "You can close this modal content with the ESC key",
        ERROR: "Something Went Wrong, Please Try Again Later",
        IMAGE_ERROR: "Image Not Found",
        ELEMENT_NOT_FOUND: "HTML Element Not Found",
        AJAX_NOT_FOUND: "Error Loading AJAX : Not Found",
        AJAX_FORBIDDEN: "Error Loading AJAX : Forbidden",
        IFRAME_ERROR: "Error Loading Page",
        TOGGLE_ZOOM: "Toggle zoom level",
        TOGGLE_THUMBS: "Toggle thumbnails",
        TOGGLE_SLIDESHOW: "Toggle slideshow",
        TOGGLE_FULLSCREEN: "Toggle full-screen mode",
        DOWNLOAD: "Download"
    };
    const Fancybox_defaults = {
        startIndex: 0,
        preload: 1,
        infinite: true,
        showClass: "fancybox-zoomInUp",
        hideClass: "fancybox-fadeOut",
        animated: true,
        hideScrollbar: true,
        parentEl: null,
        mainClass: null,
        autoFocus: true,
        trapFocus: true,
        placeFocusBack: true,
        click: "close",
        closeButton: "inside",
        dragToClose: true,
        keyboard: {
            Escape: "close",
            Delete: "close",
            Backspace: "close",
            PageUp: "next",
            PageDown: "prev",
            ArrowUp: "next",
            ArrowDown: "prev",
            ArrowRight: "next",
            ArrowLeft: "prev"
        },
        template: {
            closeButton: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg>',
            spinner: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="25 25 50 50" tabindex="-1"><circle cx="50" cy="50" r="20"/></svg>',
            main: null
        },
        l10n: l10n_en
    };
    const instances = new Map;
    let called = 0;
    class Fancybox extends Base {
        constructor(items, options = {}) {
            items = items.map((item => {
                if (item.width) item._width = item.width;
                if (item.height) item._height = item.height;
                return item;
            }));
            super(extend_extend(true, {}, Fancybox_defaults, options));
            this.bindHandlers();
            this.state = "init";
            this.setItems(items);
            this.attachPlugins(Fancybox.Plugins);
            this.trigger("init");
            if (true === this.option("hideScrollbar")) this.hideScrollbar();
            this.initLayout();
            this.initCarousel();
            this.attachEvents();
            instances.set(this.id, this);
            this.trigger("prepare");
            this.state = "ready";
            this.trigger("ready");
            this.$container.setAttribute("aria-hidden", "false");
            if (this.option("trapFocus")) this.focus();
        }
        option(name, ...rest) {
            const slide = this.getSlide();
            let value = slide ? slide[name] : void 0;
            if (void 0 !== value) {
                if ("function" === typeof value) value = value.call(this, this, ...rest);
                return value;
            }
            return super.option(name, ...rest);
        }
        bindHandlers() {
            for (const methodName of [ "onMousedown", "onKeydown", "onClick", "onFocus", "onCreateSlide", "onSettle", "onTouchMove", "onTouchEnd", "onTransform" ]) this[methodName] = this[methodName].bind(this);
        }
        attachEvents() {
            document.addEventListener("mousedown", this.onMousedown);
            document.addEventListener("keydown", this.onKeydown, true);
            if (this.option("trapFocus")) document.addEventListener("focus", this.onFocus, true);
            this.$container.addEventListener("click", this.onClick);
        }
        detachEvents() {
            document.removeEventListener("mousedown", this.onMousedown);
            document.removeEventListener("keydown", this.onKeydown, true);
            document.removeEventListener("focus", this.onFocus, true);
            this.$container.removeEventListener("click", this.onClick);
        }
        initLayout() {
            this.$root = this.option("parentEl") || document.body;
            let mainTemplate = this.option("template.main");
            if (mainTemplate) {
                this.$root.insertAdjacentHTML("beforeend", this.localize(mainTemplate));
                this.$container = this.$root.querySelector(".fancybox__container");
            }
            if (!this.$container) {
                this.$container = document.createElement("div");
                this.$root.appendChild(this.$container);
            }
            this.$container.onscroll = () => {
                this.$container.scrollLeft = 0;
                return false;
            };
            Object.entries({
                class: "fancybox__container",
                role: "dialog",
                tabIndex: "-1",
                "aria-modal": "true",
                "aria-hidden": "true",
                "aria-label": this.localize("{{MODAL}}")
            }).forEach((args => this.$container.setAttribute(...args)));
            if (this.option("animated")) this.$container.classList.add("is-animated");
            this.$backdrop = this.$container.querySelector(".fancybox__backdrop");
            if (!this.$backdrop) {
                this.$backdrop = document.createElement("div");
                this.$backdrop.classList.add("fancybox__backdrop");
                this.$container.appendChild(this.$backdrop);
            }
            this.$carousel = this.$container.querySelector(".fancybox__carousel");
            if (!this.$carousel) {
                this.$carousel = document.createElement("div");
                this.$carousel.classList.add("fancybox__carousel");
                this.$container.appendChild(this.$carousel);
            }
            this.$container.Fancybox = this;
            this.id = this.$container.getAttribute("id");
            if (!this.id) {
                this.id = this.options.id || ++called;
                this.$container.setAttribute("id", "fancybox-" + this.id);
            }
            const mainClass = this.option("mainClass");
            if (mainClass) this.$container.classList.add(...mainClass.split(" "));
            document.documentElement.classList.add("with-fancybox");
            this.trigger("initLayout");
            return this;
        }
        setItems(items) {
            const slides = [];
            for (const slide of items) {
                const $trigger = slide.$trigger;
                if ($trigger) {
                    const dataset = $trigger.dataset || {};
                    slide.src = dataset.src || $trigger.getAttribute("href") || slide.src;
                    slide.type = dataset.type || slide.type;
                    if (!slide.src && $trigger instanceof HTMLImageElement) slide.src = $trigger.currentSrc || slide.$trigger.src;
                }
                let $thumb = slide.$thumb;
                if (!$thumb) {
                    let origTarget = slide.$trigger && slide.$trigger.origTarget;
                    if (origTarget) if (origTarget instanceof HTMLImageElement) $thumb = origTarget; else $thumb = origTarget.querySelector("img:not([aria-hidden])");
                    if (!$thumb && slide.$trigger) $thumb = slide.$trigger instanceof HTMLImageElement ? slide.$trigger : slide.$trigger.querySelector("img:not([aria-hidden])");
                }
                slide.$thumb = $thumb || null;
                let thumb = slide.thumb;
                if (!thumb && $thumb) {
                    thumb = $thumb.currentSrc || $thumb.src;
                    if (!thumb && $thumb.dataset) thumb = $thumb.dataset.lazySrc || $thumb.dataset.src;
                }
                if (!thumb && "image" === slide.type) thumb = slide.src;
                slide.thumb = thumb || null;
                slide.caption = slide.caption || "";
                slides.push(slide);
            }
            this.items = slides;
        }
        initCarousel() {
            this.Carousel = new Carousel(this.$carousel, extend_extend(true, {}, {
                prefix: "",
                classNames: {
                    viewport: "fancybox__viewport",
                    track: "fancybox__track",
                    slide: "fancybox__slide"
                },
                textSelection: true,
                preload: this.option("preload"),
                friction: .88,
                slides: this.items,
                initialPage: this.options.startIndex,
                slidesPerPage: 1,
                infiniteX: this.option("infinite"),
                infiniteY: true,
                l10n: this.option("l10n"),
                Dots: false,
                Navigation: {
                    classNames: {
                        main: "fancybox__nav",
                        button: "carousel__button",
                        next: "is-next",
                        prev: "is-prev"
                    }
                },
                Panzoom: {
                    textSelection: true,
                    panOnlyZoomed: () => this.Carousel && this.Carousel.pages && this.Carousel.pages.length < 2 && !this.option("dragToClose"),
                    lockAxis: () => {
                        if (this.Carousel) {
                            let rez = "x";
                            if (this.option("dragToClose")) rez += "y";
                            return rez;
                        }
                    }
                },
                on: {
                    "*": (name, ...details) => this.trigger(`Carousel.${name}`, ...details),
                    init: carousel => this.Carousel = carousel,
                    createSlide: this.onCreateSlide,
                    settle: this.onSettle
                }
            }, this.option("Carousel")));
            if (this.option("dragToClose")) this.Carousel.Panzoom.on({
                touchMove: this.onTouchMove,
                afterTransform: this.onTransform,
                touchEnd: this.onTouchEnd
            });
            this.trigger("initCarousel");
            return this;
        }
        onCreateSlide(carousel, slide) {
            let caption = slide.caption || "";
            if ("function" === typeof this.options.caption) caption = this.options.caption.call(this, this, this.Carousel, slide);
            if ("string" === typeof caption && caption.length) {
                const $caption = document.createElement("div");
                const id = `fancybox__caption_${this.id}_${slide.index}`;
                $caption.className = "fancybox__caption";
                $caption.innerHTML = caption;
                $caption.setAttribute("id", id);
                slide.$caption = slide.$el.appendChild($caption);
                slide.$el.classList.add("has-caption");
                slide.$el.setAttribute("aria-labelledby", id);
            }
        }
        onSettle() {
            if (this.option("autoFocus")) this.focus();
        }
        onFocus(event) {
            if (!this.isTopmost()) return;
            this.focus(event);
        }
        onClick(event) {
            if (event.defaultPrevented) return;
            let eventTarget = event.composedPath()[0];
            if (eventTarget.matches("[data-fancybox-close]")) {
                event.preventDefault();
                Fancybox.close(false, event);
                return;
            }
            if (eventTarget.matches("[data-fancybox-next]")) {
                event.preventDefault();
                Fancybox.next();
                return;
            }
            if (eventTarget.matches("[data-fancybox-prev]")) {
                event.preventDefault();
                Fancybox.prev();
                return;
            }
            const activeElement = document.activeElement;
            if (activeElement) {
                if (activeElement.closest("[contenteditable]")) return;
                if (!eventTarget.matches(FOCUSABLE_ELEMENTS)) activeElement.blur();
            }
            if (eventTarget.closest(".fancybox__content")) return;
            if (getSelection().toString().length) return;
            if (false === this.trigger("click", event)) return;
            const action = this.option("click");
            switch (action) {
              case "close":
                this.close();
                break;

              case "next":
                this.next();
                break;
            }
        }
        onTouchMove() {
            const panzoom = this.getSlide().Panzoom;
            return panzoom && 1 !== panzoom.content.scale ? false : true;
        }
        onTouchEnd(panzoom) {
            const distanceY = panzoom.dragOffset.y;
            if (Math.abs(distanceY) >= 150 || Math.abs(distanceY) >= 35 && panzoom.dragOffset.time < 350) {
                if (this.option("hideClass")) this.getSlide().hideClass = `fancybox-throwOut${panzoom.content.y < 0 ? "Up" : "Down"}`;
                this.close();
            } else if ("y" === panzoom.lockAxis) panzoom.panTo({
                y: 0
            });
        }
        onTransform(panzoom) {
            const $backdrop = this.$backdrop;
            if ($backdrop) {
                const yPos = Math.abs(panzoom.content.y);
                const opacity = yPos < 1 ? "" : Math.max(.33, Math.min(1, 1 - yPos / panzoom.content.fitHeight * 1.5));
                this.$container.style.setProperty("--fancybox-ts", opacity ? "0s" : "");
                this.$container.style.setProperty("--fancybox-opacity", opacity);
            }
        }
        onMousedown() {
            if ("ready" === this.state) document.body.classList.add("is-using-mouse");
        }
        onKeydown(event) {
            if (!this.isTopmost()) return;
            document.body.classList.remove("is-using-mouse");
            const key = event.key;
            const keyboard = this.option("keyboard");
            if (!keyboard || event.ctrlKey || event.altKey || event.shiftKey) return;
            const target = event.composedPath()[0];
            const classList = document.activeElement && document.activeElement.classList;
            const isUIElement = classList && classList.contains("carousel__button");
            if ("Escape" !== key && !isUIElement) {
                let ignoreElements = event.target.isContentEditable || -1 !== [ "BUTTON", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO" ].indexOf(target.nodeName);
                if (ignoreElements) return;
            }
            if (false === this.trigger("keydown", key, event)) return;
            const action = keyboard[key];
            if ("function" === typeof this[action]) this[action]();
        }
        getSlide() {
            const carousel = this.Carousel;
            if (!carousel) return null;
            const page = null === carousel.page ? carousel.option("initialPage") : carousel.page;
            const pages = carousel.pages || [];
            if (pages.length && pages[page]) return pages[page].slides[0];
            return null;
        }
        focus(event) {
            if (Fancybox.ignoreFocusChange) return;
            if ([ "init", "closing", "customClosing", "destroy" ].indexOf(this.state) > -1) return;
            const $container = this.$container;
            const currentSlide = this.getSlide();
            const $currentSlide = "done" === currentSlide.state ? currentSlide.$el : null;
            if ($currentSlide && $currentSlide.contains(document.activeElement)) return;
            if (event) event.preventDefault();
            Fancybox.ignoreFocusChange = true;
            const allFocusableElems = Array.from($container.querySelectorAll(FOCUSABLE_ELEMENTS));
            let enabledElems = [];
            let $firstEl;
            for (let node of allFocusableElems) {
                const isNodeVisible = node.offsetParent;
                const isNodeInsideCurrentSlide = $currentSlide && $currentSlide.contains(node);
                const isNodeOutsideCarousel = !this.Carousel.$viewport.contains(node);
                if (isNodeVisible && (isNodeInsideCurrentSlide || isNodeOutsideCarousel)) {
                    enabledElems.push(node);
                    if (void 0 !== node.dataset.origTabindex) {
                        node.tabIndex = node.dataset.origTabindex;
                        node.removeAttribute("data-orig-tabindex");
                    }
                    if (node.hasAttribute("autoFocus") || !$firstEl && isNodeInsideCurrentSlide && !node.classList.contains("carousel__button")) $firstEl = node;
                } else {
                    node.dataset.origTabindex = void 0 === node.dataset.origTabindex ? node.getAttribute("tabindex") : node.dataset.origTabindex;
                    node.tabIndex = -1;
                }
            }
            if (!event) {
                if (this.option("autoFocus") && $firstEl) setFocusOn($firstEl); else if (enabledElems.indexOf(document.activeElement) < 0) setFocusOn($container);
            } else if (enabledElems.indexOf(event.target) > -1) this.lastFocus = event.target; else if (this.lastFocus === $container) setFocusOn(enabledElems[enabledElems.length - 1]); else setFocusOn($container);
            this.lastFocus = document.activeElement;
            Fancybox.ignoreFocusChange = false;
        }
        hideScrollbar() {
            if (!canUseDOM) return;
            const scrollbarWidth = window.innerWidth - document.documentElement.getBoundingClientRect().width;
            const id = "fancybox-style-noscroll";
            let $style = document.getElementById(id);
            if ($style) return;
            if (scrollbarWidth > 0) {
                $style = document.createElement("style");
                $style.id = id;
                $style.type = "text/css";
                $style.innerHTML = `.compensate-for-scrollbar {padding-right: ${scrollbarWidth}px;}`;
                document.getElementsByTagName("head")[0].appendChild($style);
                document.body.classList.add("compensate-for-scrollbar");
            }
        }
        revealScrollbar() {
            document.body.classList.remove("compensate-for-scrollbar");
            const el = document.getElementById("fancybox-style-noscroll");
            if (el) el.remove();
        }
        clearContent(slide) {
            this.Carousel.trigger("removeSlide", slide);
            if (slide.$content) {
                slide.$content.remove();
                slide.$content = null;
            }
            if (slide.$closeButton) {
                slide.$closeButton.remove();
                slide.$closeButton = null;
            }
            if (slide._className) slide.$el.classList.remove(slide._className);
        }
        setContent(slide, html, opts = {}) {
            let $content;
            const $el = slide.$el;
            if (html instanceof HTMLElement) if ([ "img", "iframe", "video", "audio" ].indexOf(html.nodeName.toLowerCase()) > -1) {
                $content = document.createElement("div");
                $content.appendChild(html);
            } else $content = html; else {
                const $fragment = document.createRange().createContextualFragment(html);
                $content = document.createElement("div");
                $content.appendChild($fragment);
            }
            if (slide.filter && !slide.error) $content = $content.querySelector(slide.filter);
            if (!($content instanceof Element)) {
                this.setError(slide, "{{ELEMENT_NOT_FOUND}}");
                return;
            }
            slide._className = `has-${opts.suffix || slide.type || "unknown"}`;
            $el.classList.add(slide._className);
            $content.classList.add("fancybox__content");
            if ("none" === $content.style.display || "none" === getComputedStyle($content).getPropertyValue("display")) $content.style.display = slide.display || this.option("defaultDisplay") || "flex";
            if (slide.id) $content.setAttribute("id", slide.id);
            slide.$content = $content;
            $el.prepend($content);
            this.manageCloseButton(slide);
            if ("loading" !== slide.state) this.revealContent(slide);
            return $content;
        }
        manageCloseButton(slide) {
            const position = void 0 === slide.closeButton ? this.option("closeButton") : slide.closeButton;
            if (!position || "top" === position && this.$closeButton) return;
            const $btn = document.createElement("button");
            $btn.classList.add("carousel__button", "is-close");
            $btn.setAttribute("title", this.options.l10n.CLOSE);
            $btn.innerHTML = this.option("template.closeButton");
            $btn.addEventListener("click", (e => this.close(e)));
            if ("inside" === position) {
                if (slide.$closeButton) slide.$closeButton.remove();
                slide.$closeButton = slide.$content.appendChild($btn);
            } else this.$closeButton = this.$container.insertBefore($btn, this.$container.firstChild);
        }
        revealContent(slide) {
            this.trigger("reveal", slide);
            slide.$content.style.visibility = "";
            let showClass = false;
            if (!(slide.error || "loading" === slide.state || null !== this.Carousel.prevPage || slide.index !== this.options.startIndex)) showClass = void 0 === slide.showClass ? this.option("showClass") : slide.showClass;
            if (!showClass) {
                this.done(slide);
                return;
            }
            slide.state = "animating";
            this.animateCSS(slide.$content, showClass, (() => {
                this.done(slide);
            }));
        }
        animateCSS($element, className, callback) {
            if ($element) $element.dispatchEvent(new CustomEvent("animationend", {
                bubbles: true,
                cancelable: true
            }));
            if (!$element || !className) {
                if ("function" === typeof callback) callback();
                return;
            }
            const handleAnimationEnd = function(event) {
                if (event.currentTarget === this) {
                    $element.removeEventListener("animationend", handleAnimationEnd);
                    if (callback) callback();
                    $element.classList.remove(className);
                }
            };
            $element.addEventListener("animationend", handleAnimationEnd);
            $element.classList.add(className);
        }
        done(slide) {
            slide.state = "done";
            this.trigger("done", slide);
            const currentSlide = this.getSlide();
            if (currentSlide && slide.index === currentSlide.index && this.option("autoFocus")) this.focus();
        }
        setError(slide, message) {
            slide.error = message;
            this.hideLoading(slide);
            this.clearContent(slide);
            const div = document.createElement("div");
            div.classList.add("fancybox-error");
            div.innerHTML = this.localize(message || "<p>{{ERROR}}</p>");
            this.setContent(slide, div, {
                suffix: "error"
            });
        }
        showLoading(slide) {
            slide.state = "loading";
            slide.$el.classList.add("is-loading");
            let $spinner = slide.$el.querySelector(".fancybox__spinner");
            if ($spinner) return;
            $spinner = document.createElement("div");
            $spinner.classList.add("fancybox__spinner");
            $spinner.innerHTML = this.option("template.spinner");
            $spinner.addEventListener("click", (() => {
                if (!this.Carousel.Panzoom.velocity) this.close();
            }));
            slide.$el.prepend($spinner);
        }
        hideLoading(slide) {
            const $spinner = slide.$el && slide.$el.querySelector(".fancybox__spinner");
            if ($spinner) {
                $spinner.remove();
                slide.$el.classList.remove("is-loading");
            }
            if ("loading" === slide.state) {
                this.trigger("load", slide);
                slide.state = "ready";
            }
        }
        next() {
            const carousel = this.Carousel;
            if (carousel && carousel.pages.length > 1) carousel.slideNext();
        }
        prev() {
            const carousel = this.Carousel;
            if (carousel && carousel.pages.length > 1) carousel.slidePrev();
        }
        jumpTo(...args) {
            if (this.Carousel) this.Carousel.slideTo(...args);
        }
        isClosing() {
            return [ "closing", "customClosing", "destroy" ].includes(this.state);
        }
        isTopmost() {
            return Fancybox.getInstance().id == this.id;
        }
        close(event) {
            if (event) event.preventDefault();
            if (this.isClosing()) return;
            if (false === this.trigger("shouldClose", event)) return;
            this.state = "closing";
            this.Carousel.Panzoom.destroy();
            this.detachEvents();
            this.trigger("closing", event);
            if ("destroy" === this.state) return;
            this.$container.setAttribute("aria-hidden", "true");
            this.$container.classList.add("is-closing");
            const currentSlide = this.getSlide();
            this.Carousel.slides.forEach((slide => {
                if (slide.$content && slide.index !== currentSlide.index) this.Carousel.trigger("removeSlide", slide);
            }));
            if ("closing" === this.state) {
                const hideClass = void 0 === currentSlide.hideClass ? this.option("hideClass") : currentSlide.hideClass;
                this.animateCSS(currentSlide.$content, hideClass, (() => {
                    this.destroy();
                }), true);
            }
        }
        destroy() {
            if ("destroy" === this.state) return;
            this.state = "destroy";
            this.trigger("destroy");
            const $trigger = this.option("placeFocusBack") ? this.option("triggerTarget", this.getSlide().$trigger) : null;
            this.Carousel.destroy();
            this.detachPlugins();
            this.Carousel = null;
            this.options = {};
            this.events = {};
            this.$container.remove();
            this.$container = this.$backdrop = this.$carousel = null;
            if ($trigger) setFocusOn($trigger);
            instances.delete(this.id);
            const nextInstance = Fancybox.getInstance();
            if (nextInstance) {
                nextInstance.focus();
                return;
            }
            document.documentElement.classList.remove("with-fancybox");
            document.body.classList.remove("is-using-mouse");
            this.revealScrollbar();
        }
        static show(items, options = {}) {
            return new Fancybox(items, options);
        }
        static fromEvent(event, options = {}) {
            if (event.defaultPrevented) return;
            if (event.button && 0 !== event.button) return;
            if (event.ctrlKey || event.metaKey || event.shiftKey) return;
            const origTarget = event.composedPath()[0];
            let eventTarget = origTarget;
            let triggerGroupName;
            if (eventTarget.matches("[data-fancybox-trigger]") || (eventTarget = eventTarget.closest("[data-fancybox-trigger]"))) {
                options.triggerTarget = eventTarget;
                triggerGroupName = eventTarget && eventTarget.dataset && eventTarget.dataset.fancyboxTrigger;
            }
            if (triggerGroupName) {
                const triggerItems = document.querySelectorAll(`[data-fancybox="${triggerGroupName}"]`);
                const triggerIndex = parseInt(eventTarget.dataset.fancyboxIndex, 10) || 0;
                eventTarget = triggerItems.length ? triggerItems[triggerIndex] : eventTarget;
            }
            let matchingOpener;
            let target;
            Array.from(Fancybox.openers.keys()).reverse().some((opener => {
                target = eventTarget || origTarget;
                let found = false;
                try {
                    if (target instanceof Element && ("string" === typeof opener || opener instanceof String)) found = target.matches(opener) || (target = target.closest(opener));
                } catch (error) {}
                if (found) {
                    event.preventDefault();
                    matchingOpener = opener;
                    return true;
                }
                return false;
            }));
            let rez = false;
            if (matchingOpener) {
                options.event = event;
                options.target = target;
                target.origTarget = origTarget;
                rez = Fancybox.fromOpener(matchingOpener, options);
                const nextInstance = Fancybox.getInstance();
                if (nextInstance && "ready" === nextInstance.state && event.detail) document.body.classList.add("is-using-mouse");
            }
            return rez;
        }
        static fromOpener(opener, options = {}) {
            const mapCallback = function(el) {
                const falseValues = [ "false", "0", "no", "null", "undefined" ];
                const trueValues = [ "true", "1", "yes" ];
                const dataset = Object.assign({}, el.dataset);
                const options = {};
                for (let [key, value] of Object.entries(dataset)) {
                    if ("fancybox" === key) continue;
                    if ("width" === key || "height" === key) options[`_${key}`] = value; else if ("string" === typeof value || value instanceof String) if (falseValues.indexOf(value) > -1) options[key] = false; else if (trueValues.indexOf(options[key]) > -1) options[key] = true; else try {
                        options[key] = JSON.parse(value);
                    } catch (e) {
                        options[key] = value;
                    } else options[key] = value;
                }
                if (el instanceof Element) options.$trigger = el;
                return options;
            };
            let items = [], index = options.startIndex || 0, target = options.target || null;
            options = extend_extend({}, options, Fancybox.openers.get(opener));
            const groupAll = void 0 === options.groupAll ? false : options.groupAll;
            const groupAttr = void 0 === options.groupAttr ? "data-fancybox" : options.groupAttr;
            const groupValue = groupAttr && target ? target.getAttribute(`${groupAttr}`) : "";
            if (!target || groupValue || groupAll) {
                const $root = options.root || (target ? target.getRootNode() : document.body);
                items = [].slice.call($root.querySelectorAll(opener));
            }
            if (target && !groupAll) if (groupValue) items = items.filter((el => el.getAttribute(`${groupAttr}`) === groupValue)); else items = [ target ];
            if (!items.length) return false;
            const currentInstance = Fancybox.getInstance();
            if (currentInstance && items.indexOf(currentInstance.options.$trigger) > -1) return false;
            index = target ? items.indexOf(target) : index;
            items = items.map(mapCallback);
            return new Fancybox(items, extend_extend({}, options, {
                startIndex: index,
                $trigger: target
            }));
        }
        static bind(selector, options = {}) {
            function attachClickEvent() {
                document.body.addEventListener("click", Fancybox.fromEvent, false);
            }
            if (!canUseDOM) return;
            if (!Fancybox.openers.size) if (/complete|interactive|loaded/.test(document.readyState)) attachClickEvent(); else document.addEventListener("DOMContentLoaded", attachClickEvent);
            Fancybox.openers.set(selector, options);
        }
        static unbind(selector) {
            Fancybox.openers.delete(selector);
            if (!Fancybox.openers.size) Fancybox.destroy();
        }
        static destroy() {
            let fb;
            while (fb = Fancybox.getInstance()) fb.destroy();
            Fancybox.openers = new Map;
            document.body.removeEventListener("click", Fancybox.fromEvent, false);
        }
        static getInstance(id) {
            if (id) return instances.get(id);
            const instance = Array.from(instances.values()).reverse().find((instance => {
                if (!instance.isClosing()) return instance;
                return false;
            }));
            return instance || null;
        }
        static close(all = true, args) {
            if (all) for (const instance of instances.values()) instance.close(args); else {
                const instance = Fancybox.getInstance();
                if (instance) instance.close(args);
            }
        }
        static next() {
            const instance = Fancybox.getInstance();
            if (instance) instance.next();
        }
        static prev() {
            const instance = Fancybox.getInstance();
            if (instance) instance.prev();
        }
    }
    Fancybox.version = "__VERSION__";
    Fancybox.defaults = Fancybox_defaults;
    Fancybox.openers = new Map;
    Fancybox.Plugins = Fancybox_plugins_Plugins;
    Fancybox.bind("[data-fancybox]");
    for (const [key, Plugin] of Object.entries(Fancybox.Plugins || {})) if ("function" === typeof Plugin.create) Plugin.create(Fancybox);
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
})();