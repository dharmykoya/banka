  const api = 'https://banktoday.herokuapp.com';  
  const form = document.querySelector('#signinForm');
  const message = document.querySelector('.message');
  const alert = document.querySelector('.alert');
  const closeBtn = document.querySelector('#closebtn');
  const validate = () => {

    if(form.email.value == "" ) {
      message.innerText = "Please provide your email!";
      alert.style.display = 'block';
      form.email.focus() ;
      return false;
    }
    if( form.password.value == "" ) {
      message.innerText = "Please provide your password!";
      alert.style.display = 'block';
      form.password.focus() ;
      return false;
    }
  }

  const errorAlert = () => {
    const span = document.querySelector('.closebtn');
    span.parentElement.style.display = 'none';
  }

  const signIn = (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
  
    const data = { email, password };
    fetch(`${api}/api/v1/auth/signin`, {
      method: 'POST', // or 'PUT'
      mode: 'cors',
      cache: 'no-cache',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
    }).then(res => res.json())
      .then((response) => {
        if (response.status === 422) {
          console.log(21, 'wrong details');
        } else if (response.status === 400) {
          console.log(22, 'wrong Information provided');
        } else if (response.status === 200) {
          console.log(21, response.data);
          if (response.data.isAdmin) {
            console.log(25, 'admin')
            setInterval(() => {
              sessionStorage.setItem('token', response.data.token);
              sessionStorage.setItem('email', response.data.email);
              sessionStorage.setItem('id', response.data.id);
              localStorage.setItem('firstName', response.data.firstName);
              localStorage.setItem('email', response.data.email);
              window.location.replace('./adminDashboard.html');
            }, 1000);
          } else if (response.data.type === 'staff') {
            console.log(25, 'staff')
            setInterval(() => {
              sessionStorage.setItem('token', response.data.token);
              sessionStorage.setItem('email', response.data.email);
              sessionStorage.setItem('id', response.data.id);
              localStorage.setItem('firstName', response.data.firstName);
              localStorage.setItem('email', response.data.email);
              window.location.replace('./staffDashboard.html');
            }, 1000);
          } else {
            console.log(25, 'client')
          setInterval(() => {
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('email', response.data.email);
            sessionStorage.setItem('id', response.data.id);
            localStorage.setItem('firstName', response.data.firstName);
            localStorage.setItem('email', response.data.email);
            window.location.replace('./dashboard.html');
          }, 1000);
          }
          
        }
      })
      .catch(error => console.error('Error:', error));
  };

  form.addEventListener('submit', validate);
  closeBtn.addEventListener('click', errorAlert);
  form.addEventListener('submit', signIn);