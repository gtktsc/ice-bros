import { Input, InputChannel, Message, Note, NoteMessageEvent } from "webmidi";

type Attribute = keyof (Input | Note | InputChannel | Message);

export type MidiCondition = {
  trigger: keyof NoteMessageEvent;
  attribute?: Attribute;
  operator: string;
  value: number | string;
};

export type TimeCondition = {
  trigger: "elapsed";
  operator: string;
  value: number;
};

export type TimeTrigger = {
  type: "time";
  condition: TimeCondition[];
};

export type MidiTrigger = {
  type: "midi";
  event: "noteon" | "noteoff" | "controlchange" | "midimessage";
  condition: MidiCondition[];
};

export type Event = {
  id: string;
  title?: string;
  triggers: Array<TimeTrigger | MidiTrigger>;
  action: (event: unknown, state: unknown) => void;
};

export type Sketch = {
  events: Event[];
};

export type State = {
  inputs: Input[];
  elapsed: number;
};
