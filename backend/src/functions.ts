import express from "express";
import { Client } from "@elastic/elasticsearch";

import keys from "../../elasticsearch/keys.json";
import keywords from "../../keywords.json";

const router = express.Router();

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

router.post("/search", async (req, res) => {
  const artist: string = req.body.artist;
  const query: string = `${req.body.query} ${artist}`;
  let gte: any = req.body.gte;
  let querySearch: any = {
    multi_match: {
      query: query.trim(),
      fields: [
        "Metaphor_1_Sinhala",
        "Metaphor_2_Sinhala",
        "Metaphor_3_Sinhala",
        "Subject_1",
        "Subject_2",
        "Subject_3",
        "Target_1",
        "Target_2",
        "Target_3",
        `Composer_Sinhala${artist ? `^${2}` : ""}`,
        `Singer_Sinhala${artist ? `^${2}` : ""}`,
        `Lyricist_Sinhala${artist ? `^${2}` : ""}`,
      ],
    },
  };
  if (artist || gte) {
    querySearch = {
      bool: {
        must: [
          {
            multi_match: {
              query: query.trim(),
              fields: [
                "Metaphor_1_Sinhala",
                "Metaphor_2_Sinhala",
                "Metaphor_3_Sinhala",
                "Subject_1",
                "Subject_2",
                "Subject_3",
                "Target_1",
                "Target_2",
                "Target_3",
              ],
            },
          },
        ],
      },
    };
    if (artist)
      querySearch.bool.must.push({
        multi_match: {
          query: query.trim(),
          fields: [
            `Composer_Sinhala${artist ? `^${2}` : ""}`,
            `Singer_Sinhala${artist ? `^${2}` : ""}`,
            `Lyricist_Sinhala${artist ? `^${2}` : ""}`,
          ],
        },
      });

    if (gte) {
      gte = parseInt(gte);
      querySearch.bool.must.push({
        range: {
          Spotify_Plays: {
            gte,
            boost: 2.0,
          },
        },
      });
    }
  }
  const result = await client.search({
    index: "sinhala_songs_index",
    /**
     * Give indexed documents
     */
    query: querySearch,
  });
  console.log(result.hits.hits);
  res.send({
    hits: result.hits.hits,
  });
});

export default router;
