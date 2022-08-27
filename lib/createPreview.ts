import { either, readonlyArray, string } from "fp-ts";
import { identity, pipe } from "fp-ts/function";
import { Endomorphism } from "fp-ts/Endomorphism";
import { Reader } from "fp-ts/Reader";

interface PreviewConfig {
  readonly maxLength: number;
  readonly modifier?: Endomorphism<string>;
}

interface Preview {
  readonly text: string;
  readonly isTrimmed: boolean;
}

export const createPreview =
  (text: string): Reader<PreviewConfig, Preview> =>
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
        (a): Preview => ({
          text: modifier(a.join(string.empty)),
          isTrimmed: false,
        })
      ),
      either.getOrElseW(
        (a): Preview => ({
          text: pipe(
            a.join(string.empty),
            string.trim,
            (s) => (!s.endsWith(".") ? s + "…" : s),
            modifier
          ),
          isTrimmed: true,
        })
      )
    );
