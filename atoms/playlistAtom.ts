import { atom } from "recoil";

export const playlistState = atom<SpotifyApi.SinglePlaylistResponse | null>({
  key: "playlistAtomState",
  default: null,
});

export const playlistIdState = atom<string | null>({
  key: "playlistIdState",
  // default: "03bKMoeCxREu1jKjPvCXwD",
  // default: "56NYcYpAEM8xveHQBx4tkE",
  default: null,
});
