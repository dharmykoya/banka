const api = 'https://banktoday.herokuapp.com';
const form = document.querySelector('#signinForm');
const message = document.querySelector('.message');
const alert = document.querySelector('.alert');
const closeBtn = document.querySelector('#closebtn');
const validate = () => {
  if (form.email.value === '') {
    message.innerText = 'Please provide your email!';
    alert.style.display = 'block';
    form.email.focus();
    return false;
  }
  if (form.password.value === '') {
    message.innerText = 'Please provide your password!';
    alert.style.display = 'block';
    form.password.focus();
    return false;
  }
};

const errorAlert = () => {
  const span = document.querySelector('.closebtn');
  span.parentElement.style.display = 'none';
};

const signIn = (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  let errors;
  const data = { email, password };
  fetch(`${api}/api/v1/auth/signin`, {
    method: 'POST', // or 'PUT'
    mode: 'cors',
    cache: 'no-cache',
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
  }).then(res => res.json())
    .then((response) => {
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
      } else if (response.status === 400) {
        alert.classList.remove('hide');
        const item = document.createElement('li');
        const newContent = document.createTextNode(response.error);
        item.appendChild(newContent);
        while (message.firstChild) {
          message.removeChild(message.firstChild);
        }
        message.appendChild(item);
      } else if (response.status === 200) {
        if (response.data.isAdmin) {
          setInterval(() => {
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('email', response.data.email);
            sessionStorage.setItem('id', response.data.id);
            sessionStorage.setItem('firstName', response.data.firstName);
            localStorage.setItem('email', response.data.email);

            window.location.replace('./adminDashboard.html');
          }, 1000);
        } else if (response.data.type === 'staff') {
          setInterval(() => {
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('email', response.data.email);
            sessionStorage.setItem('id', response.data.id);
            sessionStorage.setItem('firstName', response.data.firstName);
            sessionStorage.setItem('token', response.data.token);
            localStorage.setItem('email', response.data.email);
            window.location.replace('./staffDashboard.html');
          }, 1000);
        } else {
          setInterval(() => {
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('email', response.data.email);
            sessionStorage.setItem('id', response.data.id);
            sessionStorage.setItem('firstName', response.data.firstName);
            localStorage.setItem('email', response.data.email);
            window.location.replace('./dashboard.html');
          }, 1000);
        }
      }
    })
    .catch(error => error);
};

form.addEventListener('submit', validate);
closeBtn.addEventListener('click', errorAlert);
form.addEventListener('submit', signIn);
