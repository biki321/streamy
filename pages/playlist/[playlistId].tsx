import { useCallback, useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState } from "recoil";
import { playlistState } from "../../atoms/playlistAtom";
import Songs from "../../components/Songs";
import useSpotify from "../../hooks/useSpotify";
import Image from "next/image";
import Layout from "../../components/Layout";
import AddTrack from "../../components/AddTrack";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-red-500",
  "from-cyan-500",
  "from-sky-500",
  "from-violet-500",
  "from-purple-500",
  "from-orange-500",
  "from-amber-500",
  "from-yellow-500",
  "from-lime-500",
  "from-green-500	",
];

function Playlist() {
  const { data: session } = useSession();
  const router = useRouter();
  const playlistId = router.query.playlistId as string;
  console.log("router query playlist page", router.query);
  const [color, setcolor] = useState<string | null>(null);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const spotifyApi = useSpotify();
  //session info do not have user id so fetching it
  const [currentUserId, setcurrentUserId] = useState<string | null>(null);

  const fetchPlaylistData = useCallback(() => {
    if (!playlistId) return;
    if (!spotifyApi.getAccessToken()) {
      console.log(
        "spotify acces toekn playlist page",
        spotifyApi.getAccessToken()
      );
      return;
    }
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
  }, [spotifyApi, playlistId, session]);

  useEffect(() => {
    console.log("effect get plauylist center");
    if (!playlistId) return;
    fetchPlaylistData();
  }, [fetchPlaylistData, playlistId, setPlaylist, session, spotifyApi]);

  return (
    <Layout>
      <div
        className=" text-white h-screen overflow-y-scroll 
    scrollbar-hide"
      >
        <section
          className={`flex items-end space-x-7 bg-gradient-to-b
      to-[#212328] ${color} h-72 lg:h-80 text-white p-5`}
        >
          {playlist?.images?.[0]?.url && (
            <div
              className="shadow-2xl hover:scale-110 
            transition-transform duration-100 ease-out;"
            >
              <Image
                src={playlist?.images?.[0]?.url}
                width={176}
                height={176}
                alt=""
              />
            </div>
          )}
          <div>
            <p className="text-gray-400">Playlist</p>
            <h1
              className="text-2xl md:text-3xl xl:text-5xl
          font-bold"
            >
              {playlist?.name}
            </h1>
          </div>
        </section>
        <section className="px-5 pb-32 space-y-3">
          <div>
            <Songs currentUserId={currentUserId} />
            <hr />
          </div>
          {playlist?.owner.id === currentUserId && (
            <AddTrack
              playlistId={playlist.id}
              fetchPlaylistData={fetchPlaylistData}
            />
          )}
        </section>
      </div>
    </Layout>
  );
}

export default Playlist;
