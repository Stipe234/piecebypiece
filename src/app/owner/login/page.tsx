import OwnerLoginForm from "@/components/owner/OwnerLoginForm";
import { isOwnerAuthenticated } from "@/lib/owner-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OwnerLoginPage() {
  if (await isOwnerAuthenticated()) {
    redirect("/owner");
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(216,186,132,0.22),_transparent_35%),linear-gradient(180deg,#171411_0%,#0e0c0a_100%)] px-6 py-12 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur md:p-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#d8ba84]">Piece by Piece</p>
            <h1 className="mt-6 max-w-xl font-heading text-5xl font-light leading-[0.95] md:text-7xl">
              Owner dashboard for the full brand picture.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-white/70">
              Revenue, sold pieces, live stock, recent orders, and shipping progress all in one calm workspace.
            </p>
          </div>

          <div className="grid gap-4 pt-10 md:grid-cols-3">
            {[
              ["Revenue", "Track turnover from paid orders"],
              ["Inventory", "Adjust stock before something oversells"],
              ["Shipping", "Move orders from pending to delivered"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-[2rem] border border-white/10 bg-[#11100e]/90 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Secure access</p>
            <h2 className="mt-4 font-heading text-3xl font-light text-white">Sign in</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Enter the private dashboard password to continue.
            </p>

            <div className="mt-8">
              <OwnerLoginForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
