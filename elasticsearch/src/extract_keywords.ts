import corpus from "../corpus.json";

import fs from "fs";

const keywords = {
  composers: [],
  singers: [],
  lyricists: [],
  subjects: [],
  targets: [],
};

const keywordsSongs = {
  Composer_Sinhala: "composers",
  Singer_Sinhala: "singers",
  Lyricist_Sinhala: "lyricists",
  Subject_1: "subjects",
  Subject_2: "subjects",
  Subject_3: "subjects",
  Target_1: "targets",
  Target_2: "targets",
  Target_3: "targets",
};

const extract = (
  dictionary: { [key: string]: string[] },
  key: string,
  song: any,
  song_key: string
) => {
  const properties = song[song_key].split(",");
  if (properties) {
    properties.forEach((property: string) => {
      property
        .trim()
        .split(" ")
        .forEach((part) => {
          const trimmedPart = part.trim();
          if (!dictionary[key].includes(trimmedPart))
            dictionary[key].push(trimmedPart);
        });
    });
  }
};

corpus.forEach((song) =>
  Object.keys(keywordsSongs).forEach((song_key) =>
    extract(
      keywords,
      // @ts-ignore
      keywordsSongs[song_key],
      song,
      song_key
    )
  )
);

fs.writeFileSync("../keywords.json", JSON.stringify(keywords))
