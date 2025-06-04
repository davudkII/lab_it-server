export function createCard({ data, handleLikeClick, handleDeleteClick, openImagePopup }) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  const likeCounter = document.createElement('span');
  likeCounter.classList.add('card__like-counter');
  likeCounter.textContent = data.likes.length;
  likeButton.after(likeCounter);

  // Проверка, лайкнута ли карточка текущим пользователем
  const isLiked = data.likes.some(user => user.id === "user1");
  if (isLiked) likeButton.classList.add('card__like-button_is-active');

  likeButton.addEventListener('click', handleLikeClick);
  deleteButton.addEventListener('click', handleDeleteClick);

  cardImage.addEventListener('click', () => openImagePopup(data.link, data.name));

  return cardElement;
}

export function renderCard(cardData, currentUserId, handleDeleteCard, handleLikeCard, openImagePopup) {
  const cardElement = createCard({
    data: cardData,
    handleLikeClick: () => handleLikeCard(cardData, cardElement),
    handleDeleteClick: () => handleDeleteCard(cardData.id, cardElement),
    openImagePopup
  });

  const deleteButton = cardElement.querySelector('.card__delete-button');
  if (cardData.owner.id !== currentUserId) {
    deleteButton.remove();
  }

  return cardElement;
}