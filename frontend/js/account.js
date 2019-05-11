const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const admin = sessionStorage.getItem('admin');
const clientName = document.querySelector('#client-name');
const accountBalance = document.querySelector('#account-balance');
const accountType = document.querySelector('#account-type');
const accountCreated = document.querySelector('#account-created');
const accountEmail = document.querySelector('#account-email');
const accountStatus = document.querySelector('.status-active-badge');
const accountNo = document.querySelector('#account-no');
const changeStatusForm = document.querySelector('#change-status');
const deleteAccountForm = document.querySelector('#delete-account');
const buttonLoader = document.querySelector('.button-loader');
const statusButton = document.querySelector('#status-button');
const deleteButton = document.querySelector('#delete-button');
const tbody = document.querySelector('.tbody');
const navBar = document.querySelector('#myTopnav');
const preloader = document.querySelector('#preloader');
const staffCredit = document.querySelector('#staff-credit');
const staffDebit = document.querySelector('#staff-debit');

if (admin) {
  navBar.innerHTML = `<div class="logo-container">
      <a href="index.html" class="logo-text">
      <img class="index-logo" src="img/logo5.png">anka</a>
    </div>
    <a class="topnav-anchor" href="adminDashboard.html">Profile</a>        
    <a class="topnav-anchor" href="addstaff.html">New Staff</a>
    <a  class="topnav-anchor"href="listUsers.html">All Staff</a>
    <a class="topnav-anchor" href="listBankAccounts.html">All Account</a>
    <a class="icon topnav-anchor" onclick="navToggle()">
        <i class="fa fa-bars"></i>
    </a>
    <div class="right navbar-right">
        <a class=" topnav-anchor pointer-none">Admin</a>
        <a class="topnav-anchor" href="signin.html" id="logout">Logout</a>
    </div>`;
  staffCredit.href = '';
  staffDebit.href = '';

  staffCredit.classList.add('hide');
  staffDebit.classList.add('hide');
}
if (admin === 'false') {
  navBar.innerHTML = `<div class="logo-container">
    <a href="index.html" class="logo-text">
    <img class="index-logo" src="img/logo5.png">anka</a>
    </div>
    <a class="topnav-anchor" href="staffDashboard.html">Profile</a>        
    <a class="topnav-anchor" href="transaction.html">Transaction</a>
    <a  class="topnav-anchor" href="listBankAccounts.html">All Account</a>
    <a class="icon topnav-anchor" onclick="navToggle()">
        <i class="fa fa-bars"></i>
    </a>
    <div class="right navbar-right">
        <a class=" topnav-anchor pointer-none">Staff</a>
        <a class="topnav-anchor" href="signin.html" id="logout">Logout</a>
    </div>`;
}


// Get the modal
const modal = document.getElementById('myModal');
const modal2 = document.getElementById('myModal2');

// Get the button that opens the modal
const btn = document.getElementById('account-status');
const btn2 = document.getElementById('account-delete');

// Get the button that closes the modal
const closeStatus = document.querySelector('#close-status');
const closeDelete = document.querySelector('#close-delete');

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
closeStatus.addEventListener('click', closeModal);
closeDelete.addEventListener('click', closeModal);

let accountNumber;


window.onload = () => {
  // Get the account numbe from the address bar
  const query = window.location.search;
  accountNumber = query.split('=').pop();

  const getUserDetails = () => {
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
        if (response.status === 403 || response.status === 500) {
          window.location.replace('./signin.html');
        }
        const { data } = response;
        clientName.textContent = `${data.fName} ${data.lName}`;
        accountBalance.textContent = data.balance;
        accountType.textContent = data.type;
        accountNo.textContent = accountNumber;
        accountEmail.textContent = data.email;
        accountStatus.textContent = data.status;

        const humanDate = moment(data.created_on)
          .format('MMMM Do, YYYY');
        accountCreated.textContent = humanDate;
      })
      .catch(err => err);
  };
  const getUserTransactions = () => {
    setTimeout(() => {
      fetch(`${api}/api/v1/accounts/${accountNumber}/transactions`, {
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
          const { data } = response;
          data.forEach((transaction) => {
            delete transaction.id;
            delete transaction.account_number;
            const tr = document.createElement('tr');
            const date = document.createElement('td');
            const cashier = document.createElement('td');
            const credit = document.createElement('td');
            const debit = document.createElement('td');
            const oldBalance = document.createElement('td');
            const newBalance = document.createElement('td');

            const realDate = moment(transaction.created_on)
              .format('MMMM Do YYYY, h:mm a');
            const dateNode = document.createTextNode(realDate);
            date.appendChild(dateNode);
            tr.appendChild(date);

            const cashierNode = document.createTextNode(transaction.cashier);
            cashier.appendChild(cashierNode);
            tr.appendChild(cashier);

            if (transaction.type === 'credit') {
              const debitNode = document.createTextNode('');
              debit.appendChild(debitNode);
              tr.appendChild(debit);

              const creditNode = document.createTextNode(transaction.amount);
              credit.appendChild(creditNode);
              tr.appendChild(credit);
            } else {
              const debitNode = document.createTextNode(transaction.amount);
              debit.appendChild(debitNode);
              tr.appendChild(debit);

              const creditNode = document.createTextNode('');
              credit.appendChild(creditNode);
              tr.appendChild(credit);
            }

            const oldBalanceNode = document
              .createTextNode(transaction.old_balance);
            oldBalance.appendChild(oldBalanceNode);
            tr.appendChild(oldBalance);

            const newBalanceNode = document
              .createTextNode(transaction.new_balance);
            newBalance.appendChild(newBalanceNode);
            tr.appendChild(newBalance);

            tbody.appendChild(tr);
          });

          preloader.classList.remove('flex');
          preloader.classList.add('hide');
        })
        .catch(err => err);
    }, 5000);
  };
  getUserDetails();
  getUserTransactions();
};

const changeAccountStatus = (e) => {
  e.preventDefault();
  statusButton.classList.add('hide');
  buttonLoader.classList.add('loader');
  const status = document.querySelector('input[name="status"]:checked').value;
  const data = { status };
  fetch(`${api}/api/v1/accounts/${accountNumber}`, {
    method: 'PATCH', // or 'PUT'
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
      statusButton.classList.remove('hide');
      closeModal();
      document.location.reload(true);
      if (response.status === 403 || response.status === 500) {
        window.location.replace('./signin.html');
      }
    })
    .catch(err => err);
};

const deleteAccount = (e) => {
  e.preventDefault();
  deleteButton.classList.add('hide');
  buttonLoader.classList.add('loader');
  fetch(`${api}/api/v1/accounts/${accountNumber}`, {
    method: 'DELETE', // or 'PUT'
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
  }).then(res => res.json())
    .then((response) => {
      buttonLoader.classList.remove('loader');
      statusButton.classList.remove('hide');
      closeModal();
      if (response.status === 403 || response.status === 500) {
        window.location.replace('./signin.html');
      }
      if (response.status === 202) {
        window.location.replace('./listBankAccounts.html');
      }
    })
    .catch(err => err);
};

changeStatusForm.addEventListener('submit', changeAccountStatus);
deleteAccountForm.addEventListener('submit', deleteAccount);

const logoutButton = document.querySelector('#logout');
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
};
logoutButton.addEventListener('click', logout);
