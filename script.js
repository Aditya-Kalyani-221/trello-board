let lists = [];
let cards= [];
let addToList;
let moveItem;
let id = 1;
const modal = document.querySelector('.modal-list');
const modalCard = document.querySelector('.modal-card');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal-list');
const btnCloseCardModal = document.querySelector('.close-modal-card');
const btnsOpenModal = document.querySelector('.show-modal-list');
const createList = document.querySelector('#createList');
const createCard = document.querySelector('#createCard');
const listItems = document.querySelector('.list');

const openModal = function () { 
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const closeCardModal = function() {
	modalCard.classList.add('hidden');
	overlay.classList.add('hidden');
}

const addList = function() {
	lists.push(document.getElementById('lname').value);
	modal.classList.add('hidden');
  	overlay.classList.add('hidden');
  	setLocalStorage('list', lists);
  	createLists(document.getElementById('lname').value);
}

const insertCard = function() {
	let title = document.getElementById('title').value;
	let desc = document.getElementById('description').value;
	let createdTime = new Date().getTime();
	if(!title || !desc) {
		document.querySelector('.error-msg').classList.remove('hidden');
	}
	else {
		modalCard.classList.add('hidden');
		overlay.classList.add('hidden');
		let payload = {
			'title': title,
			'description': desc,
			'createdTime' : createdTime,
			'id' : id
		}
		addCardToList(addToList, payload);
		let ele = document.getElementById(addToList);
		showCard(title, desc, ele);
	}
}

const dragBegin = function(e) {
	moveItem = e.srcElement; 
} 

const dropItem = function(e) {
	let cardItem;
	 cards.forEach((listItem, key)=> {
	 	if(listItem.key === moveItem.parentElement.id) {
	 		cardItem = listItem.value.find((item)=> {
				return item.id === parseInt(moveItem.id);
			});
			listItem.value = listItem.value.filter( obj => obj.id !== parseInt(moveItem.id));
	 	}
	 })
	 addCardToList(e.currentTarget.id, cardItem);
	 e.currentTarget.appendChild(moveItem);
}

function renderBoard() {
	lists = getLocalStorageData('list');
	cards = getLocalStorageData('cards');
	if(!lists) {
		lists = [];
	}
	if(!cards) {
		cards = [];
	}
	lists.forEach((item, index)=> {
		createLists(item);
	});
}

function createLists(item) {
	let ele = document.createElement('div');
	ele.setAttribute('id', item);
	ele.setAttribute('class','list-item');
	ele.addEventListener('drop', dropItem);
	let title = document.createElement('div');
	title.setAttribute('class', 'list-name');
	let p = document.createElement('p');
	p.innerHTML = item;
	let deleteBtn = document.createElement('button');
	deleteBtn.setAttribute('class', 'delete-list');
	deleteBtn.textContent = 'X';
	deleteBtn.addEventListener('click', removeList);
	p.appendChild(deleteBtn);
	title.appendChild(p);
	ele.appendChild(title);

	displayCards(item, ele);

	let addCards = document.createElement('div');
	addCards.setAttribute('class', 'add-card-container');
	let addCardsBtn = document.createElement('button');
	addCardsBtn.setAttribute('class', 'add-card-btn');
	addCardsBtn.textContent = '+';
	addCardsBtn.addEventListener('click', addCard);

	addCards.appendChild(addCardsBtn);
	ele.appendChild(addCards);
	listItems.appendChild(ele);
}

function removeList() {
	lists.splice(lists.indexOf(this.parentElement.parentElement.parentElement.id),1);
	setLocalStorage('list', lists);
	document.getElementById(this.parentElement.parentElement.parentElement.id).remove();
}

function addCard() {
	addToList = this.parentElement.parentElement.id;
	modalCard.classList.remove('hidden');
  	overlay.classList.remove('hidden');
  	document.querySelector('.error-msg').classList.add('hidden');
}

function displayCards(listName, listEle) {
	let listCards = cards.find((item)=> {
		return item.key === listName;
	});
	if(listCards && listCards.value.length > 0) {
		for(let i=0; i < listCards.value.length; i++) {
			let title = listCards.value[i].title;
			let desc = listCards.value[i].description;
			showCard(title, desc, listEle);
		}
	}
}

function showCard(title, desc, listEle) {
	let ele = document.createElement('div');
	ele.setAttribute('class', 'card');
	ele.setAttribute('id', id++);
	ele.setAttribute('draggable', true);
	ele.addEventListener('dragstart', dragBegin);
	let cardTitle = document.createElement('div');
	cardTitle.setAttribute('class', 'title');
	cardTitle.innerHTML = title;
	let cardDesc = document.createElement('div');
	cardDesc.setAttribute('class', 'description');
	cardDesc.innerHTML = desc;
	ele.appendChild(cardTitle);
	ele.appendChild(cardDesc);
	listEle.appendChild(ele);
}

function addCardToList(listName, payload) {
	let listCards = cards.find((item)=> {
		return item.key === listName;
	});
	if(listCards) {
		for(let i=0; i < cards.length; i++) {
			if(cards[i].key === listName) {
				cards[i].value.push(payload);
			}
		}
	}
	else {
		let value = [];
		value.push(payload);
		let item = {
			'key': listName,
			'value': value
		}
		cards.push(item);
	}
	setLocalStorage('cards', cards);
}

function setLocalStorage(key, value) {
	window.localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorageData(key) {
	return JSON.parse(window.localStorage.getItem(key));
}

btnsOpenModal.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
btnCloseCardModal.addEventListener('click', closeCardModal);
overlay.addEventListener('click', closeModal);
createList.addEventListener('click', addList);
createCard.addEventListener('click', insertCard);

document.addEventListener('dragover', (e)=> {
	e.preventDefault();
})

renderBoard();