export default class Modal {
  constructor(element, options = {}) {
    this.element = element
    this.options = {
      initClassName: 'is-init-modal',
      modalBoxClassName: 'js-modal-box',
      stopScrollClassName: 'no-overflow',
      toggledClassName: 'is-open',
      transitionendProperty: 'visibility',
      ...options,
    }

    this.box = document.querySelector(`#${this.element.dataset.id}`)
    this.contBox = this.box.querySelector('[data-modal-cont-box]')
    this.closeEls = [...this.box.querySelectorAll('[data-modal-close]')]
    this.htmlEl = document.querySelector('html')

    this.onOpen = null
    this.onOpened = null
    this.onClose = null
    this.onClosed = null

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handleTransitionend = this.handleTransitionend.bind(this)
    this.clickOutside = this.clickOutside.bind(this)
    this.escPress = this.escPress.bind(this)

    this.init()
  }

  isInit() {
    return this.element.classList.contains(this.options.initClassName)
  }

  init() {
    if (this.isInit()) {
      console.error(`Modal is already initialized (id): ${this.element.dataset.id}`)
      return
    }

    this.generateA11y()
    this.addEvents()

    this.element.classList.add(this.options.initClassName)
  }

  generateA11y() {
    this.box.setAttribute('tabindex', '-1')

    this.box.setAttribute('aria-hidden', 'true')
  }

  removeA11y() {
    this.box.removeAttribute('tabindex')

    this.box.removeAttribute('aria-hidden')
  }

  isOpen() {
    return this.box.classList.contains(this.options.toggledClassName)
  }

  open() {
    if (this.isOpen()) {
      return
    }

    this.htmlEl.classList.add(this.options.stopScrollClassName)
    this.box.classList.add(this.options.toggledClassName)

    this.box.removeAttribute('aria-hidden')
    this.box.setAttribute('aria-modal', 'true')
    this.box.setAttribute('role', 'dialog')

    if (typeof this.onOpen === 'function') {
      this.onOpen()
    }
  }

  close() {
    if (!this.isOpen()) {
      return
    }

    this.htmlEl.classList.remove(this.options.stopScrollClassName)
    this.box.classList.remove(this.options.toggledClassName)

    this.box.setAttribute('aria-hidden', 'true')
    this.box.removeAttribute('aria-modal')
    this.box.removeAttribute('role')

    if (typeof this.onClose === 'function') {
      this.onClose()
    }
  }

  toggle() {
    if (this.isOpen()) {
      this.close()
      return
    }
    this.open()
  }

  handleTransitionend(event) {
    if (!event.target.classList.contains(this.options.modalBoxClassName) || (event.propertyName !== this.options.transitionendProperty)) {
      return
    }
    if (this.isOpen() && typeof this.onOpened === 'function') {
      this.onOpened()
      return
    }
    if (!this.isOpen() && typeof this.onClosed === 'function') {
      this.onClosed()
    }
  }

  clickOutside(event) {
    const target = event.target
    const id = this.element.dataset.id
    if (target.id === id || target.parentElement.id === id) {
      this.close()
    }
  }

  escPress(event) {
    if (event.keyCode === 27 && this.isOpen()) {
      this.close()
    }
  }

  addEvents() {
    this.element.addEventListener('click', this.open)
    for (const element of this.closeEls) {
      element.addEventListener('click', this.close)
    }
    this.box.addEventListener('transitionend', this.handleTransitionend)
    this.box.addEventListener('click', this.clickOutside)
    document.addEventListener('keyup', this.escPress)
  }

  removeEvents() {
    this.element.removeEventListener('click', this.open)
    for (const element of this.closeEls) {
      element.removeEventListener('click', this.close)
    }
    this.box.removeEventListener('transitionend', this.handleTransitionend)
    this.box.removeEventListener('click', this.clickOutside)
    document.removeEventListener('keyup', this.escPress)
  }

  destroy() {
    if (!this.isInit()) {
      console.error(`Modal is not initialized (id): ${this.element.dataset.id}`)
      return
    }

    if (this.isOpen()) {
      this.close()
    }

    this.removeEvents()
    this.removeA11y()

    this.element.classList.remove(this.options.initClassName)
  }
}
