export const snapshot = {
  nodes: [
    {
      type: "seed",
      id: "seed-g6Qzsd",
      name: "Seed seed-g6Qzsd",
      x: 134,
      y: 518,
      inputs: [],
      outputs: [
        {
          id: "output-nCq769",
          connections: [
            {
              source: "output-nCq769",
              target: "input-Y9a5on",
            },
          ],
        },
        {
          id: "output-bvRTSr",
          connections: [
            {
              source: "output-bvRTSr",
              target: "input-Qr4LWt",
            },
            {
              source: "output-bvRTSr",
              target: "input-5gpSUq",
            },
          ],
        },
      ],
    },
    {
      type: "seed",
      id: "seed-lAHSwM",
      name: "Seed seed-lAHSwM",
      x: 153,
      y: 728,
      inputs: [],
      outputs: [
        {
          id: "output-4R98iC",
          connections: [],
        },
        {
          id: "output-UMdej3",
          connections: [
            {
              source: "output-UMdej3",
              target: "input-co1I5n",
            },
          ],
        },
      ],
    },
    {
      type: "add",
      id: "add-Jgj6Fz",
      name: "Add add-Jgj6Fz",
      x: 558,
      y: 555,
      inputs: [
        {
          id: "input-Qr4LWt",
          connections: [
            {
              source: "output-bvRTSr",
              target: "input-Qr4LWt",
            },
          ],
        },
        {
          id: "input-co1I5n",
          connections: [
            {
              source: "output-UMdej3",
              target: "input-co1I5n",
            },
          ],
        },
      ],
      outputs: [
        {
          id: "output-w8V8yD",
          connections: [
            {
              source: "output-w8V8yD",
              target: "input-yHk4YM",
            },
          ],
        },
      ],
    },
    {
      type: "add",
      id: "add-F1WKAt",
      name: "Add add-F1WKAt",
      x: 806,
      y: 422,
      inputs: [
        {
          id: "input-Y9a5on",
          connections: [
            {
              source: "output-nCq769",
              target: "input-Y9a5on",
            },
          ],
        },
        {
          id: "input-yHk4YM",
          connections: [
            {
              source: "output-w8V8yD",
              target: "input-yHk4YM",
            },
          ],
        },
      ],
      outputs: [
        {
          id: "output-rx1CHq",
          connections: [
            {
              source: "output-rx1CHq",
              target: "input-i_wNeV",
            },
          ],
        },
      ],
    },
    {
      type: "add",
      id: "add-ZjPb0P",
      name: "Add add-ZjPb0P",
      x: 848,
      y: 769,
      inputs: [
        {
          id: "input-i_wNeV",
          connections: [
            {
              source: "output-rx1CHq",
              target: "input-i_wNeV",
            },
          ],
        },
        {
          id: "input-5gpSUq",
          connections: [
            {
              source: "output-bvRTSr",
              target: "input-5gpSUq",
            },
          ],
        },
      ],
      outputs: [
        {
          id: "output-2QW4zZ",
          connections: [],
        },
      ],
    },
  ],
};
