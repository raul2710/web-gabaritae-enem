# Graphify — setup neste projeto

## Data e ambiente

- **Data da instalação:** 2026-11-13
- **SO:** Windows (win32), PowerShell 5.1.26100.9818
- **Projeto:** `J:\Projetos\WebProjects\web-gabaritae-enem` (Next.js 16.4.6, commit base `47748149`)
- **Python:** 3.14.6 (usado para instalar o pacote)
- **Graphify:** `graphify 0.9.108` (pacote PyPI `graphifyy` — dois "y"; o comando é `graphify`)

> `uv` e `pipx` não existiam nesta máquina, então a instalação foi feita com
> `python -m pip install --user graphifyy` (o pacote já estava presente no
> site-packages do Python 3.14.6 — `Requirement already satisfied ... (0.9.108)`).
> O binário `graphify` já estava acessível na sessão: `graphify --version` → `graphify 0.9.108`.

## O que é o Graphify

Graphify monta um **grafo de conhecimento do codebase** usando **tree-sitter** (extração
local por AST), sem gastar LLM para analisar código. O resultado vira
`graphify-out/graph.json` (nós = símbolos/arquivos, arestas = imports/relações,
comunidades = clusters temáticos) mais um relatório `GRAPH_REPORT.md` e um visualizador
`graph.html`. No dia a dia, em vez de `grep` cego, pergunta-se ao grafo:
`graphify query "..."`, `graphify path "A" "B"`, `graphify explain "X"` — que devolvem
subgrafos pequenos e focados. O grafo é um retrato do momento: depois de mudar código,
roda-se `graphify update .` (novamente sem custo de API).

## Comandos executados (ordem) e resultados

| #   | Comando                                                 | Resultado                                                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `uv --version`                                          | falhou — `uv` não reconhecido                                                                                                                                                                                                                                             |
| 2   | `pipx --version`                                        | falhou — `pipx` não reconhecido                                                                                                                                                                                                                                           |
| 3   | `python --version`                                      | `Python 3.14.6`                                                                                                                                                                                                                                                           |
| 4   | `python -m pip install --user graphifyy`                | `Requirement already satisfied: graphifyy ... (0.9.108)` + deps (networkx, tree-sitter, etc.)                                                                                                                                                                             |
| 5   | `graphify --version`                                    | `graphify 0.9.108`                                                                                                                                                                                                                                                        |
| 6   | `graphify opencode install --project` (raiz do projeto) | criou skill, seção no AGENTS.md e plugin (ver abaixo). Não pediu interação; não criou entrada em opencode.json                                                                                                                                                            |
| 7   | `graphify update .`                                     | **391 nós, 972 arestas, 16 comunidades** em **~6,1 s** (6146 ms); 65 arquivos extraídos via AST (cache 0%), 3 arquivos de teste sem símbolos, 6 arquivos não classificados (`.env.example`, `.gitignore`, `.prettierignore`, `.prettierrc`, `favicon.ico`, `globals.css`) |
| 8   | `graphify god-nodes --top 5`                            | 1. `next` (36 edges), 2. `getSession()` (21), 3. `react` (20), 4. `DashboardClient()` (20), 5. `Question` (19)                                                                                                                                                            |
| 9   | `graphify query "onde o simulado calcula a nota"`       | exit **0** em **~1,6 s** (1571 ms); BFS depth=2, seed `simulados/page.tsx`, 44 nós / 105 arestas (~5143 tokens acima do budget de 2000 — resposta completa, não truncada)                                                                                                 |
| 10  | `npm run typecheck`                                     | **PASS** (`tsc --noEmit`, exit 0)                                                                                                                                                                                                                                         |
| 11  | `npm run lint`                                          | **PASS** (`eslint`, exit 0, 0 errors / 0 warnings)                                                                                                                                                                                                                        |
| 12  | `npm test`                                              | **PASS** (`vitest run` — 5 arquivos, **30/30 testes**, exit 0)                                                                                                                                                                                                            |

**Desvio:** o passo pedido era `graphify status`, mas esse subcomando não existe na
versão 0.9.108 (`error: unknown command 'status'` — `graphify --help` não lista `status`).
A validação foi feita com `graphify god-nodes`, inspeção dos artefatos em `graphify-out/`
e a query de teste real — todos OK.

## Arquivos criados e alterados

### Criados (pelo installer + construção do grafo)

| Caminho                                                                                          | O que é                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`                                                                                      | Instruções do projeto; seção `## graphify` com as regras de uso do grafo                                                                                 |
| `.opencode/plugins/graphify.js`                                                                  | Plugin `tool.execute.before` do opencode: lembra o agente de consultar o grafo no 1º bash da sessão e pedir rebuild após mudanças                        |
| `.opencode/skills/graphify/SKILL.md`                                                             | Skill `/graphify` do opencode                                                                                                                            |
| `.opencode/skills/graphify/references/*.md`                                                      | 8 referências da skill (`query.md`, `update.md`, `hooks.md`, `exports.md`, `add-watch.md`, `extraction-spec.md`, `github-and-merge.md`, `transcribe.md`) |
| `.opencode/skills/graphify/.graphify_version`                                                    | Versão da skill instalada (`0.9.108`)                                                                                                                    |
| `graphify-out/graph.json`                                                                        | O grafo (391 nós, 972 arestas, 16 comunidades)                                                                                                           |
| `graphify-out/GRAPH_REPORT.md`                                                                   | Relatório legível: hubs, god nodes, frescor do grafo                                                                                                     |
| `graphify-out/graph.html`                                                                        | Visualizador interativo (~392 KB)                                                                                                                        |
| `graphify-out/manifest.json` + `.graphify_build_state.json` + `.graphify_labels.json` + `cache/` | Estado incremental do build (para `update` rápido)                                                                                                       |
| `docs/graphify-setup.md`                                                                         | Este relatório                                                                                                                                           |

### Alterados

| Caminho                                                  | Mudança                                                                                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `.gitignore`                                             | Adicionado bloco `# graphify` com `graphify-out/` (o installer **não** adicionou; entrada única)                              |
| `eslint.config.mjs`                                      | Adicionado `.opencode/**` a `globalIgnores` — o plugin gerado produzia 1 warning `import/no-anonymous-default-export` no lint |
| `C:\Users\rault\.config\opencode\agents\orchestrator.md` | +5 regras `graphify ...*: allow` em `permission.bash` (logo após `"git show*": allow`)                                        |
| `C:\Users\rault\.config\opencode\agents\analyst.md`      | Mesmas +5 regras em `permission.bash`                                                                                         |

Nada foi commitado (conforme instrução). Obs.: o `git status` já trazia modificações
pré-existentes em `src/**` e `package-lock.json` — não tocadas por este setup.

## Matriz de permissões graphify por agente

| Agente                    | `query` / `path` / `explain` / `affected` / `god-nodes` (leitura) |  `extract` / `update` / `install` / `hook` / `label` (escrita)  |
| ------------------------- | :---------------------------------------------------------------: | :-------------------------------------------------------------: |
| **orchestrator** (global) |                     ✅ allow (5 linhas novas)                     |    ❌ deny (`"*": deny` e nenhuma regra para esses comandos)    |
| **analyst** (global)      |                     ✅ allow (5 linhas novas)                     |                         ❌ deny (idem)                          |
| **implementer** (global)  |   ✅ allow (`"*": allow`, só `git commit*`/`git push*` negados)   | ✅ allow (pode rodar `graphify update .`, `hook install`, etc.) |

Validação do YAML: os frontmatter de `orchestrator.md` e `analyst.md` foram parseados com
PyYAML após a edição — **válidos**, com `edit: deny` intacto e o corpo dos arquivos
inalterado.

## Como usar no dia a dia

1. **Reinicie o opencode** (obrigatório) para carregar o plugin, a skill e o AGENTS.md.
2. `/graphify .` — abre a skill no assistente (guia o uso do grafo).
3. Consultas ao grafo (funcionam em qualquer terminal, sem o opencode):
   - `graphify query "onde o simulado calcula a nota"`
   - `graphify path "QuizSession.tsx" "auth.ts"`
   - `graphify explain "getSession()"`
   - `graphify affected "auth.ts"` (o que é impactado por X)
   - `graphify god-nodes --top 10`
4. `graphify update .` — reconstrói o grafo após mudanças de código (AST local, sem API key).
5. `graphify hook install` — instala hooks git (post-commit/post-checkout/post-merge)
   que atualizam o grafo sozinhos. **Não foi instalado** nesta setup (opcional).
6. `graphify-out/graph.html` — abre no navegador para explorar o grafo visualmente.

## Pegadinhas / caveats

- **Reiniciar o opencode é obrigatório** após o install: plugin, skill e seção do
  AGENTS.md só passam a valer em sessões novas.
- **Caveat — carregamento do plugin:** após reiniciar o opencode, se o lembrete
  `[graphify]` não aparecer no primeiro comando bash da sessão, o plugin
  `.opencode/plugins/graphify.js` pode não ter carregado (o arquivo declara
  `server()` para OpenCode 1 e `setup()` para OpenCode 2). Para diagnosticar,
  inicie o opencode com log de debug e confira se o plugin foi carregado.
- A skill só é escrita com **`--project`** (`graphify opencode install --project`);
  sem o flag, o comportamento muda conforme a plataforma.
- **Nunca rode `graphify install` puro** aqui: ele instala para Claude Code em `~/.claude/`.
  (Verificado após o install: `C:\Users\rault\.claude` existe mas **não há resíduo
  graphify** — busca por `*graphify*` não achou nada; `~/.claude\plugins\` só tem
  `marketplaces/`, `blocklist.json`, `known_marketplaces.json`. Nada foi apagado.)
- `graphify-out/` está no `.gitignore` (entrada única), então o grafo não vai para o
  repositório — cada dev constrói o seu localmente.
- O **plugin só lembra o agente no primeiro bash da sessão**; e orchestrator/analyst
  agora têm apenas comandos **read-only** de graphify — quem precisa rodar
  `graphify update .` é o implementer (ou o usuário direto no terminal).
- O grafo é um **retrato do momento**: rode `graphify update .` após mudanças
  relevantes ou use `graphify hook install` para automatizar.
- `graphify status` **não existe** em 0.9.108 — para inspecionar o estado, use
  `graphify god-nodes` e os artefatos em `graphify-out/`.
- Extração sem API key é 100% AST (`EXTRACTED`); `--mode deep`/`extract` com backend
  LLM consomem chave de API — não usados aqui.
- 3 arquivos de teste (`questions.test.ts`, `simulator.test.ts`, `google-auth.test.ts`)
  renderizaram 0 símbolos (normal para testes) e 6 arquivos sem extensão de código
  foram pulados — ambos não afetam a utilidade do grafo.

## Verificação rápida

Checklist para confirmar que a instalação está funcionando:

- [ ] `graphify --version` → `graphify 0.9.108`
- [ ] `graphify god-nodes --top 5` → lista os 5 nós de maior grau (ex.: `next`, `getSession()`)
- [ ] `graphify query "onde o simulado calcula a nota"` → exit 0, retorna subgrafo focado
- [ ] Abrir `graphify-out/graph.html` no navegador → visualizador carrega com 391 nós / 972 arestas
- [ ] `.opencode/plugins/graphify.js` e `.opencode/skills/graphify/SKILL.md` existem
- [ ] `graphify-out/` aparece em `.gitignore`

## Como desfazer

```powershell
# 1) Remove a integração do opencode no projeto (AGENTS.md section + plugin + skill)
graphify opencode uninstall

# 2) (opcional) desinstala o CLI
python -m pip uninstall -y graphifyy   # foi instalado via pip --user (uv/pipx ausentes)
# se tivesse sido uv:  uv tool uninstall graphifyy

# 3) Reverte o .gitignore: apague as linhas
#      # graphify
#      graphify-out/
#    (e, se desejar, delete a pasta graphify-out/ manualmente)

# 4) Reverte os agentes globais: remova as 5 linhas "graphify ...": allow de
#    C:\Users\rault\.config\opencode\agents\orchestrator.md
#    C:\Users\rault\.config\opencode\agents\analyst.md

# 5) (opcional) revert eslint.config.mjs removendo ".opencode/**" dos globalIgnores
```

Obs.: `graphify uninstall --purge` apagaria `graphify-out/` junto — prefira
`graphify opencode uninstall` e apague a pasta manualmente se quiser manter controle.

## Próximos passos sugeridos

- Se o resultado agradar, rodar **`graphify hook install`** para o grafo se atualizar
  sozinho em commit/checkout/merge.
- Experimentar `graphify query` em perguntas reais de arquitetura (ex.: caminho de
  autenticação `auth.ts` → rotas `/api/auth/*`) para calibrar o valor antes de
  escalar o uso.
- **Reavaliar a utilidade quando o repo crescer** — com ~65 arquivos o ganho sobre grep
  ainda é modesto; o grafo tende a compensar mais em codebases maiores ou quando
  novos contribuidores entram no projeto.
- Considerar `graphify export wiki` se quiser navegação em Markdown por comunidade.
