import {Server} from "socket.io";

import events from "./events";

const eventsSubscriptions: { [key: string]: Set<string> } = Object.fromEntries(
    Object.keys(events).map(eventId => [eventId, new Set()])
);

const setupRealtime = (io: Server) => {
    Object.entries(events).map(([eventId, event]) => {
        event.subscribe((data) => {
            const socketIds = Array.from(eventsSubscriptions[eventId]);
            if (socketIds.length === 0) return;

            const emitter = socketIds.reduce((emitter, socketId) => {
                emitter.to(socketId);
                return emitter;
            }, io);

            emitter.emit('notify', eventId, data);
        })
    })

    io.on("connection", (socket) => {
        socket.on('subscribe', (eventId: string) => {
            if (!events[eventId]) return;
            eventsSubscriptions[eventId].add(socket.id);
        });

        socket.on('unsubscribe', (eventId) => {
            if (!events[eventId]) return;
            eventsSubscriptions[eventId].delete(socket.id);
        });

        socket.on('disconnect', () => {
            Object.values(eventsSubscriptions).forEach(subscriptions => {
                subscriptions.delete(socket.id);
            })
        });
    });
}

export default setupRealtime;