import { SnapPoint } from "@tabletop-playground/api";
import { Card } from "@tabletop-playground/api";

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
      name: string;
      mysteryTemplateId?: string;
      researchTemplateId?: string;
      specialTemplateIds?: Record<string, string>;
    }
  }

  interface GameDifficulty {
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
    };
    startingLocation: keyof GameBoardLocations["space"];
    personalStory: string;
  }

  interface AncientOne {
    name: string;
    doom: keyof GameBoardLocations["doom"];
    sheetId: string;
    mythosDeck: MythosDeckOptions;
    mysteryTemplateIds: string[];
    researchTemplateIds: string[];
    specialTemplateIds?: Record<string, string[]>;
    monsters?: Record<string, number>;
    customSetup?: () => void;
  }

  interface EldritchHorrorGameWorld {
    ancientOnes: AncientOne[];
    investigators: Investigator[];
    alreadyLoaded: string[];
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
    space: {
      Antarctica: SnapPoint;
      Arkham: SnapPoint;
      "Buenos Aries": SnapPoint;
      Istanbul: SnapPoint;
      London: SnapPoint;
      Rome: SnapPoint;
      "San Francisco": SnapPoint;
      Shanghai: SnapPoint;
      Sydney: SnapPoint;
      "The Amazon": SnapPoint;
      "The Heart of Africa": SnapPoint;
      "The Himalayas": SnapPoint;
      "The Pyramids": SnapPoint;
      Tokyo: SnapPoint;
      Tunguska: SnapPoint;
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
      21: SnapPoint;
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
  }
}
