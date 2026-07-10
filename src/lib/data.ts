import _data from "./data.json" with { type: "json" };

export type Data = {
  start: string;
  words: Record<
    string,
    {
      added: string[];
      removed: string[];
    }
  >;
};

export const data: Data = _data;
