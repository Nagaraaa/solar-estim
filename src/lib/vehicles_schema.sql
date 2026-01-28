-- Création de la table des véhicules
create table if not exists vehicles (
  id uuid default gen_random_uuid() primary key,
  brand text not null,
  model text not null,
  consumption_wltp numeric(4,1) not null, -- ex: 15.2 kWh/100km
  real_world_factor numeric(3,2) default 1.15, -- multiplicateur realité (ex: 1.15 = +15%)
  battery_usable integer not null, -- en kWh
  charging_efficiency numeric(3,2) default 0.88, -- rendement chargeur (ex: 0.88 = 88%)
  is_bidirectional boolean default false,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Activation de la sécurité (RLS) pour que seul l'admin puisse modifier
alter table vehicles enable row level security;

-- Admin can do everything
create policy "Admin Full Access"
on vehicles
for all
to service_role
using (true)
with check (true);

-- Public can read only
create policy "Public Read Access"
on vehicles
for select
to anon, authenticated
using (true);

-- Indexes for performance
create index vehicles_brand_idx on vehicles(brand);
