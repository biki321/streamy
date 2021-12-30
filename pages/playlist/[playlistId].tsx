import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../../atoms/playlistAtom";
import Songs from "../../components/Songs";
import useSpotify from "../../hooks/useSpotify";
import Image from "next/image";
import placeholderImg from "../../placeholderImg";
import Layout from "../../components/Layout";
import AddTrack from "../../components/AddTrack";

const colors = ["from-indigo-500", "from-blue-500", "from-red-500"];

function Playlist() {
  const { data: session } = useSession();
  const [color, setcolor] = useState<string | null>(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const spotifyApi = useSpotify();
  //session info do not have user id so fetching it
  const [currentUserId, setcurrentUserId] = useState<string | null>(null);

  const fetchPlaylistData = useCallback(() => {
    if (!playlistId) return;
    if (!spotifyApi.getAccessToken()) return;
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        console.log("plylist", data.body.id);
        setPlaylist(data.body);
      })
      .catch((error) => console.log("error", error));
  }, [playlistId, setPlaylist, spotifyApi]);

  useEffect(() => {
    setcolor(shuffle(colors).pop()!);
  }, [playlistId]);

  useEffect(() => {
    if (!spotifyApi.getAccessToken()) return;
    spotifyApi
      .getMe()
      .then((data) => setcurrentUserId(data.body.id))
      .catch((err) => console.log(err));
    //without playlistid it was not fetching data
  }, [spotifyApi, playlistId]);

  useEffect(() => {
    console.log("effect get plauylist center");
    if (!playlistId) return;
    fetchPlaylistData();
  }, [fetchPlaylistData, playlistId, setPlaylist, spotifyApi]);

  return (
    <Layout>
      <div
        className="flex-grow text-white h-screen overflow-y-scroll 
    scrollbar-hide"
      >
        <header className="absolute top-5 right-8">
          <div
            className="flex items-center space-x-3
        opacity-90 hover:opacity-80 cursor-pointer rounded-full
        p-1 pr-2 bg-black"
          >
            <Image
              className="rounded-full"
              src={session?.user?.image ?? placeholderImg}
              width={40}
              height={40}
              alt=""
            />
            <h2>{session?.user?.name}</h2>
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </header>

        <section
          className={`flex items-end space-x-7 bg-gradient-to-b
      to-[#212328] ${color} h-80 text-white p-8`}
        >
          {playlist?.images?.[0]?.url && (
            <div className="shadow-2xl">
              <Image
                src={playlist?.images?.[0]?.url}
                width={176}
                height={176}
                alt=""
              />
            </div>
          )}
          <div>
            <p>Playlist</p>
            <h1
              className="text-2xl md:text-3xl xl:text-5xl
          font-bold"
            >
              {playlist?.name}
            </h1>
          </div>
        </section>
        <section className="pl-8 pb-28">
          <div>
            <Songs />
          </div>
          <hr />
          {playlist?.owner.id === currentUserId && (
            <div>
              <AddTrack
                playlistId={playlist.id}
                fetchPlaylistData={fetchPlaylistData}
              />
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default Playlist;
