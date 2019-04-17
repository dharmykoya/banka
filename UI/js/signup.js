  
  const form = document.querySelector('#signupForm');
  const message = document.querySelector('.message');
  const alert = document.querySelector('.alert');
  const validate = () => {
    if(form.firstName.value == "" ) {
      message.innerText = "Please provide your First Name!";
      alert.style.display = 'block';
      form.email.focus() ;
      return false;
    }
    if( form.lastName.value == "" ) {
      message.innerText = "Please provide your Last Name!";
      alert.style.display = 'block';
      form.password.focus() ;
      return false;
    }
    if( form.phone.value == "" ) {
      message.innerText = "Please provide your phone number!";
      alert.style.display = 'block';
      form.password.focus() ;
      return false;
    }
    if( form.email.value == "" ) {
      message.innerText = "Please provide your email!";
      alert.style.display = 'block';
      form.password.focus() ;
      return false;
    }
    if( form.password.value == "" ) {
      message.innerText = "Please provide your password!";
      alert.style.display = 'block';
      form.password.focus() ;
      return false;
    }
    if( form.password.value !== form.password2.value) {
      message.innerText = "passwords do not match";
      alert.style.display = 'block';
      form.password.focus() ;
      return false;
    }
  }

  const errorAlert = () => {
    const span = document.querySelector('.closebtn');
    span.parentElement.style.display = 'none';
  }