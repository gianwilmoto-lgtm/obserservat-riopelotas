# Roteiro de evolução

## Entregue nesta primeira implementação

Auditoria do checkout; arquitetura de dez módulos; protótipo Next.js/Tailwind responsivo; dashboard e filtros demonstrativos; detalhe de obra com mapa; manifesto e fallback offline; fluxos e rotas de conta, ocorrência, revisão e LAI; migrações PostgreSQL/RLS; quarentena privada; coletor manual CSV/PDF e testes locais.

## Próxima etapa: persistência homologada

- Configurar Supabase dedicado com autorização do responsável, aplicar migrações e verificar todos os papéis com contas de teste.
- Validar confirmação de e-mail, recuperação de senha, refresh de sessão, logout e revogação.
- Executar upload de foto, erro/limpeza, isolamento de anexos, revisão e acompanhamento LAI remoto.
- Definir política LGPD e canal de atendimento antes de usar dados pessoais.

## Integração real

- Liberar somente hosts necessários; confirmar fontes e documentação.
- Implementar primeiro adaptador com amostra oficial pequena, rastreabilidade, testes de totais e idempotência.
- Concluir normalização relacional e promoção após revisão; ligar UI aos dados oficiais.
- Exibir documentos originais, fontes e datas reais; adicionar paginação e índices conforme volume.

## Participação e operação

- Lista pública de relatos revisados com anonimização, recurso e versões de moderação.
- Revisão de fotos, antivírus de PDFs, limites de requisição e limpeza de órfãos.
- Anexos e respostas LAI; lembretes sem sugerir que cadastro local vale como protocolo legal.
- Filas e agendamento, logs sanitizados, backups e restauração.
- Auditoria de acessibilidade, CSP e testes independentes de segurança.

## Expansão

Saúde, educação, funcionalismo, meio ambiente e análises avançadas entram por módulos, com metodologias próprias. Adicionar autorização com escopo por município antes de equipes multitenant. Qualquer IA apresenta hipóteses explicáveis, nunca prova de irregularidade.

**Deploy, domínio, serviços pagos e publicação pública exigem autorização específica.**
