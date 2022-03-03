const { refCard, world, Vector } = require("@tabletop-playground/api");
const { Util } = require("../util");
const { tableLocations, expansionSpawn } = require("../world-constants");

/** @type {AncientOne} */
const nyarlathotep = {
  name: "Nyarlathotep",
  doom: 12,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["D265B2DB44A312FD532180BE4363A0D9"],
  researchTemplateIds: ["B37A788C4D37C0F7A88FF3AC94C5984A"],
  specialTemplateIds: {
    "City Beneath the Sands": ["1B2DB6DC498E5B12FAD3A19EDB118640"],
    "Sphinx's Labyrinth": ["3031CFCD4D3558758FAA009C3086EEF8"],
  },
  mythosDeck: {
    stage1: { green: 1, yellow: 2, blue: 1 },
    stage2: { green: 2, yellow: 3, blue: 1 },
    stage3: { green: 2, yellow: 4, blue: 0 },
  },
  customSetup: () => {
    if (!tableLocations.adventureDeck) {
      throw new Error("Unable to find location for adventure");
    }

    const adventureBagLocation = tableLocations.adventureDeck
      .getGlobalPosition()
      .add(new Vector(0, 7, 0));
    const adventureBag = Util.createContainer(
      "7D4457334FE9A8DF3D57A19518F3C775",
      adventureBagLocation
    );
    adventureBag.snapToGround();
    adventureBag.setId("nyarlathotep-adventure-bag");
    adventureBag.setName("Nyarlathotep's Adventures");

    const adventureIds = [
      "28952AA8494DF4F20962579EC8AABF47", // Brotherhood of the Dark Pharaoh
      "78AE288643D97160D5A130BA28C5B3D7", // Cult of the Bloody Tongue
      "56F59EF14921255E3233DF9720514159", // Cult of the Sand Bat
      "F4AFDAF24B24F9FF99392C8919AD34A4", // Order of the Bloated Woman
      "BEEB07464B9819C2D6BAB883A88C9146", // adventure token
    ];
    for (const adventureId of adventureIds) {
      const adventureCards = Util.createCard(expansionSpawn, adventureId);
      adventureBag.addObjects([adventureCards], 0);
    }

    // TODO setup the adventure corresponding to the drawn mystery.
    // Be careful that preludes like "In the Lightless Chamber" changes the mystery after this has executed.
    // Also some preludes spawn their own adventures.
  },
};

world.__eldritchHorror.ancientOnes.set(nyarlathotep.name, nyarlathotep);
