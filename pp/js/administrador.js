// Funções do Administrador
function carregarAdmin() {
    loadUsersList();
    updateAdminStats();
    carregarTemplatesAdmin();
}

function loadUsersList() {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;
    
    usersList.innerHTML = '';
    
    Object.keys(users).forEach(username => {
        const user = users[username];
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        userItem.innerHTML = `
            <div class="user-info-left">
                <strong>${user.name}</strong> 
                <span style="color: #7f8c8d;">(@${username})</span>
                <div class="user-badge badge-${user.role}">${user.role.toUpperCase()}</div>
                <div style="font-size: 12px; color: #95a5a6; margin-top: 5px;">
                    Criado em: ${new Date(user.createdAt).toLocaleDateString()}
                </div>
            </div>
            <div class="user-actions">
                <button class="btn btn-sm" onclick="editUser('${username}')">Editar</button>
                <button class="btn btn-sm btn-warning" onclick="changePassword('${username}')">Senha</button>
                ${username !== 'admin' ? `<button class="btn btn-sm btn-danger" onclick="deleteUser('${username}')">Excluir</button>` : ''}
            </div>
        `;
        
        usersList.appendChild(userItem);
    });
}

// Templates functions
function carregarTemplatesAdmin() {
    const templatesList = document.getElementById('templates-list');
    if (!templatesList) return;
    
    templatesList.innerHTML = '';
    const templates = listarTemplates();
    
    if (Object.keys(templates).length === 0) {
        templatesList.innerHTML = '<div class="empty-state">Nenhum template criado ainda</div>';
        return;
    }
    
    Object.keys(templates).forEach(templateId => {
        const template = templates[templateId];
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.innerHTML = `
            <div class="template-info">
                <strong>${template.nome}</strong>
                <span style="color: #7f8c8d;">(ID: ${templateId})</span>
                <div style="font-size: 12px; color: #95a5a6; margin-top: 5px;">
                    ${template.itens.length} itens • ${template.observacoes ? 'Com observações' : 'Sem observações'}
                </div>
            </div>
            <div class="template-actions">
                <button class="btn btn-sm" onclick="showTemplateModal('${templateId}')">Editar</button>
                ${!['prensa_hidraulica', 'bambury', 'caldeira'].includes(templateId) ? 
                    `<button class="btn btn-sm btn-danger" onclick="excluirTemplateConfirm('${templateId}')">Excluir</button>` : 
                    '<button class="btn btn-sm btn-secondary" disabled>Padrão</button>'}
            </div>
        `;
        templatesList.appendChild(templateItem);
    });
}

function showTemplateModal(templateId = null) {
    const modal = document.getElementById('template-modal');
    const title = document.getElementById('template-modal-title');
    const form = document.getElementById('template-form');
    
    if (templateId) {
        // Modo edição
        title.textContent = 'Editar Template';
        const template = getTemplate(templateId);
        document.getElementById('template-id').value = templateId;
        document.getElementById('template-nome').value = template.nome;
        document.getElementById('template-observacoes').checked = template.observacoes;
        
        // Carregar itens
        const itensContainer = document.getElementById('template-itens-container');
        itensContainer.innerHTML = '';
        template.itens.forEach((item, index) => {
            addTemplateItem(item.texto, item.tipo, index);
        });
    } else {
        // Modo criação
        title.textContent = 'Criar Novo Template';
        form.reset();
        document.getElementById('template-id').value = '';
        document.getElementById('template-itens-container').innerHTML = '';
        addTemplateItem(); // Item padrão
    }
    
    modal.style.display = 'flex';
}

function addTemplateItem(texto = '', tipo = 'checkbox', index = null) {
    const container = document.getElementById('template-itens-container');
    const itemIndex = index !== null ? index : container.children.length;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'template-item-row';
    itemDiv.innerHTML = `
        <input type="text" class="template-item-text" placeholder="Descrição do item" value="${texto}" required>
        <select class="template-item-type">
            <option value="checkbox" ${tipo === 'checkbox' ? 'selected' : ''}>Checkbox</option>
            <option value="text" ${tipo === 'text' ? 'selected' : ''}>Campo de Texto</option>
            <option value="number" ${tipo === 'number' ? 'selected' : ''}>Número</option>
        </select>
        <button type="button" class="btn btn-sm btn-danger" onclick="removerTemplateItem(this)">Remover</button>
    `;
    container.appendChild(itemDiv);
}

function removerTemplateItem(button) {
    if (document.getElementById('template-itens-container').children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('O template deve ter pelo menos um item!');
    }
}

// Processar formulário de template
document.getElementById('template-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const templateId = document.getElementById('template-id').value;
    const nome = document.getElementById('template-nome').value;
    const observacoes = document.getElementById('template-observacoes').checked;
    
    // Coletar itens
    const itens = [];
    const itemRows = document.getElementById('template-itens-container').children;
    
    for (let i = 0; i < itemRows.length; i++) {
        const row = itemRows[i];
        const texto = row.querySelector('.template-item-text').value;
        const tipo = row.querySelector('.template-item-type').value;
        
        if (texto.trim()) {
            itens.push({
                id: `item${i + 1}`,
                texto: texto.trim(),
                tipo: tipo
            });
        }
    }
    
    if (itens.length === 0) {
        alert('Adicione pelo menos um item ao template!');
        return;
    }
    
    if (templateId) {
        // Editar template existente
        editarTemplate(templateId, itens, nome);
        alert('Template atualizado com sucesso!');
    } else {
        // Criar novo template
        const novoId = criarTemplate(nome, itens, observacoes);
        alert(`Template "${nome}" criado com sucesso!`);
    }
    
    closeTemplateModal();
    carregarTemplatesAdmin();
});

function closeTemplateModal() {
    document.getElementById('template-modal').style.display = 'none';
}

function excluirTemplateConfirm(templateId) {
    if (confirm(`Tem certeza que deseja excluir o template "${checklistTemplates[templateId]?.nome}"?`)) {
        if (excluirTemplate(templateId)) {
            alert('Template excluído com sucesso!');
            carregarTemplatesAdmin();
        } else {
            alert('Não é possível excluir templates padrão do sistema.');
        }
    }
}

// User management functions
function showCreateUserModal() {
    document.getElementById('modal-title').textContent = 'Criar Novo Usuário';
    document.getElementById('user-form').reset();
    document.getElementById('edit-username').value = '';
    document.getElementById('modal-username').readOnly = false;
    document.getElementById('user-modal').style.display = 'flex';
}

function closeUserModal() {
    document.getElementById('user-modal').style.display = 'none';
}

function editUser(username) {
    const user = users[username];
    document.getElementById('modal-title').textContent = 'Editar Usuário';
    document.getElementById('edit-username').value = username;
    document.getElementById('modal-username').value = username;
    document.getElementById('modal-username').readOnly = true;
    document.getElementById('modal-password').value = user.password;
    document.getElementById('modal-name').value = user.name;
    document.getElementById('modal-role').value = user.role;
    document.getElementById('user-modal').style.display = 'flex';
}

function changePassword(username) {
    const newPassword = prompt(`Digite a nova senha para ${username}:`, users[username].password);
    if (newPassword) {
        users[username].password = newPassword;
        localStorage.setItem('checklist_users', JSON.stringify(users));
        loadUsersList();
        alert('Senha alterada com sucesso!');
    }
}

function deleteUser(username) {
    if (confirm(`Tem certeza que deseja excluir o usuário "${username}"?`)) {
        delete users[username];
        localStorage.setItem('checklist_users', JSON.stringify(users));
        loadUsersList();
        updateAdminStats();
        alert('Usuário excluído com sucesso!');
    }
}

// Processar formulário de usuário
document.getElementById('user-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const editUsername = document.getElementById('edit-username').value;
    const username = document.getElementById('modal-username').value;
    const password = document.getElementById('modal-password').value;
    const name = document.getElementById('modal-name').value;
    const role = document.getElementById('modal-role').value;
    
    if (editUsername) {
        // Editar usuário existente
        users[editUsername].password = password;
        users[editUsername].name = name;
        users[editUsername].role = role;
    } else {
        // Criar novo usuário
        if (users[username]) {
            alert('Usuário já existe!');
            return;
        }
        users[username] = {
            password: password,
            name: name,
            role: role,
            createdAt: new Date().toISOString()
        };
    }
    
    localStorage.setItem('checklist_users', JSON.stringify(users));
    loadUsersList();
    updateAdminStats();
    closeUserModal();
    alert(editUsername ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
});

function updateAdminStats() {
    document.getElementById('admin-total-users').textContent = Object.keys(users).length;
    document.getElementById('admin-total-checklists').textContent = historico.length;
    document.getElementById('admin-pendentes').textContent = checklists.filter(c => c.status === 'pendente').length;
}

function exportUsers() {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'usuarios_sistema.json');
    linkElement.click();
}

function resetSystem() {
    if (confirm('ATENÇÃO: Isso irá resetar todo o sistema. Tem certeza?')) {
        localStorage.clear();
        alert('Sistema reiniciado. A página será recarregada.');
        location.reload();
    }
}
