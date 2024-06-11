    // Redirect to index.html after form submission
    document.addEventListener("DOMContentLoaded", function() {
        const form = document.querySelector('form');
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            const formData = new FormData(form);
            const queryString = new URLSearchParams(formData).toString();
            window.location.href = '/view/home.html?' + queryString;
        });
    });