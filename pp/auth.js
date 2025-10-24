// Processar login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (users[username] && users[username].password === password) {
        currentUser = users[username];
        currentUser.username = username;
        
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('login-error').style.display = 'none';
        
        // Redirecionar para a tela correta baseado no role
        if (currentUser.role === 'operador') {
            document.getElementById('operador-app').style.display = 'block';
            document.getElementById('operador-info').textContent = `Usuário: ${username}`;
            document.getElementById('operador-welcome').textContent = `Bem-vindo, ${currentUser.name}!`;
            document.getElementById('operador').value = currentUser.name;
            carregarRascunhos();
        } else if (currentUser.role === 'lider') {
            document.getElementById('lider-app').style.display = 'block';
            document.getElementById('lider-info').textContent = `Usuário: ${username}`;
            document.getElementById('lider-welcome').textContent = `Bem-vindo, ${currentUser.name}!`;
            document.getElementById('lider').value = currentUser.name;
            carregarChecklistsPendentes();
            carregarHistorico();
        } else if (currentUser.role === 'gerencia') {
            document.getElementById('gerencia-app').style.display = 'block';
            document.getElementById('gerencia-info').textContent = `Usuário: ${username}`;
            document.getElementById('gerencia-welcome').textContent = `Bem-vindo, ${currentUser.name}!`;
            document.getElementById('gerencia').value = currentUser.name;
            carregarGerencia();
        } else if (currentUser.role === 'admin') {
            document.getElementById('admin-app').style.display = 'block';
            document.getElementById('admin-info').textContent = `Usuário: ${username}`;
            document.getElementById('admin-welcome').textContent = `Bem-vindo, ${currentUser.name}!`;
            carregarAdmin();
        }
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

// Processar cadastro
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    const role = document.getElementById('register-role').value;
    const code = document.getElementById('register-code').value;
    
    // Verificar se usuário já existe
    if (users[username]) {
        document.getElementById('register-error').textContent = 'Usuário já existe. Escolha outro nome.';
        document.getElementById('register-error').style.display = 'block';
        return;
    }
    
    // Verificar código de autorização
    if (code !== authorizationCodes[role]) {
        document.getElementById('register-error').textContent = 'Código de autorização inválido para este tipo de usuário.';
        document.getElementById('register-error').style.display = 'block';
        return;
    }
    
    // Criar novo usuário
    users[username] = {
        password: password,
        name: name,
        role: role,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('checklist_users', JSON.stringify(users));
    
    alert('Conta criada com sucesso! Faça login para continuar.');
    
    // Limpar formulário e voltar para login
    document.getElementById('register-form').reset();
    document.querySelector('.tab[data-tab="login"]').click();
});