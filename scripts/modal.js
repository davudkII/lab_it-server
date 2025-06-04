export function setupModalListeners() {
  // Закрытие по клику на оверлей
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
      closeModal(e.target);
    }
  });

  // Закрытие по крестику
  document.querySelectorAll('.popup__close').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.closest('.popup'));
    });
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openedPopup = document.querySelector('.popup_is-opened');
      if (openedPopup) closeModal(openedPopup);
    }
  });
}

export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscape);
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscape);
}

function handleEscape(e) {
  if (e.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) closeModal(openedPopup);
  }
}