import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import Image from "next/image";

type Provider = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

function login({ providers }: { providers: Provider | null }) {
  console.log("provider at login", Object.values(providers!));
  return (
    <div
      className="flex flex-col items-center bg-[#212328] min-h-screen
     w-full justify-center"
    >
      {/* <Image
        className="w-52 mb-5"
        src="https://links.papareact.com/9xl"
        alt=""
      /> */}

      {Object.values(providers!).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-full"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
