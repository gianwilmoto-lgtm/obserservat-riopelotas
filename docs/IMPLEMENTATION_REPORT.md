# Relatório de implementação — 15/10/2026

## Resultado

Protótipo local do Observatório criado no repositório independente existente. Nenhum projeto Wilmotos foi alterado. Nenhum serviço externo foi criado, contratado ou publicado. Arquivos de implementação permanecem no checkout local, sem push.

## Etapas e próximos passos

| Etapa | Feito e funcionando | Testado | Dependência / próximo passo |
|---|---|---|---|
| A — Auditoria | Checkout, ferramentas, recursos, rede e presença de variáveis examinados; cache npm corrigido | Node/npm/Python, instalação e acesso ao registro de pacotes | Portais oficiais bloqueados pela política de rede |
| B — Arquitetura | Dez módulos planejados; núcleo Next.js; modelo normalizado; fontes, documentos, cidadãos e auditoria | Migrações executadas em PostgreSQL embarcado com schemas Auth/Storage simulados | Aplicar e homologar em Supabase dedicado; multi-município exige escopo de papéis futuro |
| C — Protótipo | Início, dashboard, obras, contratos, filtros, detalhe, gráfico, mapa com fallback, conta, participação, LAI e área restrita | Navegação desktop/mobile, filtros/estado vazio, formulários, página inexistente e offline em Chromium | Tiles externos não foram confirmados; instalação nativa em aparelhos ainda não testada |
| D — Persistência | Rotas Supabase, cadastro/login/logout, ocorrências com foto, revisão, acompanhamento LAI, RLS, auditoria e buckets privados implementados | Isolamento entre cidadãos, bloqueio de autopromoção, moderação, armazenamento por proprietário e integridade no PostgreSQL embarcado; APIs sem sessão e cross-origin no servidor real | **Parcial:** fluxo autenticado completo, e-mail e uploads no serviço real aguardam URL/chave pública e banco dedicado |
| E — Integração | Coletor manual CSV, metadados/hash de PDF, quarentena autenticada e inventário de fontes | CLI processou 2 registros fictícios; testes de duplicidade, formato, data, valores e fórmulas | **Bloqueada externamente:** nenhum portal oficial acessível. Adaptador remoto e promoção para tabelas oficiais ainda não implementados |
| F — Testes | Suítes locais e checklist de aceite externo | TypeScript, build, testes de domínio/banco/Python/navegador | Homologação remota, acessibilidade assistiva e revisão de segurança antes de produção |

## Evidências locais

- `npm ci --cache /workspace/.npm-cache`: instalação reproduzida pelo lockfile.
- `npm run typecheck`: passou.
- `npm test`: **6 testes passaram**, incluindo a migração SQL e verificações de RLS, deduplicação e integridade referencial. O teste de banco tem várias asserções e usa PGlite; **não** equivale a validação do serviço Supabase.
- `npm run test:python`: **7 testes passaram**.
- `npm run build`: build de produção concluído.
- `npm run test:e2e`: **7 testes passaram em Chromium**. Comprovaram navegação, filtros, totais demonstrativos, detalhe/404, formulários sem falsa persistência, recusa de chamadas não autenticadas/cross-origin, manifesto e fallback offline.
- `npm audit --omit=dev`: nenhuma vulnerabilidade conhecida reportada no momento da execução; isso não constitui auditoria completa de segurança.
- Importação CLI de `data/contracts-demo.csv`: **2 registros fictícios**, `verified=false`, identificadores estáveis e SHA-256; nenhum registro oficial publicado.
- Captura móvel de 390 pixels inspecionada: página sem transbordamento horizontal global; navegação horizontal acessível.

## Correções durante os testes

A verificação de origem inicialmente recusava chamadas locais legítimas devido à normalização do host pelo Next.js. Foi corrigida para comparar a origem com o Host recebido e protocolo, e o teste confirmou tanto a rejeição cross-origin quanto a resposta de autenticação esperada no mesmo host. Seletores de teste de filtros foram ajustados para seus papéis acessíveis. O teste adicional de leitura anônima limpa o identificador JWT simulado ao trocar de papel, reproduzindo corretamente uma sessão sem usuário.

## Limites claros

- Toda obra, empresa e valor exibidos no painel público são fictícios, inclusive quando Supabase estiver configurado.
- Demonstração não salva formulários. Conta e persistência reais ficam desabilitadas sem configuração.
- Cadastro de LAI não é envio ao órgão e não inicia prazo legal.
- Arquivos importados ficam em revisão; não há extração automática confiável de PDF, antivírus ou publicação automática.
- Modelo PWA tem manifesto e fallback offline. Não promete sincronização de envio nem armazena informações privadas offline.
- Nenhuma fonte oficial real foi importada ou validada.
- `SECURITY.md` documenta controles e pendências de produção, incluindo limites de ingresso, rate limiting, refresh de sessão, varredura de documentos e governança LGPD.

## Continuidade

Primeiro configurar um projeto Supabase exclusivo e executar `docs/ACCEPTANCE.md`. Em paralelo, revisar os domínios de rede necessários e retomar a pesquisa em `DATA_SOURCES.md`. Em seguida, implementar o primeiro adaptador oficial com uma amostra pequena e validação humana. Publicação pública permanece condicionada à autorização do responsável.
