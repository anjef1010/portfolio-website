// script.js
const hamburger = document.querySelector('.hamburger-icon');
const navMenu = document.querySelector('.menu-links');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open'); // Toggle the open class
});
