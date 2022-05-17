type CallBack<P> = (p: P) => Promise<void> | void

class Subscription<V> {

    private readonly event: Event<V>;
    public callback: CallBack<V>;
    public order: number;

    constructor(event: Event<V>, callback: CallBack<V>, order: number) {
        this.event = event;
        this.order = order;
        this.callback = callback;
    }

    public unsubscribe() { this.event.unsubscribe(this) }

}

interface Options<V> {
    onSubscribe?: (subscription: Subscription<V>) => void
    onUnsubscribe?: (subscription: Subscription<V>) => void
}

interface EventClient<V> {
    subscribe: (callback: CallBack<V>, order?: number) => Subscription<V>
    unsubscribe: (subscription: Subscription<V>) => void
}

class Event<V> {

    private readonly options: Options<V>
    private readonly _subscriptions = new Set<Subscription<V>>();

    constructor(actions: Options<V> = {}) { this.options = actions }

    public notify(value: V) {
        const subscriptions = Array.from(this._subscriptions.values());
        const ordersListeners = subscriptions.sort((a, b) => {
            return a.order - b.order;
        });

        Promise.all(ordersListeners.map(l => l.callback(value)))
            .catch(console.error)
    }

    public subscribe(callback: CallBack<V>, order: number = 0): Subscription<V> {
        const subscription = new Subscription(this, callback, order);
        this._subscriptions.add(subscription);

        this.options?.onSubscribe && this.options.onSubscribe(subscription);

        return subscription;
    }

    public unsubscribe(subscription: Subscription<V>) {
        this._subscriptions.delete(subscription);

        this.options?.onUnsubscribe && this.options.onUnsubscribe(subscription);
    }

    public get client(): EventClient<V> {
        return {
            subscribe: (c: CallBack<V>, o: number = 0) => this.subscribe(c, o),
            unsubscribe: (s: Subscription<V>) => this.unsubscribe(s),
        }
    }

}

export default Event;
export type {
    EventClient,
    Subscription
}