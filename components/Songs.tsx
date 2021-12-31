import { TrashIcon } from "@heroicons/react/solid";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Song from "./Song";

interface IProps {
  currentUserId: string | null;
}

function Songs({ currentUserId }: IProps) {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const spotifyApi = useSpotify();

  const handleRemoveTrack = (trackId: string) => {
    const tracksToRemove = [{ uri: `spotify:track:${trackId}` }];
    if (playlist?.id)
      spotifyApi
        .removeTracksFromPlaylist(playlist?.id, tracksToRemove)
        .then(() => {
          setPlaylist((prevState) => {
            if (prevState)
              return {
                ...prevState,
                tracks: {
                  ...prevState.tracks,
                  items: prevState.tracks.items.filter(
                    (track) => track.track.id !== trackId
                  ),
                },
              };
            else return prevState;
          });
        })
        .catch((error) => console.log(error));
  };

  return (
    <div className="px-8 flex flex-col space-y-1 text-white">
      {playlist?.tracks.items.map((track, i) => (
        <div key={track.track.id}>
          <div className="flex items-center justify-between">
            <Song track={track.track} />
            {currentUserId === playlist.owner.id ? (
              <button
                type="button"
                onClick={() => handleRemoveTrack(track.track.id)}
                className=""
              >
                <TrashIcon className="button" />
              </button>
            ) : null}
          </div>
          <hr className="border-t-[0.1px] border-[#292B30]" />
        </div>
      ))}
    </div>
  );
}

export default Songs;
