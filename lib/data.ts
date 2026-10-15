export type Work = {
  id: string;
  title: string;
  neighborhood: string;
  subject: string;
  status: string;
  budget: number;
  paid: number;
  progress: number;
  lat: number;
  lng: number;
  description: string;
  contractId: string;
};
export const works: Work[] = [
  {
    id: "obra-001",
    title: "Requalificação da Praça do Bairro",
    neighborhood: "Centro",
    subject: "Urbanismo",
    status: "Em andamento",
    budget: 1250000,
    paid: 612500,
    progress: 49,
    lat: -31.771,
    lng: -52.342,
    description:
      "Exemplo fictício de recuperação de passeios, iluminação e espaços de convivência. Localização aproximada para demonstração.",
    contractId: "contrato-001",
  },
  {
    id: "obra-002",
    title: "Ampliação de unidade de saúde",
    neighborhood: "Fragata",
    subject: "Saúde",
    status: "Em andamento",
    budget: 2400000,
    paid: 1800000,
    progress: 75,
    lat: -31.759,
    lng: -52.367,
    description:
      "Exemplo fictício de ampliação de salas de atendimento e adequação de acessibilidade.",
    contractId: "contrato-002",
  },
  {
    id: "obra-003",
    title: "Reforma de escola municipal",
    neighborhood: "Três Vendas",
    subject: "Educação",
    status: "Planejada",
    budget: 890000,
    paid: 0,
    progress: 0,
    lat: -31.735,
    lng: -52.338,
    description:
      "Exemplo fictício de recuperação de cobertura, instalações e pátio escolar.",
    contractId: "contrato-003",
  },
  {
    id: "obra-004",
    title: "Drenagem e recuperação de via",
    neighborhood: "Laranjal",
    subject: "Infraestrutura",
    status: "Concluída",
    budget: 680000,
    paid: 680000,
    progress: 100,
    lat: -31.765,
    lng: -52.229,
    description:
      "Exemplo fictício de manutenção de rede pluvial e pavimentação.",
    contractId: "contrato-004",
  },
];
export const contracts = works.map((w, i) => ({
  id: w.contractId,
  number: `DEMO-${String(i + 1).padStart(3, "0")}/2026`,
  title: w.title,
  company: `Empresa demonstrativa ${i + 1}`,
  amount: w.budget,
  neighborhood: w.neighborhood,
  subject: w.subject,
  status: w.status,
  workId: w.id,
}));
export const money = (n: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);
export const modules = [
  "Transparência financeira",
  "Obras públicas",
  "Licitações e contratos",
  "Fiscalização cidadã",
  "Pedidos LAI",
  "Saúde pública",
  "Educação",
  "Funcionalismo e administração",
  "Meio ambiente e urbanismo",
  "Inteligência de dados e relatórios",
];
export function filterRecords<
  T extends { title: string; neighborhood: string; subject: string },
>(rows: T[], query: string, neighborhood: string, subject: string) {
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  return rows.filter(
    (r) =>
      normalize(r.title).includes(normalize(query)) &&
      (!neighborhood || r.neighborhood === neighborhood) &&
      (!subject || r.subject === subject),
  );
}
