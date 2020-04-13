/* eslint-disable max-classes-per-file */
export const STATUS_IDLE = 'idle';
export const STATUS_CLIENT_READY = 'clientReady';
export const STATUS_RIPPING_START = 'rippingStart';
export const STATUS_METADATA_RETREIVED = 'metaDataRetrieved';
export const STATUS_RIPPING_SUCCESS = 'rippingSuccess';
export const STATUS_RIPPING_ERROR = 'rippingError';
export const STATUS_STORING_START = 'storingStart';
export const STATUS_STORING_END = 'storingEnd';

export class StatusMessage {
  static fromEvent(eventData) {
    const { state, metaData } = JSON.parse(eventData);
    return new StatusMessage(state, metaData);
  }

  static idle() {
    return new StatusMessage(STATUS_IDLE);
  }

  constructor(state, metaData = {}) {
    this.state = state;
    this.metaData = metaData;
  }

  isIdle() {
    return STATUS_IDLE === this.state;
  }

  isRunning() {
    return STATUS_IDLE !== this.state;
  }

  isStoringStart() {
    return STATUS_STORING_START === this.state;
  }

  setState(state) {
    this.state = state;
  }

  setToIdle() {
    this.state = STATUS_IDLE;
    this.metaData = {};
  }

  addMetaData(field, value) {
    this.metaData[field] = value;
  }

  getMetaData(field) {
    return this.metaData[field];
  }

  send(ws) {
    ws.send(this.toJson());
  }

  toJson() {
    return JSON.stringify({
      state: this.state,
      metaData: this.metaData,
    });
  }
}

export class ClientMessage extends StatusMessage {
  static fromEvent(eventData) {
    const { state } = JSON.parse(eventData);
    return new ClientMessage(state);
  }

  static clientReady() {
    return new ClientMessage(STATUS_CLIENT_READY);
  }

  constructor(state, metadata = []) {
    super(state, metadata);
  }

  isClientReady() {
    return this.state === STATUS_CLIENT_READY;
  }
}
