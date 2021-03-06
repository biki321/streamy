import { atom } from "recoil";

export const playlistState = atom<SpotifyApi.SinglePlaylistResponse | null>({
  key: "playlistAtomState",
  default: null,
});

export const userPlaylistState = atom<SpotifyApi.PlaylistObjectSimplified[]>({
  key: "userPlaylistState",
  default: [],
});

export const playlistIdState = atom<string | null>({
  key: "playlistIdState",
  default: null,
});
