import {EntitySave} from '../../../usecases';
import makeRequestHandler from '../../utils/makeRequestHandler';

export default {
    post: makeRequestHandler(EntitySave, (message) => message || {}),
};
