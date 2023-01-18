"use strict";
import { Client } from "@elastic/elasticsearch";
import "array.prototype.flatmap";

import corpus from "../corpus.json";
import keys from "../keys.json";

const getStopWords = (keyWords: { [key: string]: string[] }) => {
  const stopWords: string[] = [];
  for (const property in keyWords) {
    for (const key of keyWords[property]) {
      stopWords.push(key);
    }
  }
  return stopWords;
};

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "-BYE5=PQ*+bWRkEKIyeS",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Uncomment this if you want to remove the index
 */
// client.indices
//   .delete({
//     index: "sinhala_songs_index",
//   })
//   .then(
//     function (resp) {
//       console.log("Successful query!");
//       console.log(JSON.stringify(resp, null, 4));
//     },
//     function (err) {
//       console.trace(err.message);
//     }
//   );

async function run() {
  await client.indices.create({
    index: "sinhala_songs_index",
    body: {
      settings: {
        analysis: {
          /**
           * here the custom icu_tokenizer will be used
           * to get a better performance with
           * asian languages
           */
          analyzer: {
            // @ts-ignore
            my_icu_analyzer: {
              type: "custom",
              tokenizer: "icu_tokenizer",
              filter: ["my_ngram_filter", "my_stop_word_filter"],
            },
          },
          /**
           * custom token filters will be used
           * because to get better performance with
           * Sinhala language
           */
          filter: {
            /**
             * edge_ngram filter will be used
             * to tokenize the words with minimum 3 letters to
             * 18 letters
             */
            // @ts-ignore
            my_ngram_filter: {
              type: "edge_ngram",
              min_gram: 3,
              max_gram: 18,
              side: "front",
            },
            /**
             * custom stop word filter will be used
             * to ignore some words introduced in the
             * keys.json
             */
            // @ts-ignore
            my_stop_word_filter: {
              type: "stop",
              ignore_case: true,
              stopwords: getStopWords(keys),
            },
          },
        },
      },
      mappings: {
        properties: {
          /**
           * Specify the main parameters
           * including full text search
           */
          Composer_Sinhala: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Singer_Sinhala: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Lyricist_Sinhala: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Song_Sinhala: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Metaphor_1_Sinhala: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Metaphor_2_Sinhala: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Metaphor_3_Sinhala: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Subject_1: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Subject_2: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Subject_3: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Target_1: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Target_2: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          Target_3: {
            type: "text",
            fields: {
              raw: {
                type: "keyword",
              },
            },
            analyzer: "my_icu_analyzer",
          },
          /**
           * Specify tother parameters
           * without full text search
           */
          Lyrics: {
            type: "text",
          },
          Interpretation_1: {
            type: "text",
          },
          Interpretation_2: {
            type: "text",
          },
          Interpretation_3: {
            type: "text",
          },
          Spotify_Plays: {
            type: "integer",
          },
        },
      },
    },
  });

  const operations = corpus.flatMap((document) => [
    { index: { _index: "sinhala_songs_index" } },
    document,
  ]);
  const bulkResponse = await client.bulk({ refresh: true, operations });

  if (bulkResponse.errors) {
    const erroredDocuments: any[] = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      // @ts-ignore
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          // @ts-ignore
          status: action[operation].status,
          // @ts-ignore
          error: action[operation].error,
          operation: operations[i * 2],
          document: operations[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }

  const count = await client.count({ index: "sinhala_songs_index" });
  console.log(count);
}

run().catch(console.log);
