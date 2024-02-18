(() => {
    "use strict";
    const scrollController = {
      scrollPosition: 0,
      disabledScroll() {
        scrollController.scrollPosition = window.scrollY;
        document.body.style.cssText = `
          overflow: hidden;
          position: fixed;
          top: -${scrollController.scrollPosition}px;
          left: 0;
          height: 100vh;
          width: 100vw;
          padding-right: ${window.innerWidth - document.body.offsetWidth}px
        `;
        document.documentElement.style.scrollBehavior = 'unset';
      },
      enabledScroll() {
        document.body.style.cssText = '';
        window.scroll({top: scrollController.scrollPosition})
        document.documentElement.style.scrollBehavior = '';
      },
    }
    let modalOpened = false;
    
    const imgTemplate = document.createElement('img');
    imgTemplate.style.maxWidth = '100%';
    imgTemplate.style.maxHeight = '80vh';
    
    const modalController = ({modal, btnOpen, btnClose, time = 300, pictureElemClass}) => {
      const buttonElems = document.querySelectorAll(btnOpen);
      const modalElem = document.querySelector(modal);
    
      modalElem.style.cssText = `
        display: flex;
        visibility: hidden;
        opacity: 0;
        transition: opacity ${time}ms ease-in-out;
      `;
    
      const closeModal = event => {
        const target = event.target;
    
        if (
          target === modalElem ||
          (btnClose && target.closest(btnClose)) ||
          event.code === 'Escape'
          ) {
          
          modalElem.style.opacity = 0;
    
          setTimeout(() => {
            modalElem.style.visibility = 'hidden';
            if (modalOpened) {
              modalOpened = false;
              scrollController.enabledScroll();
            }
          }, time);
    
          window.removeEventListener('keydown', closeModal);
        }
      }
    
      const openModal = (modalElem, pictureElemClass) => {
        if (!modalOpened) {
          modalOpened = true;
          modalElem.style.visibility = 'visible';
          modalElem.style.opacity = 1;
          if (modalElem.classList.contains('modal-enlarge')) {
            const imgElem = imgTemplate.cloneNode(true);
    
            if (pictureElemClass) {
              const pictureElem = document.querySelector(`.${pictureElemClass}`);
              const sourceElem = pictureElem.querySelector('source');
              const imgSrc = sourceElem ? sourceElem.srcset : pictureElem.querySelector('img').src;
              imgElem.src = imgSrc;
            }
            imgElem.alt = 'Увеличенное изображение';
            const modalContainer = modalElem.querySelector('.modal__container');
            modalContainer.innerHTML = '';
            modalContainer.appendChild(imgElem);
          }
          window.addEventListener('keydown', closeModal);
          scrollController.disabledScroll();
        }
      };
    
      buttonElems.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalElem, pictureElemClass));
      });
    
      modalElem.addEventListener('click', (event) => closeModal(event));
    };
    
    modalController({
      modal: '.modal-enlarge',
      btnOpen: '.enlarge-picture',
      btnClose: '.modal__close',
      pictureElemClass: 'enlarge-picture',
    });

    const flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
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
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                headerItemHeight = document.querySelector(headerItem).offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
        } else FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
    };
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    function formSubmit(options = {
        validate: true
    }) {
        const forms = document.forms;
        if (forms.length) for (const form of forms) {
            form.addEventListener("submit", (function(e) {
                const form = e.target;
                formSubmitAction(form, e);
            }));
            form.addEventListener("reset", (function(e) {
                const form = e.target;
                formValidate.formClean(form);
            }));
        }
        async function formSubmitAction(form, e) {
            const error = !form.hasAttribute("data-no-validate") ? formValidate.getErrors(form) : 0;
            if (error === 0) {
                const ajax = form.hasAttribute("data-ajax");
                if (ajax) {
                    e.preventDefault();
                    const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
                    const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
                    const formData = new FormData(form);
                    form.classList.add("_sending");
                    const response = await fetch(formAction, {
                        method: formMethod,
                        body: formData
                    });
                    if (response.ok) {
                        let responseResult = await response.json();
                        form.classList.remove("_sending");
                        formSent(form, responseResult);
                    } else {
                        alert("Ошибка");
                        form.classList.remove("_sending");
                    }
                } else if (form.hasAttribute("data-dev")) {
                    e.preventDefault();
                    formSent(form);
                }
            } else {
                e.preventDefault();
                const formError = form.querySelector("._form-error");
                if (formError && form.hasAttribute("data-goto-error")) gotoBlock(formError, true, 1e3);
            }
        }
        function formSent(form, responseResult = ``) {
            document.dispatchEvent(new CustomEvent("formSent", {
                detail: {
                    form
                }
            }));
            setTimeout((() => {
                if (flsModules.popup) {
                    const popup = form.dataset.popupMessage;
                    popup ? flsModules.popup.open(popup) : null;
                }
            }), 0);
            formValidate.formClean(form);
            formLogging(`Форма отправлена!`);
        }
        function formLogging(message) {
            FLS(`[Формы]: ${message}`);
        }
    }
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if (e.type === "click") {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if (e.type === "watcherCallback" && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.dataset.watch === "navigator") {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
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
        if (place === "last" || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if (place === "first") {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== void 0) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if (this.type === "min") Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if (a.place === "first" || b.place === "last") return -1;
                if (a.place === "last" || b.place === "first") return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return 1;
                    if (a.place === "last" || b.place === "first") return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    const getFullWidth = elem => Math.max(elem.offsetWidth, elem.scrollWidth);
    const getFullHeight = elem => Math.max(elem.offsetHeight, elem.scrollHeight);
    const textNodeFromPoint = (element, x, y) => {
        const nodes = element.childNodes;
        const range = document.createRange();
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.nodeType !== 3) continue;
            range.selectNodeContents(node);
            const rect = range.getBoundingClientRect();
            if (x >= rect.left && y >= rect.top && x <= rect.right && y <= rect.bottom) return node;
        }
        return false;
    };
    const clearTextSelection = () => {
        const selection = window.getSelection ? window.getSelection() : document.selection;
        if (!selection) return;
        if (selection.removeAllRanges) selection.removeAllRanges(); else if (selection.empty) selection.empty();
    };
    const CLICK_EVENT_THRESHOLD_PX = 5;
    class ScrollBooster {
        constructor(options = {}) {
            const defaults = {
                content: options.viewport.children[0],
                direction: "all",
                pointerMode: "all",
                scrollMode: void 0,
                bounce: true,
                bounceForce: .1,
                friction: .05,
                textSelection: false,
                inputsFocus: true,
                emulateScroll: false,
                preventDefaultOnEmulateScroll: false,
                preventPointerMoveDefault: true,
                lockScrollOnDragDirection: false,
                pointerDownPreventDefault: true,
                dragDirectionTolerance: 40,
                onPointerDown() {},
                onPointerUp() {},
                onPointerMove() {},
                onClick() {},
                onUpdate() {},
                onWheel() {},
                shouldScroll() {
                    return true;
                }
            };
            this.props = {
                ...defaults,
                ...options
            };
            if (!this.props.viewport || !(this.props.viewport instanceof Element)) {
                console.error(`ScrollBooster init error: "viewport" config property must be present and must be Element`);
                return;
            }
            if (!this.props.content) {
                console.error(`ScrollBooster init error: Viewport does not have any content`);
                return;
            }
            this.isDragging = false;
            this.isTargetScroll = false;
            this.isScrolling = false;
            this.isRunning = false;
            const START_COORDINATES = {
                x: 0,
                y: 0
            };
            this.position = {
                ...START_COORDINATES
            };
            this.velocity = {
                ...START_COORDINATES
            };
            this.dragStartPosition = {
                ...START_COORDINATES
            };
            this.dragOffset = {
                ...START_COORDINATES
            };
            this.clientOffset = {
                ...START_COORDINATES
            };
            this.dragPosition = {
                ...START_COORDINATES
            };
            this.targetPosition = {
                ...START_COORDINATES
            };
            this.scrollOffset = {
                ...START_COORDINATES
            };
            this.rafID = null;
            this.events = {};
            this.updateMetrics();
            this.handleEvents();
        }
        updateOptions(options = {}) {
            this.props = {
                ...this.props,
                ...options
            };
            this.props.onUpdate(this.getState());
            this.startAnimationLoop();
        }
        updateMetrics() {
            this.viewport = {
                width: this.props.viewport.clientWidth,
                height: this.props.viewport.clientHeight
            };
            this.content = {
                width: getFullWidth(this.props.content),
                height: getFullHeight(this.props.content)
            };
            this.edgeX = {
                from: Math.min(-this.content.width + this.viewport.width, 0),
                to: 0
            };
            this.edgeY = {
                from: Math.min(-this.content.height + this.viewport.height, 0),
                to: 0
            };
            this.props.onUpdate(this.getState());
            this.startAnimationLoop();
        }
        startAnimationLoop() {
            this.isRunning = true;
            cancelAnimationFrame(this.rafID);
            this.rafID = requestAnimationFrame((() => this.animate()));
        }
        animate() {
            if (!this.isRunning) return;
            this.updateScrollPosition();
            if (!this.isMoving()) {
                this.isRunning = false;
                this.isTargetScroll = false;
            }
            const state = this.getState();
            this.setContentPosition(state);
            this.props.onUpdate(state);
            this.rafID = requestAnimationFrame((() => this.animate()));
        }
        updateScrollPosition() {
            this.applyEdgeForce();
            this.applyDragForce();
            this.applyScrollForce();
            this.applyTargetForce();
            const inverseFriction = 1 - this.props.friction;
            this.velocity.x *= inverseFriction;
            this.velocity.y *= inverseFriction;
            if (this.props.direction !== "vertical") this.position.x += this.velocity.x;
            if (this.props.direction !== "horizontal") this.position.y += this.velocity.y;
            if ((!this.props.bounce || this.isScrolling) && !this.isTargetScroll) {
                this.position.x = Math.max(Math.min(this.position.x, this.edgeX.to), this.edgeX.from);
                this.position.y = Math.max(Math.min(this.position.y, this.edgeY.to), this.edgeY.from);
            }
        }
        applyForce(force) {
            this.velocity.x += force.x;
            this.velocity.y += force.y;
        }
        applyEdgeForce() {
            if (!this.props.bounce || this.isDragging) return;
            const beyondXFrom = this.position.x < this.edgeX.from;
            const beyondXTo = this.position.x > this.edgeX.to;
            const beyondYFrom = this.position.y < this.edgeY.from;
            const beyondYTo = this.position.y > this.edgeY.to;
            const beyondX = beyondXFrom || beyondXTo;
            const beyondY = beyondYFrom || beyondYTo;
            if (!beyondX && !beyondY) return;
            const edge = {
                x: beyondXFrom ? this.edgeX.from : this.edgeX.to,
                y: beyondYFrom ? this.edgeY.from : this.edgeY.to
            };
            const distanceToEdge = {
                x: edge.x - this.position.x,
                y: edge.y - this.position.y
            };
            const force = {
                x: distanceToEdge.x * this.props.bounceForce,
                y: distanceToEdge.y * this.props.bounceForce
            };
            const restPosition = {
                x: this.position.x + (this.velocity.x + force.x) / this.props.friction,
                y: this.position.y + (this.velocity.y + force.y) / this.props.friction
            };
            if (beyondXFrom && restPosition.x >= this.edgeX.from || beyondXTo && restPosition.x <= this.edgeX.to) force.x = distanceToEdge.x * this.props.bounceForce - this.velocity.x;
            if (beyondYFrom && restPosition.y >= this.edgeY.from || beyondYTo && restPosition.y <= this.edgeY.to) force.y = distanceToEdge.y * this.props.bounceForce - this.velocity.y;
            this.applyForce({
                x: beyondX ? force.x : 0,
                y: beyondY ? force.y : 0
            });
        }
        applyDragForce() {
            if (!this.isDragging) return;
            const dragVelocity = {
                x: this.dragPosition.x - this.position.x,
                y: this.dragPosition.y - this.position.y
            };
            this.applyForce({
                x: dragVelocity.x - this.velocity.x,
                y: dragVelocity.y - this.velocity.y
            });
        }
        applyScrollForce() {
            if (!this.isScrolling) return;
            this.applyForce({
                x: this.scrollOffset.x - this.velocity.x,
                y: this.scrollOffset.y - this.velocity.y
            });
            this.scrollOffset.x = 0;
            this.scrollOffset.y = 0;
        }
        applyTargetForce() {
            if (!this.isTargetScroll) return;
            this.applyForce({
                x: (this.targetPosition.x - this.position.x) * .08 - this.velocity.x,
                y: (this.targetPosition.y - this.position.y) * .08 - this.velocity.y
            });
        }
        isMoving() {
            return this.isDragging || this.isScrolling || Math.abs(this.velocity.x) >= .01 || Math.abs(this.velocity.y) >= .01;
        }
        scrollTo(position = {}) {
            this.isTargetScroll = true;
            this.targetPosition.x = -position.x || 0;
            this.targetPosition.y = -position.y || 0;
            this.startAnimationLoop();
        }
        setPosition(position = {}) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.position.x = -position.x || 0;
            this.position.y = -position.y || 0;
            this.startAnimationLoop();
        }
        getState() {
            return {
                isMoving: this.isMoving(),
                isDragging: !!(this.dragOffset.x || this.dragOffset.y),
                position: {
                    x: -this.position.x,
                    y: -this.position.y
                },
                dragOffset: this.dragOffset,
                dragAngle: this.getDragAngle(this.clientOffset.x, this.clientOffset.y),
                borderCollision: {
                    left: this.position.x >= this.edgeX.to,
                    right: this.position.x <= this.edgeX.from,
                    top: this.position.y >= this.edgeY.to,
                    bottom: this.position.y <= this.edgeY.from
                }
            };
        }
        getDragAngle(x, y) {
            return Math.round(Math.atan2(x, y) * (180 / Math.PI));
        }
        getDragDirection(angle, tolerance) {
            const absAngle = Math.abs(90 - Math.abs(angle));
            if (absAngle <= 90 - tolerance) return "horizontal"; else return "vertical";
        }
        setContentPosition(state) {
            if (this.props.scrollMode === "transform") this.props.content.style.transform = `translate(${-state.position.x}px, ${-state.position.y}px)`;
            if (this.props.scrollMode === "native") {
                this.props.viewport.scrollTop = state.position.y;
                this.props.viewport.scrollLeft = state.position.x;
            }
        }
        handleEvents() {
            const dragOrigin = {
                x: 0,
                y: 0
            };
            const clientOrigin = {
                x: 0,
                y: 0
            };
            let dragDirection = null;
            let wheelTimer = null;
            let isTouch = false;
            const setDragPosition = event => {
                if (!this.isDragging) return;
                const eventData = isTouch ? event.touches[0] : event;
                const {pageX, pageY, clientX, clientY} = eventData;
                this.dragOffset.x = pageX - dragOrigin.x;
                this.dragOffset.y = pageY - dragOrigin.y;
                this.clientOffset.x = clientX - clientOrigin.x;
                this.clientOffset.y = clientY - clientOrigin.y;
                if (Math.abs(this.clientOffset.x) > 5 && !dragDirection || Math.abs(this.clientOffset.y) > 5 && !dragDirection) dragDirection = this.getDragDirection(this.getDragAngle(this.clientOffset.x, this.clientOffset.y), this.props.dragDirectionTolerance);
                if (this.props.lockScrollOnDragDirection && this.props.lockScrollOnDragDirection !== "all") if (dragDirection === this.props.lockScrollOnDragDirection && isTouch) {
                    this.dragPosition.x = this.dragStartPosition.x + this.dragOffset.x;
                    this.dragPosition.y = this.dragStartPosition.y + this.dragOffset.y;
                } else if (!isTouch) {
                    this.dragPosition.x = this.dragStartPosition.x + this.dragOffset.x;
                    this.dragPosition.y = this.dragStartPosition.y + this.dragOffset.y;
                } else {
                    this.dragPosition.x = this.dragStartPosition.x;
                    this.dragPosition.y = this.dragStartPosition.y;
                } else {
                    this.dragPosition.x = this.dragStartPosition.x + this.dragOffset.x;
                    this.dragPosition.y = this.dragStartPosition.y + this.dragOffset.y;
                }
            };
            this.events.pointerdown = event => {
                isTouch = !!(event.touches && event.touches[0]);
                this.props.onPointerDown(this.getState(), event, isTouch);
                const eventData = isTouch ? event.touches[0] : event;
                const {pageX, pageY, clientX, clientY} = eventData;
                const {viewport} = this.props;
                const rect = viewport.getBoundingClientRect();
                if (clientX - rect.left >= viewport.clientLeft + viewport.clientWidth) return;
                if (clientY - rect.top >= viewport.clientTop + viewport.clientHeight) return;
                if (!this.props.shouldScroll(this.getState(), event)) return;
                if (event.button === 2) return;
                if (this.props.pointerMode === "mouse" && isTouch) return;
                if (this.props.pointerMode === "touch" && !isTouch) return;
                const formNodes = [ "input", "textarea", "button", "select", "label" ];
                if (this.props.inputsFocus && formNodes.indexOf(event.target.nodeName.toLowerCase()) > -1) return;
                if (this.props.textSelection) {
                    const textNode = textNodeFromPoint(event.target, clientX, clientY);
                    if (textNode) return;
                    clearTextSelection();
                }
                this.isDragging = true;
                dragOrigin.x = pageX;
                dragOrigin.y = pageY;
                clientOrigin.x = clientX;
                clientOrigin.y = clientY;
                this.dragStartPosition.x = this.position.x;
                this.dragStartPosition.y = this.position.y;
                setDragPosition(event);
                this.startAnimationLoop();
                if (!isTouch && this.props.pointerDownPreventDefault) event.preventDefault();
            };
            this.events.pointermove = event => {
                if (event.cancelable && (this.props.lockScrollOnDragDirection === "all" || this.props.lockScrollOnDragDirection === dragDirection)) event.preventDefault();
                setDragPosition(event);
                this.props.onPointerMove(this.getState(), event, isTouch);
            };
            this.events.pointerup = event => {
                this.isDragging = false;
                dragDirection = null;
                this.props.onPointerUp(this.getState(), event, isTouch);
            };
            this.events.wheel = event => {
                const state = this.getState();
                if (!this.props.emulateScroll) return;
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.isScrolling = true;
                this.scrollOffset.x = -event.deltaX;
                this.scrollOffset.y = -event.deltaY;
                this.props.onWheel(state, event);
                this.startAnimationLoop();
                clearTimeout(wheelTimer);
                wheelTimer = setTimeout((() => this.isScrolling = false), 80);
                if (this.props.preventDefaultOnEmulateScroll && this.getDragDirection(this.getDragAngle(-event.deltaX, -event.deltaY), this.props.dragDirectionTolerance) === this.props.preventDefaultOnEmulateScroll) event.preventDefault();
            };
            this.events.scroll = () => {
                const {scrollLeft, scrollTop} = this.props.viewport;
                if (Math.abs(this.position.x + scrollLeft) > 3) {
                    this.position.x = -scrollLeft;
                    this.velocity.x = 0;
                }
                if (Math.abs(this.position.y + scrollTop) > 3) {
                    this.position.y = -scrollTop;
                    this.velocity.y = 0;
                }
            };
            this.events.click = event => {
                const state = this.getState();
                const dragOffsetX = this.props.direction !== "vertical" ? state.dragOffset.x : 0;
                const dragOffsetY = this.props.direction !== "horizontal" ? state.dragOffset.y : 0;
                if (Math.max(Math.abs(dragOffsetX), Math.abs(dragOffsetY)) > CLICK_EVENT_THRESHOLD_PX) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                this.props.onClick(state, event, isTouch);
            };
            this.events.contentLoad = () => this.updateMetrics();
            this.events.resize = () => this.updateMetrics();
            this.props.viewport.addEventListener("mousedown", this.events.pointerdown);
            this.props.viewport.addEventListener("touchstart", this.events.pointerdown, {
                passive: false
            });
            this.props.viewport.addEventListener("click", this.events.click);
            this.props.viewport.addEventListener("wheel", this.events.wheel, {
                passive: false
            });
            this.props.viewport.addEventListener("scroll", this.events.scroll);
            this.props.content.addEventListener("load", this.events.contentLoad, true);
            window.addEventListener("mousemove", this.events.pointermove);
            window.addEventListener("touchmove", this.events.pointermove, {
                passive: false
            });
            window.addEventListener("mouseup", this.events.pointerup);
            window.addEventListener("touchend", this.events.pointerup);
            window.addEventListener("resize", this.events.resize);
        }
        destroy() {
            this.props.viewport.removeEventListener("mousedown", this.events.pointerdown);
            this.props.viewport.removeEventListener("touchstart", this.events.pointerdown);
            this.props.viewport.removeEventListener("click", this.events.click);
            this.props.viewport.removeEventListener("wheel", this.events.wheel);
            this.props.viewport.removeEventListener("scroll", this.events.scroll);
            this.props.content.removeEventListener("load", this.events.contentLoad);
            window.removeEventListener("mousemove", this.events.pointermove);
            window.removeEventListener("touchmove", this.events.pointermove);
            window.removeEventListener("mouseup", this.events.pointerup);
            window.removeEventListener("touchend", this.events.pointerup);
            window.removeEventListener("resize", this.events.resize);
        }
    }
    document.addEventListener("DOMContentLoaded", (function() {
        var phoneInputs = document.querySelectorAll("input[data-tel-input]");
        var getInputNumbersValue = function(input) {
            return input.value.replace(/\D/g, "");
        };
        var onPhonePaste = function(e) {
            var input = e.target, inputNumbersValue = getInputNumbersValue(input);
            var pasted = e.clipboardData || window.clipboardData;
            if (pasted) {
                var pastedText = pasted.getData("Text");
                if (/\D/g.test(pastedText)) {
                    input.value = inputNumbersValue;
                    return;
                }
            }
        };
        var onPhoneInput = function(e) {
            var input = e.target, inputNumbersValue = getInputNumbersValue(input), selectionStart = input.selectionStart, formattedInputValue = "";
            if (!inputNumbersValue) return input.value = "";
            if (input.value.length != selectionStart) {
                if (e.data && /\D/g.test(e.data)) input.value = inputNumbersValue;
                return;
            }
            if ([ "7", "8", "9" ].indexOf(inputNumbersValue[0]) > -1) {
                if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
                var firstSymbols = inputNumbersValue[0] == "8" ? "8" : "+7";
                formattedInputValue = input.value = firstSymbols + " ";
                if (inputNumbersValue.length > 1) formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
                if (inputNumbersValue.length >= 5) formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
                if (inputNumbersValue.length >= 8) formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
                if (inputNumbersValue.length >= 10) formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
            } else formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
            input.value = formattedInputValue;
        };
        var onPhoneKeyDown = function(e) {
            var inputValue = e.target.value.replace(/\D/g, "");
            if (e.keyCode == 8 && inputValue.length == 1) e.target.value = "";
        };
        for (var phoneInput of phoneInputs) {
            phoneInput.addEventListener("keydown", onPhoneKeyDown);
            phoneInput.addEventListener("input", onPhoneInput, false);
            phoneInput.addEventListener("paste", onPhonePaste, false);
        }
    }));
    new Swiper(".gallery__slider", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        centeredSlides: false,
        autoplay: {
            delay: 2e3,
            disableOnInteraction: false
        },
        pagination: {
            el: ".gallery-nav-pagination",
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 5
        }
    });
    new Swiper(".rooms__slider", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: false,
        navigation: {
            nextEl: ".rooms-button-next",
            prevEl: ".rooms-button-prev"
        }
    });
    new ScrollBooster({
        viewport: document.querySelector(".portfolio-viewport"),
        content: document.querySelector(".portfolio-list"),
        scrollMode: "transform",
        direction: "horizontal",
        emulateScroll: true
    });
    document.addEventListener("formSent", (function(e) {
        const currentForm = e.detail.form;
        currentForm.querySelector(".successbox").style.display = "block";
        setTimeout((() => {
            currentForm.querySelector(".successbox").style.display = "none";
        }), 4e3);
        grecaptcha.execute("6Lcg3LUlAAAAAAIombQNRJUYPzFIPnNu6fpdHsoc", {
            action: "homepage"
        }).then((function(token) {
            captcha = document.querySelectorAll(".g-recaptcha-response");
            captcha.forEach((item => item.value = token));
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        var isMobile = {
            Android: function Android() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function BlackBerry() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function iOS() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function Opera() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function Windows() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function any() {
                return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
            }
        };
        if (document.querySelector("#ymap")) {
            var init = function init() {
                var myMap = new ymaps.Map("ymap", {
                    center: [ 54.724864, 55.924977 ],
                    zoom: 16
                }, {
                    searchControlProvider: "yandex#search"
                }), myPlacemark = new ymaps.Placemark([ 54.724864, 55.924977 ], {
                    balloonContentHeader: "Бутик-Отель Пушкин",
                    balloonContentBody: "РБ, г.Уфа, улица Пушкина 42А<br>",
                    balloonContentFooter: "<a href='tel:+79373505575'>+79373505575</a>",
                    hintContent: "<span style='color: #420e02;'>Бутик-Отель Пушкин</span>"
                }, {
                    preset: "islands#redDotIcon"
                });
                myMap.geoObjects.add(myPlacemark);
                myMap.behaviors.disable("scrollZoom");
                if (isMobile.any()) myMap.behaviors.disable("drag");
            };
            ymaps.ready(init);
        }
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    formSubmit();
    pageNavigation();
})();