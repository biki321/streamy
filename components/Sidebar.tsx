import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { LogoutIcon, XIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState, userPlaylistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import useWindowSize from "../hooks/useWindowSize";

interface IProps {
  isSideBarOpen: boolean;
  setIsSideBarOpen: Dispatch<SetStateAction<boolean>>;
}

function Sidebar({ isSideBarOpen, setIsSideBarOpen }: IProps) {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [userPlaylists, setUserPlaylists] = useRecoilState(userPlaylistState);
  const [_, setplaylistId] = useRecoilState(playlistIdState);
  const router = useRouter();
  const { windowWidth } = useWindowSize();
  console.log("session sidebar", session);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        console.log("playlist", data.body.items);
        setUserPlaylists(data.body.items);
        setplaylistId((prevState) =>
          !prevState ? data.body.items[0].id : prevState
        );
      });
    }
  }, [spotifyApi, session, setplaylistId, setUserPlaylists]);

  useEffect(() => {
    if (windowWidth && windowWidth >= 768) setIsSideBarOpen(true);
  }, [setIsSideBarOpen, windowWidth]);

  const handleOnClickPlaylist = (id: string) => {
    setplaylistId(id);
    if (windowWidth && windowWidth <= 768) setIsSideBarOpen((prev) => !prev);
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
        setUserPlaylists((prev) => [data.body, ...prev]);
        if (windowWidth && windowWidth <= 768)
          setIsSideBarOpen((prev) => !prev);
        router.push(`/playlist/${data.body.id}`);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <div
        className={`text-white p-4 border-r border-graysecond 
        bg-gray-900 z-20 space-y-4 h-screen overflow-y-scroll 
        scrollbar-hide text-xs min-w-[130px] lg:min-w-[170px]  lg:text-sm sm:max-w-[12rem] 
        lg:max-w-[15rem] pb-36 ${
          windowWidth && windowWidth < 768 ? "fixed top-0 left-0" : ""
        } 
       ${
         isSideBarOpen ? "translate-x-0" : "translate-x-[-100%]"
       } ease-in-out duration-150`}
      >
        {windowWidth && windowWidth < 768 ? (
          <button
            className="hover:text-ambercustom"
            onClick={() => setIsSideBarOpen((prevState) => !prevState)}
          >
            <XIcon className="h-6 w-6" />
          </button>
        ) : null}
        <button
          className="flex items-center space-x-2 
        hover:text-ambercustom font-semibold"
          onClick={() => signOut()}
        >
          <LogoutIcon className="h-5 w-5" />
          <p>Log out</p>
        </button>
        <hr className="border-t-2 border-graysecond" />
        <Link href="/">
          <a
            className="flex items-center space-x-2 
        hover:text-ambercustom font-semibold"
          >
            <HomeIcon className="h-5 w-5" />
            <p>Home</p>
          </a>
        </Link>

        <hr className="border-t-2 border-graysecond" />
        <button
          className="flex items-center space-x-2 
        hover:text-ambercustom font-semibold"
          onClick={handleOnClickCreatePlaylist}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>

        <hr className="border-t-2 border-graysecond" />

        <p className="text-gray-400">Playlists</p>
        {userPlaylists.map((playlist) => (
          <p
            key={playlist.id}
            className="cursor-pointer hover:text-ambercustom
            hover:scale-110 transition-transform duration-100 ease-out;"
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
