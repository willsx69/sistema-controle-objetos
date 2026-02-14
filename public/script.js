 // Funções do sistema
        async function carregar() {
            try {
                const res = await fetch('/lancamentos');
                const dados = await res.json();
                const lista = document.getElementById('lista');
                
                if (dados.length === 0) {
                    lista.innerHTML = '<li class="empty-message">Nenhum item pendente</li>';
                    return;
                }
                
                lista.innerHTML = '';
                dados.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="codigo">${item.codigo}</span>
                        <button class="btn-conferir" onclick="conferir(${item.id})">✓ Conferir</button>
                    `;
                    lista.appendChild(li);
                });
            } catch (error) {
                console.error('Erro ao carregar:', error);
            }
        }

        async function adicionar() {
            const codigo = document.getElementById('codigo').value;
            if (!codigo) {
                alert('Digite um código!');
                return;
            }

            try {
                await fetch('/lancamentos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ codigo })
                });
                
                document.getElementById('codigo').value = '';
                carregar();
            } catch (error) {
                console.error('Erro ao adicionar:', error);
                alert('Erro ao adicionar código!');
            }
        }

        async function conferir(id) {
            try {
                await fetch('/lancamentos/' + id, {
                    method: 'PUT'
                });
                carregar();
            } catch (error) {
                console.error('Erro ao conferir:', error);
                alert('Erro ao conferir código!');
            }
        }

        // Carregar lista ao abrir a página
        window.addEventListener('load', carregar);