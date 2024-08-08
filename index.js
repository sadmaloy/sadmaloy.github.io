const add = document.querySelector('.add')
const clear = document.querySelector('.clear')

const storage = JSON.parse(localStorage.getItem('users')) || {}

/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete')
    const changeBtn = userCard.querySelector('.change')

    const userEmail = deleteBtn.dataset.deleteUserEmail

    deleteBtn.addEventListener('click', () => {
        console.log(
            `%c Удаление пользователя ${userEmail} `,
            'background: red; color: white',
        )
        delete storage[userEmail]
        localStorage.setItem('users', JSON.stringify(storage))
        userCard.remove()
    })

    changeBtn.addEventListener('click', () => {
        console.log(
            `%c Изменение пользователя ${userEmail} `,
            'background: green; color: white',
        )
        const inputs = document.querySelectorAll('input')
        const {
            name, secondName, dateOfBirth, email,
        } = storage[userEmail]
        inputs[0].value = name;
        inputs[1].value = secondName;
        inputs[2].value = dateOfBirth;
        inputs[3].value = email;
    })
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.dateOfBirth - дата рождения пользователя
 * @param {string} data.email - email пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({
    name, secondName, dateOfBirth, email,
}) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p>${dateOfBirth}</p>
                <p class="email">${email}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users')

    if (!storage) {
        console.log('localStorage пустой')
        return
    }

    users.innerHTML = ''

    Object.keys(storage).forEach((email) => {
        const userData = storage[email]
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(userData)
        users.append(userCard)
        setListeners(userCard)
    })
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault()
    const newName = document.querySelector('#name')
    const newSecondName = document.querySelector('#secondName')
    const newDateOfBirth = document.querySelector('#dateOfBirth')
    const newEmail = document.querySelector('#email')

    const users = document.querySelector('.users')

    if (!newEmail.value
        || !newName.value
        || !newSecondName.value
        || !newDateOfBirth.value
    ) {
        resetInputs(newName, newSecondName, newDateOfBirth, newEmail)
        return
    }
    const email = newEmail.value
    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        dateOfBirth: newDateOfBirth.value,
        email: newEmail.value,
    }

    if (storage[email]) {
        storage[email].name = newName.value
        storage[email].secondName = newSecondName.value
        storage[email].dateOfBirth = newDateOfBirth.value
        localStorage.setItem('users', JSON.stringify(storage))
        const userCard = document.querySelector(`[data-email='${email}']`)
        userCard.querySelector('.user-info p:nth-child(1)').textContent = newName.value
        userCard.querySelector('.user-info p:nth-child(2)').textContent = newSecondName.value
        userCard.querySelector('.user-info p:nth-child(3)').textContent = newDateOfBirth.value
    } else {
        storage[email] = data
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(data)
        users.append(userCard)
        setListeners(userCard)
        localStorage.setItem('users', JSON.stringify(storage))
    }

    resetInputs(newName, newSecondName, newDateOfBirth, newEmail)
    console.log(storage)
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
}

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
})
