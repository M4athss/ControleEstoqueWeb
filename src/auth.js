
// 1. Pega o token salvo no "cofre" do navegador
const token = localStorage.getItem('authToken');

// 2. Verifica se o token NÃO existe
if (!token) {
    // 3. Se não existe, expulsa o usuário de volta para o login
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = '/login.html'; 
}