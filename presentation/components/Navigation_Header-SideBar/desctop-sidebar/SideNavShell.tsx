
// presentation/components/Layout/SidebarShell.tsx
import DesktopSideNavClient from "./DesktopSideNavClient"; // "use client"
// import crypto from "crypto";
import { User } from "next-auth";

// function gravatar(email?: string | null) {
//   if (!email) return null;
//   const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
//   return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=256`;
// }

interface SideNavShellProps {
  user?: User;
}

export default async function SideNavShell({ user }: SideNavShellProps) {

  
  const avatarSrc =
    user?.image ??
    // gravatar(user?.email) ??
    "https://api.dicebear.com/9.x/shapes/svg?seed=rt&size=128";

  return (
    <aside className="hidden md:flex md:col-start-1 md:row-span-2 border-r z-1">
      <DesktopSideNavClient
        isAuth={!!user}
        userName={user?.name ?? undefined}
        avatarSrc={avatarSrc}
      />
    </aside>
  );
}
