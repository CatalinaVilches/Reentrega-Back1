let status = document.querySelectorAll('.statusP');

status.forEach(element => {
    element.textContent === 'true' ? element.style.color = 'green' : element.style.color = 'red';
});