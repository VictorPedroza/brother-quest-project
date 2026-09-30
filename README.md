# BrotherQuest

BrotherQuest é uma aplicação de gamificação para transformar rotinas e hábitos diários em uma experiência mais engajante, motivadora e visível para equipes ou grupos que querem manter o foco em objetivos simples e recorrentes.

A ideia central é fazer com que pequenas ações do dia a dia ganhem status de missão, evolução e recompensa. Em vez de uma lista estática de tarefas, o usuário entra em um ambiente parecido com um jogo: escolhe seu perfil, conclui atividades, acumula XP, mantém streaks, coleta Gold e troca esse saldo por prêmios.

---

## Motivação do projeto

Muitas pessoas se beneficiam mais quando a rotina deixa de ser apenas um checklist e passa a ter progressão, contexto e reconhecimento. O BrotherQuest nasceu para criar esse senso de evolução em uma experiência simples e acessível.

Ele foi pensado para:

- incentivar consistência em pequenas ações diárias;
- transformar desafios comuns em objetivos com progresso visual;
- dar sensação de conquista através de níveis, XP e recompensas;
- permitir que um administrador acompanhe a evolução do grupo;
- manter a experiência leve, visualmente amigável e fácil de usar.

Em outras palavras, o projeto combina produtividade, engajamento e diversão em uma mesma interface.

---

## O que a aplicação faz

### 1. Seleção de perfil

Ao entrar, o usuário escolhe um perfil entre os jogadores disponíveis. A autenticação acontece com e-mail e senha do usuário, e a interface faz a transição para a dashboard do jogador.

### 2. Dashboard de progresso

A dashboard exibe:

- nível atual;
- XP total;
- progresso para o próximo nível;
- streak atual;
- moedas acumuladas (Gold);
- atividades disponíveis para conclusão.

Cada missão concluída pode gerar progresso e reforçar o hábito de execução contínua.

### 3. Sistema de missões

As atividades funcionam como tarefas do dia a dia transformadas em desafios. Ao concluir uma ação, o usuário ganha recompensa em XP e Gold, além de fortalecer sua sequência de dias consecutivos.

### 4. Loja de recompensas

A página de prêmios permite que o jogador troque Gold por itens ou benefícios disponíveis. Isso cria um ciclo claro de engajamento:

- conclui missão;
- acumula Gold;
- resgata recompensa;
- continua evoluindo.

### 5. Painel administrativo

O administrador visualiza:

- quantidade de jogadores ativos;
- XP médio do grupo;
- maior nível alcançado;
- resgates em andamento e aprovados.

Esse painel ajuda a acompanhar a motivação e o desempenho coletivo sem expor a experiência interna do usuário.

---

## Fluxo principal da aplicação

1. Usuário acessa a tela inicial e escolhe seu perfil.
2. Realiza login com credenciais do jogador.
3. A dashboard apresenta suas metas, progresso e streak.
4. O jogador conclui atividades diárias.
5. O sistema atualiza XP, Gold e nível.
6. O jogador pode resgatar recompensas na loja.
7. O administrador revisa resgates e acompanha evolução geral.

---

## Tecnologias utilizadas

- HTML5 para estrutura das páginas;
- CSS para a identidade visual e layouts;
- JavaScript moderno para interações e lógica de interface;
- Supabase para autenticação, armazenamento de dados e regras de negócio;
- arquitetura em módulos com serviços e UI separados para facilitar manutenção.

---

## Estrutura do projeto

As páginas HTML ficam na raiz porque são pontos de entrada servidos diretamente pelo hosting estático. Cada página carrega a folha de estilos compartilhada e seu próprio módulo JavaScript.

```text
.
├── index.html
├── dashboard.html
├── rewards.html
├── admin-login.html
├── admin.html
├── css/
│   ├── main.css
│   ├── base/
│   ├── components/
│   ├── layout/
│   ├── pages/
│   └── utils/
└── js/
	├── app.js
	├── dashboard.js
	├── rewards.js
	├── admin-login.js
	├── admin.js
	├── service/
	├── supabase/
	├── ui/
	└── utils/
```

Responsabilidades principais:

- `css/main.css`: ponto único de entrada dos estilos, importando os arquivos de cada categoria;
- `css/base/`: reset e variáveis globais;
- `css/components/`: estilos de componentes reutilizáveis;
- `css/layout/`: estruturas compartilhadas entre páginas;
- `css/pages/`: estilos específicos de cada página;
- `css/utils/`: animações e utilitários visuais;
- `js/`: módulos de entrada associados às páginas;
- `js/service/`: acesso e operações de negócio para autenticação, perfis, atividades e recompensas;
- `js/ui/`: atualização e renderização da interface;
- `js/supabase/`: configuração e integração com o Supabase;
- `js/utils/`: funções auxiliares reutilizáveis.

### Convenções para novas páginas e módulos

- Manter as páginas HTML na raiz e usar `lang="pt-BR"`, metadados de codificação e viewport, título e referências de assets dentro de `<head>`.
- Compartilhar `/css/main.css`; adicionar estilos específicos em `css/pages/` e registrá-los em `css/main.css`.
- Usar um módulo de entrada em `js/` por página e manter lógica reutilizável em `service/`, `ui/` ou `utils/` conforme a responsabilidade.
- Usar `<script type="module">` para os módulos de página e caminhos absolutos iniciados em `/` para os assets, como nas páginas atuais.
- Preservar os nomes e caminhos públicos das páginas para manter compatibilidade com os links e o hosting estático.

---

## Configuração com Supabase

Este projeto depende do Supabase para autenticação, perfis, atividades, resgates e permissões.

A conexão é configurada em:

- `js/supabase/supabaseClient.js`

Você deve inserir a URL e a chave pública do seu projeto Supabase no arquivo correspondente antes de testar a aplicação.

### Acesso administrativo

O login administrativo fica em `/admin-login.html` e o painel em `/admin.html`.

Para permitir acesso ao administrador, a linha do usuário na tabela `profiles` deve estar relacionada ao usuário autenticado e conter `role = "admin"`.

Também é possível considerar `role` em `app_metadata` ou `user_metadata` como fallback.

> Importante: as tabelas e funções do projeto devem estar protegidas por políticas RLS adequadas.

---

## Objetivo final

BrotherQuest foi criado para transformar rotinas em progresso visível. O projeto une simplicidade de uso, feedback instantâneo e incentivo contínuo em uma experiência que funciona tanto como ferramenta de engajamento pessoal quanto como sistema de acompanhamento de grupo.

Seja para motivar hábitos, recompensar disciplina ou manter uma equipe engajada, a proposta principal da aplicação é tornar o progresso tangível e ainda mais agradável.

---

## Licença

Este projeto foi desenvolvido como aplicação interna e de estudo, sem uma licença pública específica definida até o momento.
