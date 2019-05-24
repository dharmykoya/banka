const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const email = sessionStorage.getItem('email');
const userId = sessionStorage.getItem('id');
const firstName = sessionStorage.getItem('firstName');
const lastName = sessionStorage.getItem('lastName');
const imageURL = localStorage.getItem('imageURL');

const adminName = document.querySelector('#admin-name');
const adminEmail = document.querySelector('#admin-email');
const adminId = document.querySelector('#admin-Id');
const profilePic = document.querySelector('#profilePic');
const profileImageForm = document.getElementById('profileImageForm');
const buttonLoader = document.querySelector('.button-loader');
const uploadBtn = document.querySelector('#imageConfirm');

const changePasswordBtn = document.querySelector('#password-confirm');
const alert = document.querySelector('.alert');
const successMessage = document.querySelector('.successMessage');
const message = document.querySelector('.message');
const message2 = document.querySelector('.message2');
const staffMessage = document.querySelector('.staffMessage');
const closeBtn = document.querySelector('.closebtn');
const closeBtn2 = document.querySelector('.closebtn2');
const changePasswordForm = document.getElementById('changePasswordForm');
const buttonLoader2 = document.querySelector('.button-loader2');

// Get the modal
const modal = document.getElementById('myModal');
const modal2 = document.getElementById('myModal2');

// Get the button that opens the modal
const btn = document.getElementById('upload-picture');
const btn2 = document.getElementById('change-password');

// Get the button that closes the modal
const closeImage = document.querySelector('#close-image');
const closePassword = document.querySelector('#close-password');

// function that closes the modal
const closeModal = () => {
  modal.style.display = 'none';
  modal2.style.display = 'none';
};

// Get the <span> element that closes the modal
const spansNode = document.querySelectorAll('.close');
const spans = [...spansNode];
spans.map((span) => {
  span.onclick = () => {
    modal.style.display = 'none';
    modal2.style.display = 'none';
  };
  return true;
});


// When the user clicks on the button, open the modal
const openStatusModal = () => {
  modal.style.display = 'block';
};
const openDeleteModal = () => {
  modal2.style.display = 'block';
};


btn.addEventListener('click', openStatusModal);
btn2.addEventListener('click', openDeleteModal);
closeImage.addEventListener('click', closeModal);
closePassword.addEventListener('click', closeModal);


// close the alert message
const errorAlert = () => {
  alert.classList.add('hide');
  successMessage.classList.add('hide');
  staffMessage.classList.add('hide');
};

// Show Message
const showMessage2 = (errors) => {
  if (Array.isArray(errors)) {
    alert.classList.remove('hide');
    message2.classList.remove('hide');
    alert.style.backgroundColor = '#f44336';
    while (message2.firstChild) {
      message2.removeChild(message2.firstChild);
    }
    return errors.map((error) => {
      const item = document.createElement('li');
      const newContent = document.createTextNode(`${error}`);
      item.appendChild(newContent);
      message2.appendChild(item);
      return true;
    });
  }
  alert.classList.remove('hide');
  message2.classList.remove('hide');
  alert.style.backgroundColor = '#f44336';
  while (message2.firstChild) {
    message2.removeChild(message2.firstChild);
  }
  const item = document.createElement('li');
  const newContent = document.createTextNode(`${errors}`);
  item.appendChild(newContent);
  message2.appendChild(item);
};


if (!token) {
  window.location.replace('./signin.html');
}
window.onload = () => {
  adminName.textContent = `${firstName} ${lastName}`;
  adminEmail.textContent = email;
  adminId.textContent = userId;
  profilePic.src = imageURL;
};
const logoutButton = document.querySelector('#logout');
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
};


const uploadPic = (e) => {
  e.preventDefault();
  uploadBtn.classList.add('hide');
  buttonLoader.classList.add('loader');
  const profileImage = document.querySelector('#profileImage').files[0];

  const data = new FormData();
  data.append('profileImage', profileImage);

  fetch(`${api}/api/v1/user/upload`, {
    method: 'PATCH', // or 'PUT'
    mode: 'cors',
    cache: 'no-cache',
    body: data,
    headers: {
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    redirect: 'follow',
  }).then(res => res.json())
    .then((response) => {
      buttonLoader.classList.remove('loader');
      uploadBtn.classList.remove('hide');
      if (response.status === 403) {
        window.location.replace('./signin.html');
      }
      if (response.status === 200) {
        profilePic.src = response.data.imageURL;
        localStorage.setItem('imageURL', response.data.imageURL);
        closeModal();
      }
    })
    .catch(err => err);
};

const changePassword = (e) => {
  e.preventDefault();
  changePasswordBtn.classList.add('hide');
  buttonLoader2.classList.add('loader');

  const oldPassword = document.querySelector('#oldPassword').value;
  const password = document.querySelector('#newPassword').value;
  const confirmPassword = document.querySelector('#confirmPassword').value;
  const data = {
    oldPassword,
    password,
    confirmPassword
  };

  fetch(`${api}/api/v1/auth/password`, {
    method: 'PATCH', // or 'PUT'
    mode: 'cors',
    cache: 'no-cache',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
  }).then(res => res.json())
    .then((response) => {
      buttonLoader2.classList.remove('loader');
      changePasswordBtn.classList.remove('hide');
      if (response.status === 403) {
        window.location.replace('./signin.html');
      }

      if (response.status === 422 || response.status === 400) {
        showMessage2(response.error);
      }

      if (response.status === 200) { 
        changePasswordForm.reset();
        closeModal();
        successMessage.classList.remove('hide');
        while (message.firstChild) {
          message.removeChild(message.firstChild);
        }
        const item = document.createElement('li');
        const newContent = document.createTextNode(`${response.data}`);
        item.appendChild(newContent);
        message.appendChild(item);
        showMessage2(response.data);
      }
    })
    .catch(err => err);
};

closeBtn.addEventListener('click', errorAlert);
closeBtn2.addEventListener('click', errorAlert);
changePasswordForm.addEventListener('submit', changePassword);
profileImageForm.addEventListener('submit', uploadPic);
logoutButton.addEventListener('click', logout);
