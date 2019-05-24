const api = 'https://banktoday.herokuapp.com';
const token = sessionStorage.getItem('token');
const staffName = document.querySelector('#staff-name');
const createdAt = document.querySelector('#date-created');
const staffEmail = document.querySelector('#staff-email');
const StaffId = document.querySelector('#staff-Id');
const preloader = document.querySelector('#preloader');
const profilePic = document.querySelector('.profilepic');

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

let userId;

window.onload = () => {
  // Get the account numbe from the address bar
  const query = window.location.search;
  userId = query.split('=').pop();

  const getUserDetails = () => {
    fetch(`${api}/api/v1/auth/${userId}`, {
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
        staffName.textContent = `${data.first_name} ${data.last_name}`;
        // createdAt.textContent = data.created_at;
        StaffId.textContent = data.id;
        staffEmail.textContent = data.email;

        const humanDate = moment(data.created_at)
          .format('MMMM Do, YYYY');
        createdAt.textContent = humanDate;
        profilePic.src = response.data.imageurl;
        preloader.classList.remove('flex');
        preloader.classList.add('hide');
      })
      .catch(err => err);
  };
  getUserDetails();
};

const logoutButton = document.querySelector('#logout');
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
};
logoutButton.addEventListener('click', logout);
