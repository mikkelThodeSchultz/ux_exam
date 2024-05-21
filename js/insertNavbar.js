'use strict';

document.addEventListener('DOMContentLoaded', function() {
    fetch('../_navbar.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('nav').innerHTML = data;
        });
});