import Image from "next/image";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";
import placeholderImg from "../placeholderImg";

interface IProps {
  track: SpotifyApi.TrackObjectFull;
}

function Song({ track }: IProps) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.uri],
    });
  };

  const imgUrl =
    track.album.images.length > 0 ? track.album.images[0].url : placeholderImg;

  return (
    <div className="py-4 cursor-pointer" onClick={playSong}>
      <div className="flex items-center space-x-4">
        <Image
          src={imgUrl}
          width={44}
          height={44}
          alt=""
          className="rounded-full"
        />
        <div>
          <p className="font-bold truncate">{track.name}</p>
          <p className="text-xs">
            {millisToMinutesAndSeconds(track.duration_ms)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Song;
