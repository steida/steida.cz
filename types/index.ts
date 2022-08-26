export interface FacebookStatus {
  readonly timestamp: number;
  readonly data?: ReadonlyArray<{ readonly post?: string }>;
}

export type FacebookStatuses = ReadonlyArray<FacebookStatus>;

export interface Status {
  readonly timestamp: string;
  readonly text: string;
}

export type Statuses = ReadonlyArray<Status>;

export interface UiStatus extends Status {
  readonly textForSearch: string;
  readonly formattedDate: string;
}

export type UiStatuses = ReadonlyArray<UiStatus>;

export type SortBy = "timestamp" | "length";

// eslint-disable-next-line functional/no-mixed-type
export interface AppState {
  readonly filter: string;
  readonly setFilter: (filter: string) => void;
  readonly sortBy: SortBy;
  readonly setSortBy: (sortBy: SortBy) => void;
  readonly selected: readonly string[];
  readonly setSelected: (timestamps: readonly string[]) => void;
  readonly select: (timestamp: string) => void;
  readonly unselect: (timestamp: string) => void;
  readonly unselectAll: () => void;
}
