export type Band = {
  id: string;
  name: string;
};

export type Track = {
  name: string;
  count: number;
  selected: boolean;
};

export type Album = {
  name: string;
  img: string;
  id: string;
  score: number;
  tracks: string[];
};
