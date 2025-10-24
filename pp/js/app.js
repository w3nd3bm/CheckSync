// Dados globais do sistema
let users = JSON.parse(localStorage.getItem('checklist_users')) || {};
let checklists = JSON.parse(localStorage.getItem('checklists')) || [];
let rascunhos = JSON.parse(localStorage.getItem('rascunhos')) || [];
let historico = JSON.parse(localStorage.getItem('historico')) || [];
let authorizationCodes = JSON.parse(localStorage.getItem('auth_codes')) || {
    operador: 'OP123',
    lider: 'LD456',
    gerencia: 'GR789',
    admin: 'AD999'
};
let currentUser = null;

// Inicializar data atual
function initializeDate() {
    const dataInput = document.getElementById('data');
    if (dataInput) {
        dataInput.valueAsDate = new Date();
    }
}

// Inicializar usuários padrão
function initializeUsers() {
    if (Object.keys(users).length === 0) {
        users = {
            'admin': {
                password: 'admin123',
                name: 'Administrador',
                role: 'admin',
                createdAt: new Date().toISOString()
            },
            'gerencia': {
                password: '1234',
                name: 'Gerente',
                role: 'gerencia',
                createdAt: new Date().toISOString()
            },
            'lider': {
                password: '1234',
                name: 'Líder',
                role: 'lider',
                createdAt: new Date().toISOString()
            },
            'operador': {
                password: '1234',
                name: 'Operador',
                role: 'operador',
                createdAt: new Date().toISOString()
            }
        };
        localStorage.setItem('checklist_users', JSON.stringify(users));
        localStorage.setItem('auth_codes', JSON.stringify(authorizationCodes));
    }
}

// Configurar abas do login
function setupLoginTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            const container = this.closest('.tab-container');
            
            // Ativar aba
            container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar conteúdo correspondente
            container.querySelectorAll('.tab-content > div').forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });
}

// Função para mostrar/ocultar senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = 'Ocultar';
    } else {
        input.type = 'password';
        button.textContent = 'Mostrar';
    }
}

// Função auxiliar para obter o nome da máquina
function getNomeMaquina(codigo) {
    const template = getTemplate(codigo);
    return template ? template.nome : codigo;
}

// Função para carregar checklist baseado na máquina selecionada
function carregarChecklistPorMaquina() {
    const maquinaSelect = document.getElementById('maquina');
    if (!maquinaSelect) return;
    
    maquinaSelect.addEventListener('change', function() {
        const templateId = this.value;
        if (templateId) {
            const template = getTemplate(templateId);
            if (template) {
                renderizarChecklist(template);
            }
        }
    });
}

// Função para renderizar o checklist dinâmico
function renderizarChecklist(template) {
    const itensContainer = document.querySelector('.checklist-itens-container');
    if (!itensContainer) return;
    
    // Limpar itens existentes
    itensContainer.innerHTML = '';
    
    // Adicionar itens do template
    template.itens.forEach((item, index) => {
        const checkItem = document.createElement('div');
        checkItem.className = 'check-item';
        
        if (item.tipo === 'checkbox') {
            checkItem.innerHTML = `
                <input type="checkbox" id="${item.id}" name="${item.id}" value="ok">
                <label for="${item.id}">${item.texto}</label>
            `;
        } else if (item.tipo === 'text') {
            checkItem.innerHTML = `
                <label for="${item.id}">${item.texto}</label>
                <input type="text" id="${item.id}" name="${item.id}" placeholder="Digite aqui...">
            `;
        } else if (item.tipo === 'number') {
            checkItem.innerHTML = `
                <label for="${item.id}">${item.texto}</label>
                <input type="number" id="${item.id}" name="${item.id}" placeholder="0">
            `;
        }
        
        itensContainer.appendChild(checkItem);
    });
    
    // Mostrar/ocultar campo de observações
    const observacoesGroup = document.getElementById('observacoes-group');
    if (observacoesGroup) {
        observacoesGroup.style.display = template.observacoes ? 'block' : 'none';
    }
}

// Função para logout
function logout() {
    currentUser = null;
    document.getElementById('operador-app').style.display = 'none';
    document.getElementById('lider-app').style.display = 'none';
    document.getElementById('gerencia-app').style.display = 'none';
    document.getElementById('admin-app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('login-form').reset();
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initializeUsers();
    initializeTemplates();
    setupLoginTabs();
    initializeDate();
    carregarChecklistPorMaquina();
});
