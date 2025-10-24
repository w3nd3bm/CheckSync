// Funções do Líder
function carregarChecklistsPendentes() {
    const listaPendentes = document.getElementById('lista-pendentes');
    const pendentes = checklists.filter(c => c.status === 'pendente');
    
    if (pendentes.length === 0) {
        listaPendentes.innerHTML = '<div class="empty-state">Nenhum checklist pendente de aprovação</div>';
        return;
    }
    
    listaPendentes.innerHTML = '';
    
    pendentes.forEach(checklist => {
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
            <div>
                <strong>${checklist.operador}</strong> - ${getNomeMaquina(checklist.maquina)} - ${checklist.data}
                <br><small>Enviado em: ${checklist.dataEnvio}</small>
            </div>
            <div>
                <button class="btn" onclick="verDetalhesChecklist(${checklist.id})">Ver Detalhes</button>
            </div>
        `;
        listaPendentes.appendChild(div);
    });
}

function verDetalhesChecklist(id) {
    const checklist = checklists.find(c => c.id === id);
    if (!checklist) return;
    
    document.getElementById('checklists-pendentes').classList.add('hidden');
    document.getElementById('detalhes-checklist').classList.remove('hidden');
    
    const detalhesConteudo = document.getElementById('detalhes-conteudo');
    detalhesConteudo.innerHTML = `
        <div class="checklist-summary">
            <p><strong>Operador:</strong> ${checklist.operador}</p>
            <p><strong>Máquina:</strong> ${getNomeMaquina(checklist.maquina)}</p>
            <p><strong>Data:</strong> ${checklist.data}</p>
            <p><strong>Enviado em:</strong> ${checklist.dataEnvio}</p>
            
            <h4 style="margin-top: 20px;">Itens Verificados:</h4>
            <div class="${checklist.itens.item1 ? 'checklist-item ok' : 'checklist-item not-ok'}">
                <span>Verificar nível de óleo</span>
                <span>${checklist.itens.item1 ? 'OK' : 'NÃO OK'}</span>
            </div>
            <div class="${checklist.itens.item2 ? 'checklist-item ok' : 'checklist-item not-ok'}">
                <span>Verificar pressão do sistema hidráulico</span>
                <span>${checklist.itens.item2 ? 'OK' : 'NÃO OK'}</span>
            </div>
            <div class="${checklist.itens.item3 ? 'checklist-item ok' : 'checklist-item not-ok'}">
                <span>Verificar tensão das correias</span>
                <span>${checklist.itens.item3 ? 'OK' : 'NÃO OK'}</span>
            </div>
            <div class="${checklist.itens.item4 ? 'checklist-item ok' : 'checklist-item not-ok'}">
                <span>Verificar funcionamento dos sensores de segurança</span>
                <span>${checklist.itens.item4 ? 'OK' : 'NÃO OK'}</span>
            </div>
            <div class="${checklist.itens.item5 ? 'checklist-item ok' : 'checklist-item not-ok'}">
                <span>Limpar área de trabalho</span>
                <span>${checklist.itens.item5 ? 'OK' : 'NÃO OK'}</span>
            </div>
            
            <p style="margin-top: 15px;"><strong>Observações do Operador:</strong> ${checklist.observacoes || 'Nenhuma'}</p>
        </div>
    `;
    
    detalhesConteudo.dataset.checklistId = id;
}

function voltarParaLista() {
    document.getElementById('checklists-pendentes').classList.remove('hidden');
    document.getElementById('detalhes-checklist').classList.add('hidden');
    document.getElementById('comentario-lider').value = '';
}

function aprovarChecklist() {
    const id = parseInt(document.getElementById('detalhes-conteudo').dataset.checklistId);
    const comentario = document.getElementById('comentario-lider').value;
    const lider = document.getElementById('lider').value || currentUser.name;
    
    const checklistIndex = checklists.findIndex(c => c.id === id);
    if (checklistIndex === -1) return;
    
    checklists[checklistIndex].status = 'aprovado';
    checklists[checklistIndex].lider = lider;
    checklists[checklistIndex].comentarioLider = comentario;
    checklists[checklistIndex].dataAprovacao = new Date().toLocaleString();
    
    historico.push(checklists[checklistIndex]);
    checklists.splice(checklistIndex, 1);
    
    localStorage.setItem('checklists', JSON.stringify(checklists));
    localStorage.setItem('historico', JSON.stringify(historico));
    
    alert('Checklist aprovado com sucesso!');
    voltarParaLista();
    carregarChecklistsPendentes();
    carregarHistorico();
}

function rejeitarChecklist() {
    const id = parseInt(document.getElementById('detalhes-conteudo').dataset.checklistId);
    const comentario = document.getElementById('comentario-lider').value;
    const lider = document.getElementById('lider').value || currentUser.name;
    
    const checklistIndex = checklists.findIndex(c => c.id === id);
    if (checklistIndex === -1) return;
    
    checklists[checklistIndex].status = 'rejeitado';
    checklists[checklistIndex].lider = lider;
    checklists[checklistIndex].comentarioLider = comentario;
    checklists[checklistIndex].dataAprovacao = new Date().toLocaleString();
    
    historico.push(checklists[checklistIndex]);
    checklists.splice(checklistIndex, 1);
    
    localStorage.setItem('checklists', JSON.stringify(checklists));
    localStorage.setItem('historico', JSON.stringify(historico));
    
    alert('Checklist rejeitado!');
    voltarParaLista();
    carregarChecklistsPendentes();
    carregarHistorico();
}

function carregarHistorico() {
    const historicoAprovacoes = document.getElementById('historico-aprovacoes');
    
    if (historico.length === 0) {
        historicoAprovacoes.innerHTML = '<div class="empty-state">Nenhum checklist no histórico</div>';
        return;
    }
    
    historicoAprovacoes.innerHTML = '';
    
    historico.forEach(item => {
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
            <div>
                <strong>${item.operador}</strong> - ${getNomeMaquina(item.maquina)} - ${item.data}
                <br><small>Aprovado por: ${item.lider} em ${item.dataAprovacao}</small>
                <div class="status status-${item.status === 'aprovado' ? 'aprovado' : 'rejeitado'}">
                    ${item.status === 'aprovado' ? 'APROVADO' : 'REJEITADO'}
                </div>
            </div>
        `;
        historicoAprovacoes.appendChild(div);
    });
}