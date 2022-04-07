export const snapshot = {
  nodes: [
    {
      type: "seed",
      id: "seed-QNK9dZ",
      name: "Seed seed-QNK9dZ",
      x: 0,
      y: 0,
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
      x: 65,
      y: 424,
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
      type: "add",
      id: "add-rUMGRx",
      name: "Add add-rUMGRx",
      x: 539,
      y: 276,
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
