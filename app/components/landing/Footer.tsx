export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-3 border-t border-border-soft bg-surface-1 px-6 py-7 text-center sm:flex-row sm:justify-between sm:text-left sm:px-10">
      <div className="font-display text-base font-bold text-text-strong">
        Edu<span className="text-brand">Slide</span>
      </div>
      <p className="text-sm text-text-muted">
        © 2026 EduSlide · Privacy-first AI for education
      </p>
      <p className="text-sm text-text-muted">Privacy · Terms · Security</p>
    </footer>
  );
}
