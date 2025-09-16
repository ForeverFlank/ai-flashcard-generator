"use strict";

import { checkAuth } from "./apis/user-api.js";
import { setupTopUI, updateTopRightUI } from "./uis/top-menu-ui.js";
import { setupGeneratorUI } from "./uis/generator-ui.js";
import { setupDeckUI, setupViewModeUI, tryDrawSharedDeck } from "./uis/deck-ui.js";
import { setupExploreUI } from "./uis/explore-ui.js";

document.addEventListener("DOMContentLoaded", async () => {
    await checkAuth();
    updateTopRightUI();

    setupTopUI();
    setupGeneratorUI();
    setupDeckUI();
    setupViewModeUI();
    setupExploreUI();

    await tryDrawSharedDeck();
});