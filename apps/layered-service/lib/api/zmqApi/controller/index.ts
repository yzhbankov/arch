import Entity from './entity';
import {getChannelWithMessage} from '../../../utils';

export const ZMQ_PULL_CHANNELS = {
    ENTITY: '~entity',
};

export default async function (messageRaw: string): Promise<null> {
    const {channel, message} = getChannelWithMessage(messageRaw);
    switch (channel) {
        case ZMQ_PULL_CHANNELS.ENTITY: {
            await Entity.post(message || {});
            return null;
        }
    }
    return null;
}
