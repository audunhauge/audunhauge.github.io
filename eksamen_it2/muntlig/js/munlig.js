// dette er varebeholdningen ved start

let lagerListe = [
    {varenummer:12, beskrivelse:"slips",beholdning:12, pris:200},
    {varenummer:13, beskrivelse:"skjerf",beholdning:32, pris:210},
    {varenummer:14, beskrivelse:"skjorte",beholdning:122, pris:700},
    {varenummer:15, beskrivelse:"skjørt",beholdning:42, pris:900},
    {varenummer:16, beskrivelse:"bukse",beholdning:62, pris:1200},
    {varenummer:17, beskrivelse:"sokker",beholdning:72, pris:50},
    {varenummer:18, beskrivelse:"truser",beholdning:82, pris:100},
    {varenummer:19, beskrivelse:"bluse",beholdning:92, pris:270},
    {varenummer:20, beskrivelse:"trøye",beholdning:15, pris:290},
    {varenummer:21, beskrivelse:"shorts",beholdning:126, pris:500},
    {varenummer:22, beskrivelse:"sko",beholdning:172, pris:1700},
];

let kundeListe = [
    {kundenr:16, navn:"Ole Olsen", adresse:"Olesvei 36, 5535 Haugesund"},
    {kundenr:17, navn:"Ole Peder Olsen", adresse:"Olesvei 36, 5535 Haugesund"},
    {kundenr:18, navn:"Ole Johann Olsen", adresse:"Olesvei 36, 5535 Haugesund"},
]

// et eksempel på en handlekorg

let korg = [
    { varenummer:12, antall,3, kundenr:16},
    { varenummer:19, antall,1, kundenr:16},
]