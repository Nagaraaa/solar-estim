-- Create the vehicles table
create table if not exists vehicles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  brand text not null,
  model text not null,
  year integer,
  
  -- Technical specs
  battery_capacity_kwh numeric not null, -- Capacité utile
  range_wltp_km numeric not null,        -- Autonomie WLTP
  consumption_kwh_100km numeric,         -- Consommation (si absente, calculée via capacity/range)
  max_charge_power_kw numeric,           -- Puissance max de charge AC/DC
  
  -- Solar-Estim Precision Factors
  real_world_factor numeric default 0.85,    -- Facteur de réalité (vs WLTP)
  charging_efficiency numeric default 0.90,  -- Efficacité de charge (pertes onduleur/borne)
  
  -- V2G/V2H
  is_bidirectional boolean default false,
  bidirectional_type text check (bidirectional_type in ('V2L', 'V2H', 'V2G', 'V2X')),
  
  -- Metadata
  image_url text
);

-- RLS Policies (Enable RLS for security)
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
create index vehicles_model_idx on vehicles(model);
