// presentation/components/Layout/MobileHeaderClient.tsx
"use client";

import { useState } from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import Logo from "../Logo";
import BurgerMenu from "./BurgerMenu";
import ProfileButton from "../ProfileButton";
import Link from "next/link";

export default function MobileHeaderClient({
  isAuth,
  userName,
  avatarSrc,
}: {
  isAuth: boolean;
  userName?: string;
  avatarSrc?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(v => !v)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {/* твои 3 полоски */}
              <div className="flex flex-col w-5 h-5 justify-center items-center">
                <span className={`block h-0.5 w-5 bg-current transition-all ${open ? "rotate-45 translate-y-1" : "-translate-y-1"}`} />
                <span className={`block h-0.5 w-5 bg-current transition-all ${open ? "opacity-0" : "opacity-100"}`} />
                <span className={`block h-0.5 w-5 bg-current transition-all ${open ? "-rotate-45 -translate-y-1" : "translate-y-1"}`} />
              </div>
            </button>

            <div className="flex items-center gap-2">
              <Logo size={32} />
              <Link href="/">
                <h1 className="font-orbitron text-md tracking-wider font-semibold text-foreground">Real Translator</h1>
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <ThemeSwitcher className="mr-4" />
			<ProfileButton isAuth={isAuth} avatarSrc={avatarSrc} userName={userName} size="mobile" />
          </div>
        </div>
      </header>

      <BurgerMenu isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
