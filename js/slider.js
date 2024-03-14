class mainSlider {
  static PREFIX = 'main';
  static EL_WRAPPER = `${mainSlider.PREFIX}__wrapper`;
  static EL_ITEM = `${mainSlider.PREFIX}__item`;
  static EL_ITEM_ACTIVE = `${mainSlider.PREFIX}__item_active`;
  static EL_ITEMS = `${mainSlider.PREFIX}__items`;
  static EL_INDICATOR = `${mainSlider.PREFIX}__indicator`;
  static EL_INDICATOR_ACTIVE = `${mainSlider.PREFIX}__indicator_active`;
  static EL_INDICATORS = `${mainSlider.PREFIX}__indicators`;
  static EL_CONTROL = `${mainSlider.PREFIX}__btn`;
  static SWIPE_THRESHOLD = 20;
  static TRANSITION_NONE = 'transition-none';
  static checkSupportPassiveEvents() {
    let passiveSupported = false;
    try {
      const options = Object.defineProperty({}, 'passive', {
        get() {
          passiveSupported = true;
        },
      });
      window.addEventListener('testPassiveListener', null, options);
      window.removeEventListener('testPassiveListener', null, options);
    } catch (error) {
      passiveSupported = false;
    }
    return passiveSupported;
  }

  constructor(target, config) {
    this._el = typeof target === 'string' ? document.querySelector(target) : target;
    this._elWrapper = this._el.querySelector(`.${this.constructor.EL_WRAPPER}`);
    this._elItems = this._el.querySelector(`.${this.constructor.EL_ITEMS}`);
    this._elListItem = this._el.querySelectorAll(`.${this.constructor.EL_ITEM}`);

    this._exOrderMin = 0;
    this._exOrderMax = 0;
    this._exItemMin = null;
    this._exItemMax = null;
    this._exTranslateMin = 0;
    this._exTranslateMax = 0;

    this._states = [];

    this._isBalancing = false;

    this._direction = 'next';

    this._transform = 0;

    this._clientRect = this._elWrapper.getBoundingClientRect();

    this._supportResizeObserver = typeof window.ResizeObserver !== 'undefined';

    const styleElItems = window.getComputedStyle(this._elItems);
    this._delay = Math.round(parseFloat(styleElItems.transitionDuration) * 50);

    this._hasSwipeState = false;
    this._swipeStartPosX = 0;

    this._intervalId = null;
    this._config = {
      loop: true,
      autoplay: false,
      interval: 5000,
      indicators: true,
      swipe: true,
      ...config
    };
    this._elItems.dataset.translate = '0';

    this._elListItem.forEach((item, index) => {
      item.dataset.order = `${index}`;
      item.dataset.index = `${index}`;
      item.dataset.translate = '0';
      this._states.push(index === 0 ? 1 : 0);
    });

    if (this._config.loop) {
      const count = this._elListItem.length - 1;
      const translate = -this._elListItem.length;
      this._elListItem[count].dataset.order = '-1';
      this._elListItem[count].dataset.translate = `${-this._elListItem.length}`;
      const valueX = translate * this._clientRect.width;
      this._elListItem[count].style.transform = `translate3D(${valueX}px, 0px, 0.1px)`;
    }

    this._addIndicators();
    this._elListIndicator = document.querySelectorAll(`.${this.constructor.EL_INDICATOR}`);

    this._updateExProperties();

    this._changeActiveItems();

    this._addEventListener();

    this._autoplay();
  }

  _changeActiveItems() {
    this._states.forEach((item, index) => {
      if (item) {
        this._elListItem[index].classList.add(this.constructor.EL_ITEM_ACTIVE);
      } else {
        this._elListItem[index].classList.remove(this.constructor.EL_ITEM_ACTIVE);
      }
      if (this._elListIndicator.length && item) {
        this._elListIndicator[index].classList.add(this.constructor.EL_INDICATOR_ACTIVE);
      } else if (this._elListIndicator.length && !item) {
        this._elListIndicator[index].classList.remove(this.constructor.EL_INDICATOR_ACTIVE);
      }
    });
    this._el.dispatchEvent(new CustomEvent('change.itc.slider', {
      bubbles: true
    }));
  }

  _move() {
    this._elItems.classList.remove(this.constructor.TRANSITION_NONE);
    if (this._direction === 'none') {
      const valueX = this._transform * this._clientRect.width;
      this._elItems.style.transform = `translate3D(${valueX}px, 0px, 0.1px)`;
      return;
    }
    if (!this._config.loop) {
      const isNotMovePrev = this._states[0] && this._direction === 'prev';
      const isNotMoveNext = this._states[this._states.length - 1] && this._direction === 'next';
      if (isNotMovePrev || isNotMoveNext) {
        this._autoplay('stop');
        return;
      }
    }
    this._transform += this._direction === 'next' ? -1 : 1;
    if (this._direction === 'next') {
      this._states = [...this._states.slice(-1), ...this._states.slice(0, -1)];
    } else if (this._direction === 'prev') {
      this._states = [...this._states.slice(1), ...this._states.slice(0, 1)];
    }
    this._elItems.dataset.translate = this._transform;
    const valueX = this._transform * this._clientRect.width;
    this._elItems.style.transform = `translate3D(${valueX}px, 0px, 0.1px)`;
    this._elItems.dispatchEvent(new CustomEvent('moving.itc.slider', {
      bubbles: true
    }));
    this._changeActiveItems();
    if (!this._isBalancing) {
      this._isBalancing = true;
      window.requestAnimationFrame(this._balanceItems.bind(this));
    }
  }

  _moveTo(index) {
    const currIndex = this._states.indexOf(1);
    this._direction = index > currIndex ? 'next' : 'prev';
    for (let i = 0; i < Math.abs(index - currIndex); i++) {
      this._move();
    }
  }

  _autoplay(action) {
    if (!this._config.autoplay) {
      return;
    }
    if (action === 'stop') {
      clearInterval(this._intervalId);
      this._intervalId = null;
      return;
    }
    if (this._intervalId === null) {
      this._intervalId = setInterval(() => {
        this._direction = 'next';
        this._move();
      }, this._config.interval);
    }
  }

  _addIndicators() {
    const el = this._el.querySelector(`.${this.constructor.EL_INDICATORS}`);
    if (el || !this._config.indicators) {
      return;
    }
    let rows = '';
    for (let i = 0, {
        length
      } = this._elListItem; i < length; i++) {
      rows += `<li class="${this.constructor.EL_INDICATOR}" data-slide-to="${i}"></li>`;
    }
    const html = `<ol class="${this.constructor.EL_INDICATORS}">${rows}</ol>`;
    this._el.insertAdjacentHTML('beforeend', html);
  }

  _updateExProperties() {
    const els = Object.values(this._elListItem).map((el) => el);
    const orders = els.map((item) => Number(item.dataset.order));
    this._exOrderMin = Math.min(...orders);
    this._exOrderMax = Math.max(...orders);
    const min = orders.indexOf(this._exOrderMin);
    const max = orders.indexOf(this._exOrderMax);
    this._exItemMin = els[min];
    this._exItemMax = els[max];
    this._exTranslateMin = Number(this._exItemMin.dataset.translate);
    this._exTranslateMax = Number(this._exItemMax.dataset.translate);
  }

  _balanceItems() {
    if (!this._isBalancing) {
      return;
    }
    if (this._direction === 'next') {
      const exItemRight = this._exItemMin.getBoundingClientRect().right;
      if (exItemRight < this._clientRect.left - this._clientRect.width / 2) {
        this._exItemMin.dataset.order = `${this._exOrderMin + this._elListItem.length}`;
        this._exItemMin.dataset.translate = `${this._exTranslateMin + this._elListItem.length}`;
        const valueX = (this._exTranslateMin + this._elListItem.length) * this._clientRect.width;
        this._exItemMin.style.transform = `translate3D(${valueX}px, 0px, 0.1px)`;
        this._updateExProperties();
      }
    } else {
      const exItemLeft = this._exItemMax.getBoundingClientRect().left;
      if (exItemLeft > this._clientRect.right + this._clientRect.width / 2) {
        this._exItemMax.dataset.order = `${this._exOrderMax - this._elListItem.length}`;
        this._exItemMax.dataset.translate = `${this._exTranslateMax - this._elListItem.length}`;
        const valueX = (this._exTranslateMax - this._elListItem.length) * this._clientRect.width;
        this._exItemMax.style.transform = `translate3D(${valueX}px, 0px, 0.1px)`;
        this._updateExProperties();
      }
    }
    window.setTimeout(() => {
      window.requestAnimationFrame(this._balanceItems.bind(this));
    }, this._delay);
  }

  _addEventListener() {
    const onSwipeStart = (e) => {
      this._autoplay('stop');
      if (e.target.closest(`.${this.constructor.EL_CONTROL}`)) {
        return;
      }
      const event = e.type.search('touch') === 0 ? e.touches[0] : e;
      this._swipeStartPosX = event.clientX;
      this._swipeStartPosY = event.clientY;
      this._hasSwipeState = true;
      this._hasSwiping = false;
    };
    const onSwipeMove = (e) => {
      if (!this._hasSwipeState) {
        return;
      }
      const event = e.type.search('touch') === 0 ? e.touches[0] : e;
      let diffPosX = this._swipeStartPosX - event.clientX;
      const diffPosY = this._swipeStartPosY - event.clientY;
      if (!this._hasSwiping) {
        if (Math.abs(diffPosY) > Math.abs(diffPosX) || Math.abs(diffPosX) === 0) {
          this._hasSwipeState = false;
          return;
        }
        this._hasSwiping = true;
      }
      e.preventDefault();
      if (!this._config.loop) {
        const isNotMoveFirst = this._states[0] && diffPosX <= 0;
        const isNotMoveLast = this._states[this._states.length - 1] && diffPosX >= 0;
        if (isNotMoveFirst || isNotMoveLast) {
          diffPosX /= 4;
        }
      }
      this._elItems.classList.add(this.constructor.TRANSITION_NONE);
      const valueX = this._transform * this._clientRect.width - diffPosX;
      this._elItems.style.transform = `translate3D(${valueX}px, 0px, 0.1px)`;
    };
    const onSwipeEnd = (e) => {
      if (!this._hasSwipeState) {
        return;
      }
      const event = e.type.search('touch') === 0 ? e.changedTouches[0] : e;
      let diffPosX = this._swipeStartPosX - event.clientX;
      if (diffPosX === 0) {
        this._hasSwipeState = false;
        return;
      }
      if (!this._config.loop) {
        const isNotMoveFirst = this._states[0] && diffPosX <= 0;
        const isNotMoveLast = this._states[this._states.length - 1] && diffPosX >= 0;
        if (isNotMoveFirst || isNotMoveLast) {
          diffPosX = 0;
        }
      }
      const value = (diffPosX / this._clientRect.width) * 100;
      this._elItems.classList.remove(this.constructor.TRANSITION_NONE);
      if (value > this.constructor.SWIPE_THRESHOLD) {
        this._direction = 'next';
        this._move();
      } else if (value < -this.constructor.SWIPE_THRESHOLD) {
        this._direction = 'prev';
        this._move();
      } else {
        this._direction = 'none';
        this._move();
      }
      this._hasSwipeState = false;
      this._autoplay();
    };

    this._el.addEventListener('click', (e) => {
      const $target = e.target;
      this._autoplay('stop');
      if ($target.dataset.slideTo) {
        e.preventDefault();
        const index = parseInt($target.dataset.slideTo, 10);
        this._moveTo(index);
      }
      this._autoplay();
    });

    if (this._config.loop) {
      this._elItems.addEventListener('transitionend', () => {
        this._isBalancing = false;
      });
    }

    this._el.addEventListener('mouseenter', () => {
      this._autoplay('stop');
    });
    this._el.addEventListener('mouseleave', () => {
      this._autoplay();
    });

    if (this._config.swipe) {
      const options = this.constructor.checkSupportPassiveEvents() ? {
        passive: false
      } : false;
      this._el.addEventListener('touchstart', onSwipeStart, options);
      this._el.addEventListener('touchmove', onSwipeMove, options);
      this._el.addEventListener('mousedown', onSwipeStart);
      this._el.addEventListener('mousemove', onSwipeMove);
      document.addEventListener('touchend', onSwipeEnd);
      document.addEventListener('mouseup', onSwipeEnd);
      document.addEventListener('mouseout', onSwipeEnd);
    }
    this._el.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this._config.loop) {
        this._autoplay();
      } else {
        this._autoplay('stop');
      }
    });
    if (this._supportResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        const {
          contentRect
        } = entries[0];
        if (Math.round(this._clientRect.width * 10) === Math.round(contentRect.width * 10)) {
          return;
        }
        this._clientRect = contentRect;
        const newValueX = contentRect.width * Number(this._elItems.dataset.translate);
        this.reset(newValueX, true);
        this._autoplay();
      });
      resizeObserver.observe(this._elWrapper);
    }
  }

  reset(newValueX = 0, recalc = false) {
    this._autoplay('stop');
    this._elItems.classList.add(this.constructor.TRANSITION_NONE);
    this._elItems.style.transform = `translate3D(${newValueX}px, 0px, 0.1px)`;
    this._elListItem.forEach((el) => {
      const valueX = recalc ? Number(el.dataset.translate) * this._clientRect.width : 0;
      el.style.transform = `translate3D(${valueX}px, 0px, 0.1px)`;
    });
    if (!recalc) {
      this._transform = 0;
      this._states = [];
      this._elItems.dataset.translate = '0';
      this._elListItem = this._el.querySelectorAll(`.${this.constructor.EL_ITEM}`);

      this._elListItem.forEach((item, index) => {
        item.dataset.order = `${index}`;
        item.dataset.index = `${index}`;
        item.dataset.translate = '0';
        this._states.push(index === 0 ? 1 : 0);
      });

      if (this._config.loop) {
        const count = this._elListItem.length - 1;
        const translate = -this._elListItem.length;
        this._elListItem[count].dataset.order = '-1';
        this._elListItem[count].dataset.translate = `${-this._elListItem.length}`;
        const valueX = translate * this._clientRect.width;
        this._elListItem[count].style.transform = `translate3D(${valueX}px, 0px, 0.1px)`;
      }
      this._el.querySelector(`.${this.constructor.EL_INDICATORS}`).remove();

      this._addIndicators();
      this._elListIndicator = document.querySelectorAll(`.${this.constructor.EL_INDICATOR}`);

      this._updateExProperties();

      this._changeActiveItems();
    }
    this._autoplay();
  }


  next() {
    this._direction = 'next';
    this._move();
  }

  prev() {
    this._direction = 'prev';
    this._move();
  }

  autoplay() {
    this._autoplay('stop');
  }
  moveTo(index) {
    this._moveTo(index);
  }
}


let ilogo = 1;
for (let liLogo of carouselLogo.querySelectorAll('.img-item')) {
  liLogo.style.position = 'relative';
  liLogo.insertAdjacentHTML('beforeend', `<span style="position:absolute;left:0;top:0">${ilogo}</span>`);
  i++;
}

let testLogo = document.querySelector('.test-logo');
let widthLogo = testLogo.offsetWidth;
let countLogo = 1;

let listLogo = carouselLogo.querySelector('.ul-logo');
let listElemsLogo = carouselLogo.querySelectorAll('.img-item');

let positionLogo = 0;

carouselLogo.querySelector('.next-logo').onclick = function () {

  positionLogo -= widthLogo * countLogo;
  if (Math.abs(positionLogo) === listElemsLogo.length * widthLogo - (widthLogo * 4) && window.innerWidth > 1300) {
    positionLogo = 0;
  } else if (Math.abs(positionLogo) === listElemsLogo.length * widthLogo - (widthLogo * 3) && window.innerWidth <= 1300 && window.innerWidth > 1040) {
    positionLogo = 0;
  } else if (Math.abs(positionLogo) === listElemsLogo.length * widthLogo - (widthLogo * 2) && window.innerWidth <= 1040 && window.innerWidth > 800) {
    positionLogo = 0;
  } else if (Math.abs(positionLogo) === listElemsLogo.length * widthLogo - widthLogo && window.innerWidth <= 800 && window.innerWidth > 600) {
    positionLogo = 0;
  } else if (Math.abs(positionLogo) === listElemsLogo.length * widthLogo && window.innerWidth <= 600) {
    positionLogo = 0;
  }
  positionLogo = Math.max(positionLogo, -widthLogo * (listElemsLogo.length - countLogo));
  listLogo.style.marginLeft = positionLogo + 'px';
};

document.addEventListener('DOMContentLoaded', function(e){
  function autoNext(){
    document.querySelector('.next-logo').click();
    setTimeout(autoNext, 5000);
  }
  setTimeout(autoNext, 5000)
})
