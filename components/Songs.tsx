import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
  const playlist = useRecoilValue(playlistState);

  return (
    <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
      {playlist?.tracks.items.map((track, i) => (
        <div key={track.track.id}>
          <Song track={track} order={i} />
          <hr className="border-t-[0.1px] border-[#292B30]" />
        </div>
      ))}
    </div>
  );
}

export default Songs;
