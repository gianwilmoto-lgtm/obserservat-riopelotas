# Fontes públicas e evidências

Investigação inicial em **15/10/2026**. Foram feitas requisições HTTPS simples, sem autenticação, sem scraping recursivo e sem contornar bloqueios. Todas as URLs abaixo retornaram **`Tunnel connection failed: 403 Forbidden` no proxy do ambiente**. Isso indica bloqueio da política local; não prova indisponibilidade dos portais.

| Fonte / URL consultada                                                    | Formato e campos confirmados                                 | Periodicidade       | Limitação e método planejado                                                                                             |
| ------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Prefeitura: https://www.pelotas.com.br                                    | Não confirmados                                              | Não confirmada      | Página de entrada para localizar links oficiais de transparência, licitações e contratos quando liberada                 |
| Endereço candidato de transparência: https://transparencia.pelotas.com.br | Não confirmados; endereço ainda não validado pela Prefeitura | Não confirmada      | Candidato de descoberta, **não endpoint confirmado**; verificar link no portal municipal antes de utilizar               |
| PNCP: https://pncp.gov.br                                                 | Não confirmados nesta sessão                                 | Não confirmada      | Consultar documentação oficial, selecionar município e testar paginação antes de criar adaptador                         |
| Manuais PNCP: https://www.gov.br/pncp/pt-br/acesso-a-informacao/manuais   | Não acessíveis nesta sessão                                  | Conforme publicação | Verificar URL e contrato da API a partir da documentação; nenhum endpoint de API foi inventado                           |
| TCE-RS: https://www.tce.rs.gov.br                                         | Não confirmados                                              | Não confirmada      | Localizar exportações oficiais documentadas; não afirmar que um dataset está disponível sem consulta                     |
| Diário Municipal/FAMURS: https://www.diariomunicipal.com.br/famurs/       | Não confirmados                                              | Não confirmada      | Verificar cobertura de Pelotas e formatos; registro manual de PDF com URL e hash enquanto não houver exportação validada |

Nenhuma integração oficial funcionou ou foi alegada como funcional. O rascunho de rede deve permitir os hosts acima para que a pesquisa prossiga; salvar um rascunho não altera a rede da sessão automaticamente. Caso um portal redirecione para outro host, revisar o destino específico antes de solicitar adição.

## Alternativa disponível

- CSV manual com esquema explícito no README; processamento local validado por testes.
- PDF manual em quarentena, apenas reconhecimento de assinatura e hash. Extração/OCR e antivírus não implementados.
- Upload autenticado para quarentena Supabase implementado, mas teste externo depende de configuração.
- Metadados: URL de origem, data de coleta, SHA-256, formato, identificador externo e estado de revisão.
- `data/contracts-demo.csv` é uma amostra **fictícia**, não uma exportação municipal. A importação testada produziu 2 registros em revisão.

## Critérios para uma primeira integração real

1. Confirmar links e documentação no órgão, campos, licença/reutilização e atualização.
2. Obter uma amostra pequena sem coleta agressiva, preservando documento original.
3. Mapear órgão, município, fornecedor, contrato, valores e datas; conferir totais com a origem.
4. Testar identificadores, duplicidade e reexecução; não usar só o nome de empresa como chave.
5. Implementar importação transacional para staging e revisão, sem promover automaticamente para `verified=true`.
6. Exibir URL/documento original e data em cada registro real; manter os dados fictícios separados.
