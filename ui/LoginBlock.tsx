import { signIn, signOut } from "@/auth";
import { GoogleButton } from "./GoogleButton";

export function LoginBlock() {
  return (
    <div className="flex flex-col justify-center items-center backdrop-blur-sm z-10 absolute top-0 left-0 bottom-0 right-0">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full border">
        <h2 className="text-2xl font-bold mb-4">Log in to Generate Articles</h2>
        <p className="text-lg mb-4">
          To explore the depths of Wonkypedia you need to login so I don&apos;t
          go broke. Don&apos;t worry, it&apos;s completely free!
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <GoogleButton />
        </form>
      </div>
    </div>
  );
}
