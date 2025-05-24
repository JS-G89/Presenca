document.addEventListener("DOMContentLoaded", async function() {
    const mensagem = document.getElementById("mensagem");
    
    try {
        mensagem.innerText = "Verificando usuário...";
        let userAgent = navigator.userAgent;
        
        // 🔹 Captura o IP do usuário
        let ipResponse = await fetch('https://api.ipify.org?format=json');
        if (!ipResponse.ok) throw new Error("Falha ao obter IP");
        let ipData = await ipResponse.json();
        let ip = ipData.ip || "Desconhecido";

        let dados = { userAgent, ip };

        console.log("🔹 Enviando dados ao servidor:", JSON.stringify(dados));

        // 🔹 Faz a requisição ao Google Apps Script
        let response = await fetch('https://script.google.com/macros/s/AKfycbxdgGvOoWhAVHlMrdkRXhKUQeONiy0Jj8dHGqzQZQhRB1TeripXzNAj0w8Xre6VXNnt/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        
        let resposta = await response.json();
        console.log("🔹 Resposta do servidor:", resposta);

        if (resposta && resposta.nome) {
            mensagem.innerText = `Seja bem-vindo, ${resposta.nome}!`;
            registrarPresenca(dados);
        } else {
            mensagem.innerText = "Usuário não encontrado. Redirecionando...";
            setTimeout(() => window.location.href = "cadastro.html", 3000);
        }
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        mensagem.innerText = "Erro ao verificar presença!";
    }
});

// 🔹 Função para registrar presença
async function registrarPresenca(dados) {
    try {
        let response = await fetch('https://script.google.com/macros/s/AKfycbxdgGvOoWhAVHlMrdkRXhKUQeONiy0Jj8dHGqzQZQhRB1TeripXzNAj0w8Xre6VXNnt/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...dados, registrar: true })
        });

        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

        console.log("🔹 Presença registrada com sucesso!");
    } catch (error) {
        console.error("Erro ao registrar presença:", error);
    }
}

// 🔹 Consultar registros
document.getElementById("consultarBtn").addEventListener("click", async function() {
    try {
        let resposta = await fetch("https://script.google.com/macros/s/AKfycbxdgGvOoWhAVHlMrdkRXhKUQeONiy0Jj8dHGqzQZQhRB1TeripXzNAj0w8Xre6VXNnt/exec");
        if (!resposta.ok) throw new Error("Erro ao consultar registros.");
        
        let dados = await resposta.json();
        document.getElementById("resultado").innerHTML = JSON.stringify(dados, null, 2);
    } catch (error) {
        console.error("Erro ao consultar registros:", error);
    }
});
