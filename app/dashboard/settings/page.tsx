import { createClient, getCachedUser } from "@/app/lib/supabase/server";
import { getProfile } from "@/app/lib/dashboard/queries";
import { sendPasswordReset, updatePreferences, updateProfile } from "@/app/lib/dashboard/actions";
import { TEMPLATES } from "@/app/lib/dashboard/templates";

function Toggle({ name, defaultChecked }: { name: string; defaultChecked: boolean }) {
  return (
    <label className="relative inline-flex h-[22px] w-10 flex-shrink-0 cursor-pointer items-center">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="absolute inset-0 rounded-full bg-border-mid transition-colors peer-checked:bg-brand" />
      <span className="absolute left-[3px] h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-[18px]" />
    </label>
  );
}

export default async function SettingsPage() {
  const user = await getCachedUser();
  if (!user) return null;
  const supabase = await createClient();

  const profile = await getProfile(supabase, user.id);

  return (
    <div className="px-7 py-6">
      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        <form action={updateProfile} className="rounded-xl border border-border-soft bg-surface-1 p-5">
          <div className="mb-4 text-sm font-bold text-text-strong">Profile</div>

          <SettingsRow title="Full name" desc="Shown on exported presentations">
            <input
              name="fullName"
              defaultValue={profile.full_name ?? ""}
              className="w-56 rounded-lg border border-border-mid bg-surface-1 px-3 py-2 text-[13px] text-text-strong focus:border-brand focus:outline-none"
            />
          </SettingsRow>

          <SettingsRow title="Email" desc="Your account email address">
            <input
              name="email"
              type="email"
              defaultValue={user.email ?? ""}
              className="w-56 rounded-lg border border-border-mid bg-surface-1 px-3 py-2 text-[13px] text-text-strong focus:border-brand focus:outline-none"
            />
          </SettingsRow>

          <SettingsRow title="Institution" desc="Optional — shown in the Academic template" last>
            <input
              name="institution"
              defaultValue={profile.institution ?? ""}
              placeholder="e.g. IIT Delhi"
              className="w-56 rounded-lg border border-border-mid bg-surface-1 px-3 py-2 text-[13px] text-text-strong focus:border-brand focus:outline-none"
            />
          </SettingsRow>

          <div className="flex justify-end border-t border-border-soft pt-3.5">
            <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90">
              Save changes
            </button>
          </div>
        </form>

        <form action={updatePreferences} className="rounded-xl border border-border-soft bg-surface-1 p-5">
          <div className="mb-4 text-sm font-bold text-text-strong">Preferences</div>

          <SettingsRow title="Default template" desc="Applied to all new uploads">
            <select
              name="defaultTemplate"
              defaultValue={profile.default_template}
              className="w-44 rounded-lg border border-border-mid bg-surface-1 px-3 py-2 text-[13px] text-text-strong focus:border-brand focus:outline-none"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </SettingsRow>

          <SettingsRow title="Speaker notes" desc="Generate AI speaker notes by default">
            <Toggle name="speakerNotesDefault" defaultChecked={profile.speaker_notes_default} />
          </SettingsRow>

          <SettingsRow title="Email on completion" desc="Get notified when a presentation is ready">
            <Toggle name="emailOnCompletion" defaultChecked={profile.email_on_completion} />
          </SettingsRow>

          <SettingsRow title="Auto-delete uploads" desc="Remove source documents after 30 days" last>
            <Toggle name="autoDeleteUploads" defaultChecked={profile.auto_delete_uploads} />
          </SettingsRow>

          <div className="flex justify-end border-t border-border-soft pt-3.5">
            <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90">
              Save preferences
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4 rounded-xl border border-border-soft bg-surface-1 p-5">
        <div className="mb-4 text-sm font-bold text-text-strong">Security</div>

        <SettingsRow title="Change password" desc="Send a password reset link to your email" last>
          <form action={sendPasswordReset}>
            <button
              type="submit"
              className="rounded-lg border border-border-mid bg-surface-1 px-3.5 py-2 text-[13px] font-medium text-text-strong hover:bg-surface-3"
            >
              Send reset email
            </button>
          </form>
        </SettingsRow>

        <div className="flex items-start justify-between gap-5 border-t border-border-soft pt-3.5">
          <div>
            <h4 className="mb-0.5 text-sm font-semibold text-text-strong">Delete account</h4>
            <p className="text-[13px] leading-relaxed text-text-muted">
              Permanently delete your account and all data
            </p>
          </div>
          <span className="flex-shrink-0 text-[13px] text-text-muted">Contact support</span>
        </div>
      </div>
    </div>
  );
}

function SettingsRow({
  title,
  desc,
  children,
  last,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-5 py-3.5 ${last ? "" : "border-b border-border-soft"}`}>
      <div className="min-w-0 flex-1">
        <h4 className="mb-0.5 text-sm font-semibold text-text-strong">{title}</h4>
        <p className="text-[13px] leading-relaxed text-text-muted">{desc}</p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}
