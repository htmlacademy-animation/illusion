export default class AnimatedCart {
  constructor(options) {
    this.options = options;

    this.cart         = document.querySelector(options.cart);
    this.ticket       = document.querySelector(options.ticket);
    this.form         = document.querySelector(options.form);
    this.ticketsBlock = document.querySelector(options.ticketsBlock);
    this.inputs           = this.form.querySelectorAll(`input`);
    this.number           = this.cart.querySelector(options.number);
    this.currentContainer = this.ticketsBlock.querySelector(options.currentContainer);

    this.initEventListeners();
  }


  initEventListeners() {
    this.form.addEventListener(`submit`, (e) => {
      e.preventDefault();

      this.animate();
    });
  }


  animate() {
    const total = Array.from(this.inputs).reduce((sum, current) => {
      return sum + parseInt(current.value, 10);
    }, 0);

    this.calculateDeltas();

    this.ticket.classList.remove(`animate`);

    void this.ticket.offsetWidth;

    this.ticket.classList.add(`animate`);

    setTimeout(() => {
      if (this.cart.classList.contains(`updated`)) {
        this.cart.classList.remove(`updated`);

        setTimeout(() => {
          this.number.innerHTML = total;
          this.cart.classList.add(`updated`);
        }, 300);
      } else {
        this.number.innerHTML = total;
        this.cart.classList.add(`updated`);
      }
    }, 800);
  }


  calculateDeltas() {
    this.currentContainer = this.ticketsBlock.querySelector(this.options.currentContainer);
    this.ticket = this.currentContainer.querySelector(this.options.ticket);

    const ticketCR = this.ticket.getBoundingClientRect();
    const {width: ticketWidth, height: ticketHeight, left: ticketX, top: ticketY} = ticketCR;

    const cartCR = this.cart.getBoundingClientRect();
    const {width: cartWidth, height: cartHeight, left: cartX, top: cartY} = cartCR;

    const cartDeltaX = cartX - ticketX + cartWidth / 2 - ticketWidth / 2;
    const cartDeltaY = cartY - ticketY + cartHeight / 2 - ticketHeight / 2;

    document.documentElement.style.setProperty(`--cartDeltaX`, cartDeltaX + `px`);
    document.documentElement.style.setProperty(`--cartDeltaY`, cartDeltaY + `px`);
  }
}
