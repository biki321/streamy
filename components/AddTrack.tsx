import { debounce } from "lodash";
import { ChangeEvent, Fragment, useCallback, useMemo, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import Song from "./Song";

interface IProps {
  playlistId: string;
  fetchPlaylistData: () => void;
}

function AddTrack({ playlistId, fetchPlaylistData }: IProps) {
  const spotifyApi = useSpotify();
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [searchTxt, setSearchTxt] = useState("");
  //if loading then it will have id
  const [addTrackLoading, setAddTrackLoading] = useState<string | null>(null);

  const fetchTracks = useCallback(
    (value: string) => {
      // Search tracks whose name, album or artist contains value
      spotifyApi
        .searchTracks(value)
        .then((data) => setTracks(data.body.tracks?.items ?? []))
        .catch((error) => console.log(error));
    },
    [spotifyApi]
  );

  const debouncedChangeHandler = useMemo(
    () => debounce(fetchTracks, 400),
    [fetchTracks]
  );

  const handleSrchTxtChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 1) return;
    setSearchTxt(e.target.value);
    debouncedChangeHandler(e.target.value);
  };

  const addTrack = (trackId: string) => {
    setAddTrackLoading(trackId);
    spotifyApi
      .addTracksToPlaylist(playlistId, [`spotify:track:${trackId}`])
      .then(() => {
        setAddTrackLoading(null);
        setTracks((prevState) =>
          prevState.filter((track) => track.id !== trackId)
        );
        fetchPlaylistData();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="space-y-2">
      <p className="text-lg xl:text-3xl font-bold">
        Lets find something for your playlist
      </p>
      <input
        type="text"
        className="p-2 rounded-sm bg-[#2D2D2D] text-white 
        outline-none"
        placeholder="search for songs"
        value={searchTxt}
        onChange={handleSrchTxtChange}
      />

      {tracks.map((track) => (
        <Fragment key={track.id}>
          <div className="flex items-center justify-between">
            <Song track={track} />
            {addTrackLoading && addTrackLoading === track.id ? (
              "loading"
            ) : (
              <button
                onClick={() => addTrack(track.id)}
                type="button"
                className="px-5 py-1 rounded-l-full rounded-r-full
            border-solid border-white border-2"
              >
                Add
              </button>
            )}
          </div>
          <hr className="border-t-[0.1px] border-[#292B30]" />
        </Fragment>
      ))}
    </div>
  );
}

export default AddTrack;
