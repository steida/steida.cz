import { string } from "fp-ts";

export const createTitle = (prefix?: string) =>
  `${prefix ? `${prefix} | ` : string.empty}Daniel Steigerwald`;
