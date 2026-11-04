// Minimal types for StPageFlip (the package ships no declarations).
declare module 'page-flip/dist/js/page-flip.module.js' {
  export type FlipEvent<T = unknown> = { data: T; object: PageFlip };
  export type PageFlipSettings = {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    startPage?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    useMouseEvents?: boolean;
  };
  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    on(event: 'flip', cb: (e: FlipEvent<number>) => void): PageFlip;
    on(event: 'changeOrientation', cb: (e: FlipEvent<'portrait' | 'landscape'>) => void): PageFlip;
    on(event: 'changeState' | 'init' | 'update', cb: (e: FlipEvent) => void): PageFlip;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): 'portrait' | 'landscape';
    destroy(): void;
  }
}
