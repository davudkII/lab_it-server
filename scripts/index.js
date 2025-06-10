import { 
  getUserInfo, 
  getInitialCards, 
  updateUserInfo, 
  updateAvatar, 
  addNewCard, 
  deleteCard,
  toggleLike,   
} from './api.js';
import { openModal, closeModal, setupModalListeners } from './modal.js';
import './validate.js';

const popups = {
  edit: document.querySelector('.popup_type_edit'),
  add: document.querySelector('.popup_type_new-card'),
  avatar: document.querySelector('.popup_type_avatar'),
  image: document.querySelector('.popup_type_image')
};

function initPopups() {
  // Открытие попапа редактирования профиля
  document.querySelector('.profile__edit-button').addEventListener('click', () => {
    const nameInput = popups.edit.querySelector('.popup__input_type_name');
    const aboutInput = popups.edit.querySelector('.popup__input_type_description');
    
    nameInput.value = profileName.textContent;
    aboutInput.value = profileDescription.textContent;
    
    openModal(popups.edit);
  });

  // Открытие попапа добавления карточки
  document.querySelector('.profile__add-button').addEventListener('click', () => {
    openModal(popups.add);
  });

  // Открытие попапа аватара
  document.querySelector('.profile__avatar-edit-button').addEventListener('click', () => {
    openModal(popups.avatar);
  });
  document.querySelector('.edit-form').addEventListener('submit', handleProfileFormSubmit);
  document.querySelector('.add-form').addEventListener('submit', handleCardFormSubmit);
  document.querySelector('.avatar-form').addEventListener('submit', handleAvatarFormSubmit);
}

// DOM элементы
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const cardsContainer = document.querySelector('.places__list');

// Инициализация приложения
async function initApp() {
  try {
    setupModalListeners();
    initPopups();
    const userData = await getUserInfo();
    
    
    if (!userData || !userData.id) {
      throw new Error('Неверные данные пользователя');
    }
    
    renderUserInfo(userData);
    
    const cards = await getInitialCards();
    if (cards && Array.isArray(cards)) {
      renderCards(cards, userData.id);
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
}

// Рендер информации о пользователе
function renderUserInfo(userData) {
  if (!userData) return;
  
  if (profileName) profileName.textContent = userData.name || '';
  if (profileDescription) profileDescription.textContent = userData.about || '';
  if (profileAvatar && userData.avatar) {
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
  }
}

async function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  
  const submitButton = evt.target.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  try {
    const avatarInput = evt.target.querySelector('.popup__input_type_url');
    const avatarUrl = avatarInput.value.trim();
    
    if (!avatarUrl) {
      throw new Error('Введите ссылку на аватар');
    }

    const userData = await updateAvatar(avatarUrl);
    
    // Проверяем, что сервер вернул обновленные данные
    if (!userData || !userData.avatar) {
      throw new Error('Сервер не вернул обновленный аватар');
    }
    
    // Обновляем аватарку
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    evt.target.reset();
    closeModal(popups.avatar);
    
  } catch (error) {
    console.error('Ошибка при обновлении аватара:', error);
    alert(error.message || 'Не удалось обновить аватар');
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

// Рендер карточек
function renderCards(cards, currentUserId) {
  if (!cardsContainer) {
    console.error('Контейнер карточек не найден');
    return;
  }
  
  cardsContainer.innerHTML = '';
  
  // Защита от undefined и не массивов
  if (!Array.isArray(cards)) {
    console.warn('Карточки не являются массивом:', cards);
    cards = []; // Устанавливаем пустой массив по умолчанию
  }
  
  cards.forEach(card => {
    try {
      // Добавляем проверку и нормализацию данных карточки
      const safeCard = {
        ...card,
        likes: Array.isArray(card?.likes) ? card.likes : [],
        owner: card?.owner || { id: currentUserId }
      };
      
      const cardElement = createCard(safeCard, currentUserId);
      if (cardElement) {
        cardsContainer.appendChild(cardElement);
      }
    } catch (error) {
      console.error('Ошибка при создании карточки:', error, card);
    }
  });
}

// Создание карточки
function createCard(cardData, currentUserId) {
  // Защита от undefined и инициализация значений по умолчанию
  cardData = cardData || {};
  cardData.likes = Array.isArray(cardData.likes) ? cardData.likes : [];
  cardData.owner = cardData.owner || { id: currentUserId };
  cardData.name = cardData.name || 'Без названия';
  cardData.link = cardData.link || '';
  cardData.id = cardData.id || Date.now(); // Временный ID, если не указан

  const template = document.getElementById('card-template');
  if (!template) {
    console.error('Шаблон карточки не найден');
    return null;
  }

  const cardElement = template.content.cloneNode(true).querySelector('.places__item');
  if (!cardElement) {
    console.error('Не удалось создать элемент карточки');
    return null;
  }

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  // Заполнение данных
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length; // Теперь likes всегда массив

  // Проверка лайков с защитой
  const isLiked = cardData.likes.some(user => user && user.id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Проверка владельца с защитой
  if (cardData.owner.id !== currentUserId) {
    deleteButton.style.display = 'none';
  }

  // Проверка владельца
  if (cardData.owner.id !== currentUserId) {
    deleteButton.style.display = 'none';
  }

  // Обработчики событий
  likeButton.addEventListener('click', () => handleLikeClick(cardData, likeButton, likeCounter));
  deleteButton.addEventListener('click', () => handleDeleteClick(cardData.id, cardElement));
  cardImage.addEventListener('click', () => openImagePopup(cardData.link, cardData.name));

  return cardElement;
}

// Обработчики событий
async function handleLikeClick(cardData, likeButton, likeCounter) {
  try {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const userId = "user1"; // ID текущего пользователя
    
    const updatedCard = await toggleLike(cardData.id, isLiked, userId);
    
    // Обновляем отображение
    likeCounter.textContent = updatedCard.likes.length;
    likeButton.classList.toggle('card__like-button_is-active');
    
  } catch (error) {
    console.error('Ошибка при обновлении лайка:', error);
  }
}

async function handleDeleteClick(cardId, cardElement) {
  try {
    await deleteCard(cardId);
    cardElement.remove();
  } catch (error) {
    console.error('Ошибка при удалении карточки:', error);
  }
}

function openImagePopup(link, name) {
  const popupImage = popups.image.querySelector('.popup__image');
  const popupCaption = popups.image.querySelector('.popup__caption');
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModal(popups.image);
}}

// Обработчики форм
async function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  
  const submitButton = evt.target.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  try {
    const name = evt.target.querySelector('.popup__input_type_name').value;
    const about = evt.target.querySelector('.popup__input_type_description').value;
    
    const userData = await updateUserInfo(name, about);
    renderUserInfo(userData);
    closeModal(popups.edit);
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    alert('Не удалось обновить профиль');
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

async function handleCardFormSubmit(evt) {
  evt.preventDefault();
  
  const submitButton = evt.target.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Создание...';
  submitButton.disabled = true;

  try {
    const name = evt.target.querySelector('.popup__input_type_card-name').value;
    const link = evt.target.querySelector('.popup__input_type_url').value;
    
    const newCard = await addNewCard(name, link);
    const userData = await getUserInfo();
    const cardElement = createCard(newCard, userData.id);
    
    cardsContainer.prepend(cardElement);
    evt.target.reset();
    closeModal(popups.add);
  } catch (error) {
    console.error('Ошибка при добавлении карточки:', error);
    alert('Не удалось добавить карточку');
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}




// Инициализация
document.addEventListener('DOMContentLoaded', initApp);
