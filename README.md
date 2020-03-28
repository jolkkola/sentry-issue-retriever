# Sentry.io project issue retriever

This is a simple tool to retrieve issues in JSON format for a single project from Sentry's API. It was made for handling CSP (Content Security Policy) reports, so a bunch of the fields available from the API will get dropped. See the function `parseIssueData` for details.

The tool supports Sentry's paging, but does not have any error handling or logging, so use it at your own discretion.

Documentation for the API is available at [Sentry's documentation portal](https://docs.sentry.io/api/). The part concerning a project's issues can be found at ["list a projects' issues"](https://docs.sentry.io/api/events/get-project-group-index/).

You need a valid access token for your project in order to use the API. I used a token for [internal integration](https://sentry.io/settings/yle/developer-settings/), but a personal access token should work as well. The token should have read access to "project" and "issue & event".

## Configuration

See the `.env.example` file for available values.

- `ORGANIZATION`: the name of your organization (`organization_slug`)
- `PROJECT`: the name of your project (`project_slug`)
- `SENTRY_DOMAIN`: the domain of the API service
- `SENTRY_TOKEN`: the access token you created in Sentry's portal

## Usage

- clone this repository
- copy the `.env.example` file to `.env`
- update the configuration
- run `yarn` to install dependencies
- use `yarn start` or `node main.js` to run the program
- results should appear after a while in `results.json`

You can use [json2csv](https://www.npmjs.com/package/json2csv) or some other tool to format the resulting json as csv.
