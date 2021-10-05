const { world, GameObject, Vector, SnapPoint, Card } = require("@tabletop-playground/api");
const { Util } = require("./util");
const {
  eldritchToken,
  gameBoardLocations,
  doomToken,
  gateStack,
  cluePool,
  monsterCup,
  assetDeck,
  conditionDeck,
  shipTicket,
  tableLocations,
  epicMonsterCup,
  omenToken,
} = require("./world-constants");

class GameUtil {
  /**
   * @param {number} number
   */
  static advanceDoom(number = 1) {
    const doomCount = findDoomCount();
    if (doomCount) {
      // @ts-ignore
      const advancedDoomSnapShot = gameBoardLocations.doom[doomCount - number];
      if (advancedDoomSnapShot) {
        Util.moveObject(doomToken, advancedDoomSnapShot);
      }
    }
  }

  /**
   * @param {number} number
   */
  static retreatDoom(number = 1) {
    const doomCount = findDoomCount();
    if (doomCount) {
      // @ts-ignore
      const retreatedDoomSnapShot = gameBoardLocations.doom[doomCount + number];
      if (retreatedDoomSnapShot) {
        Util.moveObject(doomToken, retreatedDoomSnapShot);
      }
    }
  }

  /**
   * @param {number} number
   */
  static takeEldritchTokens(number = 1) {
    const stackPos = eldritchToken.getPosition().add(new Vector(0, 0, 3));
    const tokenStack = Util.createCard("2B59F5E24A16BA40DBA5DEB42AA14D89", stackPos);

    if (number > 1) {
      for (let i = 1; i < number; i++) {
        tokenStack.addCards(Util.createCard("2B59F5E24A16BA40DBA5DEB42AA14D89", stackPos));
      }
    }

    return tokenStack;
  }

  /**
   * @param {number} number
   */
  static takeFocusTokens(number = 1) {
    const focusStack = world.getObjectById("focus-token");
    if (!focusStack) {
      throw new Error("Unable to find focus token");
    }
    const stackPos = focusStack.getPosition().add(new Vector(0, 0, 3));
    const focusToken = Util.createCard("414DCAD946F6CCB38C7D8BB8F8838008", stackPos);

    if (number > 1) {
      for (let i = 1; i < number; i++) {
        focusToken.addCards(Util.createCard("414DCAD946F6CCB38C7D8BB8F8838008", stackPos));
      }
    }

    return focusToken;
  }

  /**
   * @param {number} number
   */
  static takeDevastationTokens(number = 1) {
    const devastationStack = world.getObjectById("devastation-token");
    if (!devastationStack) {
      throw new Error("Unable to find devastation token");
    }
    const stackPos = devastationStack.getPosition().add(new Vector(0, 0, 3));
    const devastationToken = Util.createCard("41A12F664413E91443499C984A9A80F9", stackPos);

    if (number > 1) {
      for (let i = 1; i < number; i++) {
        devastationToken.addCards(Util.createCard("41A12F664413E91443499C984A9A80F9", stackPos));
      }
    }

    return devastationToken;
  }

  /**
   * @param {number} number
   * @throws If unable to take ship token from travel tickets template object
   */
  static takeShipTokens(number = 1) {
    const stackPos = shipTicket.getPosition().add(new Vector(0, 0, 3));
    const travelTickets = Util.createCard("934AA7324CE46C2AC3DF2999F5F3EFEB", stackPos);
    const shipTokens = Util.takeCardNameFromStack(travelTickets, "ship");
    travelTickets.destroy();

    if (!shipTokens) {
      throw new Error("Unable to take ship token");
    }

    if (number > 1) {
      const json = shipTokens.toJSONString();
      for (let i = 1; i < number; i++) {
        const copiedToken = Util.cloneCardFromJson(json, stackPos);
        shipTokens.addCards(copiedToken);
      }
    }

    return shipTokens;
  }

  /**
   * @param {number} number
   * @throws If unable to find snap point for spawned gate
   * @returns {[gateName: string, monsterName: string | undefined][]}
   */
  static spawnGates(number = 1) {
    /** @type {[gateName: string, monsterName: string | undefined][]} */
    const output = [];

    for (let i = 0; i < number; i++) {
      const gateToken = gateStack.takeCards(1);
      if (gateToken) {
        const gateDetails = gateToken.getCardDetails();
        if (gateDetails) {
          if (!gateToken.isFaceUp()) {
            Util.flip(gateToken);
          }
          const gateName = gateDetails.name;
          // @ts-ignore
          const snapPoint = gameBoardLocations.space[gateName];
          if (!snapPoint) {
            throw new Error(`Cannot find snap point for gate: ${gateName}`);
          }
          Util.moveObject(gateToken, snapPoint);

          const monster = GameUtil.spawnMonster(snapPoint);
          let monsterName;
          if (monster) {
            const monsterDetails = monster.getCardDetails();
            if (monsterDetails) {
              monsterName = monsterDetails.name;
            }
          }

          output.push([gateName, monsterName]);
        }
      }
    }

    return output;
  }

  /**
   * @param {number} number
   * @throws If unable to find snap point for spawned clue
   * @returns {string[]} Names of spawned clues
   */
  static spawnClues(number = 1) {
    const output = [];

    for (let i = 0; i < number; i++) {
      const clueToken = cluePool.takeCards(1);
      if (clueToken) {
        const cardDetails = clueToken.getCardDetails();
        if (cardDetails) {
          const clueName = cardDetails.name;
          // @ts-ignore
          const snapPoint = gameBoardLocations.space[clueName];
          if (!snapPoint) {
            throw new Error(`Cannot find snap point for clue: ${clueName}`);
          }
          Util.moveOrAddObject(clueToken, snapPoint);

          output.push(clueName);
        }
      }
    }

    return output;
  }

  /**
   * @param {SnapPoint} reserveSnapPoint
   */
  static restockReserve(reserveSnapPoint) {
    // WARN don't use default snap radius else it'll find the underlying table mat
    const isOccupied = reserveSnapPoint.getSnappedObject(1);
    if (isOccupied) {
      return; // abort - already a card here
    }
    const drawnAssetCard = assetDeck.takeCards(1);
    if (!drawnAssetCard) {
      throw new Error("Unable to draw card from the asset deck");
    }
    Util.flip(drawnAssetCard);
    Util.moveObject(drawnAssetCard, reserveSnapPoint);
  }

  static drawDebtCondition() {
    const drawnDebtCard = Util.takeCardNameFromStack(conditionDeck, "Debt");
    if (!drawnDebtCard) {
      throw new Error("Unable to draw Debt card from the conditions deck");
    }

    Util.moveOrAddObject(drawnDebtCard, gameBoardLocations.bankLoan);
  }

  static getActivePrelude() {
    if (world.__eldritchHorror.activePrelude) {
      return world.__eldritchHorror.preludes.get(world.__eldritchHorror.activePrelude);
    }
  }

  static getActiveAncientOne() {
    return world.__eldritchHorror.activeAncientOne;
  }

  /**
   * @param {GameObject} deck
   */
  static addEncounterDeck(deck) {
    Util.insertObjectAt(deck, tableLocations.topDeckRow, 0);

    return tableLocations.topDeckRow[0];
  }

  /**
   * Takes {@link monsterName} from the monster cup and moves it near the ancient one sheet, this is considered "set aside"
   *
   * @param {string} monsterName
   * @param {number} [count]
   * @returns {[monsterStack: Card, snapPoint: SnapPoint]}
   */
  static setAsideMonster(monsterName, count = 1) {
    const monsterStack = Util.takeCardNameFromStack(monsterCup, monsterName, count);
    if (!monsterStack) {
      throw new Error(`Unable to find "${monsterName}" in the monster cup`);
    }
    const availablePosition = Util.getNextAvailableSnapPoint(tableLocations.ancientOneMonsters);
    Util.moveObject(monsterStack, availablePosition);

    return [monsterStack, availablePosition];
  }

  /**
   * Spawns a monster from the monster cup
   *
   * @param {SnapPoint | Vector} position
   */
  static spawnMonster(position) {
    const monster = monsterCup.takeCards(1);
    if (monster) {
      Util.moveOrAddObject(monster, position);
    }

    return monster;
  }

  /**
   * @param {string} monsterName
   * @param {SnapPoint | Vector} position
   * @throws If unable to find `monsterName`
   */
  static spawnEpicMonster(monsterName, position) {
    const epicMonster = Util.takeCardNameFromStack(epicMonsterCup, monsterName);
    if (!epicMonster) {
      throw new Error(`Unable to find "${monsterName}" in the epic monster cup`);
    }

    Util.moveOrAddObject(epicMonster, position);

    return epicMonster;
  }

  /**
   * @param {string} monsterName
   */
  static takeMonster(monsterName) {
    return (
      // first try the monster cup
      Util.takeCardNameFromStack(monsterCup, monsterName) ||
      // next try to find amongst Set Aside monsters
      GameUtil.takeSetAsideMonster(monsterName)
    );
  }

  /**
   * @param {string} monsterName
   */
  static takeSetAsideMonster(monsterName) {
    for (const snapPoint of tableLocations.ancientOneMonsters) {
      const snappedObject = snapPoint.getSnappedObject();
      if (snappedObject instanceof Card) {
        if (snappedObject.getStackSize() > 1) {
          const monster = Util.takeCardNameFromStack(snappedObject, monsterName);
          if (monster) {
            return monster;
          }
        } else {
          const cardDetails = snappedObject.getCardDetails();
          if (cardDetails && cardDetails.name === monsterName) {
            return snappedObject;
          }
        }
      }
    }
  }

  /**
   * @param {SavedData} data
   */
  static setSavedData(data) {
    Util.setSavedData(data);
  }

  /**
   * @param {Partial<SavedData>} data
   */
  static updateSavedData(data) {
    Util.setSavedData(Object.assign(GameUtil.getSavedData(), data));
  }

  /**
   * @returns {SavedData}
   */
  static getSavedData() {
    const data = Util.getSavedData();
    if (!data || !data.sets === undefined) {
      return { sets: [] };
    }

    return data;
  }

  static getCurrentOmenColor() {
    if (gameBoardLocations.omen.green.getSnappedObject() === omenToken) {
      return "green";
    }
    if (gameBoardLocations.omen.blue1.getSnappedObject() === omenToken) {
      return "blue";
    }
    if (gameBoardLocations.omen.red.getSnappedObject() === omenToken) {
      return "red";
    }
    if (gameBoardLocations.omen.blue2.getSnappedObject() === omenToken) {
      return "blue";
    }

    throw new Error("Unable to find omen token");
  }

  /**
   * @param {number} number
   */
  static advanceOmen(number = 1) {
    const omenTrack = [
      gameBoardLocations.omen.green,
      gameBoardLocations.omen.blue1,
      gameBoardLocations.omen.red,
      gameBoardLocations.omen.blue2,
    ];

    const currentOmenIndex = omenTrack.findIndex((x) => x.getSnappedObject() === omenToken);
    const advancedOmenSnapShot = omenTrack[(currentOmenIndex + number) % 4];
    Util.moveObject(omenToken, advancedOmenSnapShot);

    // TODO advance doom for each matching gates
  }

  static getActiveIconReference() {
    return world.__eldritchHorror.activeIconReference;
  }
}
exports.GameUtil = GameUtil;

function findDoomCount() {
  for (const [doom, snapPoint] of Object.entries(gameBoardLocations.doom)) {
    const snappedObject = snapPoint.getSnappedObject();
    if (snappedObject !== undefined) {
      if (snappedObject === doomToken) {
        return Number(doom);
      }
    }
  }
}
