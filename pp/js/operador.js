// Funções do Operador
function salvarRascunho() {
    const form = document.getElementById('checklist-form');
    const formData = new FormData(form);
    const maquina = formData.get('maquina');
    
    if (!maquina) {
        alert('Por favor, selecione uma máquina.');
        return;
    }
    
    // Coletar dados dos itens dinâmicos
    const template = getTemplate(maquina);
    const itensData = {};
    
    template.itens.forEach(item => {
        if (item.tipo === 'checkbox') {
            itensData[item.id] = document.getElementById(item.id)?.checked || false;
        } else {
            itensData[item.id] = document.getElementById(item.id)?.value || '';
        }
    });
    
    const rascunho = {
        id: Date.now(),
        operador: formData.get('operador'),
        maquina: maquina,
        data: formData.get('data'),
        itens: itensData,
        observacoes: formData.get('observacoes'),
        status: 'rascunho',
        template: maquina
    };
    
    rascunhos.push(rascunho);
    localStorage.setItem('rascunhos', JSON.stringify(rascunhos));
    
    alert('Rascunho salvo com sucesso!');
    carregarRascunhos();
}

function enviarParaAprovacao() {
    const form = document.getElementById('checklist-form');
    const formData = new FormData(form);
    const maquina = formData.get('maquina');
    
    if (!formData.get('operador') || !maquina) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Coletar dados dos itens dinâmicos
    const template = getTemplate(maquina);
    const itensData = {};
    
    template.itens.forEach(item => {
        if (item.tipo === 'checkbox') {
            itensData[item.id] = document.getElementById(item.id)?.checked || false;
        } else {
            itensData[item.id] = document.getElementById(item.id)?.value || '';
        }
    });
    
    const checklist = {
        id: Date.now(),
        operador: formData.get('operador'),
        maquina: maquina,
        data: formData.get('data'),
        itens: itensData,
        observacoes: formData.get('observacoes'),
        status: 'pendente',
        dataEnvio: new Date().toLocaleString(),
        template: maquina
    };
    
    checklists.push(checklist);
    localStorage.setItem('checklists', JSON.stringify(checklists));
    
    alert('Checklist enviado para aprovação com sucesso!');
    form.reset();
    document.getElementById('operador').value = currentUser.name;
    document.getElementById('data').valueAsDate = new Date();
    
    // Limpar itens dinâmicos
    const itensContainer = document.querySelector('.checklist-itens-container');
    itensContainer.innerHTML = '';
}

function carregarRascunhos() {
    const listaRascunhos = document.getElementById('lista-rascunhos');
    const containerRascunhos = document.getElementById('rascunhos-operador');
    
    if (!listaRascunhos || !containerRascunhos) return;
    
    const userRascunhos = rascunhos.filter(r => r.operador === currentUser.name);
    
    if (userRascunhos.length === 0) {
        listaRascunhos.innerHTML = '<div class="empty-state">Nenhum rascunho salvo</div>';
        containerRascunhos.classList.add('hidden');
        return;
    }
    
    containerRascunhos.classList.remove('hidden');
    listaRascunhos.innerHTML = '';
    
    userRascunhos.forEach(rascunho => {
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
            <div>
                <strong>${rascunho.operador}</strong> - ${getNomeMaquina(rascunho.maquina)} - ${rascunho.data}
            </div>
            <div>
                <button class="btn" onclick="carregarRascunho(${rascunho.id})">Editar</button>
                <button class="btn btn-danger" onclick="excluirRascunho(${rascunho.id})">Excluir</button>
            </div>
        `;
        listaRascunhos.appendChild(div);
    });
}

function carregarRascunho(id) {
    const rascunho = rascunhos.find(r => r.id === id);
    if (!rascunho) return;
    
    document.getElementById('operador').value = rascunho.operador;
    document.getElementById('maquina').value = rascunho.maquina;
    document.getElementById('data').value = rascunho.data;
    document.getElementById('observacoes').value = rascunho.observacoes || '';
    
    // Carregar template correspondente
    const template = getTemplate(rascunho.maquina);
    if (template) {
        renderizarChecklist(template);
        
        // Preencher valores dos itens
        template.itens.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                if (item.tipo === 'checkbox') {
                    element.checked = rascunho.itens[item.id] || false;
                } else {
                    element.value = rascunho.itens[item.id] || '';
                }
            }
        });
    }
    
    excluirRascunho(id);
}

function excluirRascunho(id) {
    rascunhos = rascunhos.filter(r => r.id !== id);
    localStorage.setItem('rascunhos', JSON.stringify(rascunhos));
    carregarRascunhos();
}
