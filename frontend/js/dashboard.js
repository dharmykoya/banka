const transactionBox = document.querySelector('.account-transaction-container');
const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const email = sessionStorage.getItem('email');
const userId = sessionStorage.getItem('id');
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
const closeBtn = document.querySelector('.close');
let accountNumberTransaction;

window.onload = () => {
  const getUserDetails = () => {
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
      .then(async (response) => {
        console.log(32, response);
      })
      .catch(err => err);
  };
  getUserDetails();
}
