import type { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userPlaylistState } from "../atoms/playlistAtom";
import Layout from "../components/Layout";
import PlaylistCard from "../components/PlaylistCard";
import useSpotify from "../hooks/useSpotify";

const Home: NextPage = () => {
  const spotifyApi = useSpotify();
  const [featuredPlaylist, setFeaturedPlaylist] =
    useState<SpotifyApi.ListOfFeaturedPlaylistsResponse | null>(null);
  const userPlaylists = useRecoilValue(userPlaylistState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { body: user } = await spotifyApi.getMe();
        const { body: featuredPlaylist } =
          await spotifyApi.getFeaturedPlaylists({ country: user.country });
        setFeaturedPlaylist(featuredPlaylist);
        console.log("featured", featuredPlaylist);
      } catch (error) {
        console.log("error at index.tsx", error);
      }
    };
    fetchData();
  }, [spotifyApi]);

  return (
    <Layout>
      <section className="m-3 space-y-5">
        <section className="space-y-3">
          <h2 className="text-white text-2xl md:text-3xl font-bold">
            {featuredPlaylist?.message}
          </h2>
          <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
            {featuredPlaylist?.playlists.items.map((playlist) =>
              playlist.type === "playlist" ? (
                <div key={playlist.id} className="shrink-0 basis-44 grow-0">
                  <PlaylistCard playlist={playlist} />
                </div>
              ) : null
            )}
          </div>
        </section>
        {userPlaylists.length > 0 ? (
          <section>
            <h2 className="text-white  text-2xl md:text-3xl font-bold">
              Your Playlists
            </h2>
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
              {userPlaylists.map((playlist) => (
                <div key={playlist.id} className="shrink-0 basis-44 grow-0">
                  <PlaylistCard playlist={playlist} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section></section>
        )}
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
};

export default Home;
