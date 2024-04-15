export function trim(templateStrings: TemplateStringsArray, ...values: any[]) {
  let fullString = templateStrings.reduce((accumulator, str, i) => {
    return accumulator + values[i - 1] + str;
  });

  return fullString
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
}
