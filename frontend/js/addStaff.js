const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const createStaffForm = document.querySelector('#createStaff');
const message = document.querySelector('.message');
const alert = document.querySelector('.alert');
const closeBtn = document.querySelector('#closebtn');
const createStaffBtn = document.querySelector('#createStaff-button');
const buttonLoader = document.querySelector('.button-loader');

const validate = () => {
  if (createStaffForm.firstName.value === '') {
    message.innerText = 'Please provide your First Name!';
    alert.style.display = 'block';
    createStaffForm.email.focus();
    return false;
  }
  if (createStaffForm.lastName.value === '') {
    message.innerText = 'Please provide your Last Name!';
    alert.style.display = 'block';
    createStaffForm.password.focus();
    return false;
  }
  if (createStaffForm.email.value === '') {
    message.innerText = 'Please provide your email!';
    alert.style.display = 'block';
    createStaffForm.password.focus();
    return false;
  }
  if (createStaffForm.password.value === '') {
    message.innerText = 'Please provide your password!';
    alert.style.display = 'block';
    createStaffForm.password.focus();
    return false;
  }
  if (createStaffForm.password.value !== createStaffForm.password2.value) {
    message.innerText = 'passwords do not match';
    alert.style.display = 'block';
    createStaffForm.password.focus();
    return false;
  }
};

const errorAlert = () => {
  const span = document.querySelector('.closebtn');
  span.parentElement.style.display = 'none';
};
// function to create staff/admin
const createStaff = (e) => {
  let errors;
  e.preventDefault();
  createStaffBtn.classList.add('hide');
  buttonLoader.classList.add('loader');

  const firstName = document.querySelector('#firstName').value;
  const lastName = document.querySelector('#lastName').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirm_password').value;
  const data = {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  };
  fetch(`${api}/api/v1/auth/addStaff`, {
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
      createStaffBtn.classList.remove('hide');
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
      } else if (response.status === 409) {
        alert.classList.remove('hide');
        const item = document.createElement('li');
        const newContent = document.createTextNode(response.error);
        item.appendChild(newContent);
        while (message.firstChild) {
          message.removeChild(message.firstChild);
        }
        message.appendChild(item);
      } else if (response.status === 201) {
        window.location.replace('./listUsers.html');
      }
    })
    .catch(error => error);
};
createStaffForm.addEventListener('submit', validate);
closeBtn.addEventListener('click', errorAlert);
createStaffForm.addEventListener('submit', createStaff);
