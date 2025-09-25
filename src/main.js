(function () {
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const pwdError = document.getElementById('pwdError');
    const toggle = document.getElementById('togglePwd');
    const btnGoogle = document.getElementById('btnGoogle');


    // Mostrar/ocultar senha (acessível)
    toggle.addEventListener('click', () => {
        const show = password.type === 'password';
        password.type = show ? 'text' : 'password';
        toggle.setAttribute('aria-pressed', String(show));
        toggle.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
    });


    // Validações simples no client
    function validateEmail() {
        const val = email.value.trim();
        if (!val) return 'E‑mail é obrigatório.';
        // pattern simples
        const re = /^\S+@\S+\.\S+$/;
        return re.test(val) ? '' : 'Formato de e‑mail inválido.';
    }


    function validatePassword() {
        const val = password.value;
        if (!val) return 'Senha é obrigatória.';
        if (val.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.';
        return '';
    }


    email.addEventListener('input', () => { emailError.textContent = validateEmail(); });
    password.addEventListener('input', () => { pwdError.textContent = validatePassword(); });


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const eErr = validateEmail();
        const pErr = validatePassword();
        emailError.textContent = eErr;
        pwdError.textContent = pErr;


        if (eErr || pErr) {
            // foca no primeiro campo com erro
            if (eErr) email.focus(); else password.focus();
            return;
        }


        // Simulação de requisição — substitua por fetch/axios para backend real
        const payload = {
            email: email.value.trim(),
            password: password.value,
            remember: document.getElementById('remember').checked
        };


        // Aqui você faria a requisição para seu endpoint de login.
        // Exemplo (com fetch):
        // fetch('/api/login', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
        // .then(res => res.json())
        // .then(data => { ... })


        // Para demonstração, mostra um estado de sucesso
        form.querySelector('.btn-primary').textContent = 'Entrando...';
        form.querySelector('.btn-primary').disabled = true;


        setTimeout(() => {
            // simula sucesso
            form.querySelector('.btn-primary').textContent = 'Entrar';
            form.querySelector('.btn-primary').disabled = false;
            alert('Login simulado: ' + payload.email);
            // depois de logado, redirecione: window.location.href = '/dashboard'
        }, 900);
    });


    // Botão de login social (placeholder)
    btnGoogle.addEventListener('click', () => {
        alert('Aqui você iniciaria o fluxo OAuth com Google.');
    });


})();