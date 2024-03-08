import { cleanString } from "../helpers/string";
import { getURLQuery } from "../helpers/url";
import { IMod } from "../models/mod.model";
import { IModsPage } from "../models/pages/mods.model";
import { Page } from "./page";

async function scrapData(page: Page): Promise<[unknown | null, Error | null]> {
  try {
    let data = null;

    switch(page) {
      case Page.mods:
        data = await scrapModsPage();
        break;
      default:
        throw new Error("Unsupported page!");
    }

    return [data, null];
  } catch (err: any) {
    console.log(err);
    return [null, err];
  }
}

async function scrapModsPage(): Promise<IModsPage | null> {
  try {
    const data: IModsPage = {
      featured: {} as IMod,
      favourite: {} as IMod,
      recommended: {} as IMod,
      mods: []
    };

    const root = document.querySelector(".box-space");
    const mods = await scrapModsPageModsList(root);

    data.mods = mods;

    console.log(data);

    return data;
  } catch (err) {
    throw err;
  }
}

async function scrapModsPageModsList(root: Element | null): Promise<IMod[]> {
  if (!root) throw new Error("Root element not exists!");

  const modList = root.querySelectorAll(".mod-item");
  if (!modList || modList.length === 0) throw new Error("Unable to find elements for mods list!");

  const mods: IMod[] = [];

  modList.forEach(modElement => {
    const mod: IMod = {
      id: "",
      name: "",
      author: "",
      rating: 0
    };

    const modImageContainer = modElement.querySelector(".mod-item__img");

    if (!modImageContainer) throw new Error("Unable to find mod image container!");
    const modImageLabel = modImageContainer.querySelector("mod-label");

    if (modImageLabel) {
      // mod.label = modImageLabel.innerHTML;
    }

    const modLink = modImageContainer.querySelector("a");
    if (!modLink) throw new Error("Unable to find mod image link!");

    const modImage = modLink.querySelector("img");
    if (!modImage) throw new Error("Unable to find mod image!");

    mod.iconUrl = modImage.src;

    const modContent = modElement.querySelector(".mod-item__content");
    if (!modContent) throw new Error("Unable to find mod content!");

    const modName = modContent.querySelector("h4");
    if (!modName) throw new Error("Unable to find mod name!");

    mod.name = modName.innerHTML;

    const authorContainer = modElement.querySelector("p");
    if (!authorContainer) throw new Error("Unable to find mod author!");

    const modAuthor = authorContainer.querySelector("span");
    if (!modAuthor) throw new Error("Unable to find mod author!");

    mod.author = cleanString(modAuthor.innerHTML, / (.+)/);

    const modRating = modElement.querySelector(".mod-item__rating-num");
    if (!modRating) throw new Error("Unable to find mod rating!");

    mod.rating = Number(cleanString(modRating.innerHTML, /^([\d.]+)/));
    mod.ratingCount = Number(cleanString(modRating.innerHTML, /\((\d+)\)/));

    const modId = modElement.querySelector("a");
    if (!modId) throw new Error("Unable to find mod link!");

    const query = getURLQuery(modId.href);
    if (!query || Object.keys(query).length === 0) throw new Error("Unable to find mod id!");

    mod.id = query.mod_id;

    mods.push(mod);
  });

  console.log(mods);

  return mods;
}

export { scrapData };