export const snapshot = {
  stage: {
    x: 3092,
    y: 2504
  },
  nodes: [
    {
      type: "script",
      id: "script-5QM24I",
      name: "Clock",
      x: 3299.6666717529297,
      y: 2797.6666870117188,
      inputs: [],
      outputs: [
        {
          id: "output-LmkUuh",
          inputs: ["input-W8yr42"]
        },
        {
          id: "output-MENMA4",
          inputs: ["input-HklVPx"]
        },
        {
          id: "output-iaIULo",
          inputs: ["input-5V11EJ"]
        }
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              identifier: "hour",
              label: "Hour"
            },
            {
              identifier: "minute",
              label: "Minute"
            },
            {
              identifier: "second",
              label: "Second"
            }
          ]
        },
        script: "const time = new Date();\nhour = time.getHours();\nminute = time.getMinutes();\nsecond = time.getSeconds();"
      }
    },
    {
      type: "script",
      id: "script-d_6iiv",
      name: "Daylight Calculator",
      x: 3752.6666870117188,
      y: 2910.6666870117188,
      inputs: [
        {
          id: "input-W8yr42",
          output: "output-LmkUuh"
        },
        {
          id: "input-HklVPx",
          output: "output-MENMA4"
        },
        {
          id: "input-5V11EJ",
          output: "output-iaIULo"
        }
      ],
      outputs: [
        {
          id: "output-RFJ_Jz",
          inputs: []
        },
        {
          id: "output-Csesgz",
          inputs: []
        }
      ],
      behavior: {
        metadata: {
          inputs: [
            {
              identifier: "hour",
              label: "Hour"
            },
            {
              identifier: "minute",
              label: "Minute"
            },
            {
              identifier: "second",
              label: "Second"
            }
          ],
          outputs: [
            {
              identifier: "daylight",
              label: "Daylight"
            },
            {
              identifier: "fourTwenty",
              label: "Is 4:20?"
            }
          ]
        },
        script: "daylight = 6 < hour && (hour < 19 && 30 < minute);\nfourTwenty = hour === 16 && minute === 20;"
      }
    }
  ]
};
