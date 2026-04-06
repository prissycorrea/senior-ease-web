# Senior Ease Web

Aplicativo web pensado para **apoiar pessoas idosas** no dia a dia: visual confortável, letras ajustáveis, rotinas e agenda em linguagem simples. Projeto desenvolvido no contexto do **Hackaton (FIAP)** — Fase 5 da pós graduação em Front End Engineering.

### Neste documento

1. [O que é o app](#o-que-é-o-app)  
2. [Firebase e versão web](#firebase-e-versão-web)  
3. [Jornada no app — etapa por etapa](#jornada-no-app--etapa-por-etapa)  
4. [Funcionalidades e público idoso](#funcionalidades-e-facilidades-público-idoso)  
5. [Arquitetura](#arquitetura)  
6. [Testes](#testes)  
7. [Tecnologias](#tecnologias-utilizadas)  
8. [Pipelines (CI/CD)](#pipelines-e-etapas-github-actions)  
9. [Como rodar](#como-rodar-o-app)  

---

## O que é o app

O **Senior Ease** é um protótipo de webApp **Angular** que simula uma experiência completa: da primeira abertura até o uso cotidiano com **lista de atividades**, **agenda por dia**, **criação de tarefas** e **ajustes de acessibilidade**.

---

## Firebase e versão web

O projeto usa o SDK **Firebase** via **AngularFire** (`@angular/fire`): **Authentication** (e-mail e senha) e **Cloud Firestore** para as tarefas, alinhado ao **mesmo projeto Firebase** da **versão mobile** do Senior Ease, quando ambos apontam para o mesmo `projectId` e regras de segurança.

Com isso, a pessoa tem acesso às **mesmas coisas** nos dois lugares: **a mesma conta** (perfil no Auth) e a **mesma lista de tarefas** na coleção compartilhada, desde que as **regras de segurança** do Firestore e o provedor de e-mail/senha estejam habilitados no console do Firebase.

---

## Jornada no app — etapa por etapa

| Etapa | O que acontece |
|--------|----------------|
| **1. Conforto visual** | Escolha entre tema padrão (cores suaves) ou **alto contraste**, com explicação clara do propósito. |
| **2. Tamanho da letra** | Ajuste do **multiplicador de fonte** com pré-visualização; valor é salvo e aplicado em todo o app. |
| **3. Boas-vindas** | Tela de entrada com **Criar conta** ou **Já tenho conta**. |
| **4. Cadastro (3 passos)** | Nome → e-mail → senha e confirmação; com **Firebase** configurado, a conta é criada na nuvem (**mesmo Auth que na web**). |
| **5. Login (2 passos)** | E-mail e senha via **Firebase**; |
| **6. App principal — Início** | Lista **“Próximas atividades”**, **progresso diário**, detalhe da tarefa, **adicionar tarefa** (fluxo guiado com data/horário). |
| **7. App principal — Agenda** | Faixa de **dias rolável** com o dia atual centralizado; lista filtrada por data; mesma linha visual da home. |
| **8. Ajustes** | Perfil resumido, **tamanho da letra** (reabre o fluxo de ajuste), **interruptor de alto contraste**, atalhos informativos (ex.: privacidade) e **Sair da conta** (volta à boas-vindas; encerra sessão no Firebase quando aplicável). |


---

## Funcionalidades e facilidades (público idoso)

- **Tipografia Lexend** e tamanhos que **escalam** com o multiplicador global, reduzindo esforço de leitura.
- **Alto contraste** persistente, com paleta dedicada (cores, bordas e componentes adaptados).
- **Botões e áreas de toque** amplas, textos diretos e hierarquia visual clara (títulos em destaque, cartões com bordas suaves).
- **Rotina visível**: progresso do dia e lista de atividades com estado concluído/pendente explícito.
- **Agenda por dia**: seleção de data em “pílulas”, data por extenso em português e lista do dia.
- **Criação de tarefa passo a passo** (título → dia/horário), com confirmação de sucesso amigável.
- **Ajustes centralizados** para alterar contraste e letra sem refazer o onboarding inteiro.

---

## Arquitetura

Organização por **features** e **camadas** dentro de `src/app/`:

```
src/app/
├── core/              # Shell (header, sidemenu) e rotas do layout
├── features/          # Módulos de negócio
│   ├── auth/          # Login, cadastro, auth-root
│   ├── dashboard/     # Dashboard, nova tarefa, serviços e tarefas
│   └── settings-wizard/  # Passo a passo de tema e fonte
├── shared/            # Componentes, guards, serviços compartilhados
├── app.config.ts      # Providers (Firebase, locale pt-BR, router)
└── app.routes.ts      # Rotas principais e lazy loading
```

- **Guards**: `authGuard` redireciona usuários não autenticados para `/autenticacao/login`.
- **Serviços**: `AuthService`, `TaskService` e formulários próximos às features de auth e dashboard.

---

## Testes

- **Framework**: [Karma](https://karma-runner.github.io/) + [Jasmine](https://jasmine.github.io/) (padrão do Angular CLI).
- **Comando**: `npm test` (alias de `ng test`); executa testes unitários em navegador headless conforme configuração do `angular.json`.

---

## Tecnologias utilizadas

| Área | Tecnologia |
|------|------------|
| Framework | [Angular](https://angular.dev/) 21 |
| UI | [Bootstrap](https://getbootstrap.com/) 5, [Angular Material](https://material.angular.io/) + CDK |
| Ícones | [Font Awesome](https://fontawesome.com/) (pacote free) |
| Backend / auth | [Firebase](https://firebase.google.com/) + [AngularFire](https://github.com/angular/angularfire) |
| Linguagem | TypeScript |
| Estilos | SCSS |

---

## Como rodar

### Pré-requisitos

- **Node.js** (versão compatível com Angular 21; recomenda-se a LTS atual).  
- **npm**

### Instalação

```bash
git clone <url-do-repositório>
cd senior-ease-web
npm ci
```

Ajuste `src/environments/environments.ts` com as credenciais do seu projeto Firebase, se for diferente do ambiente padrão do repositório.

### Desenvolvimento

```bash
npm start
```

Equivale a `ng serve` — aplicação em `http://localhost:4200/` (porta padrão do CLI).

### Outros scripts

| Script | Uso |
|--------|-----|
| `npm run build` | Build de produção (`ng build`) |
| `npm run watch` | Build em modo desenvolvimento com watch |
| `npm test` | Testes unitários (Karma/Jasmine) |

---
