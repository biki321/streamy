import {
  PauseIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  VolumeUpIcon,
  PlayIcon,
  VolumeOffIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import placeholderImg from "../placeholderImg";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = useCallback(() => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("now playing", data.body?.item);
        setCurrentIdTrack(data.body?.item?.id!);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  }, [setCurrentIdTrack, setIsPlaying, songInfo, spotifyApi]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (!data.body) return;
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const debouncedAdjustVolume = useCallback(
    () =>
      debounce((volume) => {
        spotifyApi.setVolume(volume).catch((error) => console.log(error));
      }, 500),
    [spotifyApi]
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, fetchCurrentSong, spotifyApi]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume();
    }
  }, [debouncedAdjustVolume, volume]);

  return (
    <div
      className="h-20 bg-graysecond
    text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8"
    >
      <div className="flex items-center space-x-4">
        <div className="md:inlne h-10 w-10">
          <Image
            width={40}
            height={40}
            src={songInfo?.album.images?.[0]?.url ?? placeholderImg}
            alt=""
          />
        </div>
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          className="button"
          //this is not working
          //onClick={() => spotifyApi.skipToPrevious()}
        />
        {isPlaying ? (
          <PauseIcon className="button w-10 h-10" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="button w-10 h-10" onClick={handlePlayPause} />
        )}

        <FastForwardIcon
          className="button"
          //this is not working
          //onClick={() => spotifyApi.skipToNext()}
        />
        <ReplyIcon className="button" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeOffIcon
          className="button"
          onClick={() => volume > 0 && setVolume((pv) => pv - 10)}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume((pv) => pv + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
