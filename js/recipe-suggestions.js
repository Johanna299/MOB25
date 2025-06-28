document.querySelectorAll('.save-recipe').forEach(button => {
    button.addEventListener('click', () => {
        const icon = button.querySelector('i');
        button.classList.toggle('active');
        // Toggle zwischen Outline und Solid Icon
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    });
});