import importlib.util
import tempfile
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('import_public',Path(__file__).parents[1]/'scripts/import_public.py')
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class ImportTests(unittest.TestCase):
    def stage(self, text, extension='.csv'):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/('input'+extension)
            p.write_bytes(text.encode())
            return module.stage(p,'https://example.org/dados','2026-10-15',True)
    def row(self, amount='12.34', external='1', obj='Objeto fictício'):
        return f'{external},{obj},Órgão fictício,Empresa fictícia,{amount},2026-01-01\n'
    header='external_id,object,agency,company,amount,signed_at\n'
    def test_stable_ids_and_provenance(self):
        one=self.stage(self.header+self.row());two=self.stage(self.header+self.row())
        self.assertEqual(one,two);self.assertFalse(one['verified']);self.assertTrue(one['demo']);self.assertEqual(len(one['sha256']),64)
    def test_reject_duplicate(self):
        with self.assertRaises(ValueError):self.stage(self.header+self.row()+self.row())
    def test_reject_invalid_amounts(self):
        for amount in ['-1','NaN','Infinity','1.123','not-a-number']:
            with self.subTest(amount=amount),self.assertRaises(ValueError):self.stage(self.header+self.row(amount))
    def test_reject_formula(self):
        with self.assertRaises(ValueError):self.stage(self.header+self.row(obj='=HYPERLINK(x)'))
    def test_missing_headers_and_empty(self):
        for text in ['abc\n12\n',self.header]:
            with self.assertRaises(ValueError):self.stage(text)
    def test_pdf_quarantine(self):
        result=self.stage('%PDF-1.4\nDemo','.pdf')
        self.assertEqual(result['records'],[]);self.assertEqual(result['status'],'pending_review')
    def test_fake_pdf(self):
        with self.assertRaises(ValueError):self.stage('<script>bad</script>','.pdf')
if __name__=='__main__':unittest.main()
