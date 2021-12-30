import type { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <div>sdf</div>
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
