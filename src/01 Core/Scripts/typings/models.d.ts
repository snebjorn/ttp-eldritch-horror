interface MythosDeckOptions {
  stage1: MythosColor;
  stage2: MythosColor;
  stage3: MythosColor;
}

interface MythosColor {
  green: number;
  yellow: number;
  blue: number;
}

interface GameSetupOptions {
  difficulty: GameDifficulty;
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
  startingLocation: string;
  personalStory: string;
}

interface AncientOne {
  name: string;
  doom: number;
  sheetId: string;
  mythosDeck: MythosDeckOptions;
  mysteryTemplateId: string[];
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
