import {addIcons, OhVueIcon} from "oh-vue-icons";
import {BiCheck2All, BiPlusLg, BiTrash} from "oh-vue-icons/icons";

addIcons(BiCheck2All, BiPlusLg, BiTrash);

export function setupIcons(app) {
  app.component("v-icon", OhVueIcon);
}
