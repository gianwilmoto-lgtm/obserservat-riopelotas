# Publicação da demonstração existente

Não recriar o projeto. Usar o repositório `gianwilmoto-lgtm/obserservat-riopelotas` e sua aplicação Next.js completa. `netlify.toml` fornece o build e diretório de saída. A hospedagem precisa executar Next.js com rotas de servidor: não publicar somente `public/`, não usar exportação estática nem GitHub Pages.

## Caminho recomendado: Netlify, plano gratuito quando disponível

O plano e limites vigentes devem ser conferidos no painel. Não selecionar plano pago, comprar domínio ou habilitar recursos pagos para esta apresentação. A página de preços não pôde ser consultada deste ambiente (proxy 403), portanto nenhuma gratuidade ilimitada é prometida.

1. Abra https://app.netlify.com/ e entre ou crie sua conta. Use a conexão com GitHub.
2. No painel, escolha **Add new project** (ou **Add new site**) → **Import an existing project** → **GitHub**.
3. Se solicitado, autorize o aplicativo Netlify no GitHub apenas para `gianwilmoto-lgtm/obserservat-riopelotas` (**Only select repositories**). Não conceda acesso a projetos Wilmotos.
4. Selecione esse repositório e a branch `main`.
5. Confira a detecção de **Next.js**. Base directory: vazio/raiz. Build command: `npm run build`. Publish directory: `.next`. Node.js: `24`, já definido no arquivo de configuração.
6. Não configure variáveis Supabase. Se houver valores herdados de outro projeto, não os vincule à demonstração. Nunca adicione `service_role`, senhas ou tokens ao código.
7. Clique em **Deploy** / **Deploy project**. Aguarde o build terminar. O adaptador Next.js deve ser detectado/instalado pela Netlify.
8. No deploy marcado como **Published**, use **Open production deploy** / **Visit site** e copie o endereço HTTPS `https://<nome-atribuido>.netlify.app`. O endereço exato só existe depois da criação do projeto; não foi inventado neste documento.
9. Abra esse endereço em uma janela anônima. Se a hospedagem exigir login para visitantes, ajuste **Access & security** / proteção de acesso para permitir a apresentação pública, sem remover a proteção administrativa da aplicação.

Os nomes dos botões podem variar com atualizações do painel. Não é necessário comprar ou configurar domínio próprio.

## Sem banco: comportamento esperado

- Início, dashboard, filtros, obras, contratos e páginas informativas usam os dados fictícios já desenvolvidos.
- Formulários de participação e LAI validam o preenchimento e informam explicitamente que nada foi salvo ou enviado.
- Login/cadastro reais ficam indisponíveis; administração exige autenticação e papel autorizado. Código, migrações, rotas e controles permanecem preservados.
- Mapas dependem do acesso do navegador ao OpenStreetMap e têm fallback.
- A PWA funciona sob HTTPS da hospedagem, com página offline e sem cache de dados privados.

## “Editar ambiente” do Codex

A API do ambiente mostrou dois requisitos pendentes: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`. **Ambos são opcionais para a demonstração.** Não preencha valores fictícios para remover o aviso: presença de valores ativa o caminho real de autenticação.

Os quatro grupos de alterações anteriormente salvos foram: script de instalação, instruções de inicialização, lista de rede e requisitos de variáveis. A API não informa quatro mensagens de erro nem os rótulos exatos da interface. Instalação/inicialização foram verificadas; rede para fontes oficiais não é requisito do dashboard fictício. A configuração do ambiente Codex é separada da hospedagem pública na Netlify. Publicar um snapshot Codex não gera endereço público do site.

## Testes após o deploy

1. Abrir início, dashboard, obras, contratos, participação, LAI, conta, fontes e privacidade; verificar o aviso de dados fictícios.
2. Filtrar uma obra por bairro, abrir detalhes e confirmar ausência de documento oficial no exemplo.
3. Validar um formulário com dados fictícios; exigir a mensagem de que não houve persistência.
4. Abrir Administração sem login; não deve exibir registros privados ou ferramentas autorizadas.
5. Em celular, verificar navegação, filtros e ausência de rolagem horizontal global.
6. Conferir manifesto e service worker sob HTTPS; testar fallback offline depois da primeira visita.
7. Verificar logs do deploy e ausência de chaves/variáveis sensíveis. Não expor valores na documentação.

O relatório de publicação deve registrar o URL realmente acessado, status HTTP, resultado dos fluxos e limitações. Sem deploy externo e acesso ao endereço final, testes locais não serão descritos como testes de produção.
