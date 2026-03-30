document.addEventListener("DOMContentLoaded", function () {
  // Objetivo:
  // Enviar um texto de um formulário para uma API do n8n e exibir o resultado o código html, css e colocar a animação no fundo da tela do site.

  // Passos:
  // 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.

  // 2. Obter o valor digitado pelo usuário no campo de texto.

  // 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.

  // 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.

  // 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).

  // 6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela:

  //    - Mostrar o HTML e CSS gerado em uma área de preview.
  //    - Inserir o CSS retornado dinamicamente na página para aplicar o background.

  // 7. Remover o indicador de carregamento após o recebimento da resposta.

  function setLoading(isLoading) {
    const buttonSpan = document.querySelector(".btn-magic span");

    if (isLoading) {
      buttonSpan.innerHTML = "Gerando Background ...";
    } else {
      buttonSpan.innerHTML = "Gerar Background Mágico";
    }
  }

  function applyGeneratedPreview(html, css) {
    const preview = document.getElementById("preview-section");

    // Exibe o card de preview (pode ter estado `display: none` antes da primeira geração).
    preview.style.display = "block";
    // Interpreta a string como markup e renderiza o fundo dentro do card.
    preview.innerHTML = html;

    // Estilos da geração anterior ficam em um <style id="dynamic-style">; removemos para não empilhar CSS.
    const previousStyle = document.getElementById("dynamic-style");
    if (previousStyle) previousStyle.remove();

    if (css) {
      // Novo bloco de estilo no <head>: aplica o CSS na página inteira (incluindo o preview).
      const styleElement = document.createElement("style");
      styleElement.id = "dynamic-style"; // mesmo id para localizar e remover na próxima vez
      styleElement.textContent = css;
      document.head.appendChild(styleElement);
    }
  }

  // 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
  const form = document.querySelector(".form-group");
  const textarea = document.getElementById("description");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // 2. Obter o valor digitado pelo usuário no campo de texto.
    const description = textarea.value.trim();

    if (!description) {
      return;
    }

    // 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
    setLoading(true);

    // 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
    try {
      const response = await fetch(
        "https://pedrohen-s.app.n8n.cloud/webhook-test/b1b91700-96f3-4ca7-93fc-7a3a0bdcbbcd",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        },
      );

      // 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).
      const data = await response.json();

      console.log(data);

      const htmlCode = document.getElementById("html-code");
      const cssCode = document.getElementById("css-code");

      htmlCode.textContent = data.html || "";
      cssCode.textContent = data.css || "";

      applyGeneratedPreview(data.html, data.css);
    } catch (error) {
      console.log("Erro ao gerar o fundo:", err);

      htmlCode.textContent = "Não consegui gerar o HTML. Tente novamente.";

      cssCode.textContent = "Não consegui gerar o CSS. Tente novamente.";

      preview.innerHTML = "";
    } finally {
      setLoading(false);
    }
  });
});
