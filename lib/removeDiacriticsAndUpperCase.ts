import { string } from "fp-ts";
import { Endomorphism } from "fp-ts/Endomorphism";

// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
export const removeDiacriticsAndUpperCase: Endomorphism<string> = (s) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, string.empty)
    .toLowerCase();
