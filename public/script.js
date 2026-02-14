// ========== SISTEMA DE NOTIFICAÇÕES ==========
class Notificacao {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    mostrar(mensagem, tipo = 'info', titulo = '') {
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        
        const icones = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const titulos = {
            success: 'Sucesso!',
            error: 'Erro!',
            warning: 'Atenção!',
            info: 'Informação'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icones[tipo]}</div>
            <div class="toast-content">
                <div class="toast-title">${titulo || titulos[tipo]}</div>
                <div class="toast-message">${mensagem}</div>
            </div>
            <div class="toast-progress"></div>
        `;
        
        this.container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('close');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
        
        toast.addEventListener('click', () => {
            toast.classList.add('close');
            setTimeout(() => toast.remove(), 300);
        });
    }
    
    success(msg) { this.mostrar(msg, 'success'); }
    error(msg) { this.mostrar(msg, 'error'); }
    warning(msg) { this.mostrar(msg, 'warning'); }
    info(msg) { this.mostrar(msg, 'info'); }
}

// ========== MODAL DE CONFIRMAÇÃO ==========
function mostrarConfirmacao(titulo, mensagem, icone = '❓') {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-icon">${icone}</div>
                <h3>${titulo}</h3>
                <p>${mensagem}</p>
                <div class="modal-buttons">
                    <button class="modal-btn cancel">Cancelar</button>
                    <button class="modal-btn confirm">Confirmar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.confirm').addEventListener('click', () => {
            overlay.remove();
            resolve(true);
        });
        
        overlay.querySelector('.cancel').addEventListener('click', () => {
            overlay.remove();
            resolve(false);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve(false);
            }
        });
    });
}

// Criar instância das notificações
const notificacao = new Notificacao();

// ========== CARREGAR LISTAS ==========
async function carregarPendentes() {
    try {
        const res = await fetch("/lancamentos");
        const dados = await res.json();
        const lista = document.getElementById("lista-pendentes");
        
        document.getElementById("total-pendentes").textContent = dados.length;
        
        if (dados.length === 0) {
            lista.innerHTML = '<li class="empty-message">Nenhum item pendente</li>';
            return;
        }
        
        lista.innerHTML = "";
        dados.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div style="flex:1">
                    <strong>${item.codigo}</strong><br>
                    <small>${item.data_criacao ? new Date(item.data_criacao).toLocaleString('pt-BR') : ''}</small>
                </div>
                <div>
                    <button class="btn-conferir" onclick="conferir(${item.id})">✓</button>
                    <button class="btn-excluir" onclick="excluir(${item.id})">🗑️</button>
                </div>
            `;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Erro:", error);
        notificacao.error('Erro ao carregar pendentes!');
    }
}

async function carregarConferidas() {
    try {
        const res = await fetch("/lancamentos/conferidas");
        const dados = await res.json();
        const lista = document.getElementById("lista-conferidas");
        
        document.getElementById("total-conferidas").textContent = dados.length;
        
        if (dados.length === 0) {
            lista.innerHTML = '<li class="empty-message">Nenhum item conferido</li>';
            return;
        }
        
        lista.innerHTML = "";
        dados.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div style="flex:1">
                    <strong>${item.codigo}</strong><br>
                    <small>${item.data_criacao ? new Date(item.data_criacao).toLocaleString('pt-BR') : ''}</small>
                </div>
                <div>
                    <button class="btn-desfazer" onclick="desfazer(${item.id})">↩</button>
                    <button class="btn-excluir" onclick="excluir(${item.id})">🗑️</button>
                </div>
            `;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Erro:", error);
        notificacao.error('Erro ao carregar conferidas!');
    }
}

// ========== AÇÕES PRINCIPAIS ==========
async function adicionar() {
    const codigo = document.getElementById("codigo").value.trim();
    if (!codigo) {
        notificacao.warning('Por favor, digite um código antes de adicionar!');
        return;
    }
    
    try {
        const res = await fetch("/lancamentos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigo })
        });
        
        if (!res.ok) throw new Error("Erro no servidor");
        
        document.getElementById("codigo").value = "";
        await carregarPendentes();
        await carregarConferidas();
        
        notificacao.success(`Código "${codigo}" adicionado com sucesso! 🎉`);
        
    } catch (error) {
        console.error("Erro:", error);
        notificacao.error('Não foi possível adicionar o código. Tente novamente!');
    }
}

async function conferir(id) {
    try {
        const res = await fetch("/lancamentos/" + id, { method: "PUT" });
        if (!res.ok) throw new Error("Erro no servidor");
        
        await carregarPendentes();
        await carregarConferidas();
        fecharPesquisa();
        
        notificacao.success('✅ Item conferido com sucesso!');
        
    } catch (error) {
        console.error("Erro:", error);
        notificacao.error('Erro ao conferir item!');
    }
}

async function desfazer(id) {
    try {
        const res = await fetch("/lancamentos/desfazer/" + id, { method: "PUT" });
        if (!res.ok) throw new Error("Erro no servidor");
        
        await carregarPendentes();
        await carregarConferidas();
        fecharPesquisa();
        
        notificacao.warning('↩ Item voltou para pendentes!');
        
    } catch (error) {
        console.error("Erro:", error);
        notificacao.error('Erro ao desfazer!');
    }
}

// ========== EXCLUIR ==========
async function excluir(id) {
    const confirmado = await mostrarConfirmacao(
        'Excluir Item',
        'Tem certeza que deseja excluir este item permanentemente?',
        '🗑️'
    );
    
    if (!confirmado) {
        notificacao.info('Operação cancelada.');
        return;
    }
    
    try {
        const res = await fetch("/lancamentos/" + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Erro no servidor");
        
        await carregarPendentes();
        await carregarConferidas();
        fecharPesquisa();
        
        notificacao.success('Item excluído com sucesso! 🗑️');
        
    } catch (error) {
        console.error("Erro:", error);
        notificacao.error('Erro ao excluir item!');
    }
}

async function limparConferidos() {
    const confirmado = await mostrarConfirmacao(
        'Limpar Conferidos',
        'Tem certeza que deseja limpar TODOS os itens conferidos? Esta ação não pode ser desfeita!',
        '⚠️'
    );
    
    if (!confirmado) {
        notificacao.info('Operação cancelada.');
        return;
    }
    
    try {
        const res = await fetch("/lancamentos/conferidos/limpar", { method: "DELETE" });
        const data = await res.json();
        
        notificacao.success(`${data.excluidos} itens foram excluídos com sucesso! 🧹`);
        await carregarConferidas();
        
    } catch (error) {
        console.error("Erro:", error);
        notificacao.error('Erro ao limpar conferidos!');
    }
}

// ========== PESQUISAR ==========
async function pesquisar() {
    const termo = document.getElementById("pesquisa").value.trim();
    if (!termo) {
        notificacao.warning('Digite um termo para pesquisar! 🔍');
        return;
    }
    
    try {
        const res = await fetch("/lancamentos/pesquisar/" + encodeURIComponent(termo));
        const dados = await res.json();
        
        const lista = document.getElementById("lista-pesquisa");
        lista.innerHTML = "";
        
        if (dados.length === 0) {
            lista.innerHTML = '<li class="empty-message">Nenhum resultado encontrado</li>';
            notificacao.info(`Nenhum código encontrado para "${termo}"`);
        } else {
            dados.forEach(item => {
                const li = document.createElement("li");
                const status = item.conferido ? "✅ Conferido" : "⏳ Pendente";
                li.innerHTML = `
                    <div style="flex:1">
                        <strong>${item.codigo}</strong><br>
                        <small>${status} - ${item.data_criacao ? new Date(item.data_criacao).toLocaleString('pt-BR') : ''}</small>
                    </div>
                    <div>
                        ${!item.conferido ? 
                            `<button class="btn-conferir" onclick="conferir(${item.id})">✓</button>` : 
                            `<button class="btn-desfazer" onclick="desfazer(${item.id})">↩</button>`
                        }
                        <button class="btn-excluir" onclick="excluir(${item.id})">🗑️</button>
                    </div>
                `;
                lista.appendChild(li);
            });
            notificacao.success(`Encontrados ${dados.length} resultados para "${termo}"!`);
        }
        
        document.getElementById("resultado-pesquisa").style.display = "block";
    } catch (error) {
        console.error("Erro:", error);
        notificacao.error('Erro ao pesquisar! Tente novamente.');
    }
}

function limparPesquisa() {
    document.getElementById("pesquisa").value = "";
    fecharPesquisa();
}

function fecharPesquisa() {
    document.getElementById("resultado-pesquisa").style.display = "none";
}

// ========== INICIALIZAÇÃO ==========
function mostrarBoasVindas() {
    setTimeout(() => {
        notificacao.success('✨ Sistema pronto para usar!', 'Bem-vindo!');
    }, 500);
}

window.addEventListener("load", () => {
    carregarPendentes();
    carregarConferidas();
    mostrarBoasVindas();
    
    const pesquisaInput = document.getElementById("pesquisa");
    if (pesquisaInput) {
        pesquisaInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") pesquisar();
        });
    }
});