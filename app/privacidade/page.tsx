export default function Privacy() {
  return (
    <article className="card">
      <h1 className="page-title">Privacidade e participação responsável</h1>
      <p>
        Este protótipo é independente e não é um canal oficial da Prefeitura.
      </p>
      <h2>Dados mínimos</h2>
      <p>
        Contas reais usam e-mail e senha gerenciados pelo Supabase. Não
        solicitamos CPF, telefone ou endereço residencial. Relatos podem conter
        texto, bairro e uma fotografia opcional; pedidos LAI ficam privados.
      </p>
      <h2>Fotos e moderação</h2>
      <p>
        Fotografias são reprocessadas para remover metadados e ficam em
        armazenamento privado. Relatos aguardam revisão antes de qualquer
        publicação do texto. Não envie rostos, placas, documentos ou denúncias
        que identifiquem terceiros.
      </p>
      <h2>Serviços externos</h2>
      <p>
        Mapas consultam o OpenStreetMap, que recebe o endereço IP. A
        autenticação depende da configuração Supabase. Cookies de sessão são
        usados apenas quando a autenticação está habilitada. Páginas privadas
        não são armazenadas pelo modo offline.
      </p>
      <h2>Antes de uso público</h2>
      <p>
        O responsável pelo tratamento, canal de atendimento aos titulares,
        prazos de retenção e rotina de exclusão precisam ser definidos antes de
        receber dados reais. Enquanto isso, use somente informações fictícias
        nos testes.
      </p>
    </article>
  );
}
