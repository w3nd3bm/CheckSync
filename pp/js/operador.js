// Funções do Operador
function salvarRascunho() {
    const form = document.getElementById('checklist-form');
    const formData = new FormData(form);
    
    const rascunho = {
        id: Date.now(),
        operador: formData.get('operador'),
        maquina: formData.get('maquina'),
        data: formData.get('data'),
        itens: {
            item1: document.getElementById('item1').checked,
            item2: document.getElementById('item2').checked,
            item3: document.getElementById('item3').checked,
            item4: document.getElementById('item4').checked,
            item5: document.getElementById('item5').checked
        },
        observacoes: formData.get('observacoes'),
        status: 'rascunho'
    };
    
    rascunhos.push(rascunho);
    localStorage.setItem('rascunhos', JSON.stringify(rascunhos));
    
    alert('Rascunho salvo com sucesso!');
    carregarRascunhos();
}

function enviarParaAprovacao() {
    const form = document.getElementById('checklist-form');
    const formData = new FormData(form);
    
    if (!formData.get('operador') || !formData.get('maquina')) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    const checklist = {
        id: Date.now(),
        operador: formData.get('operador'),
        maquina: formData.get('maquina'),
        data: formData.get('data'),
        itens: {
            item1: document.getElementById('item1').checked,
            item2: document.getElementById('item2').checked,
            item3: document.getElementById('item3').checked,
            item4: document.getElementById('item4').checked,
            item5: document.getElementById('item5').checked
        },
        observacoes: formData.get('observacoes'),
        status: 'pendente',
        dataEnvio: new Date().toLocaleString()
    };
    
    checklists.push(checklist);
    localStorage.setItem('checklists', JSON.stringify(checklists));
    
    alert('Checklist enviado para aprovação com sucesso!');
    form.reset();
    document.getElementById('operador').value = currentUser.name;
    document.getElementById('data').valueAsDate = new Date();
}

function carregarRascunhos() {
    const listaRascunhos = document.getElementById('lista-rascunhos');
    const containerRascunhos = document.getElementById('rascunhos-operador');
    
    const userRascunhos = rascunhos.filter(r => r.operador === currentUser.username);
    
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
    document.getElementById('observacoes').value = rascunho.observacoes;
    
    document.getElementById('item1').checked = rascunho.itens.item1;
    document.getElementById('item2').checked = rascunho.itens.item2;
    document.getElementById('item3').checked = rascunho.itens.item3;
    document.getElementById('item4').checked = rascunho.itens.item4;
    document.getElementById('item5').checked = rascunho.itens.item5;
    
    excluirRascunho(id);
}

function excluirRascunho(id) {
    rascunhos = rascunhos.filter(r => r.id !== id);
    localStorage.setItem('rascunhos', JSON.stringify(rascunhos));
    carregarRascunhos();
}