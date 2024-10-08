# WebBoilerplate

Projeto gerado com [Angular CLI](https://github.com/angular/angular-cli) versão 16.2.10.

## Clonando para um novo projeto

```bash
git clone https://bitbucket.org/noclaftech/boilerplate-web-angular <nome-do-projeto>
```

## Servidor de dev

```bash
ng serve
```

E abra o navegador em [localhost:4200](http://localhost:4200). A aplicação irá recarregar automaticamente caso haja alguma alteração no código.

## Build

Para gerar uma build de produção.

```bash
npm run build:prod
```

Ou para gerar uma build de desenvolvimento.

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## Gerando componentes

```bash
ng generate component nome-do-componente
```

Para gerar um novo componente. Você também pode usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Gerando componentes com lazy loading

```bash
ng generate module pages/nome-do-componente --routing=true && ng generate component pages/nome-do-componente --module=pages/nome-do-componente
```

Para gerar um novo componente com lazy loading

## Libs instaladas

- Angular Material
  - `ng add @angular/material`
- NgxMask
  - `npm i ngx-mask`
- MD5 Typescript
  - `npm i md5-typescript`
- Ngx Cookie Service
  - `npm i ngx-cookie-service`
- Zxcvbn
  - `npm i @zxcvbn-ts`
- AOS
  - `npm i aos`
- Medium Zoom
  - `npm i medium-zoom`

## Links úteis

### Pacotes instalados

- [Angular](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [ngx-mask](https://github.com/JsDaddy/ngx-mask)
- [Scroll animado (AOS)](https://michalsnik.github.io/aos/)

### Outros

- [Charts](https://apexcharts.com/docs/angular-charts/)
- [Carrosel/Slides](https://swiperjs.com/angular)
- [Captcha](https://github.com/leNicDev/ng-hcaptcha#readme)
- [Scroll animado (ngx-scrollreveal)](https://tinesoft.github.io/ngx-scrollreveal/doc/index.html)
- [Icones](https://fw2svg.kaualf.com/)

## Componentes compartilhados

### Loading

```html
<loading></loading>
```

### Loading da página

```html
<page-loading></page-loading>
```

### Paginação de tabela

```html
<pagination (pageChange) [back] [next] [current] [total]></pagination>
```

### Modal de confirmação

Esse padrão de modal e callback do mesmo, como também a estrutura do componente, deve ser seguido para todos os modais de confirmação.

```ts
constructor(private dialog: MatDialog) {}

confirm() {
  const dialogRef = this.dialog.open(ConfirmModalComponent, {
    data: {
      title: 'Título',
      message: 'Mensagem',
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      // Confirmação
    } else {
      // Cancelamento
    }
  });
}
```

### Navbar

A navbar já possui padrãos e a configuração de estilo pode ser feita no arquivo `src/styles/variables.scss`, editando de acordo com a necessidade as variaveis reservadas.

## Modulo compartilhado

Cada componente, modulo, pipe, diretiva etc, compartilhados devem ser importados e exportados no `SharedModule`, como também suas devidas dependências.

## Serviço HTTP

O serviço HTTP já possui um interceptor para adicionar o token de acesso em todas as requisições, caso o mesmo exista, trata erros de requisição, adiciona o content-type correto automaticamente, repete a requisição caso a mesma falhe, e aceita caminhos de url relativos com base na _base_url_ configurada no environments, Foi adicionada uma documentação DocJS para te auxiliar na utilização de cada método. Para seu uso, basta importa-lo ao invés do cliente.

```ts
constructor(private http: HttpService) {}
```

## Estilização

Para criar novos estilos globais, como por exemplo, para botões, formulários, modais, etc, é preciso criar o arquivo `.scss` na pasta `src/styles`, por exemplo, `src/styles/_buttons.scss`. Após isso importe-o no arquivo `src/styles.scss` como: `@import 'styles/buttons';`. Não se esqueça do `_` no início do nome do arquivo.

As variáveis de estilização estão no arquivo `src/styles/_variables.scss`.

### Media screens

Para criar media screens use

```scss
@include media('<=tablet') {
  // > | < | <= | >=
  // Estilos aqui
}
```

Caso queira adicionar novos breakpoints use o arquivo `src/styles/_media.scss`.

Para mais informações, acesse a documentação do [Include Media](https://eduardoboucas.github.io/include-media).

## Diretivas

Diretivas são utilizadas para criar componentes reutilizáveis.

### Input mask

```html
<input type="text" name="phone" mask="(00) 00000-0000" />
```

### Input file

> O evento do `(upload)` retorna o base64 do arquivo selecionado, quando se trata de uma imagem, ela já é compressada com o service `compressor`.

```html
<input
  type="file"
  name="logo"
  appInputFile
  (upload)="handleInputChange($event)"
/>
```

### Icones

Basta adicionar o nome do icone no atributo `icon` da tag `<i>`, como por exemplo:

```html
<i icon="icon-name"></i>
```

Você pode adicionar novos icones na pasta `src/app/directives/icon.directive.ts`.

Recomendamos usar o [FontAwesome](https://fontawesome.com/icons/) para os icones, usando o [fw2svg](https://fw2svg.kaualf.com) para transformar da tag HTML para SVG, porém, você pode usar qualquer outro.

> Se usar o FontAwesome junto ao fw2svg, você conseguirá usar propriedades do css como font-size e color para estilizar o icone.

## Serviços

### Custom validators

> Validadores customizados para o formControl do Angular. Existem atualmente validadores para CPF e CNPJ.

```ts
constructor(private customValidators: CustomValidatorsService) {}

cpfInput = new FormControl('', [
  Validators.required,
  this.customValidators.cpf(),
]);
```

### Angular Notifier (angular-notifier)

> Serviço para exibir mensagens na tela.

```html geral (app.component.html)
<notifier-container></notifier-container>
```

```scss geral (syles.scss)
@import 'node_modules/angular-notifier/styles';
```

```ts
constructor(private notifier: NotifierService) {}

// Tipos de mensagens
this.notifier.notify('default', 'Mensagem'); // Sem contexto
this.notifier.notify('info', 'Mensagem'); // Informativas
this.notifier.notify('warning', 'Mensagem'); // Avisos
this.notifier.notify('success', 'Mensagem'); // Sucesso
this.notifier.notify('error', 'Mensagem'); // Erro

// Limpar todas as mensagens
this.notifier.hideAll();

// Limpar a última mensagem que apareceu
this.notifier.hideNewest();

// Limpar a primeira mensagem que apareceu
this.notifier.hideNewest();

```

### Storage

> Serviço para armazenar dados e evitar requisições desnecessárias.

Já possui uma função para salvar o token de acesso no cookie e um `get` para obter o mesmo.

```ts
constructor(private storage: StorageService) {}

token = this.storage.token;
this.storage.setToken('token', keepLogged);
```

## PWA

### Logos

Adicionar as logos corretamente coforme o `manifest.webmanifest`. Respeite as dimensões e substitua com as logos corretas que estão em `src/assets/icons`.

### Variáveis

As variáveis `name`, `short_name`, `theme_color` e `background_color` devem ser configuradas no arquivo `manifest.webmanifest`.

## Lint

Utilize este comando para executar a verificação de sintaxe em todo o projeto.

```bash
ng lint
```

### Funções

- Nomes de funções para ouvintes de eventos, usar o prefixo `handle`. Exemplo: `handleDeleteTask()`
- Nomes de funções para funções de callback, usar o prefixo `on`. Exemplo: `onTaskDeleted()`
- Nomes de funções para funções de validação, usar o prefixo `validate`. Exemplo: `validateTask()`
- Descritivas, porém não muito extensas.
- Utilizar camelCase

### Variáveis

- Todas as variáveis devem ser escritas em inglês.
- Descritivas, porém não muito extensas.
- Tipar sempre que possível.
- Utilizar snake_case.

### Interfaces

- Precede o `I` antes da nomenclatura que segue o padrão PascalCase.
- Utilizar pasta de models para o armazenamento das mesmas.

### HTML

- Os campos de formulário com mais de uma tag `<input>` devem conter uma tag `<form>` como pai e nele conter um evento `(ngSubmit)` e um `type='submit'` no botão ao invés de um `(keyup.enter)`.
- Usar form-control ao invés de ngModel.
- Todas as tags `<input>` que possuirem um respectivo `<label>`, utilizar um `id` no input que tenha o mesmo valor que o `for` do label.

## Commits

> Preferencialmente feitos em inglês.

- **chore:** Atualização de tarefas que não ocasionam alteração no código de produção, mas mudanças de ferramentas, mudanças de configuração e bibliotecas.

- **feat:** São adições de novas funcionalidades ou de quaisquer outras novas implantações ao código.

- **fix:** Essencialmente definem o tratamento de correções de bugs.

- **refactor:** Utilizado em quaisquer mudanças que sejam executados no código, porém não alterem a funcionalidade final da tarefa impactada.

- **docs:** Inclusão ou alteração somente de arquivos de documentação.

- **perf:** Uma alteração de código que melhora o desempenho.

- **style:** Alterações referentes a arquivos de estilo como SCSS ou CSS.

- **build:** Alterações que afetam o sistema de construção ou dependências externas (escopos de exemplo: gulp, broccoli, npm).

- **ci:** Mudanças em nossos arquivos e scripts de configuração de CI (exemplo de escopos: Travis, Circle, BrowserStack, SauceLabs).

- **env:** Utilizado na descrição de modificações ou adições em arquivos de configuração em processos e métodos de integração contínua (CI), como parâmetros em arquivos de configuração de containers.

### Exemplos de Commits:

- chore: add commitlint and husky
- chore(eslint): require semicolon
- refactor: typed variables
- feat: add axios / search and check data
- feat(page/home): created route for home page
- fix: NH-3 button color in login

## Branchs

> Prerencialmente feitos em inglês.

- _bugfix/_: Responsável por corrigir bugs pequenos em ambiente de desenvolvimento.

- _feature/_: O nome já diz, uma nova feature que será adicionada ao projeto, componente e afins.

- _hotfix/_: Responsável por corrigir algum erro critico que impeça o cliente de executar alguma função em ambiente de produção.

- _improvement/_: Em si é uma melhoria para uma feature já existente, seja de performance, de escrita, de layout, etc.

### Exemplos de Branchs:

- _bugfix/login-submit-form_: Correção de bug ao submeter o formulário de login
- _feature/login-page-form_: Adição de formulário na página de login
- _hotfix/login-page-submit-button_: Correção de bug no botão de submeter o formulário de login já em produção
- _improvement/login-page-section_: Melhoria na seção de login

## Estrutura dos diretórios

Gere um arquivo de texto com a estrutura de diretórios

```bash
npm run tree
```
