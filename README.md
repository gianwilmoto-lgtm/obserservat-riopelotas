# Observatório Municipal de Pelotas

Protótipo independente para entender despesas, contratos e obras e organizar a participação cidadã. **Não é um serviço da Prefeitura. Os dados da interface são fictícios.** Não há publicação ou contratação de serviços neste projeto.

## Para abrir no seu computador

1. Instale Node.js 22 ou superior (validado com 24.19) e Python 3.12 ou superior.
2. Abra um terminal na pasta deste projeto.
3. Execute `npm ci` para instalar as dependências do arquivo de versões.
4. Execute `npm run dev` e abra o endereço local informado no terminal.
5. Para parar, pressione Ctrl+C. Não é preciso criar uma conta para explorar o dashboard.

O menu permite consultar obras e contratos, filtrar por bairro e assunto, abrir detalhes e experimentar os formulários. **Sem Supabase, os formulários apenas validam o preenchimento: nada é salvo ou enviado.** Não use dados pessoais reais nos testes.

No ambiente Codex, o checkout fica em `/workspace/obserservat-riopelotas`. Se o cache padrão não for gravável, instale com `npm ci --cache /workspace/.npm-cache`. Use o checkout existente; cada tarefa já é isolada e não precisa de Git worktree.

## Instalação como aplicativo

O protótipo tem manifesto, ícones e service worker. Em navegador compatível, use a opção “Instalar aplicativo” ou “Adicionar à tela inicial”. A instalação depende das regras do navegador e exige HTTPS fora da máquina local. Offline, uma página explica a ausência de conexão. Não há cache de páginas privadas, relatos, credenciais ou documentos.

## Contas e banco reais — configuração externa necessária

Use **um projeto Supabase exclusivo do Observatório**, sem reutilizar serviços Wilmotos. Nenhum projeto externo foi criado automaticamente.

1. No SQL Editor do projeto dedicado, execute, na ordem, `supabase/migrations/001_core.sql` e `002_storage.sql`. São migrações iniciais, transacionais, para um banco novo; não reaplique em um banco já migrado.
2. Copie `.env.example` para `.env.local` e configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com a URL e chave pública/anon do projeto. Nunca use `service_role` no navegador ou nestas variáveis. Não envie chaves no chat nem faça commit de `.env.local`.
3. Reinicie o servidor. Cadastre-se em Minha conta, confirme o e-mail se solicitado pelo Supabase e entre. Configure URLs de autenticação e confirmação do projeto de acordo com seu ambiente local.
4. Somente um operador de banco autorizado pode promover um cidadão para `analyst`, `reviewer` ou `admin`: `update public.citizens set role='reviewer' where id='<UUID da conta>';`. Nunca conceda acesso administrativo a partir de metadados controlados pelo usuário.
5. Faça os testes reais listados em `docs/ACCEPTANCE.md` antes de receber dados pessoais. E-mail, sessão, armazenamento e RLS no serviço Supabase ainda não foram testados neste ambiente.

O painel público continua usando a base demonstrativa mesmo com Supabase configurado. A promoção de dados importados para as tabelas oficiais e a substituição da fonte de leitura pública são próximas etapas, deliberadamente separadas da quarentena de arquivos.

## Importação manual, sem rede

O coletor Python usa apenas a biblioteca padrão. Recebe CSV UTF-8 com cabeçalho `external_id,object,agency,company,amount,signed_at`, valores decimais com ponto e datas `AAAA-MM-DD`.

```sh
python3 scripts/import_public.py data/contracts-demo.csv \
  --source-url https://example.org/observatorio-demo \
  --collected-at 2026-10-15 --demo \
  --output data/imports/demo.json
```

`example.org` identifica apenas o exemplo; não é uma fonte municipal. Para dados reais, use a URL oficial de onde o arquivo foi obtido e remova `--demo`. Isso **não** torna o arquivo verificado: todos os registros ficam `verified: false`, aguardando revisão. O comando recusa sobrescrever a saída; use um novo nome para cada execução. Identificadores são estáveis por URL da fonte + identificador externo. PDFs são registrados por hash para extração manual, sem executar conteúdo ou OCR automático.

Administradores, analistas e revisores podem enviar CSV/PDF para armazenamento privado pela tela Administração quando Supabase estiver configurado. Este envio não equivale a importar registros relacionais nem publicar dados. Consulte `DATA_SOURCES.md`.

## Comandos de validação

```sh
npm run typecheck
npm test
npm run test:python
npm run build
npm run test:e2e
npm start
```

Os testes de navegador usam Chromium em `/usr/bin/chromium`. Em outra máquina, informe `PLAYWRIGHT_CHROMIUM_EXECUTABLE` com o caminho do Chromium instalado. O Playwright inicia o servidor local automaticamente se necessário. Os testes E2E pressupõem modo demonstrativo, sem variáveis Supabase.

## Organização

- `app/`: páginas e rotas HTTP Next.js.
- `components/`: interface reutilizável, mapas e formulários.
- `lib/`: dados demonstrativos, validação e cliente Supabase com sessão do usuário.
- `supabase/migrations/`: modelo relacional, políticas de acesso e buckets privados.
- `scripts/`: coleta/importação Python, preparada para execução agendada por processo externo.
- `tests/`: regras de domínio, PostgreSQL embarcado, importação e navegador.
- `docs/`: auditoria, critérios de aceite e relatório de implementação.

Consulte `ARCHITECTURE.md`, `SECURITY.md` e `ROADMAP.md`. O estado efetivamente verificado está em `docs/IMPLEMENTATION_REPORT.md`.
