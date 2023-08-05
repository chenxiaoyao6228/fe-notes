import type { EventName, BaseEventName, EventParams } from "./types";

interface EventHandler<K> {
  (event: CustomEvent<K> & Event, data: K): any;
  eventFunc?: EventListenerOrEventListenerObject;
}

type ParamsValue = WindowEventMap & EventParams;
type ActionValue = `${EventName}` | BaseEventName;

export function addEventListener<
  Action extends ActionValue,
  Params = ParamsValue[ActionValue]
>(eventName: Action, handler: EventHandler<Params>, useCapture = false) {
  const func = (event: any) => {
    const detail: Params = event?.detail;
    handler(event, detail);
  };

  handler.eventFunc = func;
  window.addEventListener(eventName, func, useCapture);

  return () => removeListener(eventName, func);
}

export function removeListener<K = any>(
  eventName: ActionValue,
  handler: EventListenerOrEventListenerObject & EventHandler<K>,
  options?: any
) {
  const eventFunc = handler.eventFunc ? handler.eventFunc : handler;
  window.removeEventListener(eventName, eventFunc, options);
}

export function dispatchEvent<
  Action extends keyof ParamsValue,
  Params = ParamsValue[Action]
>(eventName: Action, detail?: Params) {
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
}
