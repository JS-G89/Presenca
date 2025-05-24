async function verificarUsuario() {
    try {
        document.getElementById("mensagem").innerText = "Verificando...";
        document.getElementById("mensagem").classList.add("loading");

        let userAgent = navigator.userAgent;
        let ip = await fetch('https://api.ipify.org?format=json')
            .then(res => res.ok ? res.json() : { ip: "Desconhecido" })
            .then(data => data.ip);

        let dados = { userAgent, ip };

        // 🔹 Salva os dados localmente antes de qualquer requisição
        salvarLocalmente(dados);

        let resposta = await fetch('https://script.google.com/macros/s/AKfycbwHWU0tjeEFRTAX2uSc7zYIkMtjLAdgKSBYJZSYcuBAr2VMt5M9IklMY0ZYL5FR0ME8/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        }).then(res => res.json());

        if (resposta.nome) {
            document.getElementById("mensagem").innerText = `Seja bem-vindo, ${resposta.nome}!`;
        } else {
            window.location.href = "cadastro.html";
        }
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        document.getElementById("mensagem").innerText = "Erro ao verificar presença!";
    }
}

// 🔹 Função para salvar os dados no LocalStorage
function salvarLocalmente(dados) {
    console.log("Tentando salvar no LocalStorage:", dados); // Teste
    if (dados && Object.keys(dados).length > 0) {
        localStorage.setItem("registroUsuario", JSON.stringify(dados));
        console.log("Dados salvos no LocalStorage com sucesso!");
    } else {
        console.warn("Erro: Dados estão vazios ou indefinidos!");
    }
}

// ✅ Executa automaticamente ao carregar a página
window.onload = verificarUsuario;
