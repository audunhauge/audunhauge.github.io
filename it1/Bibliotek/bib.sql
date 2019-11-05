CREATE TABLE laaner
(
  laanerid serial primary key,
  fornavn text not null,
  etternavn text not null,
  adresse text not null,
  tlf text default '',
  epost text default ''
);

CREATE TABLE bok
(
  bokid serial primary key,
  tittel text not null
);