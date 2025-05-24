function salvarLocalmente(dados) {
    localStorage.setItem("registroUsuario", JSON.stringify(dados));
}

async function verificarUsuario() {
    try {
        document.getElementById("mensagem").innerText = "Verificando...";
        document.getElementById("mensagem").classList.add("loading");

        let userAgent = navigator.userAgent;
        let ip = await fetch('https://api.ipify.org?format=json')
            .then(res => res.ok ? res.json() : { ip: "Desconhecido" })
            .then(data => data.ip);

        let dados = { userAgent, ip };

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

