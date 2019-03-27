
// Get the modal
var modal = document.getElementById('myModal');
var modal2 = document.getElementById('myModal2');

// Get the button that opens the modal
var btn = document.getElementById("account-status");
var btn2 = document.getElementById("account-delete");

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];
var spansNode = document.querySelectorAll(".close");
const spans = [...spansNode];
spans.map((span) => {
  span.onclick = function() {
    modal.style.display = "none";
    modal2.style.display = "none";
  }
})

// When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

btn2.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal || event.target == modal2) {
      modal.style.display = "none";
  }
}
 