// Finish toggle search, EP6

document.addEventListener('DOMContentLoaded', function() {
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', function() {
            searchBar.style.visibilty = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        });
    }

        searchClose.addEventListener('click', function() {
            searchBar.style.visibilty = 'hidden';
            searchBar.classList.remove('open');
            this.setAttribute('aria-expanded', 'false');
        });
    

});


////////