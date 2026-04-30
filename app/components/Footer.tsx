type Props = {
  onWhy: () => void;
  themeSlot: React.ReactNode;
};

export default function ScreenFooter({ onWhy, themeSlot }: Props) {
  return (
    <footer className="px-6 sm:px-12 md:px-16 lg:px-24 pb-5 pt-4 border-t border-subtle relative z-20">
      <div className="grid grid-cols-12 gap-x-6 items-baseline">
        <div className="col-span-12 md:col-span-6 md:col-start-2 lg:col-start-2 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <span className="text-[10px] tracking-editorial uppercase text-muted">
            Made by Chandu ·
          </span>
          <a
            href="https://twitter.com/charoori_ai"
            target="_blank"
            rel="noopener noreferrer"
            className="link-ctrl"
          >
            @charoori_ai
          </a>
          <a
            href="mailto:chandrahas.aroori@gmail.com"
            className="link-ctrl normal-case tracking-normal"
            style={{ letterSpacing: "0.05em" }}
          >
            chandrahas.aroori@gmail.com
          </a>
          <span className="text-[10px] tracking-editorial uppercase text-muted/70 italic">
            hit me up for feedback
          </span>
        </div>
        <div className="col-span-12 md:col-span-4 mt-3 md:mt-0 flex flex-wrap items-baseline gap-x-5 gap-y-2 md:justify-end">
          <button onClick={onWhy} className="link-ctrl">
            Why
          </button>
          {themeSlot}
        </div>
      </div>
    </footer>
  );
}
