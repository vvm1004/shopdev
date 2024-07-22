const Redis = require('redis');

class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient({ url: 'redis://localhost:6379' });
        this.publisher = Redis.createClient({ url: 'redis://localhost:6379' });

        this.subscriber.on('error', (err) => console.error('Subscriber Redis Client Error', err));
        this.publisher.on('error', (err) => console.error('Publisher Redis Client Error', err));

        this.subscriber.connect().then(() => console.log('Subscriber Redis client connected'));
        this.publisher.connect().then(() => console.log('Publisher Redis client connected'));
    }

    async publish(channel, message) {
        try {
            const reply = await this.publisher.publish(channel, message);
            return reply;
        } catch (err) {
            throw err;
        }
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel, (message, channel) => {
            callback(channel, message);
        });
    }
}

module.exports = new RedisPubSubService();
