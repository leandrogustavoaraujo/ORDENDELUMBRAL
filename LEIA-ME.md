# Clone para edição — Biblioteca Oculta

O index.html, CSS e módulos JavaScript foram extraídos do ZIP sem alterações. O aplicativo original renderiza o quiz e a página de vendas pelo JavaScript; o HTML inicial possui apenas o contêiner root.

Foram recuperadas 48 imagens públicas de /assets que não estavam no ZIP. A lista e o resultado constam em conferencia-assets.json.

Prévia local: http://127.0.0.1:8768/index.html

Na prévia, o servidor remove os pixels Meta/Google do HTML entregue e responde localmente aos endpoints de rastreamento. Essa proteção não altera os arquivos originais nem a aparência ou as perguntas do quiz. Não foram realizados pagamentos nem testes nos checkouts externos.

Limites: configurações de países/preços e câmbio continuam dependendo de serviços externos usados pelo aplicativo. Checkouts apontam para o vendedor original. O painel administrativo e seus serviços não são parte do fluxo público e não foram recuperados. Antes de publicar, substituir links de pagamento, pixels e configurações pela sua conta.

Para editar a oferta, os textos estão principalmente em js/index-DYPvFoMR.js e js/constants-nUGNZKvL.js; o arquivo index.html mantém a estrutura de entrada original. Os módulos são o build compilado, não o projeto-fonte React.
