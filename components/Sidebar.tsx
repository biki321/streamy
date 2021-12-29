import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";

function Sidebar() {
  const { data: session } = useSession();
  console.log("session sidebar", session);
  return (
    <div>
      <div
        className="text-white p-5 text-xs border-r 
      border-[#292B30] space-y-4"
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

        <p className="cursor-pointer  opacity-50">Playlists</p>
        <p className="cursor-pointer">Playlist 1</p>
        <p className="cursor-pointer">Playlist 1</p>
        <p className="cursor-pointer">Playlist 1</p>
        <p className="cursor-pointer">Playlist 1</p>
        <p className="cursor-pointer">Playlist 1</p>
      </div>
    </div>
  );
}

export default Sidebar;
