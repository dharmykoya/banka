const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const admin = sessionStorage.getItem('admin');
const savingsButton = document.querySelector('#savings');
const currentButton = document.querySelector('#current');
const currentContent = document.querySelector('#current_account');
const savingsContent = document.querySelector('#savings_account');
const savingsTbody = document.querySelector('#savings-tbody');
const currentTbody = document.querySelector('#current-tbody');
const navBar = document.querySelector('#myTopnav');

if (admin) {
  navBar.innerHTML = `<div class="logo-container">
      <a href="index.html" class="logo-text">
      <img class="index-logo" src="img/logo5.png">anka</a>
    </div>
    <a class="topnav-anchor" href="adminDashboard.html">Profile</a>        
    <a class="topnav-anchor" href="addstaff.html">New Staff</a>
    <a  class="topnav-anchor"href="listUsers.html">All Staff</a>
    <a class="topnav-anchor active" href="listAccounts.html">All Account</a>
    <a class="icon topnav-anchor" onclick="navToggle()">
        <i class="fa fa-bars"></i>
    </a>
    <div class="right navbar-right">
        <a class=" topnav-anchor pointer-none">Admin</a>
        <a class="topnav-anchor" href="signin.html">Logout</a>
    </div>`;
}
if (admin === 'false') {
  navBar.innerHTML = `<div class="logo-container">
    <a href="index.html" class="logo-text">
    <img class="index-logo" src="img/logo5.png">anka</a>
    </div>
    <a class="topnav-anchor" href="staffDashboard.html">Profile</a>        
    <a class="topnav-anchor" href="transaction.html">Transaction</a>
    <a  class="topnav-anchor active"href="account.html">All Account</a>
    <a class="icon topnav-anchor" onclick="navToggle()">
        <i class="fa fa-bars"></i>
    </a>
    <div class="right navbar-right">
        <a class=" topnav-anchor pointer-none">Staff</a>
        <a class="topnav-anchor" href="signin.html">Logout</a>
    </div>`;
}
const listAccount = (e) => {
  const content = e.target.textContent;

  if (content === 'Current Account') {
    // add/remove class active to the tabNav
    currentButton.classList.add('active');
    savingsButton.classList.remove('active');

    // add/remove the class hide-tabcontent to the tables
    currentContent.classList.remove('hide-tabcontent');
    savingsContent.classList.add('hide-tabcontent');
  } else {
    // add/remove class active to the tabNav
    currentButton.classList.remove('active');
    savingsButton.classList.add('active');

    // add/remove the class hide-tabcontent to the tables
    currentContent.classList.add('hide-tabcontent');
    savingsContent.classList.remove('hide-tabcontent');
  }
  return true;
};


// getting all the accounts in the app
window.onload = () => {
  const getAllAccounts = () => {
    fetch(`${api}/api/v1/accounts`, {
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
        data.forEach((account) => {
          const tr = document.createElement('tr');
          const name = document.createElement('td');
          const accountNumber = document.createElement('td');
          const date = document.createElement('td');
          const balance = document.createElement('td');
          const status = document.createElement('td');
          const action = document.createElement('td');
          const a = document.createElement('a');
          if (account.type === 'savings') {
            const nameNode = document
              .createTextNode(`${account.first_name} ${account.last_name}`);
            name.appendChild(nameNode);
            tr.appendChild(name);

            const accountNoNode = document
              .createTextNode(account.account_number);
            accountNumber.appendChild(accountNoNode);
            tr.appendChild(accountNumber);

            const realDate = moment(account.created_on)
              .format('MMM Do, YYYY');
            const dateNode = document.createTextNode(realDate);
            date.appendChild(dateNode);
            tr.appendChild(date);

            const balanceNode = document.createTextNode(account.balance);
            balance.appendChild(balanceNode);
            tr.appendChild(balance);

            const statusNode = document.createTextNode(account.status);
            status.appendChild(statusNode);
            tr.appendChild(status);
            savingsTbody.appendChild(tr);


            const aNode = document.createTextNode('view');
            a.appendChild(aNode);
            a.title = 'view';
            a.href = `./account.html?accountNumber=${account.account_number}`;
            a.classList.add('table-action');
            action.appendChild(a);
            tr.appendChild(action);
            return true;
          }
          if (account.type === 'current') {
            const nameNode = document
              .createTextNode(`${account.first_name} ${account.last_name}`);
            name.appendChild(nameNode);
            tr.appendChild(name);

            const accountNoNode = document
              .createTextNode(account.account_number);
            accountNumber.appendChild(accountNoNode);
            tr.appendChild(accountNumber);

            const realDate = moment(account.created_on)
              .format('MMM Do, YYYY');
            const dateNode = document.createTextNode(realDate);
            date.appendChild(dateNode);
            tr.appendChild(date);

            const balanceNode = document.createTextNode(account.balance);
            balance.appendChild(balanceNode);
            tr.appendChild(balance);

            const statusNode = document.createTextNode(account.status);
            status.appendChild(statusNode);
            tr.appendChild(status);
            currentTbody.appendChild(tr);

            const aNode = document.createTextNode('view');
            a.appendChild(aNode);
            a.title = 'view';
            // a.href = `${api}/api/v1/accounts/${account.account_number}`;
            a.href = `./account.html?accountNumber=${account.account_number}`;
            a.classList.add('table-action');
            action.appendChild(a);
            tr.appendChild(action);
            return true;
          }
        });
      })
      .catch(err => err);
  };
  getAllAccounts();
};

savingsButton.addEventListener('click', listAccount);
currentButton.addEventListener('click', listAccount);
