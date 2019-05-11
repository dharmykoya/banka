const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const email = sessionStorage.getItem('email');
const userId = sessionStorage.getItem('id');
const accountName = document.querySelector('#accountName');
const userEmail = document.querySelector('#email');
const accountBalance = document.querySelector('#accountBalance');
const accountNumber = document.querySelector('#account-number');
const accountStatus = document.querySelector('#status');
const drpDown = document.querySelector('.dropdown-content');

if (!token) {
  window.location.replace('./signin.html');
}
window.onload = () => {
  let foundAccountNumber;
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
      .then((response) => {
        if (response.status === 403 || response.status === 500) {
          window.location.replace('./signin.html');
        }
        const { firstName, lastName } = response.data.user;
        accountName.textContent = `${firstName} ${lastName}`;

        userEmail.textContent = `Email: ${email}`;

        accountStatus
          .textContent = `Status: ${response.data[0].status.toUpperCase()}`;

        accountBalance.textContent = response.data[0].balance;

        foundAccountNumber = response.data[0].account_number;
        accountNumber
          .textContent = `Account Number: ${response.data[0].account_number}`;
        const { data } = response;

        // deletting the user property from the response data
        delete data.user;
        const accountsNumbers = Object.values(data);
        accountsNumbers.forEach((account, index) => {
          sessionStorage
            .setItem(`accountNumber${index + 1}`, account.account_number);
        });

        const accounts = Object.values(data);
        accounts.map((account) => {
          const item = document.createElement('a');
          const newContent = document
            .createTextNode(`${account.account_number}`);
          item.appendChild(newContent);
          drpDown.appendChild(item);
          return true;
        });
      })
      .catch(err => err);
  };
  const getUserTransactions = () => {
    setTimeout(() => {
      fetch(`${api}/api/v1/accounts/${foundAccountNumber}/transactions`, {
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
          if (response.status === 403 || response.status === 500) {
            window.location.replace('./signin.html');
          }
        })
        .catch(err => err);
    }, 5000);
  };
  getUserDetails();
  getUserTransactions();
};

const logoutButton = document.querySelector('#logout');
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
};
logoutButton.addEventListener('click', logout);
