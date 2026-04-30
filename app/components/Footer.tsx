export default function Footer() {
  return (
    <footer className="px-6 sm:px-12 md:px-16 lg:px-24 py-6 sm:py-8 border-t border-foreground/10">
      <div className="grid grid-cols-12 gap-x-6 items-end">
        <div className="col-span-12 md:col-span-6 md:col-start-2 lg:col-start-2">
          <p className="text-xs sm:text-sm tracking-editorial uppercase text-muted mb-2">
            Made by Chandu
          </p>
          <p className="font-display text-2xl sm:text-3xl text-foreground leading-tight">
            <span className="italic">hit me up</span> for feedback.
          </p>
        </div>
        <div className="col-span-12 md:col-span-4 mt-6 md:mt-0 flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-foreground/80">
          <a
            href="https://twitter.com/charoori_ai"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-foreground/30 hover:text-accent hover:border-accent transition-colors uppercase tracking-editorial text-xs"
          >
            @charoori_ai
          </a>
          <a
            href="mailto:chandrahas.aroori@gmail.com"
            className="border-b border-foreground/30 hover:text-accent hover:border-accent transition-colors uppercase tracking-editorial text-xs"
          >
            chandrahas.aroori@gmail.com
          </a>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6 mt-10 sm:mt-12">
        <p className="col-span-12 md:col-span-10 md:col-start-2 lg:col-start-2 text-[10px] tracking-editorial uppercase text-muted/60">
          Phonk via YouTube live radio · quotes curated · stay hard
        </p>
      </div>
    </footer>
  );
}
