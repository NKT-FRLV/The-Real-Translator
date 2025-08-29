// presentation/components/Layout/HeaderShell.tsx
import { auth } from "@/app/auth";
import MobileHeaderClient from "./MobileHeaderClient";
import crypto from "crypto";

function gravatar(email?: string | null) {
  if (!email) return null;
  const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=256`;
}

export default async function HeaderShell() {
  const session = await auth();
  const user = session?.user ?? null;
  
  const avatarSrc =
    user?.image ??
    gravatar(user?.email) ??
    "https://api.dicebear.com/9.x/shapes/svg?seed=rt&size=128";

  return (
    <div className="md:hidden col-span-full row-span-1 sticky top-0 z-50">
      <MobileHeaderClient
        isAuth={!!user}
        userName={user?.name ?? undefined}
        avatarSrc={avatarSrc}
      />
    </div>
  );
}
