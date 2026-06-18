import OwnerLoginForm from "@/components/owner/OwnerLoginForm";
import { isOwnerAuthenticated } from "@/lib/owner-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OwnerLoginPage() {
  if (await isOwnerAuthenticated()) {
    redirect("/owner");
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg-tertiary)] px-6 py-12 text-[var(--color-text-primary)]">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="dash-card flex flex-col justify-between rounded-2xl p-8 md:p-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="dash-accent" aria-hidden />
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-text-tertiary)]">Piece by Piece</p>
            </div>
            <h1 className="mt-6 max-w-xl font-heading text-5xl font-light leading-[1.0] tracking-wide md:text-7xl">
              Owner dashboard for the full brand picture.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[var(--color-text-secondary)]">
              Revenue, sold pieces, live stock, recent orders, and shipping progress all in one calm workspace.
            </p>
          </div>

          <div className="grid gap-4 pt-10 md:grid-cols-3">
            {[
              ["Revenue", "Track turnover from paid orders"],
              ["Inventory", "Adjust stock before something oversells"],
              ["Shipping", "Move orders from pending to delivered"],
            ].map(([title, text]) => (
              <div key={title} className="dash-inset rounded-xl p-5">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-tertiary)]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <div className="dash-card w-full rounded-2xl p-8 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-text-tertiary)]">Secure access</p>
            <h2 className="mt-4 font-heading text-3xl font-light tracking-wide text-[var(--color-text-primary)]">Sign in</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
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
