async function verificarUsuario() {
    try {
        const mensagem = document.getElementById("mensagem");
        mensagem.innerText = "Verificando...";
        mensagem.classList.add("loading");

        let userAgent = navigator.userAgent;
        
        // Captura IP do usuário
        let ipResponse = await fetch('https://api.ipify.org?format=json');
        if (!ipResponse.ok) throw new Error("Falha ao obter IP");
        let ipData = await ipResponse.json();
        let ip = ipData.ip || "Desconhecido";

        let dados = { userAgent, ip };

        salvarLocalmente(dados);

        console.log("Enviando dados ao servidor:", JSON.stringify(dados));

        // Faz a requisição ao Google Apps Script
        let response = await fetch('https://script.google.com/macros/s/AKfycbxdgGvOoWhAVHlMrdkRXhKUQeONiy0Jj8dHGqzQZQhRB1TeripXzNAj0w8Xre6VXNnt/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        
        let resposta = await response.json();
        console.log("Resposta do servidor:", resposta);

        // Processa a resposta
        if (resposta && resposta.nome) {
            mensagem.innerText = `Seja bem-vindo, ${resposta.nome}!`;
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
    try {
        console.log("Tentando salvar no LocalStorage:", dados);
        if (dados && Object.keys(dados).length > 0) {
            localStorage.setItem("registroUsuario", JSON.stringify(dados));
            console.log("Dados salvos no LocalStorage com sucesso!");
        } else {
            console.warn("Erro: Dados estão vazios ou indefinidos!");
        }
    } catch (error) {
        console.error("Erro ao salvar no LocalStorage:", error);
    }
}

// 🔹 Função para registrar presença
async function registrarPresenca(dados) {
    try {
        console.log("Registrando presença para:", dados);

        let response = await fetch('https://script.google.com/macros/s/AKfycbxdgGvOoWhAVHlMrdkRXhKUQeONiy0Jj8dHGqzQZQhRB1TeripXzNAj0w8Xre6VXNnt/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...dados, registrar: true })
        });

        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

        console.log("Presença registrada com sucesso!");
    } catch (error) {
        console.error("Erro ao registrar presença:", error);
    }
}

// 🔹 Executa automaticamente ao carregar a página
window.onload = verificarUsuario;
