const HOME_MAIN_LABEL = "Main content";
const HOME_FOOTER_CLASS_NAME =
  "mx-auto w-full max-w-(--thread-content-max-width) px-toolbar z-10 -mt-[var(--thread-footer-overlap)] flex flex-col gap-2 pb-2";

function HomeBanners() {
  return null;
}

export function HomePage() {
  return (
    <div
      className="flex h-full flex-col"
      data-vscode-context='{"chatgpt.supportsNewChatMenu": true}'
      tabIndex={0}
    >
      <div className="relative flex h-full flex-col">
        <div
          className="[container-type:size] relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden [container-name:home-main-content]"
          role="main"
          aria-label={HOME_MAIN_LABEL}
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-panel">
            <div className="flex-1" />
          </div>
        </div>

        <div className={HOME_FOOTER_CLASS_NAME}>
          <div className="home-banners mt-2 flex flex-col gap-2 empty:hidden">
            <HomeBanners />
          </div>
          <div aria-hidden="true" className="electron:hidden" />
        </div>
      </div>
    </div>
  );
}
