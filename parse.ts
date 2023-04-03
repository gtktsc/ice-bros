import { NoteMessageEvent } from "webmidi";

export const parse = (sketch, state) =>
  sketch.events.forEach(({ triggers, action, id }) => {
    triggers.forEach(({ type, condition, event }) => {
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
            input.addListener(event, (currentMidiEvent: NoteMessageEvent) => {
              const shouldRun = condition.reduce(
                (acc, { trigger, operator, value, attribute }) => {
                  let result = acc;

                  switch (operator) {
                    case "equal": {
                      const currentValue =
                        attribute !== undefined
                          ? currentMidiEvent[trigger][attribute]
                          : currentMidiEvent[trigger];

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
            });
          });
        }
      }
    });
  });
