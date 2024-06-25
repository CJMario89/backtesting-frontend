const getUrlQuery = (url: string): Record<string, string> => {
  const queryUrl = url.split("?")[1];
  if (!queryUrl) {
    return {};
  }
  const query = queryUrl.split("&");
  const queryObject: Record<string, string> = {};
  query.forEach((element) => {
    const [key, value] = element.split("=");
    queryObject[key] = value;
  });
  return queryObject;
};

export default getUrlQuery;
