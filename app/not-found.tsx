import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty">
      <h1 className="page-title">Registro não encontrado</h1>
      <Link href="/obras" className="btn">
        Voltar às obras
      </Link>
    </div>
  );
}
