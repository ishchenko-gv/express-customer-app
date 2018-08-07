document.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-btn')) {
        var id = e.target.getAttribute('data-id');
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/users/delete/' + id);
        xhr.send();
        window.location.replace('/');
    }
});