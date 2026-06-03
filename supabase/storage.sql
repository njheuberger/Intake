insert into storage.buckets (id, name, public)
values ('project-photos', 'project-photos', false)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Authenticated users can upload project photos" on storage.objects;
drop policy if exists "Authenticated users can read project photos" on storage.objects;
drop policy if exists "Authenticated users can update project photos" on storage.objects;
drop policy if exists "Authenticated users can delete project photos" on storage.objects;

create policy "Authenticated users can upload project photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-photos');

create policy "Authenticated users can read project photos"
on storage.objects for select
to authenticated
using (bucket_id = 'project-photos');

create policy "Authenticated users can update project photos"
on storage.objects for update
to authenticated
using (bucket_id = 'project-photos')
with check (bucket_id = 'project-photos');

create policy "Authenticated users can delete project photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-photos');
