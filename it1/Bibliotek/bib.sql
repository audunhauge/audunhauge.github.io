-- drop table bok,laaner,forfatter,eksemplar,utlaan cascade;

CREATE TABLE laaner (
  laanerid serial primary key,
  fornavn text not null,
  etternavn text not null,
  adresse text,
  epost text,
  tlf text,
  kjonn text
);

CREATE TABLE forfatter (
  forfatterid serial primary key,
  fornavn text not null,
  etternavn text not null,
  fdato date,
  kjonn text check (
    kjonn = 'm'
    or kjonn = 'f'
  )
);

CREATE TABLE bok (
  bokid serial primary key,
  tittel text not null,
  pdato date,
  isbn text,
  antallSider int check (antallsider > 0),
  sjanger text,
  spraak text,
  forfatterid int references forfatter (forfatterid)
);

CREATE TABLE eksemplar (
  eksemplarid serial primary key,
  tillstand text,
  bokid int references bok (bokid)
);

CREATE TABLE utlaan (
  utlaanid serial primary key,
  udato date,
  innlevert text default 'false' check (
    innlevert = 'true'
    or innlevert = 'false'
  ),
  laanerid int references laaner (laanerid),
  eksemplarid int references eksemplar (eksemplarid)
);