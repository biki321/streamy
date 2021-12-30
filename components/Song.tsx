import Image from "next/image";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";
import placeholderImg from "../placeholderImg";

interface IProps {
  track: SpotifyApi.PlaylistTrackObject;
  order: number;
}

function Song({ track, order }: IProps) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  const imgUrl =
    track.track.album.images.length > 0
      ? track.track.album.images[0].url
      : placeholderImg;

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
          <p className="font-bold truncate">{track.track.name}</p>
          <p className="text-xs">
            {millisToMinutesAndSeconds(track.track.duration_ms)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Song;
