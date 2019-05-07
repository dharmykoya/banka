const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const email = sessionStorage.getItem('email');
const userId = sessionStorage.getItem('id');
const tranEmail = document.querySelector('#email');
const accountBalance = document.querySelector('#accountBalance');
const accountNumber = document.querySelector('#account-number');
const accountStatus = document.querySelector('#status');
const tbody = document.querySelector('.tbody');

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

        tranEmail.textContent = `Email: ${email}`;

        accountStatus
          .textContent = `Status: ${response.data[0].status.toUpperCase()}`;

        const spanBalance = document.createElement('span');
        const newBalance = document.createTextNode(response.data[0].balance);
        spanBalance.appendChild(newBalance);
        accountBalance.appendChild(spanBalance);
        foundAccountNumber = response.data[0].account_number;
        accountNumber
          .textContent = `Account Number: ${response.data[0].account_number}`;
      })
      .catch(err => err);
  };
  const getUserTransactions = () => {
    foundAccountNumber = sessionStorage.getItem('accountNumber1');
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
        })
        .catch(err => err);
    }, 5000);
  };
  getUserDetails();
  getUserTransactions();
};
