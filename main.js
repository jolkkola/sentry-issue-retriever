const fs = require("fs");
const fetch = require("node-fetch");
require("dotenv").config();

const config = {
  domain: process.env.SENTRY_DOMAIN,
  token: process.env.SENTRY_TOKEN,
  organization: process.env.ORGANIZATION,
  project: process.env.PROJECT,
};

const getAuthHeader = ({ token }) => ({ Authorization: `Bearer ${token}` });
const getIssueUri = ({ domain, organization, project }) =>
  `${domain}/api/0/projects/${organization}/${project}/issues`;

const parseIssueData = ({
  count,
  firstSeen,
  lastSeen,
  metadata: { message, uri, directive },
  permalink,
  userCount,
}) => ({
  count: Number.parseInt(count),
  csp_directive: directive,
  csp_message: message,
  csp_uri: uri,
  firstSeen,
  lastSeen,
  permalink,
  userCount,
});

const fetchData = async (
  params = {
    query: "environment:prod+is:unresolved",
    limit: 25,
    statsPeriod: "14d",
  },
  results = []
) => {
  const uri = `${getIssueUri(config)}/?${Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join("&")}`;
  const response = await fetch(uri, {
    headers: {
      ...getAuthHeader(config),
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  if (!Array.isArray(json) || json.length === 0) {
    return results;
  }
  results.push(...json.map(parseIssueData));

  const linkToNext =
    response.headers
      .get("link")
      .split(",")
      .filter(
        link => link.includes('rel="next"') && link.includes('results="true"')
      )[0] || "";
  const cursor = linkToNext
    .split(";")
    .map(s => s.trim())
    .filter(s => s.startsWith("cursor"))[0];
  return cursor
    ? await fetchData(
        { ...params, cursor: cursor.split("=")[1].slice(1, -1) },
        results
      )
    : results;
};

const main = async () => {
  await fs.promises.writeFile(
    "results.json",
    JSON.stringify(await fetchData())
  );
};

main();
