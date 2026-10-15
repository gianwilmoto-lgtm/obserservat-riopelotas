"""Offline, deterministic staging importer. Never writes directly to public tables."""
import argparse
import csv
import hashlib
import io
import json
import uuid
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import Path
from urllib.parse import urlsplit

FIELDS = {'external_id', 'object', 'agency', 'company', 'amount', 'signed_at'}
MAX_BYTES = 5 * 1024 * 1024

def stage(path: Path, source_url: str, collected_at: str, demo=False):
    url = urlsplit(source_url)
    if url.scheme != 'https' or not url.hostname or url.username or url.password:
        raise ValueError('A origem precisa ser uma URL HTTPS sem credenciais.')
    date.fromisoformat(collected_at)
    if path.stat().st_size > MAX_BYTES:
        raise ValueError('Arquivo excede 5 MB.')
    raw = path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    base = {'source_url': source_url, 'collected_at': collected_at, 'sha256': digest,
            'verified': False, 'demo': demo, 'status': 'pending_review'}
    if path.suffix.lower() == '.pdf':
        if not raw.startswith(b'%PDF-'):
            raise ValueError('Assinatura PDF inválida.')
        return {**base, 'format': 'pdf', 'records': [], 'note': 'Documento em quarentena. Extração manual e inspeção obrigatórias; conteúdo não executado.'}
    if path.suffix.lower() != '.csv':
        raise ValueError('Use CSV ou PDF.')
    reader = csv.DictReader(io.StringIO(raw.decode('utf-8-sig')), strict=True)
    if not reader.fieldnames or not FIELDS.issubset(reader.fieldnames):
        raise ValueError('Colunas obrigatórias: ' + ', '.join(sorted(FIELDS)))
    seen, records = set(), []
    for line, row in enumerate(reader, start=2):
        if None in row or any(row.get(f) is None for f in FIELDS):
            raise ValueError(f'Linha {line}: quantidade de colunas inválida.')
        item = {k: row[k].strip() for k in FIELDS}
        if any(not v or len(v) > 2000 for v in item.values()):
            raise ValueError(f'Linha {line}: campo vazio ou excessivamente longo.')
        if any(v.startswith(('=', '+', '-', '@', '\t', '\r')) for k, v in item.items() if k != 'amount'):
            raise ValueError(f'Linha {line}: expressão de planilha não permitida.')
        try:
            amount = Decimal(item['amount'])
            if not amount.is_finite() or amount < 0 or amount > Decimal('9999999999999999.99') or amount.as_tuple().exponent < -2:
                raise ValueError()
            date.fromisoformat(item['signed_at'])
        except (InvalidOperation, ValueError):
            raise ValueError(f'Linha {line}: valor ou data inválidos.') from None
        key = item['external_id']
        if key in seen:
            raise ValueError(f'Linha {line}: identificador duplicado.')
        seen.add(key)
        records.append({**item, 'amount': str(amount.quantize(Decimal('.01'))),
                        'id': str(uuid.uuid5(uuid.NAMESPACE_URL, source_url + '#' + key))})
    if not records:
        raise ValueError('CSV sem registros.')
    return {**base, 'format': 'csv', 'records': records}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path)
    parser.add_argument('--source-url', required=True)
    parser.add_argument('--collected-at', required=True)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--demo', action='store_true')
    args = parser.parse_args()
    try:
        result = stage(args.input, args.source_url, args.collected_at, args.demo)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        # Never overwrite an existing artifact silently.
        with args.output.open('x', encoding='utf-8') as out:
            json.dump(result, out, ensure_ascii=False, indent=2)
    except (ValueError, OSError, UnicodeError, csv.Error) as exc:
        parser.exit(1, f'Importação recusada: {exc}\n')
    print(f"{len(result['records'])} registro(s) em revisão; nenhum dado publicado.")

if __name__ == '__main__':
    main()
