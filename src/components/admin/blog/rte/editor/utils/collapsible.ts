export function setDomHiddenUntilFound(dom: HTMLElement): void {
  // @ts-expect-error
  dom.hidden = "until-found";
}

export function domOnBeforeMatch(dom: HTMLElement, callback: () => void): void {
  // `onbeforematch` is an experimental DOM API; cast to any to avoid TS errors
  (dom as any).onbeforematch = callback;
}
