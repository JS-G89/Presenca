async function verificarUsuario() {
    try {
        document.getElementById("mensagem").innerText = "Verificando...";
        document.getElementById("mensagem").classList.add("loading");

        let userAgent = navigator.userAgent;
        
        // Captura IP do usuário
        let ipResponse = await fetch('https://api.ipify.org?format=json');
        let ipData = ipResponse.ok ? await ipResponse.json() : { ip: "Desconhecido" };
        let ip = ipData.ip;

        let dados = { userAgent, ip };

        salvarLocalmente(dados);

        console.log("Enviando dados ao servidor:", JSON.stringify(dados)); // 🔹 Debug

        // Faz a requisição ao Google Apps Script
        let response = await fetch('https://script.google.com/macros/s/AKfycbwHWU0tjeEFRTAX2uSc7zYIkMtjLAdgKSBYJZSYcuBAr2VMt5M9IklMY0ZYL5FR0ME8/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        let resposta = await response.json();
        console.log("Resposta do servidor:", resposta); // 🔹 Debug

        // Processa a resposta
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

// 🔹 Função para salvar localmente os dados
function salvarLocalmente(dados) {
    console.log("Tentando salvar no LocalStorage:", dados);
    if (dados && Object.keys(dados).length > 0) {
        localStorage.setItem("registroUsuario", JSON.stringify(dados));
        console.log("Dados salvos no LocalStorage com sucesso!");
    } else {
        console.warn("Erro: Dados estão vazios ou indefinidos!");
    }
}

// 🔹 Função para registrar presença
async function registrarPresenca(dados) {
    try {
        console.log("Registrando presença para:", dados);

        let response = await fetch('https://script.google.com/macros/s/AKfycbwHWU0tjeEFRTAX2uSc7zYIkMtjLAdgKSBYJZSYcuBAr2VMt5M9IklMY0ZYL5FR0ME8/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...dados, registrar: true })
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        console.log("Presença registrada com sucesso!");
    } catch (error) {
        console.error("Erro ao registrar presença:", error);
    }
}

// 🔹 Executa automaticamente ao carregar a página
window.onload = verificarUsuario;
