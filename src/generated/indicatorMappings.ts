import type { IndicatorDescriptor, IndicatorMapping } from "../types";

export const oecdIndicators: IndicatorDescriptor[] = [
  {
    "id": "OECD:UNEMPLOYMENT:DE",
    "label": {
      "de": "Arbeitslosenquote",
      "en": "Unemployment Rate"
    },
    "description": {
      "de": "Prozentualer Anteil arbeitsfähiger Menschen ohne Beschäftigung.",
      "en": "Share of the labor force without employment."
    },
    "value": "6.5%",
    "unit": "%",
    "timestamp": "2024",
    "dimensions": {
      "country": "Germany",
      "age": "15-64"
    },
    "source": "OECD ELS"
  },
  {
    "id": "OECD:MIGRATION:ASYL",
    "label": {
      "de": "Fluchtmigrationsdruck",
      "en": "Migration Pressure"
    },
    "description": {
      "de": "Registrierte Asylanträge und Bewegungen in die OECD-Zone.",
      "en": "Registered asylum applications and flows."
    },
    "value": "140k",
    "unit": "applications",
    "timestamp": "2023",
    "dimensions": {
      "subgroup": "asylum",
      "region": "OECD"
    },
    "source": "OECD Migration"
  },
  {
    "id": "OECD:AI_INVEST",
    "label": {
      "de": "KI-Investitionen",
      "en": "AI Investments"
    },
    "description": {
      "de": "Staatliche und private Ausgaben für KI-Forschung und Rechenkapazität.",
      "en": "Public and private spending on AI research and compute."
    },
    "value": "72 bln",
    "unit": "USD",
    "timestamp": "2024-Q1",
    "dimensions": {
      "sector": "tech",
      "focus": "research"
    },
    "source": "OECD Science"
  },
  {
    "id": "OECD:PRECARITY:TD",
    "label": {
      "de": "Prekäre Beschäftigung",
      "en": "Precarious Employment"
    },
    "description": {
      "de": "Anteil aller Beschäftigten in befristeten oder unsicheren Jobs.",
      "en": "Share of workers in temporary or insecure jobs."
    },
    "value": "21%",
    "unit": "%",
    "timestamp": "2023",
    "dimensions": {
      "group": "working poor",
      "contract": "temporary"
    },
    "source": "OECD Labour"
  },
  {
    "id": "OECD:INEQUALITY:WA",
    "label": {
      "de": "Vermögensungleichheit",
      "en": "Wealth Inequality"
    },
    "description": {
      "de": "Vermögenskonzentration im obersten 10%",
      "en": "Wealth concentration in the top 10%."
    },
    "value": "71%",
    "unit": "share",
    "timestamp": "2023",
    "dimensions": {
      "region": "OECD",
      "measure": "top10"
    },
    "source": "OECD Income"
  }
];

export const indicatorMappings: IndicatorMapping[] = [
  {
    "crisisSlug": "prekarisierung",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 11,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "flucht",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 8,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "abschiebungsapparat",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 6,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "armut",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 6,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "demokratieabbau",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 6,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "soziale-ungleichheit",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 6,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "antibiotika-resistenzen",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "aufruestung",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "aufruestung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "biopolitische-zuschreibungen",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "faschisierung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "flucht",
    "indicatorId": "OECD:AI_INVEST",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "klimaflucht",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "korruption",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "krieg",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "kuenstliche-intelligenz",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "prekarisierung",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "radikalisierung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 5,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "abschiebungsapparat",
    "indicatorId": "OECD:AI_INVEST",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "abschiebungsapparat",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "algorithmische-steuerung",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "algorithmische-steuerung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "algorithmische-steuerung",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "alterung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "alterung",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "antibiotika-resistenzen",
    "indicatorId": "OECD:AI_INVEST",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "arbeitslosigkeit",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "armut",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "armut",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "aufruestung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "aufruestung",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "autokratie",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "autokratie",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "autokratie",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "biodiversitaetsverlust",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "climate-change",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "corruption",
    "indicatorId": "OECD:AI_INVEST",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "demografischer-wandel",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "demokratieabbau",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "desinformation",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "desinformation",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "exklusion",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "exklusion",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "faschisierung",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "finanzblasen",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "finanzblasen",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "finanzblasen",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "grenzregime",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "just-in-time-fragilitaet",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "just-in-time-fragilitaet",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "klimaflucht",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "kontrollverlust",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "kontrollverlust",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "krieg",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "kuenstliche-intelligenz",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "lebensmittelknappheit",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "medienerosion",
    "indicatorId": "OECD:AI_INVEST",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "migration",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "nihilismus",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "ozeanerwaermung",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "ozeanerwaermung",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "prekarisierung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "prekarisierung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "rentenkrise",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "soziale-ungleichheit",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "soziale-ungleichheit",
    "indicatorId": "OECD:AI_INVEST",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "staatszerfall",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "staatszerfall",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "toxischer-materialabfall",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "toxischer-materialabfall",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "ueberwachung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "ueberwachung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "umweltzerstoerung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "war",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "wasserknappheit",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "weltraumschrott",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "weltraumschrott",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 4,
    "roles": [
      "primary"
    ]
  },
  {
    "crisisSlug": "abschiebungsapparat",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "abschiebungsapparat",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ai",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "algorithmische-steuerung",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "arbeitslosigkeit",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "armut",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "armut",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "asylpolitik",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "aufruestung",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "autokratie",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "autokratie",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "automatisierung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "care",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "climate-change",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "cyberangriffe",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "demokratieabbau",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "demokratieabbau",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "digitalisierung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "empoerungsdynamiken",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "empoerungsdynamiken",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "erschoepfung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "exklusion",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "faschisierung",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "finanzblasen",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "finanzialisierung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "flucht",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "flucht",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "flucht",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "fragmentierung-der-oeffentlichkeit",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "fragmentierung-der-oeffentlichkeit",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "grenzregime",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "identitaetspolitik",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "klimawandel",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "korruption",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "krieg",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "krieg",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "kuenstliche-intelligenz",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "kuenstliche-intelligenz",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "kuenstliche-intelligenz",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "lagerlogik",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "lieferkettenabhaengigkeit",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "medienerosion",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "medienerosion",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "militarisierung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "militarisierung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "naturkatastrophen",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ozeanerwaermung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ozeanerwaermung",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "pandemic",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "plattformoekonomie",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "populismus",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "populismus",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "post-demokratie",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "postfaktizitaet",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "radikalisierung",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "rechtlosigkeit",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "soziale-ungleichheit",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "staatszerfall",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "technologische-intransparenz",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "technologische-intransparenz",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "war",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "wasserknappheit",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "weltraumschrott",
    "indicatorId": "OECD:AI_INVEST",
    "score": 3,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ai",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "algorithmische-steuerung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "alterung",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "alterung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "alterung",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "antibiotika-resistenzen",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "antibiotika-resistenzen",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "antibiotika-resistenzen",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "arbeitslosigkeit",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "arbeitslosigkeit",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "arbeitslosigkeit",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "artensterben",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "artensterben",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "asylpolitik",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "aufmerksamkeitsoekonomie",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "aufmerksamkeitsoekonomie",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "automatisierung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "bildungsungleichheit",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "bildungsungleichheit",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "biodiversitaetsverlust",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "biodiversitaetsverlust",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "biodiversitaetsverlust",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "biodiversitaetsverlust",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "biopolitische-zuschreibungen",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "biopolitische-zuschreibungen",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "blackout",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "blackout",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "bodenversiegelung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "bodenversiegelung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "care",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "climate-change",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "climate-change",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "climate-change",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "corruption",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "cyberangriffe",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "datenfragmentierung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "datenfragmentierung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "datenmissbrauch",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "demografischer-wandel",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "desinformation",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "desinformation",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "desinformation",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "digitalisierung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "drogen",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "empoerungsdynamiken",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "empoerungsdynamiken",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "empoerungsdynamiken",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "energieknappheit",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "energieknappheit",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "energieknappheit",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "entfremdung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "entfremdung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "entmenschlichung-buerokratie",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "erschoepfung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ethnonationalismus",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ethnonationalismus",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "exhaustion",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "exhaustion",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "exklusion",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "exklusion",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "faschisierung",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "faschisierung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "finanzblasen",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "finanzialisierung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "generationenkonflikt",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "generationenkonflikt",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "gentrifizierung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "gentrifizierung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "geopolitische-verschiebungen",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "geopolitische-verschiebungen",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "grenzkonflikte",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "grenzkonflikte",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "grenzregime",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "grenzregime",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "grenzregime",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "identitaetspolitik",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "identitaetspolitik",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "illegale-arbeit",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "illegale-arbeit",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "infrastrukturverfall",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "infrastrukturverfall",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "just-in-time-fragilitaet",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "just-in-time-fragilitaet",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "just-in-time-fragilitaet",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "klimaflucht",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "klimawandel",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "koerperpolitik",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "koerperpolitik",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "kontrollverlust",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "kontrollverlust",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "kontrollverlust",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "korruption",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "korruption",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "korruption",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "krieg",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "lagerlogik",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "lagerlogik",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "lebensmittelknappheit",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "lieferkettenabhaengigkeit",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "machtmissbrauch",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "machtmissbrauch",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "medienerosion",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "naturkatastrophen",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "naturkatastrophen",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "nihilismus",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "nihilismus",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "nihilismus",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "nihilismus",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "normkonflikte",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "normkonflikte",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ozeanerwaermung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ozeanversauerung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ozeanversauerung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "pandemic",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "pandemie",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "pandemie",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "pflegenotstand",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "plattformoekonomie",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "politische-gewaltfantasien",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "politische-gewaltfantasien",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "populismus",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "post-demokratie",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "postfaktizitaet",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "prekarisierung",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "propaganda",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "propaganda",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "psychische-belastung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "psychische-belastung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "radikalisierung",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "radikalisierung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "radikalisierung",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "rechtlosigkeit",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "rentenkrise",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "rentenkrise",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "rentenkrise",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ressourcenerschoepfung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "ressourcenerschoepfung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "rezession",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "rezession",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "schuldenlast",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "schuldenlast",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "sinnverlust",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "sinnverlust",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "soziale-ungleichheit",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "sprachregime",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "sprachregime",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "staatsbuergerschaft",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "staatszerfall",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "staatszerfall",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "stellvertreterkriege",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "surveillance",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "surveillance",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "symbolische-uebercodierung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "symbolische-uebercodierung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "terrorismus",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "terrorismus",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "toxischer-materialabfall",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "toxischer-materialabfall",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "toxischer-materialabfall",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "umweltzerstoerung",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "umweltzerstoerung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "umweltzerstoerung",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "umweltzerstoerung",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "vereinsamung",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "vereinsamung",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "vertrauensverlust",
    "indicatorId": "OECD:MIGRATION:ASYL",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "vertrauensverlust",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "vertrauensverlust",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "war",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "war",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "war",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "wasserknappheit",
    "indicatorId": "OECD:AI_INVEST",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "wasserknappheit",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "wasserknappheit",
    "indicatorId": "OECD:INEQUALITY:WA",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "weltraumschrott",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "weltraumschrott",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "zensur",
    "indicatorId": "OECD:PRECARITY:TD",
    "score": 2,
    "roles": [
      "secondary"
    ]
  },
  {
    "crisisSlug": "zukunftsangst",
    "indicatorId": "OECD:UNEMPLOYMENT:DE",
    "score": 2,
    "roles": [
      "secondary"
    ]
  }
];
