CREATE TABLE laaner
(
  laanerid serial primary key,
  fornavn text not null,
  etternavn text not null,
  adresse text,
  epost text,
  tlf text,
  kjonn text
);

CREATE TABLE bok
(
  bokid serial primary key,
  tittel text not null,
  pdato date,
  isbn text,
  antallSider int,
  sjanger text,
  spraak text,
  forfatterid int
);

CREATE TABLE forfatter
(
  forfatterid serial primary key,
  fornavn text not null,
  etternavn text not null,
  fdato date,
  kjonn text
);

CREATE TABLE eksemplar
(
  eksemplarid serial primary key,
  tillstand text,
  bokid int
);

CREATE TABLE utlaan
(
  utlaanid serial primary key,
  udato date,
  innlevert text default 'nei',
  laanerid int,
  eksemplarid int
);

