import plugin from "tailwindcss/plugin";

const operatorRegex = /([+-])(?=\d)/g;
const spaceRegex = /\s+/g;

const formatString = (input: string) => {
  //
  if (!input.includes("+") && !input.includes("-")) {
    return input.trim();
  }

  return input
    .replace(operatorRegex, (match: any, op: any, offset: number) =>
      offset === 0 ? op : ` ${op} `
    )
    .replace(spaceRegex, " ")
    .trim();
};

const clampPlugin = plugin(({ matchUtilities }) => {
  //
  
  matchUtilities({
    clamp: (value) => {
      //
      const parts = value.split(/\s+/);
      if (parts.length !== 3) {
        throw new Error(
          `Invalid clamp value: "${value}". Expected format: "min preferred max".`
        );
      }

      //
      const [min, preferred, max] = parts.map(formatString);

      return {
        fontSize: `clamp(${min}, ${preferred}, ${max})`,
      };
    },
  });
});

export default { clampPlugin };
