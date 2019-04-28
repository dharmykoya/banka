const api = 'https://banktoday.herokuapp.com';
const form = document.querySelector('#createAccountForm');
const message = document.querySelector('.message');
const alert = document.querySelector('.alert');
const closeBtn = document.querySelector('#closebtn');
const welcomeName = document.querySelector('.welcome-name');
const name = sessionStorage.getItem('firstName');
const token = sessionStorage.getItem('token');

window.onload = () => {
  welcomeName.innerText = name.toUpperCase();
};

const validate = () => {
  const accountsType = ['savings', 'current'];
  const check = accountsType.includes(form.role.value);

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
      if (response.status === 403) {
        console.log(21, 'You must be logged in to create an account');
      } else if (response.status === 400) {
        console.log(22, 'Something went wrong');
      } else if (response.status === 422) {
        console.log(22, 'Please select an appropriate account type');
      } else if (response.status === 201) {
        setInterval(() => {
          window.location.replace('./dashboard.html');
        }, 1000);
      }
    })
    .catch(error => console.error('Error:', error));
};

form.addEventListener('submit', validate);
closeBtn.addEventListener('click', errorAlert);
form.addEventListener('click', createAccount);
