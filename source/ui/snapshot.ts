export const snapshot = {
  stage: {
    x: 3333,
    y: 3333,
  },
  nodes: [
    {
      type: "seed",
      id: "seed-d6SwwX",
      name: "Seed",
      x: 3361.5,
      y: 3364,
      inputs: [],
      outputs: [
        {
          id: "output-vzybbq",
          inputs: [],
        },
        {
          id: "output-N2jHPQ",
          inputs: ["input-EyCfw4"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              label: "Float",
            },
            {
              label: "Int",
            },
          ],
        },
        script:
          'this._title("Seed");\n\nlet float = this._output("Float");\nlet int = this._output("Int");\n\nfloat.update(this.random());\nint.update(this.random.nextInt(256));',
      },
    },
    {
      type: "seed",
      id: "seed-j8Wtfg",
      name: "Seed",
      x: 3361.5,
      y: 3465,
      inputs: [],
      outputs: [
        {
          id: "output-iPP4dw",
          inputs: [],
        },
        {
          id: "output-qc3Znc",
          inputs: ["input-sc1I7q"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              label: "Float",
            },
            {
              label: "Int",
            },
          ],
        },
        script:
          'this._title("Seed");\n\nlet float = this._output("Float");\nlet int = this._output("Int");\n\nfloat.update(this.random());\nint.update(this.random.nextInt(256));',
      },
    },
    {
      type: "seed",
      id: "seed-T4nuHW",
      name: "Seed",
      x: 3364.5,
      y: 3563,
      inputs: [],
      outputs: [
        {
          id: "output-p2y3RV",
          inputs: [],
        },
        {
          id: "output-T8gIDb",
          inputs: ["input-x7vejv"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              label: "Float",
            },
            {
              label: "Int",
            },
          ],
        },
        script:
          'this._title("Seed");\n\nlet float = this._output("Float");\nlet int = this._output("Int");\n\nfloat.update(this.random());\nint.update(this.random.nextInt(256));',
      },
    },
    {
      type: "seed",
      id: "seed-4uFhJD",
      name: "Seed",
      x: 3366.5,
      y: 3675,
      inputs: [],
      outputs: [
        {
          id: "output-s-ZEzr",
          inputs: [],
        },
        {
          id: "output-pH5Dmu",
          inputs: ["input-lOGaiV"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              label: "Float",
            },
            {
              label: "Int",
            },
          ],
        },
        script:
          'this._title("Seed");\n\nlet float = this._output("Float");\nlet int = this._output("Int");\n\nfloat.update(this.random());\nint.update(this.random.nextInt(256));',
      },
    },
    {
      type: "seed",
      id: "seed--RQ1VZ",
      name: "Seed",
      x: 3368.5,
      y: 3775,
      inputs: [],
      outputs: [
        {
          id: "output-gj_WzO",
          inputs: [],
        },
        {
          id: "output-gUB5uC",
          inputs: ["input--78vEE"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              label: "Float",
            },
            {
              label: "Int",
            },
          ],
        },
        script:
          'this._title("Seed");\n\nlet float = this._output("Float");\nlet int = this._output("Int");\n\nfloat.update(this.random());\nint.update(this.random.nextInt(256));',
      },
    },
    {
      type: "seed",
      id: "seed-a9H3Lv",
      name: "Seed",
      x: 3370.5,
      y: 3884,
      inputs: [],
      outputs: [
        {
          id: "output--FLmuC",
          inputs: [],
        },
        {
          id: "output-1wmcbY",
          inputs: ["input-VGMfXC"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              label: "Float",
            },
            {
              label: "Int",
            },
          ],
        },
        script:
          'this._title("Seed");\n\nlet float = this._output("Float");\nlet int = this._output("Int");\n\nfloat.update(this.random());\nint.update(this.random.nextInt(256));',
      },
    },
    {
      type: "seed",
      id: "seed-H-pUou",
      name: "Seed",
      x: 3373.5,
      y: 3991,
      inputs: [],
      outputs: [
        {
          id: "output-qd68PQ",
          inputs: [],
        },
        {
          id: "output-8LZZXu",
          inputs: ["input-21t92b"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              label: "Float",
            },
            {
              label: "Int",
            },
          ],
        },
        script:
          'this._title("Seed");\n\nlet float = this._output("Float");\nlet int = this._output("Int");\n\nfloat.update(this.random());\nint.update(this.random.nextInt(256));',
      },
    },
    {
      type: "seed",
      id: "seed-izjLz7",
      name: "Seed",
      x: 3374.5,
      y: 4097,
      inputs: [],
      outputs: [
        {
          id: "output-_ksJhI",
          inputs: [],
        },
        {
          id: "output-gsMtt1",
          inputs: ["input-5xJ_t7"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [],
          outputs: [
            {
              label: "Float",
            },
            {
              label: "Int",
            },
          ],
        },
        script:
          'this._title("Seed");\n\nlet float = this._output("Float");\nlet int = this._output("Int");\n\nfloat.update(this.random());\nint.update(this.random.nextInt(256));',
      },
    },
    {
      type: "script",
      id: "script-mgJuNV",
      name: "Sum",
      x: 3683.5,
      y: 3398,
      inputs: [
        {
          id: "input-EyCfw4",
          output: "output-N2jHPQ",
        },
        {
          id: "input-sc1I7q",
          output: "output-qc3Znc",
        },
      ],
      outputs: [
        {
          id: "output-GQw_qu",
          inputs: ["input-Z5ojeX"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [
            {
              label: "A",
            },
            {
              label: "B",
            },
          ],
          outputs: [
            {
              label: "Sum",
            },
          ],
        },
        script:
          'this._title("Sum");\nconst a = this._input("A");\nconst b = this._input("B");\nlet sum = this._output("Sum");\nsum.update( Number(a) + Number(b));',
      },
    },
    {
      type: "script",
      id: "script-OFW2mi",
      name: "Sum",
      x: 3682.5,
      y: 3606,
      inputs: [
        {
          id: "input-x7vejv",
          output: "output-T8gIDb",
        },
        {
          id: "input-lOGaiV",
          output: "output-pH5Dmu",
        },
      ],
      outputs: [
        {
          id: "output-7rzrTq",
          inputs: ["input-AWkOiP"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [
            {
              label: "A",
            },
            {
              label: "B",
            },
          ],
          outputs: [
            {
              label: "Sum",
            },
          ],
        },
        script:
          'this._title("Sum");\nconst a = this._input("A");\nconst b = this._input("B");\nlet sum = this._output("Sum");\nsum.update( Number(a) + Number(b));',
      },
    },
    {
      type: "script",
      id: "script-Ht7X24",
      name: "Sum",
      x: 3672.5,
      y: 3827,
      inputs: [
        {
          id: "input--78vEE",
          output: "output-gUB5uC",
        },
        {
          id: "input-VGMfXC",
          output: "output-1wmcbY",
        },
      ],
      outputs: [
        {
          id: "output-Q6zSrz",
          inputs: ["input-uypnPc"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [
            {
              label: "A",
            },
            {
              label: "B",
            },
          ],
          outputs: [
            {
              label: "Sum",
            },
          ],
        },
        script:
          'this._title("Sum");\nconst a = this._input("A");\nconst b = this._input("B");\nlet sum = this._output("Sum");\nsum.update( Number(a) + Number(b));',
      },
    },
    {
      type: "script",
      id: "script-k4zhqg",
      name: "Sum",
      x: 3680.5,
      y: 4043,
      inputs: [
        {
          id: "input-21t92b",
          output: "output-8LZZXu",
        },
        {
          id: "input-5xJ_t7",
          output: "output-gsMtt1",
        },
      ],
      outputs: [
        {
          id: "output-gLQZDe",
          inputs: ["input-5UuI-A"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [
            {
              label: "A",
            },
            {
              label: "B",
            },
          ],
          outputs: [
            {
              label: "Sum",
            },
          ],
        },
        script:
          'this._title("Sum");\nconst a = this._input("A");\nconst b = this._input("B");\nlet sum = this._output("Sum");\nsum.update( Number(a) + Number(b));',
      },
    },
    {
      type: "script",
      id: "script-dokaug",
      name: "Sum",
      x: 3974.5,
      y: 3494,
      inputs: [
        {
          id: "input-Z5ojeX",
          output: "output-GQw_qu",
        },
        {
          id: "input-AWkOiP",
          output: "output-7rzrTq",
        },
      ],
      outputs: [
        {
          id: "output-VUl2z8",
          inputs: ["input-vQSoZh"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [
            {
              label: "A",
            },
            {
              label: "B",
            },
          ],
          outputs: [
            {
              label: "Sum",
            },
          ],
        },
        script:
          'this._title("Sum");\nconst a = this._input("A");\nconst b = this._input("B");\nlet sum = this._output("Sum");\nsum.update( Number(a) + Number(b));',
      },
    },
    {
      type: "script",
      id: "script-wQ_IZt",
      name: "Sum",
      x: 3984.5,
      y: 3937,
      inputs: [
        {
          id: "input-uypnPc",
          output: "output-Q6zSrz",
        },
        {
          id: "input-5UuI-A",
          output: "output-gLQZDe",
        },
      ],
      outputs: [
        {
          id: "output-enZrAj",
          inputs: ["input-wk_ARj"],
        },
      ],
      behavior: {
        metadata: {
          inputs: [
            {
              label: "A",
            },
            {
              label: "B",
            },
          ],
          outputs: [
            {
              label: "Sum",
            },
          ],
        },
        script:
          'this._title("Sum");\nconst a = this._input("A");\nconst b = this._input("B");\nlet sum = this._output("Sum");\nsum.update( Number(a) + Number(b));',
      },
    },
    {
      type: "script",
      id: "script-rtDgNv",
      name: "Sum",
      x: 4226.5,
      y: 3721,
      inputs: [
        {
          id: "input-vQSoZh",
          output: "output-VUl2z8",
        },
        {
          id: "input-wk_ARj",
          output: "output-enZrAj",
        },
      ],
      outputs: [
        {
          id: "output-3StlE2",
          inputs: [],
        },
      ],
      behavior: {
        metadata: {
          inputs: [
            {
              label: "A",
            },
            {
              label: "B",
            },
          ],
          outputs: [
            {
              label: "Sum",
            },
          ],
        },
        script:
          'this._title("Sum");\nconst a = this._input("A");\nconst b = this._input("B");\nlet sum = this._output("Sum");\nsum.update( Number(a) + Number(b));',
      },
    },
  ],
};
