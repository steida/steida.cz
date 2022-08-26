import { Reader } from "fp-ts/Reader";
import { IntlShape } from "react-intl";

export const createFormattedDate =
  (timestamp: string): Reader<IntlShape, string> =>
  (intl) =>
    intl.formatDate(parseInt(timestamp, 36) * 1000, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
