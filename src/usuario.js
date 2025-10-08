function saveUser() {

    const nome = document.getElementById("userName").value;
    const senha = document.getElementById("userPassword").value;
    const email = document.getElementById("userEmail").value;
    const cpf = document.getElementById("userCpf").value;


    fetch("http://localhost:8080/usuario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            senha: senha,
            email: email,
            cpf: cpf
        })
    })
        .then(response => response.json())
        .then(dados => {
            console.log("Usuário criado:", dados);
        })
        .catch(erro => {
            console.error("Erro:", erro);
        });


}