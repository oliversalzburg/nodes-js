export const snapshot = {
  stage: {
    x: 2845,
    y: 2396,
  },
  nodes: [
    {
      type: "seed",
      id: "seed-QNK9dZ",
      name: "Seed seed-QNK9dZ",
      x: 3000,
      y: 3000,
      inputs: [],
      outputs: [
        {
          id: "output-Rcps9C",
          inputs: ["input-gUjyDm"],
        },
        {
          id: "output-IL0s6U",
          inputs: [],
        },
      ],
    },
    {
      type: "seed",
      id: "seed-vgGwv5",
      name: "Seed seed-vgGwv5",
      x: 3065,
      y: 3424,
      inputs: [],
      outputs: [
        {
          id: "output-7ZYio3",
          inputs: [],
        },
        {
          id: "output-34yJYx",
          inputs: ["input-HUuye1"],
        },
      ],
    },
    {
      type: "script",
      id: "script-rUMGRx",
      name: "Script script-rUMGRx",
      x: 3539,
      y: 3276,
      inputs: [
        {
          id: "input-gUjyDm",
          output: "output-Rcps9C",
        },
        {
          id: "input-HUuye1",
          output: "output-34yJYx",
        },
      ],
      outputs: [
        {
          id: "output-v4t1jr",
          inputs: [],
        },
      ],
      behavior: {
        metadata: {
          inputs: [
            {
              identifier: "a",
              label: "A",
            },
            {
              identifier: "b",
              label: "B",
            },
          ],
          outputs: [
            {
              identifier: "sum",
              label: "Sum",
            },
          ],
        },
        script: "sum = Number(a) + Number(b);",
      },
    },
  ],
};
