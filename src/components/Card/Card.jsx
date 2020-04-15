/* ---------------------------------
Card
--------------------------------- */

import React, { useState } from "react";
import { log } from "../../utils";
import MaterialIcon from "../Misc/MaterialIcon";
import { useSpring, animated } from "react-spring";

export default function Card({
  image,
  title,
  type,
  year,
  onToWatchClick,
  onWatchedClick,
  added,
  additionalData,
  ...other
}) {
  // log(arguments);
  const [flipped, toggleFlipped] = useState(false);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const normalize = data =>
    Object.entries(data).reduce((acc, [key, val]) => {
      acc[key.toLowerCase()] = val;
      return acc;
    }, {});

  const _additionalData = additionalData ? normalize(additionalData) : {};

  return (
    <div className="CardContainer">
      <animated.div
        className="CardAnimatedFrame"
        style={{
          position: "absolute",
          zIndex: !flipped ? 1 : "auto",
          opacity: opacity.interpolate(o => 1 - o),
          transform,
        }}
      >
        <article className={`Card front${added ? " added" : ""}`}>
          <div className="CardFlipControls">
            <button onClick={() => toggleFlipped(!flipped)}>
              <MaterialIcon icon="info" />
            </button>
          </div>

          <section className="CardMedia">
            <div className="CardPosterCurtain">
              <h3 className="CardPosterCurtainTitle">{title}</h3>

              <ul className="CardMeta">
                <li className="CardMetaItem">
                  <h6 className="CardMetaItemTitle">Year</h6>

                  {year}
                </li>

                <li className="CardMetaItem">
                  <h6 className="CardMetaItemTitle">Country</h6>

                  {_additionalData.country
                    ? _additionalData.country.length > 15
                      ? _additionalData.country.substring(0, 10) + "…"
                      : _additionalData.country
                    : "n/a"}
                </li>

                <li className="CardMetaItem">
                  <h6 className="CardMetaItemTitle">Director</h6>

                  {_additionalData.director || "n/a"}
                </li>
              </ul>
            </div>

            <img src={image} alt={title} className="CardPoster" />
          </section>

          {/* <section className="CardBody">
          <span className="CardContent">{year + ", " + type}</span>
        </section> */}

          <footer className="CardFooter">
            <div className="CardControls">
              {/* TODO maybe find a better prop name */}
              {!added && (
                <>
                  <button
                    className="CardControlsButton"
                    type="button"
                    onClick={e => {
                      e.preventDefault();

                      onToWatchClick({
                        image,
                        title,
                        type,
                        year,
                        ..._additionalData,
                      });
                    }}
                  >
                    To Watch
                  </button>

                  <button
                    className="CardControlsButton"
                    type="button"
                    onClick={e => {
                      e.preventDefault();

                      onWatchedClick({
                        image,
                        title,
                        type,
                        year,
                        ..._additionalData,
                      });
                    }}
                  >
                    Watched <i className="material-icons">check_circle</i>
                  </button>
                </>
              )}
            </div>
          </footer>
        </article>
      </animated.div>

      {/* back of the card */}
      <animated.div
        className="CardAnimatedFrame"
        style={{
          position: "absolute",
          opacity,
          transform: transform.interpolate(t => `${t} rotateY(180deg)`),
        }}
      >
        <article className="Card back">
          <div className="CardFlipControls">
            <button onClick={() => toggleFlipped(!flipped)}>
              <MaterialIcon icon="close" />
            </button>
          </div>

          <div className="CardBackContent">
            <header className="CardBackContentHeader">
              <h4 className="CardBackContentHeaderTitle">{title}</h4>
            </header>

            <ul className="CardBackDataList">
              {Object.keys(_additionalData).length &&
                Object.entries(_additionalData).map(([key, val], i) => {
                  // prettier-ignore

                  // TODO
                  // we don't manage these keys for now
                  if (
                    key === "ratings" ||
                    key === 'id' ||
                    key === 'response'
                  )
                  {
                    return;
                  }

                  else if (key === "timestamp")
                  {
                    key = "Date Added";
                    val = new Date(val).toLocaleDateString()
                  }

                  else if (key === 'poster')
                  {
                    val = <a href={val}>link</a>
                  }

                  return (
                    <li key={i} className="CardBackDataListItem">
                      <span className="DataKey">{key}:</span>

                      {val}
                    </li>
                  );
                })}
            </ul>
          </div>
        </article>
      </animated.div>
    </div>
  );
}

/**
 * {
  "Title": "Ran",
  "Year": "1985",
  "Rated": "R",
  "Released": "01 Jun 1985",
  "Runtime": "162 min",
  "Genre": "Action, Drama",
  "Director": "Akira Kurosawa",
  "Writer": "Akira Kurosawa (screenplay), Hideo Oguni (screenplay), Masato Ide (screenplay), William Shakespeare (play)",
  "Actors": "Tatsuya Nakadai, Akira Terao, Jinpachi Nezu, Daisuke Ryû",
  "Plot": "In Medieval Japan, an elderly warlord retires, handing over his empire to his three sons. However, he vastly underestimates how the new-found power will corrupt them and cause them to turn on each other...and him.",
  "Language": "Japanese",
  "Country": "Japan, France",
  "Awards": "Won 1 Oscar. Another 29 wins & 22 nominations.",
  "Poster": "https://m.media-amazon.com/images/M/MV5BZDBjZTM4ZmEtOTA5ZC00NTQzLTkyNzYtMmUxNGU2YjI5YjU5L2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "8.2/10"
    },
    {
      "Source": "Rotten Tomatoes",
      "Value": "97%"
    },
    {
      "Source": "Metacritic",
      "Value": "96/100"
    }
  ],
  "Metascore": "96",
  "imdbRating": "8.2",
  "imdbVotes": "104,199",
  "imdbID": "tt0089881",
  "Type": "movie",
  "DVD": "22 Nov 2005",
  "BoxOffice": "N/A",
  "Production": "Rialto Pictures",
  "Website": "N/A",
  "Response": "True"
}

 */
