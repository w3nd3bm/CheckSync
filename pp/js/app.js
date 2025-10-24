// Atualizar inicialização de usuários
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
document.getElementById('data').valueAsDate = new Date();

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
    const maquinas = {
        'maq001': 'Máquina 001 - Prensa Hidráulica',
        'maq002': 'Máquina 002 - Torno CNC',
        'maq003': 'Máquina 003 - Fresadora',
        'maq004': 'Máquina 004 - Retífica'
    };
    return maquinas[codigo] || codigo;
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
    setupLoginTabs();
});

function initializeUsers() {
    if (Object.keys(users).length === 0) {
        users = {
            'admin': {
                password: 'admin123',
                name: 'Administrador',
                role: 'admin',
                maquina: 'admin',
                createdAt: new Date().toISOString()
            },
            'gerencia': {
                password: '1234',
                name: 'Gerente',
                role: 'gerencia',
                maquina: 'gerencia',
                createdAt: new Date().toISOString()
            },
            'lider': {
                password: '1234',
                name: 'Líder',
                role: 'lider',
                maquina: 'lider',
                createdAt: new Date().toISOString()
            },
            'operador_bambury': {
                password: '1234',
                name: 'Operador Bambury',
                role: 'operador',
                maquina: 'bambury',
                createdAt: new Date().toISOString()
            },
            'operador_caldeira': {
                password: '1234',
                name: 'Operador Caldeira',
                role: 'operador',
                maquina: 'caldeira',
                createdAt: new Date().toISOString()
            },
            'operador_prensa': {
                password: '1234',
                name: 'Operador Prensa',
                role: 'operador',
                maquina: 'prensa_hidraulica',
                createdAt: new Date().toISOString()
            }
        };
        localStorage.setItem('checklist_users', JSON.stringify(users));
        localStorage.setItem('auth_codes', JSON.stringify(authorizationCodes));
    }
}

// Nova função para carregar checklist baseado na máquina do usuário
function carregarChecklistUsuario() {
    if (currentUser && currentUser.maquina) {
        const template = getTemplate(currentUser.maquina);
        if (template) {
            renderizarChecklist(template);
        }
    }
}

// Função para renderizar o checklist dinâmico
function renderizarChecklist(template) {
    const checklistForm = document.getElementById('checklist-form');
    const itensContainer = checklistForm.querySelector('.checklist-itens-container');
    
    // Limpar itens existentes
    itensContainer.innerHTML = '';
    
    // Adicionar itens do template
    template.itens.forEach((item, index) => {
        const checkItem = document.createElement('div');
        checkItem.className = 'check-item';
        checkItem.innerHTML = `
            <input type="${item.tipo}" id="${item.id}" name="${item.id}" value="ok">
            <label for="${item.id}">${item.texto}</label>
        `;
        itensContainer.appendChild(checkItem);
    });
    
    // Mostrar/ocultar campo de observações
    const observacoesGroup = document.getElementById('observacoes-group');
    if (observacoesGroup) {
        observacoesGroup.style.display = template.observacoes ? 'block' : 'none';
    }
}