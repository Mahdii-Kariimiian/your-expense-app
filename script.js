let storedHistory = JSON.parse(localStorage.getItem('history'));
const historyArray = storedHistory || [];
const transactionText = document.querySelector('.transaction-text');
const transactionMoney = document.querySelector('.transaction-money');
const transactionSubmit = document.querySelector('.transaction-submit');
const historyTitle = document.querySelector('.history-title');
const balanceMoney = document.querySelector('.balance-money');
const incomeMoney = document.querySelector('.income-money');
const expenceMoney = document.querySelector('.expence-money');
const historySec = document.querySelector('.history-sec');

let total = 0;
let income = 0;
let expence = 0;

// add transaction to history
function addToHistory(e) {
	e.preventDefault();
	const text = transactionText.value ? transactionText.value : null;
	const money = transactionMoney.value ? transactionMoney.value : null;
	createElement(text, money);
}

// create element
function createElement(text, money) {
	if (text && money) {
		// create Date of saving
		const time = new Date();
		console.log(time);
		const month = time.getMonth() + 1;
		const day = time.getDate();
		console.log(day);
		const year = time.getFullYear();
		const historyDate = `${day < 10 ? '0' + day : day}/${
			month < 10 ? '0' + month : month
		}/${year}`;
		//create Element
		const div = document.createElement('div');
		div.classList.add('history-detail');
		const h4 = document.createElement('h4');
		h4.classList.add('history-detail-title');
		h4.innerText = text;
		const dateElement = document.createElement('p');
		dateElement.classList.add('date');
		dateElement.innerText = historyDate;
		const p = document.createElement('p');
		p.classList.add('history-detail-money');
		p.innerText = `${money} $`;
		const button = document.createElement('button');
		button.classList.add('button');
		button.innerText = 'X';
		button.addEventListener('click', () => remove(button));
		const colorDiv = document.createElement('div');
		colorDiv.classList.add('history-detail-color');
		colorDiv.style.backgroundColor = money > 0 ? 'green' : 'red';
		div.appendChild(h4);
		div.appendChild(dateElement);
		div.appendChild(p);
		div.appendChild(button);
		div.appendChild(colorDiv);
		historySec.appendChild(div);
		// creating an array of transactions
		historyObj = {
			id: historyArray.length,
			text,
			money,
			date: historyDate,
		};
		button.setAttribute('data-id', historyObj.id); // custom attribute for buttons
		historyArray.push(historyObj);
		// save transactions to local storage
		localStorage.setItem('history', JSON.stringify(historyArray));
		// recalculating the numbers
		Balance();
		// clear input values
		transactionMoney.value = '';
		transactionText.value = '';
		transactionText.style.border = '1px solid grey';
		transactionMoney.style.border = '1px solid grey';
	} else {
		transactionText.style.border = '1px solid red';
		transactionMoney.style.border = '1px solid red';
	}
}

//render local storage on page load
function renderLocalStorage() {
	if (storedHistory) {
		storedHistory.forEach((item) => {
			const div = document.createElement('div');
			div.classList.add('history-detail');
			const h4 = document.createElement('h4');
			h4.classList.add('history-detail-title');
			h4.innerText = item.text;
			const dateElement = document.createElement('p');
			dateElement.classList.add('date');
			dateElement.innerText = item.date;
			const p = document.createElement('p');
			p.classList.add('history-detail-money');
			p.innerText = `${item.money} $`;
			const colorDiv = document.createElement('div');
			const button = document.createElement('button');
			button.classList.add('button');
			button.innerText = 'X';
			button.setAttribute('data-id', item.id); // custom attribute for buttons
			colorDiv.classList.add('history-detail-color');
			colorDiv.style.backgroundColor = item.money > 0 ? 'green' : 'red';
			div.appendChild(h4);
			div.appendChild(dateElement);
			div.appendChild(p);
			div.appendChild(button);
			div.appendChild(colorDiv);
			historySec.appendChild(div);

			const buttons = document.querySelectorAll('.button');
			buttons.forEach((button) => {
				button.addEventListener('click', () => remove(button));
			});
			Balance();
		});
	}
}

// remove transactions
function remove(button) {
	const idAtt = parseInt(button.getAttribute('data-id'));
	let updatedHistory = storedHistory.filter((item) => {
		return item.id !== idAtt;
	});
	localStorage.setItem('history', JSON.stringify(updatedHistory));
	button.parentElement.remove();
	storedHistory = JSON.parse(localStorage.getItem('history') || []);
	Balance();
}

// calculate Balance
function Balance() {
	if (storedHistory) {
		total = storedHistory.reduce((acc, history) => {
			return acc + Number(history.money);
		}, 0);
	} else {
		total = 0;
	}
	balanceMoney.innerText = `${total} $`;

	// income
	if (storedHistory) {
		let incomeArray = storedHistory.filter((history) => {
			return Number(history.money) > 0;
		});

		income = incomeArray.reduce((acc, income) => {
			return acc + Number(income.money);
		}, 0);
	}
	incomeMoney.innerText = `${income} $`;

	//expence
	if (storedHistory) {
		let expenceArray = storedHistory.filter((history) => {
			return Number(history.money) < 0;
		});

		expence = expenceArray.reduce((acc, expence) => {
			return acc + Number(expence.money);
		}, 0);
	}
	expenceMoney.innerText = `${expence} $`;
}

//Events
transactionSubmit.addEventListener('click', (e) => addToHistory(e));
window.addEventListener('DOMContentLoaded', renderLocalStorage);
