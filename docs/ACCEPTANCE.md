# Aceite antes de usar persistência externa

Ainda pendente de Supabase dedicado. Usar apenas dados fictícios nos testes.

1. Aplicar as duas migrações em banco novo. Confirmar RLS e buckets privados.
2. Criar duas contas cidadãs e uma de cada papel. Verificar confirmação de e-mail, login, expiração, renovação e logout.
3. Cidadão A registra ocorrência com JPEG real; verificar recodificação/remoção EXIF, status pending e armazenamento privado. B não pode ler ocorrência nem foto.
4. Tentar enviar SVG/HTML disfarçado, arquivo acima do limite e imagem com dimensões excessivas. Nenhum arquivo deve ficar publicamente acessível.
5. Analista não pode moderar nem promover seu papel. Revisor pode publicar/rejeitar texto com justificativa. Verificar que view pública omite autor e foto.
6. Criar LAI, tentar leitura/alteração por outra conta e confirmar bloqueio. Registrar protocolo externo e estado. Cadastro local não inicia prazo legal.
7. Enviar CSV/PDF para quarentena com papel autorizado. Visitante/cidadão devem receber erro. Confirmar duplicidade por hash e ausência de publicação automática.
8. Verificar logs de auditoria e impossibilidade de sua edição pelos usuários.
9. Exercitar falhas de upload, banco e rede. Garantir limpeza ou identificação de arquivos órfãos.
10. Realizar aceite legal, operacional, acessibilidade e segurança antes de qualquer publicação.
