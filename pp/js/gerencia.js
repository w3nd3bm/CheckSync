// Funções da Gerência
function carregarGerencia() {
    updateGerenciaStats();
    carregarPendentesGerencia();
    carregarHistoricoGerencia();
}

function updateGerenciaStats() {
    const total = historico.length;
    const aprovados = historico.filter(h => h.status === 'aprovado').length;
    const rejeitados = historico.filter(h => h.status === 'rejeitado').length;
    const pendentes = checklists.filter(c => c.status === 'pendente').length;
    
    document.getElementById('total-checklists').textContent = total;
    document.getElementById('aprovados-count').textContent = aprovados;
    document.getElementById('rejeitados-count').textContent = rejeitados;
    document.getElementById('pendentes-count').textContent = pendentes;
}

function carregarPendentesGerencia() {
    const listaPendentes = document.getElementById('lista-pendentes-gerencia');
    if (!listaPendentes) return;
    
    const pendentes = checklists.filter(c => c.status === 'pendente');
    
    if (pendentes.length === 0) {
        listaPendentes.innerHTML = '<div class="empty-state">Nenhum checklist pendente</div>';
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
                <button class="btn" onclick="verDetalhesChecklistGerencia(${checklist.id})">Ver Detalhes</button>
            </div>
        `;
        listaPendentes.appendChild(div);
    });
}

function verDetalhesChecklistGerencia(id) {
    const checklist = checklists.find(c => c.id === id);
    if (!checklist) return;
    
    document.getElementById('checklists-pendentes').classList.add('hidden');
    document.getElementById('detalhes-checklist-gerencia').classList.remove('hidden');
    
    const detalhesConteudo = document.getElementById('detalhes-conteudo-gerencia');
    const template = getTemplate(checklist.maquina);
    
    let itensHTML = '';
    if (template) {
        template.itens.forEach(item => {
            const valor = checklist.itens[item.id];
            let valorExibicao = '';
            
            if (item.tipo === 'checkbox') {
                valorExibicao = valor ? '✅ OK' : '❌ NÃO OK';
            } else {
                valorExibicao = valor || 'Não informado';
            }
            
            itensHTML += `
                <div class="${item.tipo === 'checkbox' && valor ? 'checklist-item ok' : 'checklist-item not-ok'}">
                    <span>${item.texto}</span>
                    <span>${valorExibicao}</span>
                </div>
            `;
        });
    }
    
    detalhesConteudo.innerHTML = `
        <div class="checklist-summary">
            <p><strong>Operador:</strong> ${checklist.operador}</p>
            <p><strong>Máquina:</strong> ${getNomeMaquina(checklist.maquina)}</p>
            <p><strong>Data:</strong> ${checklist.data}</p>
            <p><strong>Enviado em:</strong> ${checklist.dataEnvio}</p>
            
            <h4 style="margin-top: 20px;">Itens Verificados:</h4>
            ${itensHTML}
            
            <p style="margin-top: 15px;"><strong>Observações do Operador:</strong> ${checklist.observacoes || 'Nenhuma'}</p>
        </div>
    `;
}

function voltarParaListaGerencia() {
    document.getElementById('checklists-pendentes').classList.remove('hidden');
    document.getElementById('detalhes-checklist-gerencia').classList.add('hidden');
}

function carregarHistoricoGerencia() {
    const historicoGerencia = document.getElementById('historico-gerencia');
    if (!historicoGerencia) return;
    
    if (historico.length === 0) {
        historicoGerencia.innerHTML = '<div class="empty-state">Nenhum checklist no histórico</div>';
        return;
    }
    
    historicoGerencia.innerHTML = '';
    
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
        historicoGerencia.appendChild(div);
    });
}
