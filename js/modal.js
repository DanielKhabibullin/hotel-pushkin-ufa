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

