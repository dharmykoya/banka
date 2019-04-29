const transactionBox = document.querySelector('.account-transaction-container');
const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const check = document.querySelector('#check_form');
const form = document.querySelector('#confirm_form');
const fEmail = document.querySelector('#email-found');
const fName = document.querySelector('#name-found');
const foundAccountNo = document.querySelector('#account-no-found');
const fAccountBalance = document.querySelector('#account-balance-found');
const foundType = document.querySelector('#account-type-found');
const foundStatus = document.querySelector('#account-status-found');
const error = document.querySelector('#error');
const errorContainer = document.querySelector('#no-account-found');


window.onload = () => {
  transactionBox.style.display = 'none';
};


const getAccountDetail = (e) => {
  e.preventDefault();

  const accountNumber = document.querySelector('#account-no').value;
  fetch(`${api}/api/v1/accounts/${accountNumber}`, {
    method: 'GET', // or 'PUT'
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
  }).then(res => res.json())
    .then(async (response) => {
      if (response.status === 403) {
        window.location.replace('./signin.html');
      }
      if (response.status === 422) {
        errorContainer.classList.remove('hide');
        const errorsFound = response.error;
        while (error.firstChild) {
          error.removeChild(error.firstChild);
        }
        errorsFound.map((err) => {
          const item = document.createElement('li');
          item.style.listStyle = 'none';
          const newContent = document.createTextNode(`${err}`);
          item.appendChild(newContent);
          error.appendChild(item);
          return true;
        });
      }
      if (response.status === 400) {
        errorContainer.classList.remove('hide');
        const errorFound = response.error;
        while (error.firstChild) {
          error.removeChild(error.firstChild);
        }
        const item = document.createElement('li');
        item.style.listStyle = 'none';
        const newContent = document.createTextNode(`${errorFound}`);
        item.appendChild(newContent);
        error.appendChild(item);
      }
      if (response.status === 200) {
        errorContainer.classList.add('hide');
        transactionBox.style.display = 'grid';
        fName.textContent = `${response.data.fName} ${response.data.lName}`;
        fEmail.textContent = response.data.email;
        foundAccountNo.textContent = response.data.account_number;
        fAccountBalance.textContent = response.data.balance;
        foundType.textContent = response.data.type;
        foundStatus.textContent = response.data.status;
      }
    })
    .catch(err => err);
};

const makeTransaction = (e) => {
  e.preventDefault();
  const accountNumber = document.querySelector('#account-number').value;
  const amount = document.querySelector('#amount-pay').value;
  const option = document.querySelector('#transaction-type');
  const transactionType = option.options[option.selectedIndex].value;
  const data = { amount };
  fetch(`${api}/api/v1/transactions/${accountNumber}/${transactionType}`, {
    method: 'POST', // or 'PUT'
    mode: 'cors',
    cache: 'no-cache',
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
  }).then(res => res.json())
    .then((response) => {
      if (response.status === 403) {
        window.location.replace('./signin.html');
      }
      if (response.status === 400) {
        const tBox = document.querySelector('#t-container');
        tBox.classList.add('hide');
        tBox.style.display = 'none !important';
        errorContainer.classList.remove('hide');
        const errorFound = response.error;
        while (error.firstChild) {
          error.removeChild(error.firstChild);
        }
        const item = document.createElement('li');
        item.style.listStyle = 'none';
        const newContent = document.createTextNode(`${errorFound}`);
        item.appendChild(newContent);
        error.appendChild(item);
      }
      if (response.status === 404) {
        errorContainer.classList.remove('hide');
        transactionBox.style.display = 'none';
        while (error.firstChild) {
          error.removeChild(error.firstChild);
        }
        const item = document.createElement('li');
        item.style.listStyle = 'none';
        const newContent = document
          .createTextNode('Please select a transaction type');
        item.appendChild(newContent);
        error.appendChild(item);
      }
      if (response.status === 422) {
        errorContainer.classList.remove('hide');
        transactionBox.style.display = 'none';
        const errorsFound = response.error;
        while (error.firstChild) {
          error.removeChild(error.firstChild);
        }
        errorsFound.map((err) => {
          const item = document.createElement('li');
          item.style.listStyle = 'none';
          const newContent = document.createTextNode(`${err}`);
          item.appendChild(newContent);
          error.appendChild(item);
          return true;
        });
      }
      if (response.status === 201) {
        errorContainer.classList.remove('hide');
        errorContainer.style.backgroundColor = '#66bb6a';
        transactionBox.style.display = 'none';
        const item = document.createElement('li');
        item.style.listStyle = 'none';
        const newContent = document.createTextNode('Transaction successful');
        item.appendChild(newContent);
        error.appendChild(item);
      }
    })
    .catch(err => err);
};
check.addEventListener('submit', getAccountDetail);
form.addEventListener('submit', makeTransaction);
