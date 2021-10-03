// TODO phase-out these types in favor of those in the OMDB folder
// https://github.com/thblt-thlgn/omdb

export interface RatingItem {
  Source: string;
  Value: string;
}

export interface OMDBitem {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: RatingItem[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export type OMDBsearchResults = {
  Search: OMDBitem[];
};

export type OMDBresponse = OMDBsearchResults | OMDBitem;
