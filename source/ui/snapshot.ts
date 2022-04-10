export const snapshot = {
  stage: {
    x: 3333,
    y: 3333,
  },
  nodes: [
    {
      type: "script",
      id: "script-18nu1G",
      name: "Clock",
      x: 3631.5,
      y: 3762,
      inputs: [],
      outputs: [
        {
          id: "output-lUSgBU",
          inputs: [],
        },
        {
          id: "output-77j1-4",
          inputs: [],
        },
        {
          id: "output-oAU53I",
          inputs: [],
        },
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              identifier: "ouput0",
              label: "Hour",
            },
            {
              identifier: "ouput1",
              label: "Minute",
            },
            {
              identifier: "ouput2",
              label: "Second",
            },
          ],
        },
        script:
          'this._title("Clock");\n\nconst time = new Date();\n\nlet hour = this._output("Hour");\nhour.update(time.getHours());\nlet minute = this._output("Minute");\nminute.update(time.getMinutes());\nlet second = this._output("Second");\nsecond.update(time.getSeconds());',
      },
    },
  ],
};
