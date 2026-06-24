import { Icon } from "@/components/Icon";

const HELP_PHONE = "9011023081";

// Floating "Need help with your order?" button — taps straight into a phone call.
export function HelpCallButton() {
  return (
    <a
      href={`tel:${HELP_PHONE}`}
      className="group fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-full bg-success px-4 py-3 text-white shadow-lg transition hover:brightness-110"
      aria-label={`Need help with your order? Call ${HELP_PHONE}`}
    >
      <Icon name="phone" size={22} className="shrink-0" />
      <span className="hidden text-left leading-tight sm:block">
        <span className="block text-xs font-medium text-white/80">
          Need help with your order?
        </span>
        <span className="block text-sm font-bold">{HELP_PHONE}</span>
      </span>
    </a>
  );
}
