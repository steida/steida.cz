import { either, readonlyArray, string } from "fp-ts";
import { identity, pipe } from "fp-ts/function";
import { Endomorphism } from "fp-ts/Endomorphism";
import { Reader } from "fp-ts/Reader";

interface PerexConfig {
  readonly maxLength: number;
  readonly modifier?: Endomorphism<string>;
}

interface Perex {
  readonly text: string;
  readonly isTrimmed: boolean;
}

export const createPerex =
  (text: string): Reader<PerexConfig, Perex> =>
  ({ maxLength, modifier = identity }) =>
    pipe(
      text.trim().split(/(\s+)/),
      readonlyArray.reduce(
        either.right<readonly string[], readonly string[]>([]),
        (chunks, chunk) =>
          pipe(
            chunks,
            either.map(readonlyArray.append(chunk)),
            either.filterOrElseW(
              (a) => modifier(a.join(string.empty)).length < maxLength,
              readonlyArray.dropRight(1)
            )
          )
      ),
      either.map(
        (a): Perex => ({
          text: modifier(a.join(string.empty)),
          isTrimmed: false,
        })
      ),
      either.getOrElseW(
        (a): Perex => ({
          text: pipe(
            a.join(string.empty),
            string.trim,
            (s) => s + "…",
            modifier
          ),
          isTrimmed: true,
        })
      )
    );
