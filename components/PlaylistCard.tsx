import Image from "next/image";
import router from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import placeholderImg from "../placeholderImg";

interface IProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}
function PlaylistCard({ playlist }: IProps) {
  const setPlaylistId = useSetRecoilState(playlistIdState);

  const handleOnClickPlaylist = (id: string) => {
    setPlaylistId(id);
    router.push(`/playlist/${id}`);
  };

  const imgSrc =
    playlist.images.length > 0 ? playlist.images[0].url : placeholderImg;
  return (
    <div
      className="bg-[#24252B] hover:bg-[#2E3034] p-3 rounded-md 
    text-white shadow-lg cursor-pointer"
      onClick={() => handleOnClickPlaylist(playlist.id)}
    >
      <Image
        src={imgSrc}
        width={160}
        height={150}
        objectFit="scale-down"
        alt="playlist cover image"
      />
      <h1 className="font-semibold">{playlist.name.slice(0, 15) + ".."}</h1>
    </div>
  );
}

export default PlaylistCard;
