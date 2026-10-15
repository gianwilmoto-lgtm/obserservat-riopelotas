# Segurança e governança

## Controles implementados

- Perfis visitante, cidadão, analista, revisor e administrador. Perfil real vem do banco; novos cadastros recebem apenas `citizen`.
- RLS em todas as tabelas da aplicação. Cidadãos não leem pedidos LAI ou relatos privados de outros usuários e não alteram o próprio papel.
- Publicação de texto restrita à função de moderação, com motivo obrigatório. View pública omite cidadão, fotografia e notas privadas. A UI pública de relatos é futura.
- Buckets `private-evidence` e `import-quarantine` privados. Políticas por proprietário e papel; nenhuma URL pública de anexo.
- Validação em API e constraints no banco. Mutação exige Origin igual ao servidor. Sem sessão, escrita é recusada.
- Fotos de até 5 MB: assinatura JPEG/PNG, decodificação com limite de 20 milhões de pixels, redimensionamento e recodificação JPEG com Sharp, removendo EXIF. Arquivos ficam em quarentena. Falha ao criar ocorrência tenta remover o upload órfão.
- CSV/PDF em quarentena: limite, formato básico, hash para duplicidade e metadados da origem. Não são executados nem exibidos inline. O importador Python valida cabeçalhos, valores, datas, duplicidade e fórmulas de planilha.
- Auditoria por triggers e funções privilegiadas com `search_path` vazio. Sem atualização de auditoria por usuários da aplicação.
- React escapa textos renderizados; nenhum HTML de usuário é inserido diretamente. Cabeçalhos `nosniff`, `DENY`, política de referência e permissões restritas.
- Sem credencial de serviço no cliente; `.env*` ignorados, exceto modelo sem valores. Nenhum segredo foi criado ou solicitado no chat.
- Sem coleta de CPF ou telefone. Não há analytics externos. Mapas acessam OpenStreetMap e informam isso ao usuário.
- Service worker armazena apenas página offline e ícones. Páginas privadas não são persistidas pelo worker.

## Limitações e requisitos antes de uso público

Este é um protótipo local, não um sistema homologado para receber dados pessoais reais.

1. Validar Supabase Auth, confirmação de e-mail, expiração/renovação de sessão, RLS remoto e armazenamento com contas de todos os papéis. Sessões são obtidas no servidor; acrescentar rotina de refresh de sessão conforme a configuração final do provedor.
2. Rate limiting distribuído, CAPTCHA onde apropriado, limites de corpo também no proxy, CSP com nonce e revisão de infraestrutura. O limite Content-Length é uma verificação preliminar; não substitui limite no ingresso para uploads chunked.
3. Antivírus/sandbox para documentos, revisão humana das imagens e processo de liberação. Verificar assinatura PDF **não comprova segurança**. Acesso direto ao Storage por usuário autenticado pode contornar a recodificação da API, portanto os objetos permanecem privados/quarentenados e nunca devem ser publicados automaticamente.
4. Definir controlador, base legal, canal para titulares, retenção, exclusão/anonimização e preservação de auditoria. As referências de cidadãos impedem exclusão automática quando há registros; implementar política legal explícita, sem apagar em cascata silenciosamente.
5. Backups, restauração testada, logs sanitizados, monitoramento, limites por usuário, resposta a incidentes e moderação com recurso. Limpeza periódica de uploads órfãos e proteção contra reenvio precisam de processo operacional.
6. Revisão de acessibilidade com tecnologias assistivas e testes independentes de segurança. Testes automatizados não equivalem a pentest.
7. Publicação somente com autorização. Não há integração de IA; qualquer análise futura deve indicar incerteza e nunca acusar irregularidade como fato.

## Matriz resumida

| Ação                                       | Visitante | Cidadão | Analista | Revisor | Admin |
| ------------------------------------------ | --------- | ------- | -------- | ------- | ----- |
| Dados oficiais verificados / demonstração  | Sim       | Sim     | Sim      | Sim     | Sim   |
| Registros privados próprios                | Não       | Sim     | Sim      | Sim     | Sim   |
| Ler LAI de outros                          | Não       | Não     | Não      | Não     | Não   |
| Enviar arquivo de importação               | Não       | Não     | Sim      | Sim     | Sim   |
| Inserir registros oficiais não verificados | Não       | Não     | Sim      | Não     | Sim   |
| Moderar relatos / verificar dados          | Não       | Não     | Não      | Sim     | Sim   |
| Ler auditorias                             | Não       | Não     | Não      | Não     | Sim   |
| Conceder papéis via interface              | Não       | Não     | Não      | Não     | Não   |

Administrador da aplicação não é superusuário do banco. Promoção de papéis exige operador de banco autorizado.
