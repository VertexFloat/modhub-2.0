function getURLQuery(url: string): { [key: string]: string } {
  const query = new URLSearchParams(url);
  const queryObj: { [key: string]: string } = {};

  query.forEach((value, key) => {
    queryObj[key] = value;
  });

  return queryObj;
}

function cleanPathname(pathname: string): string {
  return pathname.replace(/^\/+/, '').replace(/\..+$/, '');
}

export {
  cleanPathname,
  getURLQuery
}