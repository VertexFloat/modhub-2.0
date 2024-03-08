import { IMod } from "../mod.model";

export interface IModsPage {
  featured: IMod;
  favourite: IMod;
  recommended: IMod;
  mods: IMod[];
}