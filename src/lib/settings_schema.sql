-- Create a table for global settings
create table public.settings (
  key text not null primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users(id)
);

-- Enable RLS
alter table public.settings enable row level security;

-- Allow read access to everyone (public settings like prices needed for simulator)
create policy "Allow public read access" on public.settings
  for select using (true);

-- Allow write access only to authenticated admins
-- Assuming you have a way to distinguish admins, or just authenticated users for now if this is an internal tool
create policy "Allow authenticated update" on public.settings
  for update using (auth.role() = 'authenticated');

create policy "Allow authenticated insert" on public.settings
  for insert with check (auth.role() = 'authenticated');

-- Seed initial data based on src/lib/constants.ts
insert into public.settings (key, value, description) values
('FR_ELECTRICITY_PRICE', '0.2516', 'Prix du kWh en France (€)'),
('FR_COST_PER_KWC', '2000', 'Coût installation France (€/kWc)'),
('FR_PRIME_AUTOCONSO_3KW', '300', 'Prime autoconso <= 3kWc (€/kWc)'),
('FR_PRIME_AUTOCONSO_9KW', '230', 'Prime autoconso <= 9kWc (€/kWc)'),
('FR_PRIME_AUTOCONSO_36KW', '200', 'Prime autoconso <= 36kWc (€/kWc)'),
('FR_SURPLUS_RESALE', '0.1297', 'Tarif rachat surplus France (€/kWh)'),
('BE_ELECTRICITY_PRICE', '0.3800', 'Prix du kWh en Belgique (€)'),
('BE_COST_PER_KWC', '1400', 'Coût installation Belgique (€/kWc)'),
('BE_PROSUMER_TAX', '76.00', 'Tarif Prosumer moyen Wallonie (€/kWe)'),
('BE_GREEN_CERTS_BRU', '65.00', 'Prix certificats verts Bruxelles (€)'),
('ADMIN_CONTACT_EMAIL', '"admin@solarestim.com"', 'Email de contact administrateur');
