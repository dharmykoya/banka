const transactionBox = document.querySelector('.account-transaction-container');
const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const check = document.querySelector('#check_form');
const form = document.querySelector('#confirm_form');
const accountNumber = document.querySelector('#account-no').value;



window.onload = () => {
  transactionBox.style.display = 'none';
};


const getAccountDetail = (e) => {
  console.log(e);
  e.preventDefault();
  // if (accountNumber !== Number) {
  //   alert('Please account number must be a number');
  // }
  //const data = { accountNumber };
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
    .then((response) => {
      if (response.status === 403) {
        window.location.replace('./signin.html');
      }
      transactionBox.style.display = 'grid';
     console.log(12, response.data[0]);      
    })
    .catch(error => console.log(error));
}

// const transaction = (e) => {
//   e.preventDefault();
//   const email = document.querySelector('#email').value;
//   const password = document.querySelector('#password').value;
//   let errors;
//   const data = { email, password };
//   fetch(`${api}/api/v1/auth/signin`, {
//     method: 'POST', // or 'PUT'
//     mode: 'cors',
//     cache: 'no-cache',
//     body: JSON.stringify(data), // data can be `string` or {object}!
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     redirect: 'follow',
//   }).then(res => res.json())
//     .then((response) => {
//       if (response.status === 422) {
//         alert.classList.remove('hide');
//         errors = response.error;
//         while (message.firstChild) {
//           message.removeChild(message.firstChild);
//         }
//         errors.map((error) => {
//           const item = document.createElement('li');
//           const newContent = document.createTextNode(`${error}`);
//           item.appendChild(newContent);
//           message.appendChild(item);
//           return true;
//         });
//       } else if (response.status === 400) {
//         alert.classList.remove('hide');
//         const item = document.createElement('li');
//         const newContent = document.createTextNode(response.error);
//         item.appendChild(newContent);
//         while (message.firstChild) {
//           message.removeChild(message.firstChild);
//         }
//         message.appendChild(item);
//       } else if (response.status === 200) {
//         if (response.data.isAdmin) {
//           setInterval(() => {
//             sessionStorage.setItem('token', response.data.token);
//             sessionStorage.setItem('email', response.data.email);
//             sessionStorage.setItem('id', response.data.id);
//             sessionStorage.setItem('firstName', response.data.firstName);
//             localStorage.setItem('email', response.data.email);
//             window.location.replace('./adminDashboard.html');
//           }, 1000);
//         } else if (response.data.type === 'staff') {
//           setInterval(() => {
//             sessionStorage.setItem('token', response.data.token);
//             sessionStorage.setItem('email', response.data.email);
//             sessionStorage.setItem('id', response.data.id);
//             sessionStorage.setItem('firstName', response.data.firstName);
//             localStorage.setItem('email', response.data.email);
//             window.location.replace('./staffDashboard.html');
//           }, 1000);
//         } else {
//           setInterval(() => {
//             sessionStorage.setItem('token', response.data.token);
//             sessionStorage.setItem('email', response.data.email);
//             sessionStorage.setItem('id', response.data.id);
//             sessionStorage.setItem('firstName', response.data.firstName);
//             localStorage.setItem('email', response.data.email);
//             window.location.replace('./dashboard.html');
//           }, 1000);
//         }
//       }
//     })
//     .catch(error => error);
// };
check.addEventListener('submit', getAccountDetail);