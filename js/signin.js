  
  const form = document.querySelector('#signinForm');
  const message = document.querySelector('.message');
  const alert = document.querySelector('.alert');
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