import EventEmitter from 'events';

import logger from './logger';

export default class EventBus extends EventEmitter {
  emit(event, ...args) {
    logger.debug(`[Event Bus] Event ${event} sended with data: ${JSON.stringify(args)}`);
    super.emit(event, ...args);
  }
}
