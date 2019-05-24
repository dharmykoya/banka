/* Toggle between adding and removing the "responsive"
class to topnav when the user clicks on the icon */
const navToggle = (() => {
  const x = document.getElementById('myTopnav');
  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
});

// eslint-disable-next-line no-alert
const alertUser = (message => alert(message));


if (!navigator.onLine) {
  alertUser('Please connect to the internet');
}
