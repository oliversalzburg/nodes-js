export const snapshot = {
  stage: {
    x: 3333,
    y: 3333
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
          inputs: []
        },
        {
          id: "output-77j1-4",
          inputs: []
        },
        {
          id: "output-oAU53I",
          inputs: []
        }
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              identifier: "ouput0",
              label: "Hour"
            },
            {
              identifier: "ouput1",
              label: "Minute"
            },
            {
              identifier: "ouput2",
              label: "Second"
            }
          ]
        },
        script: `this._title("Clock");
          const time = new Date();
          
          let hour = this._output("Hour");
          hour.update(time.getHours());
          let minute = this._output("Minute");
          minute.update(time.getMinutes());
          let second = this._output("Second");
          second.update(time.getSeconds());`
      }
    }
  ]
};
