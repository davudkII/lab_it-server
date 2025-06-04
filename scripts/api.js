const config = {
  baseUrl: 'https://fine-nights-sleep.loca.lt',
   headers: {
    'Authorization': 'Bearer c56e30dc-2883-4270-a59e-b2f7bae969c6',
    'Content-Type': 'application/json',
  }
};

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

// Получение информации о пользователе
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/user1`, {
    headers: config.headers
  }).then(checkResponse);
};

// Получение карточек
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(checkResponse);
};

// Обновление информации о пользователе
export const updateUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/user1`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  }).then(checkResponse);
};

// Обновление аватара
export const updateAvatar = (avatarUrl) => {
  return fetch(`${config.baseUrl}/users/user1`, {  
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarUrl  
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`Ошибка HTTP: ${res.status}`);
    }
    return res.json();
  });
};

// Добавление новой карточки
export const addNewCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name,
      link,
      likes: [],
      owner: { id: "user1" }
    })
  }).then(checkResponse);
};

// Удаление карточки
export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
};


export const toggleLike = (cardId, isLiked, userId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      likes: isLiked 
        ? [] // Убираем лайк
        : [{ id: userId }] // Добавляем лайк
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });
};