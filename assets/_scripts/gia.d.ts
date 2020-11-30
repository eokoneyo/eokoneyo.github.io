/* eslint no-useless-constructor: "off" */

declare module 'gia' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  export abstract class Component<
    S = Record<string, unknown>,
    R = Record<string, unknown>,
    O = Record<string, unknown>
  > {
    readonly element: HTMLElement;

    protected constructor(element: HTMLElement, opts?: O);

    get ref(): R;

    set ref(items: R);

    get state(): Partial<S>;

    set state(state: Partial<S>);

    get options(): O;

    set options(opts: O);

    abstract mount(): void;

    unmount(): void;

    setState(state: Partial<S>): void;

    stateChange(stateChanges: Partial<S>): void;

    getRef(ref: string): string;

    // eslint-disable-next-line no-underscore-dangle
    _load(): void;
  }

  type GiaComponent = new (...args: never[]) => Component;

  export type GiaComponentsRecord = Record<string, GiaComponent>;

  export function loadComponents(
    components: GiaComponentsRecord,
    context?: HTMLElement
  ): void;

  export function createInstance<T>(
    element: HTMLElement,
    componentName: string,
    component: T extends Component ? new (...args : never[]) => T : never,
    options?: Record<string, unknown>,
  ): T
}
