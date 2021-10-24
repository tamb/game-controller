export default class GameController {
    root: HTMLElement;
    actions: number;
    refs: any;
    hooks: any;
    vibrate: boolean;
    fullscreen: boolean;
    document: HTMLElement;
    constructor(query: string, config: any);
    handleClick: (eventName: any, refName: any) => void;
    attachEventHandlers: () => void;
    closeFullscreen: () => void;
    openFullscreen: () => void;
    render(): void;
}
