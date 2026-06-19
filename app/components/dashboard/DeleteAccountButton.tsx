"use client";

export default function DeleteAccountButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        const confirmed = window.confirm(
          "This permanently deletes your account, documents, and presentations. This cannot be undone. Continue?",
        );
        if (!confirmed) e.preventDefault();
      }}
      className="flex-shrink-0 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-100"
    >
      Delete account
    </button>
  );
}
