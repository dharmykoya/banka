  
  const form = document.querySelector('#createAccountForm');
  console.log(23, form);
  const message = document.querySelector('.message');
  const alert = document.querySelector('.alert');
  const validate = () => {
    
    const accountsType = ['savings', 'current'];
    const check = accountsType.includes(form.role.value)

    if(form.firstName.value == "" ) {
      message.innerText = "Please provide your First Name!";
      alert.style.display = 'block';
      form.email.focus() ;
      return false;
    }
    if(form.lastName.value == "" ) {
      message.innerText = "Please provide your Last Name!";
      alert.style.display = 'block';
      form.lastName.focus() ;
      return false;
    }
    if( form.email.value == "" ) {
      message.innerText = "Please provide your email!";
      alert.style.display = 'block';
      form.email.focus() ;
      return false;
    }
    if(form.role.value == "Account type") {
      message.innerText = "Please select an account type";
      alert.style.display = 'block';
      form.password.focus() ;
      return false;
    }
  }

  const errorAlert = () => {
    const span = document.querySelector('.closebtn');
    span.parentElement.style.display = 'none';
  }