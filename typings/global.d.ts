import {
  Card,
  GameObject,
  MultistateObject,
  Player,
  SnapPoint,
  Vector,
} from "@tabletop-playground/api";

// augmenting TTP module - https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@tabletop-playground/api" {
  interface GameWorld {
    /**
     * Global variable for storing Eldritch Horror data
     */
    // it's assumed initGlobalObject() is executed as the very first thing,
    // as without ?. support I cannot be bothered to define this as optional :-/
    __eldritchHorror: EldritchHorrorGameWorld;
  }
}

declare global {
  interface MythosDeckOptions {
    stage1: MythosColorOptions;
    stage2: MythosColorOptions;
    stage3: MythosColorOptions;
  }

  type MythosCardColors = "green" | "yellow" | "blue";
  type MythosColorOptions = Record<MythosCardColors, number>;

  interface MythosSetupDecks {
    green: MythosCardDifficult;
    yellow: MythosCardDifficult;
    blue: MythosCardDifficult;
  }

  interface MythosCardDifficult {
    easy: Card;
    medium: Card;
    hard: Card;
  }

  namespace Expansion {
    type MythosCards = Record<MythosCardColors, Partial<MythosCardDifficult>>;

    interface AncientOne {
      name: AncientOneName;
      mysteryTemplateId?: string;
      researchTemplateId?: string;
      specialTemplateIds?: Record<string, string>;
    }

    interface Items {
      ancientOneSheets?: Card[];
      artifactCards?: Card;
      assetCards?: Card;
      conditionCards?: Card;
      encounterCards?: Partial<EncounterCards>;
      epicMonsters?: Card;
      focus?: true;
      impairment?: true;
      resource?: true;
      gates?: Card;
      investigators?: Card;
      monsters?: Card;
      mythosCards?: Partial<Expansion.MythosCards>;
      spellCards?: Card;
      preludeCards?: Card;
      uniqueAssetCards?: Card;
      personalStories?: {
        missions: string;
        rewards: string;
        consequences: string;
      };
    }
  }

  interface MythosDifficulty {
    isEasy: boolean;
    isMedium: boolean;
    isHard: boolean;
  }

  interface Investigator {
    name: string;
    pawnTemplateId: string;
    health: number;
    sanity: number;
    startingItems: {
      clues?: number;
      spells?: string[];
      assets?: string[];
      uniqueAssets?: string[];
      conditions?: string[];
      focus?: number;
      resources?: number;
      will?: number;
      shipTickets?: number;
    };
    startingLocation: keyof GameBoardLocations["space"] | undefined;
    personalStory: string;
  }

  interface ExtraItems {
    randomArtifacts?: number;
    randomAssets?: number;
    randomSpells?: number;
    clues?: number;
    focus?: number;
    resources?: number;
    asset?: string;
    condition?: string;
    strength?: number;
    will?: number;
    eldritchTokens?: number;
    monster?: string;
  }

  interface Prelude {
    /** Indicates if this Prelude spawns a side board and in what orientation */
    spawnsSideBoard?: (ancientOne: string) => "landscape" | "portrait" | undefined;
    /** Organize Tokens */
    step2?: (ancientOne: string, iconReference?: IconReference) => void;
    /** Choose and Place Investigators */
    step3?: (ancientOne: string, iconReference?: IconReference) => void;
    /** Receive Starting Possessions, Health, and Sanity */
    step4?: (ancientOne: string, iconReference?: IconReference) => void;
    /** Determine Ancient One */
    step5?: (
      ancientOne: string,
      sideBoardSpawn?: Vector,
      iconReference?: IconReference
    ) => (() => void) | undefined | void;
    /** Create Monster Cup */
    step6?: (ancientOne: string, iconReference?: IconReference) => void;
    /** Separate and Place Decks */
    step7?: (ancientOne: string, iconReference?: IconReference) => void;
    /** Build Mythos Deck */
    step8?: (ancientOne: string, iconReference?: IconReference) => void;
    /** Resolve Starting Effects */
    step9?: (ancientOne: string, iconReference?: IconReference) => void;
    afterResolvingSetup?: (ancientOne: string, iconReference?: IconReference) => void;
    investigatorSetup?: (
      investigator: Investigator,
      investigatorSheet: Card,
      healthToken: MultistateObject,
      sanityToken: MultistateObject,
      pawn: GameObject,
      ancientOne: string,
      player: Player
    ) => ExtraItems | void;
  }

  type AncientOneName =
    | "Azathoth"
    | "Cthulhu"
    | "Shub-Niggurath"
    | "Yog-Sothoth"
    | "Yig"
    | "Rise of the Elder Things"
    | "Ithaqua"
    | "Syzygy"
    | "Abhoth"
    | "Nephren-Ka"
    | "Hastur"
    | "Atlach-Nacha"
    | "Hypnos"
    | "Shudde M'ell"
    | "Antediluvium"
    | "Nyarlathotep";

  interface AncientOne {
    name: AncientOneName;
    doom: keyof GameBoardLocations["doom"];
    sheetId: string;
    mythosDeck: MythosDeckOptions;
    mysteryTemplateIds: string[];
    researchTemplateIds: string[];
    specialTemplateIds?: Record<string, string[]>;
    monsters?: Record<string, number>;
    /** Indicates if this Ancient One spawns a side board and in what orientation */
    sideBoard?: "landscape" | "portrait";
    customSetup?: (sideBoardSpawn?: Vector) => void;
  }

  interface EldritchHorrorGameWorld {
    ancientOnes: Map<AncientOneName, AncientOne>;
    activeAncientOne?: AncientOne;
    investigators: Investigator[];
    alreadyLoaded: string[];
    updateSetupUIFn?: () => void;
    preludes: Map<string, Prelude>;
    mysticRuins: Set<string>;
  }

  interface IconReference {
    numberOfPlayers: number;
    spawnGates: number;
    spawnClues: number;
    monsterSurge: number;
  }

  interface EncounterCards {
    otherWorld: Card;
    america: Card;
    europe: Card;
    asia: Card;
    general: Card;
    expedition: Card;
  }

  interface GameBoardLocations {
    space: Partial<SideBoard.Antarctica> &
      Partial<SideBoard.Egypt> &
      Partial<SideBoard.Dreamlands> & {
        Antarctica: SnapPoint;
        Arkham: SnapPoint;
        "Buenos Aires": SnapPoint;
        Istanbul: SnapPoint;
        London: SnapPoint;
        Stonehenge: SnapPoint; // London
        Rome: SnapPoint;
        "San Francisco": SnapPoint;
        Shanghai: SnapPoint;
        "Great Wall of China": SnapPoint; // Shanghai
        Sydney: SnapPoint;
        "The Amazon": SnapPoint;
        "The Heart of Africa": SnapPoint;
        "The Himalayas": SnapPoint;
        "The Pyramids": SnapPoint;
        Tokyo: SnapPoint;
        Tunguska: SnapPoint;
        1: SnapPoint;
        2: SnapPoint;
        Mu: SnapPoint; // space 2
        3: SnapPoint;
        "Moai Statues": SnapPoint; // space 3
        "R'lyeh": SnapPoint; // space 3
        4: SnapPoint;
        5: SnapPoint;
        6: SnapPoint;
        7: SnapPoint;
        "Chichen Itza": SnapPoint; // space 7
        8: SnapPoint;
        Atlantis: SnapPoint; // space 8
        9: SnapPoint;
        10: SnapPoint;
        11: SnapPoint;
        12: SnapPoint;
        13: SnapPoint;
        Hyperborea: SnapPoint; // space 13
        14: SnapPoint;
        15: SnapPoint;
        16: SnapPoint;
        17: SnapPoint;
        18: SnapPoint;
        19: SnapPoint;
        20: SnapPoint;
        21: SnapPoint;
        Pnakotus: SnapPoint; // space 21
      };
    bankLoan: SnapPoint;
    reserve: SnapPoint[];
    doom: {
      0: SnapPoint;
      1: SnapPoint;
      2: SnapPoint;
      3: SnapPoint;
      4: SnapPoint;
      5: SnapPoint;
      6: SnapPoint;
      7: SnapPoint;
      8: SnapPoint;
      9: SnapPoint;
      10: SnapPoint;
      11: SnapPoint;
      12: SnapPoint;
      13: SnapPoint;
      14: SnapPoint;
      15: SnapPoint;
      16: SnapPoint;
      17: SnapPoint;
      18: SnapPoint;
      19: SnapPoint;
      20: SnapPoint;
    };
    omen: {
      green: SnapPoint;
      blue1: SnapPoint;
      red: SnapPoint;
      blue2: SnapPoint;
    };
    antarcticaMat?: SideBoard.AntarcticaMat;
    egyptMat?: SideBoard.EgyptMat;
    dreamlandsMat?: SideBoard.DreamlandsMat;
  }

  namespace SideBoard {
    interface AntarcticaMat {
      board: SnapPoint;
      research: SnapPoint;
      mountains: SnapPoint;
      outposts: SnapPoint;
      adventure: SnapPoint;
      activeAdventure: SnapPoint;
      monster1: SnapPoint;
      monster2: SnapPoint;
      monster3: SnapPoint;
      monster4: SnapPoint;
    }

    interface Antarctica {
      "Miskatonic Outpost": SnapPoint;
      "Lake Camp": SnapPoint;
      "Frozen Waste": SnapPoint;
      "City of the Elder Things": SnapPoint;
      "Plateau of Leng": SnapPoint;
      "Snowy Mountains": SnapPoint;
    }

    interface EgyptMat {
      board: SnapPoint;
      africa: SnapPoint;
      egypt: SnapPoint;
      adventure: SnapPoint;
      activeAdventure: SnapPoint;
      monster1: SnapPoint;
      monster2: SnapPoint;
      monster3: SnapPoint;
      monster4: SnapPoint;
    }

    interface Egypt {
      "The Sahara Desert": SnapPoint;
      Alexandria: SnapPoint;
      "The Bent Pyramid": SnapPoint;
      Cairo: SnapPoint;
      "Tel el-Amarna": SnapPoint;
      "The Nile River": SnapPoint;
    }

    interface DreamlandsMat {
      board: SnapPoint;
      dreamQuest: SnapPoint;
      dreamlands: SnapPoint;
      adventure: SnapPoint;
      activeAdventure: SnapPoint;
      monster1: SnapPoint;
      monster2: SnapPoint;
      monster3: SnapPoint;
      monster4: SnapPoint;
    }

    interface Dreamlands {
      "Unknown Kadath": SnapPoint;
      "The Enchanted Wood": SnapPoint;
      Celephaïs: SnapPoint;
      Ulthar: SnapPoint;
      "Dylath-Leen": SnapPoint;
      "The Underworld": SnapPoint;
      "The Moon": SnapPoint;
    }
  }

  interface SavedData {
    sets: string[];
    ancientOne?: AncientOneName;
    isPersonalStory: boolean;
    iconReference?: IconReference;
    isGameBegun: boolean;
  }

  interface MonsterSpawnEffect {
    text: string;
    shouldPing?: true;
    moveTo?: Required<keyof GameBoardLocations["space"]>;
  }
}
