CREATE TABLE kunde
(
  kundeid serial primary key,
  fornavn text not null,
  etternavn text not null,
  adresse text not null,
  tlf text default '',
  epost text default ''
);

CREATE TABLE vare
(
  vareid serial primary key,
  varenavn text not null,
  beholdning INT default 0,
  basispris INT NOT NULL
);

CREATE TABLE bestilling
(
  bestillingid serial primary key,
  dato DATE NOT NULL,
  betalt boolean default false,
  betalingsmetode text not null,
  kundeid INT NOT NULL,
  FOREIGN KEY (kundeid) REFERENCES kunde(kundeid)
);

CREATE TABLE linje
(
  linjeid serial primary key,
  pris INT NOT NULL,
  antall INT default 1,
  bestillingid INT NOT NULL,
  vareid INT NOT NULL,
  FOREIGN KEY (bestillingid) REFERENCES bestilling(bestillingid),
  FOREIGN KEY (vareid) REFERENCES vare(vareid)
);