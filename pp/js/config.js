// Sistema de Templates de Checklist
let checklistTemplates = JSON.parse(localStorage.getItem('checklist_templates')) || {};

// Templates padrão
function initializeTemplates() {
    if (Object.keys(checklistTemplates).length === 0) {
        checklistTemplates = {
            'prensa_hidraulica': {
                nome: 'Prensa Hidráulica',
                itens: [
                    { id: 'item1', texto: 'Verificar nível de óleo', tipo: 'checkbox' },
                    { id: 'item2', texto: 'Verificar pressão do sistema hidráulico', tipo: 'checkbox' },
                    { id: 'item3', texto: 'Verificar tensão das correias', tipo: 'checkbox' },
                    { id: 'item4', texto: 'Verificar funcionamento dos sensores de segurança', tipo: 'checkbox' },
                    { id: 'item5', texto: 'Limpar área de trabalho', tipo: 'checkbox' }
                ],
                observacoes: true
            },
            'bambury': {
                nome: 'Bambury',
                itens: [
                    { id: 'item1', texto: 'Verificar temperatura de operação', tipo: 'checkbox' },
                    { id: 'item2', texto: 'Verificar pressão dos rolos', tipo: 'checkbox' },
                    { id: 'item3', texto: 'Verificar sistema de refrigeração', tipo: 'checkbox' },
                    { id: 'item4', texto: 'Verificar homogeneidade da mistura', tipo: 'checkbox' },
                    { id: 'item5', texto: 'Limpar câmara de mistura', tipo: 'checkbox' }
                ],
                observacoes: true
            },
            'caldeira': {
                nome: 'Caldeira',
                itens: [
                    { id: 'item1', texto: 'Verificar nível de água', tipo: 'checkbox' },
                    { id: 'item2', texto: 'Verificar pressão de vapor', tipo: 'checkbox' },
                    { id: 'item3', texto: 'Verificar queimadores', tipo: 'checkbox' },
                    { id: 'item4', texto: 'Testar válvulas de segurança', tipo: 'checkbox' },
                    { id: 'item5', texto: 'Verificar qualidade da água', tipo: 'checkbox' }
                ],
                observacoes: true
            }
        };
        localStorage.setItem('checklist_templates', JSON.stringify(checklistTemplates));
    }
}

// Função para criar template personalizado
function criarTemplate(nome, itens, observacoes = true) {
    const templateId = nome.toLowerCase().replace(/\s+/g, '_');
    checklistTemplates[templateId] = {
        nome: nome,
        itens: itens,
        observacoes: observacoes
    };
    localStorage.setItem('checklist_templates', JSON.stringify(checklistTemplates));
    return templateId;
}

// Função para editar template
function editarTemplate(templateId, novosItens, novoNome = null) {
    if (checklistTemplates[templateId]) {
        if (novoNome) {
            checklistTemplates[templateId].nome = novoNome;
        }
        checklistTemplates[templateId].itens = novosItens;
        localStorage.setItem('checklist_templates', JSON.stringify(checklistTemplates));
        return true;
    }
    return false;
}

// Função para excluir template
function excluirTemplate(templateId) {
    if (checklistTemplates[templateId]) {
        delete checklistTemplates[templateId];
        localStorage.setItem('checklist_templates', JSON.stringify(checklistTemplates));
        return true;
    }
    return false;
}

// Função para obter template por ID
function getTemplate(templateId) {
    return checklistTemplates[templateId];
}

// Função para listar todos os templates
function listarTemplates() {
    return checklistTemplates;
}