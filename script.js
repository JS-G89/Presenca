async function verificarUsuario() {
    try {
        document.getElementById("mensagem").innerText = "Verificando...";
        document.getElementById("mensagem").classList.add("loading");

        let userAgent = navigator.userAgent;
        let ip = await fetch('https://api.ipify.org?format=json')
            .then(res => res.ok ? res.json() : { ip: "Desconhecido" })
            .then(data => data.ip);

        let dados = { userAgent, ip };

        let resposta = await fetch('https://script.google.com/macros/s/AKfycbwHWU0tjeEFRTAX2uSc7zYIkMtjLAdgKSBYJZSYcuBAr2VMt5M9IklMY0ZYL5FR0ME8/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        }).then(res => res.json());

        if (resposta.nome) {
            document.getElementById("mensagem").innerText = `Seja bem-vindo, ${resposta.nome}!`;
            registrarPresenca(dados);
        } else {
            window.location.href = "cadastro.html";
        }
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        document.getElementById("mensagem").innerText = "Erro ao verificar presença!";
    }
}

async function registrarPresenca(dados) {
    try {
        await fetch('https://script.google.com/macros/s/AKfycbwHWU0tjeEFRTAX2uSc7zYIkMtjLAdgKSBYJZSYcuBAr2VMt5M9IklMY0ZYL5FR0ME8/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...dados, registrar: true })
        });
    } catch (error) {
        console.error("Erro ao registrar presença:", error);
    }
}

// ✅ A função será executada automaticamente quando a página carregar
window.onload = verificarUsuario;
