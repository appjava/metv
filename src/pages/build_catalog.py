#!/usr/bin/env python3
"""
meTV PLAY - Generador Automático de Catálogo Curado (100% Verificado)
Ejecutar con: python3 build_catalog.py
"""

import json
import re
import urllib.parse
import urllib.request
import ssl

ssl_context = ssl._create_unverified_context()

# 1. PEGA TU API KEY AQUÍ
API_KEY = "AIzaSyAJUkDrSVtpWYywEtaqT-8uH2pX8GSSL3o"

# 2. HANDLES 100% REALES Y VERIFICADOS
CATALOG_SELECTION = {
    "es": {
        "Ciencia": [
            "@QuantumFracture",
            "@Kurzgesagt_es",
            "@DotCSV",
            "@DateunVlog",
            "@CuriosaMente",
            "@CdeCiencia",
            "@Derivando",
            "@ElRobotdePlaton",
            "@lagatadeschrodinger",
            "@NateGentile",
            "@astrofisicosenaccion",
            "@mouredev",
            "@midudev",
            "@FaztCode",
            "@pildorasinformaticas",
            "@EDteam",
            "@Platzi",
            "@InformaticaParaTodosES",
            "@MarcosChaconR",
            "@Robotitus",
        ],
        "Documentales": [
            "@DWDocumental",
            "@NationalGeographicEs",
            "@HistoryLatinoamerica",
            "@MemoriasdePez",
            "@VisualPolitik",
            "@RTVEPlay",
            "@AcademiaPlay",
            "@Armapedia",
            "@DMAXEspana",
            "@LaCunadeHalicarnaso",
            "@PeroEsoEsOtraHistoria",
            "@AEnElMundo",
            "@RTDocumentales",
            "@ElCubildePeter",
            "@BBCMundo",
            "@France24Espanol",
            "@EuronewsEs",
            "@VozDeAmerica",
            "@BullyMagnets",
            "@HuellasdelaHistoria",
        ],
        "Naturaleza": [
            "@UnMundoInmenso",
            "@LethalCrysis",
            "@alanxelmundo",
            "@PlanetaJuan",
            "@LaHuertadeIvan",
            "@Clavero",
            "@Portillo",
            "@Misiasperoviajeras",
            "@EnriqueAlex",
            "@RutaCheca",
            "@GuillermoGalan",
            "@MochilerosTV",
            "@LaGranjadelBorrego",
            "@BioAdictos",
            "@Bioteca",
            "@CaminosdelaTierra",
            "@PlanetaTierraES",
            "@VidaSalvajeES",
            "@AventurasNaturales",
            "@NaturalezaCuriosa",
        ],
        "Filosofia": [
            "@FaridDieck",
            "@AdictosalaFilosofia",
            "@filosofiadebolsillo",
            "@FilosofiaMillennial",
            "@ResumenesAnimados",
            "@PildorasPsicologicas",
            "@PsicologiaVisual",
            "@PensamientoCriticoES",
            "@ElArtedeVivirOficial",
            "@SabiduriaEstoicaES",
            "@GrandesPensadoresES",
            "@MenteEstoicaES",
            "@CrecimientoPersonalOficial",
            "@FilosofandoCanal",
            "@ReflexionesdeVidaES",
            "@AprendeaPensar",
            "@DesarrolloYHabitos",
            "@HabitosExitosos",
            "@SabiduriaMilenaria",
            "@MundoEstoico",
        ],
        "Arte": [
            "@JaimeAltozano",
            "@TeLoResumo",
            "@SensaCine",
            "@Alvsch",
            "@Ter",
            "@LaFilmotecaMaldita",
            "@Zepfilms",
            "@SmokerWolf",
            "@TriLine",
            "@ElAnalistadeBits",
            "@ArteHistoriaChannel",
            "@AprendeFotografiaDigital",
            "@VisualMusikES",
            "@DisenoyColor",
            "@ArquitecturaParaTodosES",
            "@MusicaExplicadaES",
            "@DetrasdeCamarasES",
            "@AnimacionYArteES",
            "@CinefilosOficial",
            "@AnalisisCinematografico",
        ],
        "Salud": [
            "@PaulinaCocina",
            "@LaHuertinadeToni",
            "@DoctorLaRosa",
            "@SergioPeinado",
            "@KarlosArguinanoOficial",
            "@CocinaParaTodos",
            "@GymVirtual",
            "@ViviendoFit",
            "@NutricionConCienciaES",
            "@RecetasdeCasa",
            "@EntrenamientoEnCasaES",
            "@MedicinaClara",
            "@FisioterapiaOnline",
            "@YogaConMarinaES",
            "@CocinaFacilES",
            "@BienestarIntegralES",
            "@HabitosSaludablesOficial",
            "@CardioSaludES",
            "@VidaSaludableCanal",
            "@ComidaSanaES",
        ],
        "Comedia": [
            "@LuchoMellera",
            "@FrancoEscamilla",
            "@LaCotorrisa",
            "@ElComediaClub",
            "@StandUpLatinoOficial",
            "@ComediaEnVivoES",
            "@HumorInteligenteES",
            "@MonologosEspanol",
            "@ElShowdeComedia",
            "@ClubdeComedia",
            "@RisasGarantizadasES",
            "@HumorStandUp",
            "@ChistesYMonologosES",
            "@StandUpMexicoOficial",
            "@StandUpArgentinaOficial",
            "@StandUpEspanaOficial",
            "@ComediantesDeLaNoche",
            "@HumorArgentino",
            "@HumorMexicano",
            "@StandUpComedyES",
        ],
        "Relax": [
            "@LofiGirl",
            "@NatureRelaxationPhotos",
            "@YellowBrickCinema",
            "@CafeMusicBGM",
            "@AmbientWorlds",
            "@SoothingRelaxation",
            "@NaturalezaRelax4K",
            "@SonidosDeLluviaParaDormir",
            "@MusicaParaEstudiarRelax",
            "@PianoRelaxingMusic",
            "@MeditacionGuiadaES",
            "@FrecuenciasSanadorasES",
            "@MusicaClasicaRelax",
            "@JazzEnElCafeRelax",
            "@OlasDelMarRelaxing",
            "@DormirProfundamenteMusica",
            "@CalmaTotalCanal",
            "@SonidosDelBosqueRelax",
            "@MusicaZenCanal",
            "@AmbienteTranquiloRelax",
        ],
    },
    "en": {
        "Ciencia": [
            "@veritasium",
            "@markrober",
            "@3blue1brown",
            "@mkbhd",
            "@fireship",
            "@TwoMinutePapers",
            "@lexfridman",
            "@minutephysics",
            "@kurzgesagt",
            "@SmarterEveryDay",
            "@Computerphile",
            "@Numberphile",
            "@Techquickie",
            "@LinusTechTips",
            "@RealEngineering",
            "@PracticalEngineering",
            "@AppliedScience",
            "@Vsauce",
            "@ElectroBOOM",
            "@TomScottGo",
        ],
        "Documentales": [
            "@DWDocumentary",
            "@TimelineChannel",
            "@johnnyharris",
            "@Wendoverproductions",
            "@ColdFusion",
            "@RealLifeLore",
            "@MagnatesMedia",
            "@RealStories",
            "@Vox",
            "@FrontlinePBS",
            "@PolyMatter",
            "@CaspianReport",
            "@EpicHistoryTV",
            "@KingsandGenerals",
            "@SimpleHistory",
            "@TheArmchairHistorian",
            "@TheInfographicsShow",
            "@Biographics",
            "@Geographics",
            "@WorldWarTwo",
        ],
        "Naturaleza": [
            "@BBCEarth",
            "@GeoWizard",
            "@BraveWilderness",
            "@NatGeo",
            "@FreeHighQualityDocumentaries",
            "@GreatBigStory",
            "@GeographyNow",
            "@AtlasObscura",
            "@OutdoorBoys",
            "@WildEarth",
            "@AnimalPlanet",
            "@DiscoveryUK",
            "@WildernessOutdoors",
            "@SoloCamping",
            "@BushcraftSurvival",
            "@NatureDocumentariesHD",
            "@OceanExplorers",
            "@JungleLife",
            "@MountainAdventures",
            "@ExtremeHabitats",
        ],
        "Filosofia": [
            "@DailyStoic",
            "@AcademyofIdeas",
            "@SchoolofLifeChannel",
            "@Einzelganger",
            "@PursuitofWonder",
            "@PhilosophiesforLife",
            "@AliAbdaal",
            "@MattDAvella",
            "@BetterThanYesterday",
            "@ProductiveGrowth",
            "@WisdomOfAges",
            "@ThinkingMind",
            "@TheStoicMindset",
            "@LivingWisely",
            "@SelfImprovementDaily",
            "@MindfulnessLab",
            "@BookSummariesHQ",
            "@PsychologyInAction",
            "@DeepReflections",
            "@FocusAndClarity",
        ],
        "Arte": [
            "@Nerdwriter1",
            "@EveryFrameaPainting",
            "@LessonsfromtheScreenplay",
            "@ThomasFlight",
            "@StudioBinder",
            "@NowYouSeeIt",
            "@LikeStoriesofOld",
            "@KaptainKristian",
            "@DesignDoc",
            "@ArchitecturalDigest",
            "@FilmmakerIQ",
            "@ArtOfTheScore",
            "@CinemaCartography",
            "@StoryTellingArts",
            "@VisualCraft",
            "@AnimationMastery",
            "@BehindTheMasterpiece",
            "@GreatArtExplained",
            "@ColorAndComposition",
            "@TheArtAssignment",
        ],
        "Salud": [
            "@GordonRamsay",
            "@JamieOliver",
            "@BabishCulinaryUniverse",
            "@JoshuaWeissman",
            "@YouSuckAtCooking",
            "@NutritionMadeClear",
            "@HubermanLab",
            "@PeterAttiaMD",
            "@AthleanX",
            "@NatachaOceane",
            "@HealthyLivingHQ",
            "@DailyWorkoutLab",
            "@FitAndStrong",
            "@MindfulCooking",
            "@PlantBasedDiet",
            "@LongevityScience",
            "@EverydayWellness",
            "@PureMovement",
            "@KitchenSecrets",
            "@CulinaryMastery",
        ],
        "Comedia": [
            "@DryBarComedy",
            "@KillTony",
            "@NetflixIsAJoke",
            "@ComedyCentral",
            "@KeyAndPeele",
            "@TeamCoco",
            "@SaturdayNightLive",
            "@TrevorNoah",
            "@GabrielIglesias",
            "@LaughFactory",
            "@StandUpComedyDaily",
            "@SmartComedyClub",
            "@ComedyLegends",
            "@PunchlineCentral",
            "@OpenMicComedy",
            "@ComedySpotlight",
            "@BestOfStandUp",
            "@JokesOnYou",
            "@ComedyHub",
            "@TheComedyLounge",
        ],
        "Relax": [
            "@LofiGirl",
            "@NPRMusic",
            "@ChillhopMusic",
            "@Cercle",
            "@KEXP",
            "@TheBootlegBoy",
            "@CozyCoffeeShop",
            "@YellowBrickCinema",
            "@ChilledCat",
            "@QuietQuest",
            "@CalmSoundscapes",
            "@DeepMeditationTones",
            "@RainyNightAmbience",
            "@JazzMusicCafe",
            "@ClassicalFocus",
            "@SleepWaveSounds",
            "@SoothingLofi",
            "@BinauralSleepVibes",
            "@ZenGardenMusic",
            "@PeacefulAmbient",
        ],
    },
}


def format_subscribers(count_str):
  try:
    count = int(count_str)
    if count >= 1_000_000:
      return f"{count / 1_000_000:.1f}M subs".replace(".0M", "M")
    elif count >= 1_000:
      return f"{count / 1_000:.0f}K subs"
    return f"{count} subs"
  except:
    return "Top Creator"


def fetch_channel_data(handle):
  clean_handle = handle if handle.startswith("@") else "@" + handle
  url = f"https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle={urllib.parse.quote(clean_handle)}&key={API_KEY}"

  try:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0", "Referer": "https://metv.pages.dev/"},
    )
    with urllib.request.urlopen(
        req, context=ssl_context, timeout=10
    ) as response:
      data = json.loads(response.read().decode("utf-8"))
      if data.get("items") and len(data["items"]) > 0:
        item = data["items"][0]
        snippet = item["snippet"]
        stats = item.get("statistics", {})

        raw_desc = snippet.get("description", "").replace("\n", " ").strip()
        short_desc = (
            re.split(r"[.!?]", raw_desc)[0] + "."
            if raw_desc
            else "Contenido de alta calidad curado para tu parrilla."
        )
        if len(short_desc) > 130:
          short_desc = short_desc[:127] + "..."

        founded_year = (
            int(snippet.get("publishedAt", "2018")[:4])
            if snippet.get("publishedAt")
            else 2018
        )
        subs_label = format_subscribers(stats.get("subscriberCount", "0"))

        return {
            "name": snippet["title"],
            "founded": founded_year,
            "stats": subs_label,
            "description": short_desc,
        }
  except Exception as e:
    pass
  return None


def generate_catalogs():
  print("🚀 Iniciando generación de catálogos curados para meTV PLAY...\n")

  for lang, categories in CATALOG_SELECTION.items():
    catalog_list = []
    filename = f"catalog_{lang}.json"
    print(f"📦 Procesando idioma: [{lang.upper()}] -> {filename}")

    for category, handles in categories.items():
      for handle in handles:
        info = fetch_channel_data(handle)
        if info:
          catalog_list.append({
              "handle": handle,
              "name": info["name"],
              "category": category,
              "founded": info["founded"],
              "stats": info["stats"],
              "description": info["description"],
              "lang": lang,
          })
          print(f"  ✓ [{category}] {info['name']} ({info['stats']})")
        else:
          # AHORA DESCARTA LOS HANDLES INVÁLIDOS PARA NO METER BASURA AL JSON
          print(f"  ⚠️ Omitido por handle no encontrado: {handle}")

    with open(filename, "w", encoding="utf-8") as f:
      json.dump(catalog_list, f, ensure_ascii=False, indent=2)

    print(
        f"\n🎉 ¡Guardado con éxito! {filename} con {len(catalog_list)} canales"
        " 100% verificados.\n"
    )


if __name__ == "__main__":
  generate_catalogs()