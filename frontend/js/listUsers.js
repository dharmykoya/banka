const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const tbody = document.querySelector('#staff-tbody');


// getting all the accounts in the app
window.onload = () => {
  const getAllStaff = () => {
    fetch(`${api}/api/v1/user/staff`, {
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
        data.forEach((staff) => {
          const tr = document.createElement('tr');
          const name = document.createElement('td');
          const staffId = document.createElement('td');
          const date = document.createElement('td');
          const type = document.createElement('td');
          const status = document.createElement('td');
          const action = document.createElement('td');
          const a = document.createElement('a');
          // if (staff.email === email) {
          //  continue;
          // }
          const nameNode = document
            .createTextNode(`${staff.first_name} ${staff.last_name}`);
          name.appendChild(nameNode);
          tr.appendChild(name);

          const staffIdNode = document.createTextNode(staff.id);
          staffId.appendChild(staffIdNode);
          tr.appendChild(staffId);

          const realDate = moment(staff.created_on)
            .format('MMM Do, YYYY');
          const dateNode = document.createTextNode(realDate);
          date.appendChild(dateNode);
          tr.appendChild(date);

          const typeNode = document.createTextNode(staff.type);
          type.appendChild(typeNode);
          tr.appendChild(type);

          const statusNode = document.createTextNode('active');
          status.appendChild(statusNode);
          tr.appendChild(status);
          tbody.appendChild(tr);


          const aNode = document.createTextNode('view');
          a.appendChild(aNode);
          a.title = 'view';
          a.href = `./staffAccount.html?id=${staff.id}`;
          a.classList.add('table-action');
          action.appendChild(a);
          tr.appendChild(action);
          return true;
        });
      })
      .catch(err => err);
  };
  getAllStaff();
};
