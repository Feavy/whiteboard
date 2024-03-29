import {useState} from "react";

export default class Event<T> {
  private listeners: (<K extends T>(value: K) => void)[] = [];
  public lastValue: T|null = null;

  public subscribe(listener: (value: T) => void) {
    this.listeners.push(listener);
  }

  public subscribeOnce(listener: (value: T) => void) {
    const once = (value: T) => {
      this.unsubscribe(once);
      listener(value);
    };
    this.subscribe(once);
  }

  public unsubscribe(listener: (value: T) => void) {
    const index = this.listeners.indexOf(listener);
    if (index === -1) return false;
    this.listeners.splice(index, 1);
    return true;
  }

  public trigger(value: T) {
    const listeners = this.listeners.slice();
    for (const listener of listeners) {
      listener(value);
    }
    this.lastValue = value;
  }

  public asState() {
    const [value, setValue] = useState<T|null>(this.lastValue);
    this.subscribe(setValue);
    return value;
  }
}