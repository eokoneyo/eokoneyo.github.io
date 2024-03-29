/* eslint no-useless-constructor: "off" */

declare module 'gia' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  export abstract class Component<
    R = Record<string, unknown>,
    S = Record<string, unknown>,
    O = Record<string, unknown>
  > {
    readonly element: HTMLElement;

    protected constructor(element: HTMLElement, opts?: O);

    get ref(): Partial<R>;

    set ref(items: Partial<R>);

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
    // eslint-disable-next-line @typescript-eslint/ban-types
    component: T extends Component ? Function & { prototype: T } : never,
    options?: Record<string, unknown>
  ): T;

  interface Config<O = Record<'log', boolean>> {
    _options: O;

    set<T extends keyof O>(name: T, value: O[T]): void;
    get<T extends keyof O>(name: T): O[T];
  }

  export const config: Config;

  interface EventBus {
    emit(evt: string, eventObject?: Record<string, unknown>): void;

    on(evt: string, handler: () => void, once?: boolean): void;
  }

  export const eventbus: EventBus;
}
