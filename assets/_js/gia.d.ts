/* eslint no-useless-constructor: "off" */

declare module 'gia' {

  // eslint-disable-next-line @typescript-eslint/ban-types
  export abstract class Component<S = {}, R extends Record<string, unknown> = {}, O extends Record<string, unknown> = {}> {
    readonly element: HTMLElement;

    protected constructor(element: HTMLElement, opts?: O);

    get ref(): R;

    set ref(items: R);

    get state(): Partial<S>;

    set state(state: Partial<S>);

    get options(): O;

    set options(opts: O);

    require(): Promise<void>;

    abstract mount(): void;

    unmount(): void;

    setState(state: Partial<S>): void;

    stateChange(stateChanges: Partial<S>): void;

    getRef(ref: string): string;

    // eslint-disable-next-line no-underscore-dangle
    _load(): void;
  }

  export function loadComponents(
    components: Record<string, new (...args: never[]) => Component>,
    context?: HTMLElement
  ): void;
}
