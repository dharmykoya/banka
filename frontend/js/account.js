<<<<<<< HEAD:js/account.js

// Get the modal
const modal = document.getElementById('myModal');
const modal2 = document.getElementById('myModal2');

// Get the button that opens the modal
const btn = document.getElementById("account-status");
const btn2 = document.getElementById("account-delete");

// Get the <span> element that closes the modal
const spansNode = document.querySelectorAll(".close");
const spans = [...spansNode];
spans.map((span) => {
  span.onclick = function() {
    modal.style.display = "none";
    modal2.style.display = "none";
  }
});

// When the user clicks on the button, open the modal 
btn.onclick = (() => modal.style.display = "block");
btn2.onclick = (() => modal2.style.display = "block")

// When the user clicks anywhere outside of the modal, close it
window.onclick = ((event) => {
  if (event.target == modal || event.target == modal2) {
    modal.style.display = "none";
  }
});
 
=======

// Get the modal
const modal = document.getElementById('myModal');
const modal2 = document.getElementById('myModal2');

// Get the button that opens the modal
const btn = document.getElementById('account-status');
const btn2 = document.getElementById('account-delete');

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
btn.onclick = (() => {
  modal.style.display = 'block';
  return true;
});
btn2.onclick = (() => {
  modal2.style.display = 'block';
  return true;
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = ((event) => {
  if (event.target === modal || event.target === modal2) {
    modal.style.display = 'none';
  }
});
>>>>>>> f2709ef0ab64bffaf200157cea24dbd3b1f9e1f7:UI/js/account.js
