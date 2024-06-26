import React from "react";
import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import logo from "@/assets/wonkypedia.png";
import Link from "next/link";
import Search from "./Search";
import { Grid } from "./Grid";
import { GoogleButton } from "./GoogleButton";
import { IS_LOCAL } from "@/shared/config";
import { Session } from "next-auth";

const Header = async () => {
  let session: Session | null = null;
  if (!IS_LOCAL) {
    session = await auth();
  }
  return (
    <header className="bg-white text-gray-800 flex justify-between items-center border-b border-gray-200">
      <Grid className="p-4">
        <Link href="/" className="flex items-center mr-4 col-span-3">
          <Image src={logo} alt="Wonkypedia" width={50} height={50} />
          <span className="ml-2 text-xl font-bold text-gray-800">
            Wonkypedia
          </span>
        </Link>
        <Search className="col-span-9 row-start-2 md:col-span-6 flex md:row-start-1 md:col-start-4" />
        {!IS_LOCAL && (
          <form
            className="col-span-6 md:col-span-3 flex justify-end"
            action={async () => {
              "use server";
              if (session) {
                await signOut();
              } else {
                await signIn("google");
              }
            }}
          >
            {session ? (
              <button
                type="submit"
                className="text-blue-500 hover:text-blue-700 underline font-bold py-2 px-4"
              >
                Sign Out
              </button>
            ) : (
              <GoogleButton />
            )}
          </form>
        )}
      </Grid>
    </header>
  );
};

export default Header;
