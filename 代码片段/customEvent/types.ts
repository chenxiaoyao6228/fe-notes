// 全局事件名
export enum EventName {
  uploadFile = "uploadFile",
}

export type BaseEventName = keyof WindowEventMap;

// 下发消息的参数
export interface EventParams {
  [EventName.uploadFile]: {};
}
