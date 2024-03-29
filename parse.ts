import { Message, NoteMessageEvent } from "webmidi";
import { Sketch, State } from "./types";

export const parse = (sketch: Sketch, state: State) =>
  sketch.events.forEach(({ triggers, action, id }) => {
    triggers.forEach((currentTrigger) => {
      const { condition, type } = currentTrigger;

      switch (type) {
        case "time": {
          const shouldRun = condition.reduce(
            (acc, { trigger, operator, value }) => {
              let result = acc;
              switch (operator) {
                case "after": {
                  result = state[trigger] > value;
                  break;
                }
                case "before": {
                  result = state[trigger] < value;
                  break;
                }
                default: {
                  result = acc;
                  break;
                }
              }
              return result;
            },
            true
          );

          if (shouldRun) {
            action({ id, type, condition }, state);
          }
          break;
        }
        case "midi": {
          state.inputs.forEach((input) => {
            const { event } = currentTrigger;

            input.addListener(
              event,
              (currentMidiEvent: Message | NoteMessageEvent) => {
                const shouldRun = condition.reduce(
                  (acc, { trigger, operator, value, attribute }) => {
                    let result = acc;

                    switch (operator) {
                      case "equal": {
                        // @ts-ignore shhhh
                        const currentEventTrigger = currentMidiEvent[
                          trigger
                        ] as
                          | NoteMessageEvent[keyof NoteMessageEvent]
                          | Message[keyof Message];

                        const currentValue =
                          attribute !== undefined &&
                          typeof currentEventTrigger === "object"
                            ? // @ts-ignore shhhh
                              currentEventTrigger[attribute]
                            : currentEventTrigger;

                        result = currentValue === value;
                        break;
                      }
                      default: {
                        result = acc;
                        break;
                      }
                    }
                    return result;
                  },
                  true
                );

                if (shouldRun) {
                  action({ id, type, condition }, state);
                }
              }
            );
          });
        }
      }
    });
  });
