const api = 'https://banktoday.herokuapp.com';
const form = document.querySelector('#createAccountForm');
const message = document.querySelector('.message');
const alert = document.querySelector('.alert');
const closeBtn = document.querySelector('#closebtn');
const welcomeName = document.querySelector('.welcome-name');
const name = sessionStorage.getItem('firstName');
const token = sessionStorage.getItem('token');
const buttonLoader = document.querySelector('.button-loader');
const postButton = document.querySelector('#create-button');

if (!token) {
  window.location.replace('./signin.html');
}

window.onload = () => {
  welcomeName.innerText = name.toUpperCase();
};

const validate = () => {
  if (form.role.value === 'Account type') {
    message.innerText = 'Please select an account type';
    alert.style.display = 'block';
    return false;
  }
};

const errorAlert = () => {
  const span = document.querySelector('.closebtn');
  span.parentElement.style.display = 'none';
};


// function to create an account for a user
const createAccount = (e) => {
  e.preventDefault();
  postButton.classList.add('hide');
  buttonLoader.classList.add('loader');


  const option = document.querySelector('#accountType');
  const type = option.options[option.selectedIndex].value;

  const data = { type };
  fetch(`${api}/api/v1/accounts`, {
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
      buttonLoader.classList.remove('loader');
      postButton.classList.remove('hide');
      let errors;
      if (response.status === 403 || response.status === 500) {
        window.location.replace('./signin.html');
      }
      if (response.status === 400) {
        window.location.replace('./signin.html');
      }
      if (response.status === 422) {
        alert.classList.remove('hide');
        errors = response.error;
        while (message.firstChild) {
          message.removeChild(message.firstChild);
        }
        errors.map((error) => {
          const item = document.createElement('li');
          const newContent = document.createTextNode(`${error}`);
          item.appendChild(newContent);
          message.appendChild(item);
          return true;
        });
      }
      if (response.status === 201) {
        window.location.replace('./dashboard.html');
      }
    })
    .catch(error => error);
};

form.addEventListener('submit', validate);
closeBtn.addEventListener('click', errorAlert);
form.addEventListener('click', createAccount);

const logoutButton = document.querySelector('#logout');
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
};
logoutButton.addEventListener('click', logout);