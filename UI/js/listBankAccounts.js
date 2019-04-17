const listAccount = ((evt, accountsType) => {
    // Declare all variables
    const tablecontents = document.querySelectorAll('.tabcontent-list-account'); 
    const tablelinks =  document.querySelectorAll('.tablinks_list_account');
    
    // spread the Nodelist into an array
    const tabcontents = [...tablecontents];
    const tablinks = [...tablelinks];
    
    // Get all elements with class="tabcontent" and hide them
    tabcontents.map(tabcontent => tabcontent.style.display = 'none');

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks.map(tablink => tablink.className = tablink.className.replace(' active', ''));

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(accountsType).style.display = "block";
    evt.currentTarget.className += " active";
    return true;
});
