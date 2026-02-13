 async function carregar() {
      const res = await fetch("/lancamentos");
      const dados = await res.json();

      const lista = document.getElementById("lista");
      lista.innerHTML = "";

      dados.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${item.codigo} 
          <button onclick="conferir(${item.id})">Conferir</button>
        `;
        lista.appendChild(li);
      });
    }

    async function adicionar() {
      const codigo = document.getElementById("codigo").value;

      await fetch("/lancamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo })
      });

      document.getElementById("codigo").value = "";
      carregar();
    }

    async function conferir(id) {
      await fetch("/lancamentos/" + id, {
        method: "PUT"
      });

      carregar();
    }