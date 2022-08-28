export const isExpired = (ms = 0) => ms <= Date.now();

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const stringifyQueryParams = ({
  url,
  params,
}: {
  url: string;
  params: Record<string, string | number | boolean | undefined>;
}) => {
  let searchString = '';
  for (const p of Object.keys(params)) {
    const value = params[p]?.toString().trim();
    if (params[p] !== '' && value) {
      const separator = searchString ? '&' : '?';
      searchString += separator + p + '=' + value;
    }
  }
  return url + searchString;
};
