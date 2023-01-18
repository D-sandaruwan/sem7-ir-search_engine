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
  const query: string = req.body.query;
  const wordsInQuery = query.trim().split(" ");
  const result = await client.search({
    index: "sinhala_songs_index",
    /**
     * Give indexed documents
     */
    _source: {
      includes: [
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
    query: {
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
  });
  console.log(result.hits.hits);
  res.send({
    hits: result.hits.hits,
  });
});

export default router;
