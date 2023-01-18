import { useState } from "react";
import Head from "next/head";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Modal from "@mui/material/Modal";

const backendAPI = "http://localhost:8000";

export default function Home() {
  const postRequest = async (url: string, data: object) => {
    try {
      const response = await fetch(`${backendAPI}/${url}`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = response.json();
      result.then((data) => {
        setSearchResults(data.hits);
      });
    } catch (err) {
      console.log(err);
    }
  };

  type Song = {
    _id: string;
    _index: string;
    _score: number;
    _source: {
      Composer: string;
      Composer_Sinhala: string;
      Singer: string;
      Singer_Sinhala: string;
      Lyricist: string;
      Lyricist_Sinhala: string;
      Song: string;
      Song_Sinhala: string;
      Spotify_Plays: number;
      Lyrics: string;
      Metaphor_1: string;
      Metaphor_1_Sinhala: string;
      Subject_1: string;
      Target_1: string;
      Interpretation_1: string;
      Metaphor_2: string;
      Metaphor_2_Sinhala: string;
      Subject_2: string;
      Target_2: string;
      Interpretation_2: string;
      Metaphor_3: string;
      Metaphor_3_Sinhala: string;
      Subject_3: string;
      Target_3: string;
      Interpretation_3: string;
    };
  };

  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState("");
  const [gte, setGte] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  const [open, setOpen] = useState(false);
  const [song, setSong] = useState<Song | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const keywords = {
    Song: "ගීතය",
    Composer: "සංගීතය",
    Singer: "ගායනය",
    Lyricist: "රචනය",
    Spotify_Plays: "Spotify ඇසුම් වාර",
    Lyrics: "ගී පද",
    Metaphor: {
      sinhala: "උපමා/රූපක",
      attributes: {
        Metaphor: "ගී පදය",
        Subject: "උපමාව",
        Target: "උපමේය",
        Interpretation: "තේරුම",
      },
    },
  };

  const SongModal = () => {
    const style = {
      position: "absolute" as "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 800,
      bgcolor: "background.paper",
      border: "2px solid #1976d2",
      borderRadius: "8px",
      boxShadow: 24,
      p: 4,
    };

    return (
      <div>
        {song ? (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {Object.keys(keywords)
                .slice(0, 5)
                .map((key) => {
                  const keyOld = key;
                  if (key != "Spotify_Plays") {
                    key = `${key}_Sinhala`;
                  }
                  return (
                    <Grid
                      container
                      spacing={2}
                      key={key}
                      sx={{ marginY: 0, paddingY: 0 }}
                    >
                      <Grid xs={3} sx={{ marginY: 0, paddingY: 0 }}>
                        <Typography sx={{ marginY: 0, paddingY: 0 }}>
                          {/* @ts-ignore */}
                          <strong>{keywords[keyOld]}:</strong>
                        </Typography>
                      </Grid>
                      <Grid xs={9} sx={{ marginY: 0, paddingY: 0 }}>
                        {/* @ts-ignore */}
                        {song._source[key]}
                      </Grid>
                    </Grid>
                  );
                })}
              <Grid
                container
                spacing={2}
                key={"Lyrics"}
                sx={{ marginY: 0, paddingY: 0 }}
              >
                <Grid xs={3} sx={{ marginY: 0, paddingY: 0 }}>
                  <Typography sx={{ marginY: 0, paddingY: 0 }}>
                    {/* @ts-ignore */}
                    <strong>{keywords["Lyrics"]}:</strong>
                  </Typography>
                </Grid>
                <Grid xs={9} sx={{ marginY: 0, paddingY: 0 }}>
                  {/* @ts-ignore */}
                  {song._source["Lyrics"]}
                </Grid>
              </Grid>
              {["1", "2", "3"].map((number) => {
                /* @ts-ignore */
                if (song._source[`Metaphor_${number}`])
                  return (
                    <Grid
                      container
                      spacing={2}
                      key={"Lyrics"}
                      sx={{ marginY: "8px" }}
                    >
                      {Object.keys(keywords.Metaphor.attributes).map(
                        (metKey) => (
                          <>
                            <Grid xs={3} sx={{ marginY: 0, paddingY: 0 }}>
                              <Typography sx={{ marginY: 0, paddingY: 0 }}>
                                <strong>
                                  {/* @ts-ignore */}
                                  {keywords.Metaphor.attributes[metKey]}:
                                </strong>
                              </Typography>
                            </Grid>
                            <Grid xs={9} sx={{ marginY: 0, paddingY: 0 }}>
                              {
                                /* @ts-ignore */
                                song._source[
                                  metKey === "Metaphor"
                                    ? `${metKey}_${number}_Sinhala`
                                    : `${metKey}_${number}`
                                ]
                              }
                            </Grid>
                          </>
                        )
                      )}
                    </Grid>
                  );
              })}
            </Box>
          </Modal>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Search Sinhala Songs</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          padding: "16px",
        }}
      >
        <Box
          sx={{
            marginBottom: "",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">සිංහල ගීත එකතුව</Typography>
          <Typography variant="body1" sx={{ marginTop: "12px" }} align="center">
            මෙම සෙවුම් යන්ත්‍රය මගින් ඔබට ලංකාවී ප්‍රවීණතම හා දක්ෂතම සංගීත
            අධ්‍යකෂවරුන් සිවු දෙනෙක් වන<br></br>{" "}
            <strong>
              රෝහණ වීරසිංහ, වික්ටර් රත්නායක, කසුන් කල්හාර, චරිත අත්තලගේ
            </strong>
            <br></br> විසින් සංගීත නිර්මාණය කළ ගීත සොයාගත හැක.
          </Typography>
        </Box>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          sx={{ marginTop: "16px" }}
        >
          <TextField
            id="outlined-basic"
            label="සෙවුම සටහන් කරන්න"
            variant="outlined"
            size="small"
            value={query}
            fullWidth
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => postRequest("app/search", { query, artist, gte })}
            startIcon={<SearchIcon />}
            sx={{ marginLeft: "8px" }}
          >
            සොයන්න
          </Button>
        </Box>
        <Box sx={{ marginY: "16px" }}>
          <TextField
            id="outlined-basic"
            label="ගායක/සංගීත අධ්‍යක්ෂක/රචක නම"
            variant="outlined"
            size="small"
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
          />
        </Box>
        <Box>
          <TextField
            id="outlined-basic"
            label="Spotify ඇසුම්"
            variant="outlined"
            size="small"
            value={gte}
            type="number"
            onChange={(event) => setGte(event.target.value)}
          />
        </Box>
        <SongModal />
        <Box
          sx={{
            margin: "4px",
          }}
        >
          <Box sx={{ flexGrow: 1, marginTop: "16px" }}>
            <Grid container spacing={2}>
              {searchResults.map((element) => (
                <Grid
                  key={element._id}
                  xs={6}
                  sx={{
                    padding: "8px",
                  }}
                  onClick={() => {
                    const selectedSong = searchResults.find(
                      (elementHere) => element._id === elementHere._id
                    );
                    if (selectedSong) {
                      setSong(selectedSong);
                      handleOpen();
                    }
                  }}
                >
                  <Box
                    sx={{
                      border: "2px solid",
                      borderColor: "#1976d2",
                      backgroundColor: "#1976d220",
                      borderRadius: "4px",
                      padding: "8px",
                    }}
                  >
                    {Object.keys(keywords)
                      .slice(0, 5)
                      .map((key) => {
                        const keyOld = key;
                        if (key != "Spotify_Plays") {
                          key = `${key}_Sinhala`;
                        }
                        return (
                          <Grid
                            container
                            spacing={2}
                            key={key}
                            sx={{ marginY: 0, paddingY: 0 }}
                          >
                            <Grid xs={3} sx={{ marginY: 0, paddingY: 0 }}>
                              <Typography sx={{ marginY: 0, paddingY: 0 }}>
                                {/* @ts-ignore */}
                                <strong>{keywords[keyOld]}:</strong>
                              </Typography>
                            </Grid>
                            <Grid xs={9} sx={{ marginY: 0, paddingY: 0 }}>
                              {/* @ts-ignore */}
                              {element._source[key]}
                            </Grid>
                          </Grid>
                        );
                      })}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </main>
    </>
  );
}
