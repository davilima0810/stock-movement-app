# Stock Control Web

Aplicação web desenvolvida para consumir a API REST de controle de estoque.

## Tecnologias

- React
- TypeScript
- Vite
- Axios

## Como executar

### Clonar o repositório

```bash
git clone <url-do-repositorio>
```

### Acessar a pasta do projeto

```bash
cd stock-control-web
```

### Instalar as dependências

```bash
npm install
```

### Executar

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:5173
```

> É necessário que o backend esteja em execução para o correto funcionamento da aplicação.

## Funcionalidades implementadas

### Produtos

- Listagem de produtos
- Cadastro de produtos
- Atualização de produtos
- Exclusão de produtos

### Movimentações

- Registro de entrada de estoque
- Registro de saída de estoque

### Relatórios

- Relatório de produtos por tipo
- Relatório de lucro

### Integração

A aplicação consome a API REST disponível em:

```
http://localhost:8080
```

## Estrutura do projeto

```
src
├── components
├── pages
├── services
├── hooks
├── types
└── utils
```