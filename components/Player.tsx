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
import { useCallback, useEffect, useMemo, useState } from "react";
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

  const debouncedAdjustVolume = useMemo(
    () =>
      debounce((volume) => {
        spotifyApi.setVolume(volume).catch((error) => console.log(error));
      }, 300),
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
      debouncedAdjustVolume(volume);
    }
  }, [debouncedAdjustVolume, volume]);

  return (
    <div
      className="h-16 bg-graysecond
    text-white flex justify-between text-xs md:text-base px-3 md:px-5"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="md:inlne h-10 w-10">
          {songInfo?.album.images?.[0]?.url ? (
            <Image
              width={40}
              height={40}
              src={songInfo?.album.images?.[0]?.url}
              alt=""
            />
          ) : null}
        </div>
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly flex-1">
        {/* <SwitchHorizontalIcon className="button" /> */}
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
        {/* <ReplyIcon className="button" /> */}
      </div>

      <div
        className="flex items-center space-x-1 md:space-x-4 justify-end 
      flex-1"
      >
        <VolumeOffIcon
          className="button w-4 h-4 md:h-5 md:w-5"
          onClick={() => volume > 0 && setVolume((pv) => pv - 10)}
        />
        <input
          className="w-14 h-1 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="button w-4 h-4 md:h-5 md:w-5"
          onClick={() => volume < 100 && setVolume((pv) => pv + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
