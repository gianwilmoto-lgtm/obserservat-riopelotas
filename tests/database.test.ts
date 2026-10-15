import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("PostgreSQL migrations enforce ownership, role separation, moderation and auditing", async () => {
  const db = new PGlite();
  await db.exec(
    `create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;grant usage on schema storage to authenticated;grant select,insert,delete on storage.objects to authenticated;create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1,'/') $$;`,
  );
  for (const file of ["001_core.sql", "002_storage.sql"])
    await db.exec(await readFile("supabase/migrations/" + file, "utf8"));
  const citizen = "00000000-0000-4000-8000-000000000001",
    other = "00000000-0000-4000-8000-000000000002",
    reviewer = "00000000-0000-4000-8000-000000000003";
  const id = "00000000-0000-4000-8000-000000000004";
  await db.exec(
    `insert into auth.users values('${citizen}'),('${other}'),('${reviewer}');update citizens set role='reviewer' where id='${reviewer}';set role authenticated;select set_config('request.jwt.claim.sub','${citizen}',false);`,
  );
  await db.exec(
    `insert into occurrences(id,citizen_id,title,description,neighborhood,subject) values('${id}','${citizen}','Título de teste','Descrição suficientemente longa para o teste','Centro','Urbanismo');`,
  );
  await assert.rejects(
    db.exec(`update citizens set role='admin' where id='${citizen}'`),
  );
  await assert.rejects(
    db.exec(
      `insert into occurrences(citizen_id,title,description,neighborhood,subject,status) values('${citizen}','Título de teste','Descrição suficientemente longa para o teste','Centro','Urbanismo','published')`,
    ),
  );
  await assert.rejects(
    db.exec(
      `select moderate_occurrence('${id}','published','Revisão fictícia autorizada')`,
    ),
  );
  await assert.rejects(
    db.exec(
      `insert into storage.objects(bucket_id,name) values('private-evidence','${other}/photo.jpg')`,
    ),
  );
  await db.exec(
    `insert into storage.objects(bucket_id,name) values('private-evidence','${citizen}/photo.jpg')`,
  );
  await db.exec(
    `insert into lai_requests(id,citizen_id,title,body,agency) values('${id}','${citizen}','Pedido fictício','Informação fictícia para teste de isolamento','Órgão fictício');select set_config('request.jwt.claim.sub','${other}',false);`,
  );
  assert.equal((await db.query("select * from occurrences")).rows.length, 0);
  assert.equal((await db.query("select * from lai_requests")).rows.length, 0);
  assert.equal(
    (await db.query("select * from storage.objects")).rows.length,
    0,
  );
  await assert.rejects(
    db.exec(`select update_lai('${id}','submitted','ABC-123')`),
  );
  await db.exec(
    `select set_config('request.jwt.claim.sub','${reviewer}',false);select moderate_occurrence('${id}','published','Texto revisado sem dados pessoais');set role anon;`,
  );
  const published = await db.query<Record<string, unknown>>(
    "select * from published_occurrences",
  );
  assert.equal(published.rows.length, 1);
  assert.ok(!("citizen_id" in published.rows[0]));
  assert.ok(!("photo_path" in published.rows[0]));
  await assert.rejects(db.exec("select * from occurrences"));
  await db.exec("reset role");
  assert.ok((await db.query("select * from audits")).rows.length >= 6);
  await assert.rejects(
    db.exec(
      `insert into works(contract_id,title,neighborhood,subject,status,source_id,external_id,collected_at) values(gen_random_uuid(),'Obra','Centro','Urbanismo','ongoing',gen_random_uuid(),'1',now())`,
    ),
  );
  // Verify real relational inserts, deduplication and public staging isolation.
  await db.exec(`insert into municipalities(id,ibge_code,name,state) values('${citizen}','4314407','Pelotas','RS');
    insert into sources(id,name,url,format) values('${citizen}','Fonte de teste','https://example.org/test','csv');
    insert into agencies(id,municipality_id,name,external_id,source_id,collected_at) values('${citizen}','${citizen}','Órgão fictício','agency-1','${citizen}',now());
    insert into companies(id,name,external_id,source_id,collected_at) values('${citizen}','Empresa fictícia','company-1','${citizen}',now());
    insert into contracts(id,agency_id,company_id,object,number,amount,source_id,external_id,collected_at) values('${citizen}','${citizen}','${citizen}','Contrato fictício','1',12.34,'${citizen}','contract-1',now());`);
  await assert.rejects(
    db.exec(
      `insert into contracts(agency_id,company_id,object,number,amount,source_id,external_id,collected_at) values('${citizen}','${citizen}','Duplicado','1',12.34,'${citizen}','contract-1',now())`,
    ),
  );
  await assert.rejects(
    db.exec(`update contracts set amount=-1 where id='${citizen}'`),
  );
  await db.exec("set role anon;select set_config('request.jwt.claim.sub','',false);");
  assert.equal((await db.query("select * from contracts")).rows.length, 0);
  await db.exec(
    `reset role;update contracts set verified=true where id='${citizen}';set role anon;`,
  );
  assert.equal((await db.query("select * from contracts")).rows.length, 1);
  await db.exec(
    `set role authenticated;select set_config('request.jwt.claim.sub','${citizen}',false);select update_lai('${id}','submitted','PROTO-TESTE');`,
  );
  assert.equal(
    (await db.query<{ status: string }>("select status from lai_requests"))
      .rows[0].status,
    "submitted",
  );
  await db.close();
});
