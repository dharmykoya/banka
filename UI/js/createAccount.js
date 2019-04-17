  
  const form = document.querySelector('#createAccountForm');
  const message = document.querySelector('.message');
  const alert = document.querySelector('.alert');
  const validate = () => {    
    const accountsType = ['savings', 'current'];
    const check = accountsType.includes(form.role.value)

    if(form.role.value === "Account type") {
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