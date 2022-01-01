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
      className="flex flex-col items-center bg-grayfirst min-h-screen
     w-full justify-center space-y-3"
    >
      <Image
        width={150}
        height={150}
        src="https://i.imgur.com/Yd4KSUf.png"
        alt="spotify logo"
      />

      {Object.values(providers!).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-3 font-bold rounded-full
            border-2 border-transparent hover:border-white hover:bg-grayfirst 
            hover:text-white tracking-wide	"
            //this redirect to home page wfter login
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            //but this keeps user on login page
            //in localhost
            // onClick={() => signIn(provider.id)}
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
