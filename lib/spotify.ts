import SpotifyWebApi from "spotify-web-api-node";
import { URLSearchParams } from "url";

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  // 'user-library-modify',
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
].join(" ");

const params = {
  // response_type: 'code',
  // client_id: client_id,
  scope: scopes,
};

const queryParamsString = new URLSearchParams(params);

const LOGIN_URL =
  "https://accounts.spotify.com/authorize?" + queryParamsString.toString();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRECT,
});

export default spotifyApi;
export { LOGIN_URL };
