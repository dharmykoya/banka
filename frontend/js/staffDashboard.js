const token = sessionStorage.getItem('token');
const email = sessionStorage.getItem('email');
const userId = sessionStorage.getItem('id');
const firstName = sessionStorage.getItem('firstName');
const lastName = sessionStorage.getItem('lastName');
const staffRole = document.querySelector('#staff-role');
const staffName = document.querySelector('#staff-name');
const staffEmail = document.querySelector('#staff-email');
const staffId = document.querySelector('#staff-ID');
if (!token) {
  window.location.replace('./signin.html');
}
window.onload = () => {
  staffName.textContent = `${firstName} ${lastName}`;
  staffRole.textContent = 'STAFF';
  staffEmail.textContent = email;
  staffId.textContent = userId;
};

const logoutButton = document.querySelector('#logout');
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
};
logoutButton.addEventListener('click', logout);
