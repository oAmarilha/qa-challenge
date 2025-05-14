# Configurando o projeto

1. Clone o repositório com o comando `git clone https://github.com/oAmarilha/qa-challenge.git`
2. Acesse o diretório do projeto com o comando `cd qa-challenge`
3. Instale as dependências do projeto com o comando `npm install`

# Executando os testes

1. Execute o comando `npx playwright test` para rodar os testes
2. O Playwright irá executar os testes e mostrar o resultado na tela
3. Todo código atualizado e feito o push irá acionar o github actions para rodar os testes

# Dicas

* Para executar os testes em um navegador específico, adicione a opção `-b <nome-do-navegador>` ao comando, por exemplo: `npx playwright test -b chromium`
* Para executar os testes em modo headless, adicione a opção `--headed=false` ao comando, por exemplo: `npx playwright test --headed=false`
* Para executar os testes em um arquivo específico, adicione a opção `-f <caminho-do-arquivo>` ao comando, por exemplo: `npx playwright test -f tests/ui/swaglabs.spec.ts`
* Para executar os testes em um projeto específico, adicione a opção `-c <caminho-do-projeto>` ao comando, por exemplo: `npx playwright test -c tests/ui/swaglabs`
