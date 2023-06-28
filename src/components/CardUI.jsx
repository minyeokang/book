import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Cactus from "./Cactus";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { gsap } from "gsap";
export default function MediaControlCard() {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [motion, setMotion] = useState(false);
  const increment = () => {
    setMotion(true);
    console.log(motion);
  };
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://dapi.kakao.com/v3/search/book",
        {
          params: {
            target: "title",
            query: query,
          },
          headers: {
            Authorization:  `KakaoAK ${import.meta.env.VITE_KEY}`,
          },
        }
      );

      const msg = response.data;

      if (!msg.documents || msg.documents.length === 0) {
        console.log("undefined!!!");
        alert("검색결과가 없습니다.");
        setQuery("");
      } else {
        setSearchResult(msg.documents[0]);
        setQuery("");
      }
    } catch (error) {
      console.log("Request failed:", error);
      console.log("Error response:", error.response);
      console.log("Error message:", error.message);
    }
  };
  const cardContentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.set(cardContentRef.current, { opacity: 0, y: 350 });
    tl.to(cardContentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.2,
      ease: "sine.out",
    });
  }, [searchResult]);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      console.log("test");
    }
  };
  return (
    <Card sx={{ minWidth: 320 }}>
      <CardHeader title="책 제목을 검색하면" subheader="정보를 알려드려요" />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "rows",
          justifyContent: "space-between",
          gap: "20px",
          maxWidth: 1200,
        }}>
        <Box className={`wd50${motion ? " fadein" : ""}`}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "rows",
              alignItems: "baseline",
              gap: "20px",
            }}>
            <TextField
              id="standard-basic"
              label="Book title"
              variant="standard"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-text"
              onKeyPress={handleKeyPress}
            />
            <Button
              type="submit"
              variant="text"
              onClick={() => {
                handleSearch();
                if (query === "") {
                  alert("제목을 입력하세요");
                }
              }}
              sx={{ marginLeft: "20px" }}>
              search
            </Button>
          </Box>
          {searchResult && (
            <CardContent sx={{}} className="book-wrap" ref={cardContentRef}>
              <h3 className="book-title">
                {searchResult.title}
                <span className="book-author"> {searchResult.authors}</span>
              </h3>
              <div className="book-contents">
                <CardMedia
                  component="img"
                  image={searchResult.thumbnail}
                  alt="Live from space album cover"
                  className="book-thumb"
                />
                <p className="book-desc">{searchResult.contents}</p>
              </div>
            </CardContent>
          )}
        </Box>

        <Cactus className="wd50" increment={increment} />
      </CardContent>
    </Card>
  );
}
