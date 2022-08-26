import {
  eq,
  json,
  number,
  option,
  ord,
  readonlyArray,
  string,
  taskEither,
} from "fp-ts";
import { Endomorphism } from "fp-ts/Endomorphism";
import { flow, identity, pipe } from "fp-ts/function";
import { Option } from "fp-ts/Option";
import facebookStatuses1 from "../data/your_posts_1.json";
import facebookStatuses2 from "../data/your_posts_2.json";
import { garbage } from "../lib/garbage";
import { FacebookStatus, FacebookStatuses, Status } from "../types";

// https://stackoverflow.com/a/68237082/233902
const fixFacebookDataExport: Endomorphism<string> = flow(
  string.split(string.empty),
  readonlyArray.map((r) => r.charCodeAt(0)),
  (a) => new TextDecoder().decode(new Uint8Array(a))
);

pipe(
  facebookStatuses1 as FacebookStatuses,
  readonlyArray.concat(facebookStatuses2 as FacebookStatuses),
  // A few non-status items are duplicated.
  readonlyArray.uniq(
    pipe(
      number.Eq,
      eq.contramap((p: FacebookStatus) => p.timestamp)
    )
  ),
  readonlyArray.sort(
    pipe(
      number.Ord,
      ord.contramap((s: FacebookStatus) => s.timestamp)
    )
  ),
  readonlyArray.filterMap(
    (s): Option<Status> =>
      pipe(
        s.data?.find((d) => d.post != null)?.post,
        option.fromNullable,
        option.map(
          (text): Status => ({
            text: fixFacebookDataExport(text),
            timestamp: s.timestamp.toString(36),
          })
        )
      )
  ),
  readonlyArray.reverse,
  readonlyArray.filter((s) => !garbage.has(s.timestamp)),
  json.stringify,
  taskEither.fromEither,
  taskEither.chain((s) =>
    // @ts-expect-error We can't use bun-types https://github.com/oven-sh/bun/issues/358
    taskEither.tryCatch(() => Bun.write("data/statuses.json", s), identity)
  )
  // eslint-disable-next-line no-console
)().then(console.log);
