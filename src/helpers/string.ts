function cleanString(text: string, pattern: RegExp): string {
  const match: RegExpMatchArray | null = text.match(pattern);

  if (match) {
    return match[1];
  }

  return text;
}

function formatString(template: string, ...args: any[]): string {
  return template.replace(/%s/g, () => args.shift());
}

export {
  formatString,
  cleanString
}