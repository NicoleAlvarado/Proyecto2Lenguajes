
async function updateProfile() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const bio = document.getElementById('bio').value;
    const avatar = document.querySelector('input[name="avatar"]:checked').value;
    const  felipe = "Felipe";
    const response = await fetch(`http://localhost:3000/api/users/updateUser/${felipe}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newUsername: username,
            email: email,
            password: password,
            bio: bio,
            avatar: avatar
        })
    });

    const result = await response.json();
    if (response.ok) {
        alert('Perfil actualizado correctamente');
    } else {
        alert('Error al actualizar el perfil: ' + result.message);
    }
}
