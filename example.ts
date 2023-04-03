export const example = {
  events: [
    {
      id: "2",
      title: "Run event after 500ms",
      triggers: [
        {
          type: "time",
          condition: [{ trigger: "duration", operator: "after", value: 500 }],
        },
      ],
      action: () => {
        console.log("Run event after 500ms");
      },
    },
    {
      id: "3",
      title: "Run event before 1000ms",
      triggers: [
        {
          type: "time",
          condition: [{ trigger: "duration", operator: "before", value: 1000 }],
        },
      ],
      action: () => {
        console.log("Run event before 1000ms");
      },
    },
    {
      id: "4",
      title: "Run event between 700 and 8000ms",
      triggers: [
        {
          type: "time",
          condition: [
            { trigger: "duration", operator: "after", value: 700 },
            { trigger: "duration", operator: "before", value: 800 },
          ],
        },
      ],
      action: () => {
        console.log("Run event between 700 and 8000ms");
      },
    },
    {
      id: "5",
      title: "Run event on note c",
      triggers: [
        {
          type: "midi",
          event: "noteon",
          condition: [
            {
              trigger: "note",
              attribute: "name",
              operator: "equal",
              value: "C",
            },
          ],
        },
      ],
      action: () => {
        console.log("Run event on note c");
      },
    },
    {
      id: "6",
      title: "Run event on midi message 127 1",
      triggers: [
        {
          type: "midi",
          event: "midimessage",
          condition: [
            { trigger: "data", attribute: 0, operator: "equal", value: 127 },
            { trigger: "data", attribute: 1, operator: "equal", value: 1 },
          ],
        },
      ],
      action: () => {
        console.log("Run event on midi message 127 1");
      },
    },
    {
      id: "7",
      title: "Run event on midi message 127 2",
      triggers: [
        {
          type: "midi",
          event: "midimessage",
          condition: [
            { trigger: "data", attribute: 0, operator: "equal", value: 127 },
            { trigger: "data", attribute: 1, operator: "equal", value: 2 },
          ],
        },
      ],
      action: () => {
        console.log("Run event on midi message 127 2");
      },
    },
    {
      id: "7",
      title: "Run event on midi message 127 7",
      triggers: [
        {
          type: "midi",
          event: "midimessage",
          condition: [
            { trigger: "data", attribute: 0, operator: "equal", value: 127 },
            { trigger: "data", attribute: 1, operator: "equal", value: 7 },
          ],
        },
      ],
      action: () => {
        console.log("Run event on midi message 127 7");
      },
    },
    {
      id: "8",
      title: "Run event on midi message 127 0",
      triggers: [
        {
          type: "midi",
          event: "midimessage",
          condition: [
            { trigger: "data", attribute: 0, operator: "equal", value: 127 },
            { trigger: "data", attribute: 1, operator: "equal", value: 0 },
          ],
        },
      ],
      action: () => {
        console.log("Run event on midi message 127 0");
      },
    },
  ],
};
