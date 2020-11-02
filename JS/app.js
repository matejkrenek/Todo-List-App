//************  USER AND TITLE NAME ************//
const loginSection = document.querySelector('.login-section')
const loginForm = document.querySelector('.setting-form')
const login = document.querySelector('#login')

const ageSection = document.querySelector('.age-section')
const ageForm = document.querySelector('.age-form')
const age = document.querySelector('#age')

loginForm.addEventListener('submit', pickUser)
window.addEventListener('DOMContentLoaded', setUpUser)

ageForm.addEventListener('submit', pickUser)



function pickUser(e) {
    e.preventDefault()

    const userName = login.value
    const userId = Date.now()
    const userAge = age.value

    if (userName.length > 4) {
        createUserItem(userName, userId, userAge)
        loginSection.style.transform = 'translateX(-100%)'
        if (userAge.length > 1) {
            addUserToTheStorage(userName, userId, userAge)
            ageSection.style.transform = 'translateX(100%)'

        }

    } else {
        loginForm.classList.add('valid')
    }

}

function addUserToTheStorage(username, id, age) {
    const userName = {
        username: username,
        id: id,
        age: age
    }

    let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : [];

    user.push(userName)

    localStorage.setItem('user', JSON.stringify(user))

}

function setUpUser() {
    let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    if (user.length) {
        createUserItem(user[0].username, user[0].id, user[0].age)
        loginSection.style.display = 'none'
        ageSection.style.display = 'none'
    }

}

function createUserItem(username, userid) {
    const navbar = document.querySelector('.navbar')
    const user = navbar.querySelector('.user')
    const userIdAttr = document.createAttribute('data-user-id');
    userIdAttr.value = userid
    user.setAttributeNode(userIdAttr)

    user.textContent = username

}

//************  NOT-HARD CODED DATE  ************//
const weekdays = ['Monday', 'Thuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const day = document.querySelector('.day')
const datum = document.querySelector('.datum')
const arrowLeft = document.querySelector('.arrow-left')
const arrowRight = document.querySelector('.arrow-right')

arrowLeft.addEventListener('click', previousDay)
arrowRight.addEventListener('click', previousDay)
arrowRight.classList.add('unactive')

let counter = 0
let today = new Date();
let yesterday = new Date(today);

let currentDay = weekdays[today.getDay() - 1];
let currnetMonth = (months[today.getMonth()]).slice(0, 3);
let currentDate = today.getDate();
let currentYear = today.getFullYear();

day.innerHTML = currentDay
datum.innerHTML = `${currnetMonth} ${currentDate}, ${currentYear}`

//*** functions ***//
function previousDay(e) {
    if (e.currentTarget === arrowLeft) {
        yesterday.setDate(yesterday.getDate() - 1);
        currentDay = weekdays[yesterday.getDay() - 1];
        currnetMonth = (months[yesterday.getMonth()]).slice(0, 3);
        currentDate = yesterday.getDate();
        currentYear = yesterday.getFullYear();
        if ((yesterday.getDay() - 1) === -1) {
            currentDay = weekdays[yesterday.getDay() + weekdays.length - 1];
        }
        day.innerHTML = currentDay
        datum.innerHTML = `${currnetMonth} ${currentDate}, ${currentYear}`
        counter--
        checkDate()
    } else if (e.currentTarget === arrowRight && counter < 0) {
        yesterday.setDate(yesterday.getDate() + 1)
        currentDay = weekdays[yesterday.getDay() - 1];
        currnetMonth = (months[yesterday.getMonth()]).slice(0, 3);
        currentDate = yesterday.getDate();
        currentYear = yesterday.getFullYear();

        if ((yesterday.getDay() - 1) === -1) {
            currentDay = weekdays[yesterday.getDay() + weekdays.length - 1];
        }
        day.innerHTML = currentDay
        datum.innerHTML = `${currnetMonth} ${currentDate}, ${currentYear}`
        counter++
        checkDate()

    };

    if (counter < 0) {
        arrowRight.classList.remove('unactive')
    } else {
        arrowRight.classList.add('unactive')
    }

}

const alert = document.querySelector('.alert');
const form = document.querySelector('.todo-form');
const todo = document.querySelector('#todo');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.todo-container');
const list = document.querySelector('.todo-list');
const clearBtn = document.querySelector('.clear-btn');
const user = document.querySelector('.user')



let editElement;
let editFlag = false;
let editId = '';

//********* EVENT LISTENERS *********//
//submit form
form.addEventListener('submit', addItem);

//clear items
clearBtn.addEventListener('click', clearItems);

//load items
window.addEventListener('DOMContentLoaded', setupItems);


//******** FUNCTIONS ********//
function addItem(e) {
    e.preventDefault()

    const value = todo.value;
    const id = new Date().getTime().toString()
    const createdDate = datum.innerHTML;
    const userId = user.dataset.userId

    if (value && !editFlag) {
        createListItem(id, value, createdDate, userId)

        displayAlert('Item added to the list', 'success')

        container.classList.add('show-container')

        addToLocalStorage(id, value, createdDate, userId)
        setBackToDefault()
    } else if (value && editFlag) {
        editElement.innerHTML = value
        displayAlert('Item edited', 'success')

        //edit item in local storage
        editLocalStorage(editId, value, createdDate, userId);
        setBackToDefault()
    } else {
        displayAlert('Please enter value', 'danger')
    }

}

//display a message
function displayAlert(message, state) {
    alert.classList.add('active')
    alert.classList.add(`${state}`)
    alert.textContent = message
    setTimeout(function () {
        alert.classList.remove('active')
        alert.classList.remove(`${state}`)
    }, 2000)
}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement

    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling

    //set form value
    todo.value = editElement.innerHTML
    editFlag = true;
    editId = element.dataset.id
    submitBtn.textContent = 'edit'
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id;
    list.removeChild(element)
    if (list.children.length === 0) {

    }
    displayAlert('Item deleted', 'danger')
    setBackToDefault()

    //remove from local storage
    removeFromLocalStorage(id)
}

function clearItems() {
    const items = document.querySelectorAll('.todo-item');

    items.forEach(function (item) {
        const id = item.dataset.id
        if (item.dataset.date === datum.innerHTML) {
            item = document.querySelector(`[data-date='${datum.innerHTML}']`)
            list.removeChild(item)
            removeFromLocalStorage(id)
        }

    })


    //container.classList.remove('show-container')
    displayAlert('Items deleted', 'danger')
    setBackToDefault()

}

//set back to default
function setBackToDefault() {
    todo.value = ''
    editFlag = false
    editId = '';
    submitBtn.textContent = 'submit'
}

//******** SET LOCAL STORAGE ********//
function addToLocalStorage(id, value, createdDate, userId) {
    const todo = {
        id: id,
        value: value,
        createdDate: createdDate,
        userId: userId
    }

    let items = getLocalStorage();

    items.push(todo)
    localStorage.setItem('list', JSON.stringify(items))
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });

    localStorage.setItem('list', JSON.stringify(items))
}

function editLocalStorage(id, value, createdDate) {
    let items = getLocalStorage();
    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value
            item.createdDate = createdDate
        }
        return item;
    })

    localStorage.setItem('list', JSON.stringify(items))

}

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

//******** SETUP ITEMS ********//
function setupItems() {
    let items = getLocalStorage();
    if (items.length) {
        items.forEach(function (item) {
            if (item.userId === user.dataset.userId) {
                createListItem(item.id, item.value, item.createdDate, item.userId)
            } else {
                return
            }
        })
        checkDate()
    }
    container.classList.add('show-container')
}

//create new item 
function createListItem(id, value, createdDate, userId) {
    const element = document.createElement('article');
    element.classList.add('todo-item');

    //add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr)

    const dateAttr = document.createAttribute('data-date')
    dateAttr.value = createdDate
    element.setAttributeNode(dateAttr)

    const userCreaterAttr = document.createAttribute('data-creater-id')
    userCreaterAttr.value = userId
    element.setAttributeNode(userCreaterAttr)

    console.log(element)


    element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn"><i class="fas fa-pencil-alt"></i></button>
        <button type="button" class="delete-btn"><i class="far fa-trash-alt"></i></button>
    </div>
    `
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');

    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem)

    list.appendChild(element)

}

function checkDate() {
    const articles = document.querySelectorAll('article')


    articles.forEach(function (article) {
        if (article.dataset.date !== datum.innerHTML) {
            article.style.display = 'none'

        } else if (article.dataset.date === datum.innerHTML) {
            article.style.display = 'flex'

        }

    })

}
//*************************************//
//************  FEATURES  ************//
//***********************************//


//** setting section **/
const settingLinks = document.querySelectorAll('.link');
const settingContents = document.querySelectorAll('.setting-content')

settingLinks.forEach((link) => link.addEventListener('click', toggleFocus))

function toggleFocus(e) {
    removeBorder()
    removeContent()

    e.currentTarget.classList.add('active')
    const settingContent = document.querySelector(`.setting-${e.currentTarget.id}-content`)
    settingContent.classList.add('active')
}

function removeBorder() {
    settingLinks.forEach((link) => link.classList.remove('active'))
}

function removeContent() {
    settingContents.forEach((link) => link.classList.remove('active'))

}

//open settings section
const settingBtn = document.querySelector('.settings')
const settingBox = document.querySelector('.settings-box')
const settingSection = document.querySelectorAll('.setting-section')
const settingContainer = document.querySelector('.settings-container')

settingBtn.addEventListener('click', () => {
    settingBox.classList.toggle('display')
})

settingSection.forEach((item) => item.addEventListener('click', openSection))

function openSection(e) {
    settingContainer.style.display = 'flex'
    setUserInformation()
    const link = document.querySelector(`#${this.id}.link`)
    const content = document.querySelector(`.setting-${this.id}-content`)

    removeBorder()
    removeContent()

    link.classList.add('active')
    content.classList.add('active')
}

window.addEventListener('click', function (e) {
    if (e.target === settingContainer) {
        settingContainer.style.display = 'none'
    }
})

//Change user info
const changeUserName = document.querySelector('#username');
const changeUserAge = document.querySelector('#userAge');
const submitChangeBtn = document.querySelector('.submit-save-info')
const idParagraph = document.querySelector('.id')

let currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : [];
const changeUserId = currentUser[0].id
idParagraph.innerHTML = `Your user ID is: <span id="id">${changeUserId}</span>`

function setUserInformation() {
    changeUserName.value = currentUser[0].username
    changeUserAge.value = currentUser[0].age
    submitChangeBtn.addEventListener('click', changeUserInfo)
}

function changeUserInfo() {
    currentUser = [{
        username: changeUserName.value,
        age: changeUserAge.value,
        id: changeUserId
    }]

    localStorage.setItem('user', JSON.stringify(currentUser))

}

//remove acc
const removeBtn = document.querySelector('.remove-acc')

removeBtn.addEventListener('click', function () {
    localStorage.removeItem('user')
})