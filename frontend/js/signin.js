const api = 'https://banktoday.herokuapp.com';
const form = document.querySelector('#signinForm');
const message = document.querySelector('.message');
const alert = document.querySelector('.alert');
const closeBtn = document.querySelector('#closebtn');
const buttonLoader = document.querySelector('.button-loader');
const postButton = document.querySelector('.login-button');

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
  alert.classList.add('hide');
};

const signIn = (e) => {
  e.preventDefault();
  postButton.classList.add('hide');
  buttonLoader.classList.add('loader');

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
      buttonLoader.classList.remove('loader');
      postButton.classList.remove('hide');
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
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('email', response.data.email);
          sessionStorage.setItem('id', response.data.id);
          sessionStorage.setItem('firstName', response.data.firstName);
          sessionStorage.setItem('lastName', response.data.lastName);
          localStorage.setItem('email', response.data.email);
          sessionStorage.setItem('type', response.data.type);
          localStorage.setItem('imageURL', response.data.imageURL);
          sessionStorage.setItem('admin', response.data.isAdmin);

          window.location.replace('./adminDashboard.html');
        } else if (response.data.type === 'staff') {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('email', response.data.email);
          sessionStorage.setItem('id', response.data.id);
          sessionStorage.setItem('firstName', response.data.firstName);
          sessionStorage.setItem('lastName', response.data.lastName);
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('type', response.data.type);
          sessionStorage.setItem('admin', response.data.isAdmin);
          localStorage.setItem('imageURL', response.data.imageURL);
          localStorage.setItem('email', response.data.email);

          window.location.replace('./staffDashboard.html');
        } else {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('email', response.data.email);
          sessionStorage.setItem('id', response.data.id);
          sessionStorage.setItem('firstName', response.data.firstName);
          localStorage.setItem('imageURL', response.data.imageURL);
          localStorage.setItem('email', response.data.email);
          const getUserDetails = () => {
            const userId = sessionStorage.getItem('id');
            const token = sessionStorage.getItem('token');
            fetch(`${api}/api/v1/user/${userId}`, {
              method: 'GET', // or 'PUT'
              mode: 'cors',
              cache: 'no-cache',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              redirect: 'follow',
            }).then(res => res.json())
              .then((resResult) => {
                if (resResult.status === 200) {
                  window.location.replace('./dashboard.html');
                }

                if (resResult.status === 403 || resResult.status === 500) {
                  window.location.replace('./signin.html');
                }

                if (resResult.error.search('has no accounts') !== -1) {
                  window.location.replace('./dashboard.html');
                }

                window.location.replace('./createAccount.html');
              })
              .catch(err => err);
          };
          getUserDetails();
        }
      }
    })
    .catch(error => error);
};

form.addEventListener('submit', validate);
closeBtn.addEventListener('click', errorAlert);
form.addEventListener('submit', signIn);
