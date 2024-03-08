import { cleanPathname } from "../helpers/url";

export enum Page {
  mods,
  dashboard
};

export const pageMap: { [key: string]: Page } = {
  mods: Page.mods,
  modHubBEMain: Page.dashboard
};

function getCurrentPageQuery() {

}

function getCurrentPage(): Page | null {
  const pathname = cleanPathname(window.location.pathname)
  return pageMap[pathname]
}

export {
  getCurrentPage,
  getCurrentPageQuery
};