fetch("https://script.google.com/macros/s/AKfycbxWSIz-Xjx4j9Gpfp7LqO4n6VhekfpDktUi3VlQw_zmTLK2SDi19-sYl7-XGp1nrWy4/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip: "192.168.1.1", userAgent: navigator.userAgent, registrar: true })
}).then(res => res.json())
  .then(data => console.log("Resposta do Script:", data))
  .catch(error => console.error("Erro na requisição:", error));
