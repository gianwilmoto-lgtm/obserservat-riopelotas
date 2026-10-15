begin;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('private-evidence','private-evidence',false,5242880,array['image/jpeg']),
 ('import-quarantine','import-quarantine',false,5242880,array['text/csv','application/pdf']);
create policy evidence_insert on storage.objects for insert to authenticated with check(bucket_id='private-evidence' and (storage.foldername(name))[1]=auth.uid()::text);
create policy evidence_read on storage.objects for select to authenticated using(bucket_id='private-evidence' and ((storage.foldername(name))[1]=auth.uid()::text or public.app_role() in('reviewer','admin')));
create policy evidence_cleanup on storage.objects for delete to authenticated using(bucket_id='private-evidence' and (storage.foldername(name))[1]=auth.uid()::text);
create policy import_insert on storage.objects for insert to authenticated with check(bucket_id='import-quarantine' and public.app_role() in('analyst','reviewer','admin') and (storage.foldername(name))[1]=auth.uid()::text);
create policy import_read on storage.objects for select to authenticated using(bucket_id='import-quarantine' and public.app_role() in('analyst','reviewer','admin'));
create policy import_cleanup on storage.objects for delete to authenticated using(bucket_id='import-quarantine' and (storage.foldername(name))[1]=auth.uid()::text and public.app_role() in('analyst','reviewer','admin'));
commit;
