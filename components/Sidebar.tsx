import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setplaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [playlistId, setplaylistId] = useRecoilState(playlistIdState);
  const router = useRouter();
  console.log("session sidebar", session);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        console.log("playlist", data.body.items);
        setplaylists(data.body.items);
        setplaylistId((prevState) =>
          !prevState ? data.body.items[0].id : prevState
        );
      });
    }
  }, [spotifyApi, session, setplaylistId]);

  const handleOnClickPlaylist = (id: string) => {
    setplaylistId(id);
    router.push(`/playlist/${id}`);
  };

  const handleOnClickCreatePlaylist = () => {
    spotifyApi
      .createPlaylist("My playlist", {
        description: "My description",
        public: true,
      })
      .then((data) => {
        setplaylistId(data.body.id);
        setplaylists((prev) => [data.body, ...prev]);
        router.push(`/playlist/${data.body.id}`);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <div
        className="text-white p-5 border-r 
      border-[#292B30] space-y-4 h-screen overflow-y-scroll scrollbar-hide
       text-xs lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] pb-36"
      >
        <button
          className="flex items-center space-x-2 
        hover:text-amber-600"
          onClick={() => signOut()}
        >
          <p>log out</p>
        </button>
        <button
          className="flex items-center space-x-2 
        hover:text-amber-600"
        >
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button
          className="flex items-center space-x-2 
        hover:text-amber-600"
        >
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button
          className="flex items-center space-x-2  
        hover:text-amber-600"
        >
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-[#292B30]" />
        <button
          className="flex items-center space-x-2 
        hover:text-amber-600"
          onClick={handleOnClickCreatePlaylist}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button
          className="flex items-center space-x-2 
        hover:text-amber-600"
        >
          <HeartIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button
          className="flex items-center space-x-2  
        hover:text-amber-600"
        >
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-[#292B30]" />

        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            className="cursor-pointer"
            onClick={() => handleOnClickPlaylist(playlist.id)}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;