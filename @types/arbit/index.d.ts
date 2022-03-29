declare module "arbit" {
  export default function arbit(seed: string): ArbitGenerator;

  export type ArbitGenerator = (() => number) & {
    nextFloat(max: number): number;
    nextFloat(min: number, max: number): number;

    nextInt(max: number): number;
    nextInt(min: number, max: number): number;
  };
}
