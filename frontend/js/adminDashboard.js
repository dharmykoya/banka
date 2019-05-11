const token = sessionStorage.getItem('token');
const email = sessionStorage.getItem('email');
const userId = sessionStorage.getItem('id');
const firstName = sessionStorage.getItem('firstName');
const lastName = sessionStorage.getItem('lastName');
const adminName = document.querySelector('#admin-name');
const adminEmail = document.querySelector('#admin-email');
const adminId = document.querySelector('#admin-Id');
if (!token) {
  window.location.replace('./signin.html');
}
window.onload = () => {
  adminName.textContent = `${firstName} ${lastName}`;
  adminEmail.textContent = email;
  adminId.textContent = userId;
};
const logoutButton = document.querySelector('#logout');
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
};
logoutButton.addEventListener('click', logout);
