<p align="center">
  <img src="./public/logo.png" height="128">
  <h1 align="center">Tailwind</h1>
</p>

## Prerequisites

### Required

To be able to start Tailwind, you need to have the following:

- [Node.js v14 or later](https://nodejs.org/en/)
- [yarn v1](https://classic.yarnpkg.com/lang/en/)
- [OpenWeather API key](https://openweathermap.org/api)
  - if you do not have an OpenWeather API key, you may use this one: `13b22998b0a7a962ef86cd4afc83d9b7`

### Recommended

To be able to make use of all the functionality in Tailwind, you should have the following:

- [Open Exchange Rates API key](https://openexchangerates.org/)
  - if you do not have an Open Exchange Rates API key, you may use this one: `e1fafd1860ea4b30b691d2337d24cb8c`

## Usage

### Quick Start

1. Set the environment variable `TAILWIND_API_OPENEXCHANGERATES_API_KEY` and `TAILWIND_API_OPENWEATHER_API_KEY` to your own Open Exchange Rates and OpenWeather API keys respectively. An easy way to accomplish this is to create a `.env` file with the same contents as the `.env.example` file and replace `<YOUR OPEN EXCHANGE RATES API KEY HERE>` and `<YOUR OPENWEATHER API KEY HERE>` with your own keys.

2. Install dependencies by running:

```
yarn
```

3. Run the application:

```
yarn start
```

Your browser should open http://localhost:3000/ automatically once ready.

### Docker

If you have [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/install/) installed, you can start Tailwind in Docker by running:

```
docker-compose up --build
```

This will create two containers, one for the API and another for the client with the client serving content and acting as a reverse proxy for the API through [NGINX](https://www.nginx.com/). The application will be available at http://localhost:3000/ by default.

## Environment Variables

The Tailwind API can be configured through these environment variables:

| Name                                     | Default Value                               | Description                                                                                                                             |
| ---------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `TAILWIND_API_OPENWEATHER_API_KEY`       | `undefined`                                 | API key used when calling the OpenWeather API. **Required**                                                                             |
| `TAILWIND_API_OPENWEATHER_API_URL`       | `'https://api.openweathermap.org/data/2.5'` | Base URL for the OpenWeather API.                                                                                                       |
| `TAILWIND_API_OPENEXCHANGERATES_API_KEY` | `undefined`                                 | API key used when calling the Open Exchange Rates API.                                                                                  |
| `TAILWIND_API_OPENEXCHANGERATES_API_URL` | `'https://openexchangerates.org/api'`       | Base URL for the Open Exchange Rates API.                                                                                               |
| `TAILWIND_API_AIRPORTS_PATH`             | `'airports.json'`                           | File where airport information is kept.                                                                                                 |
| `TAILWIND_API_DEFAULT_RESULTS_LIMIT`     | `'50'`                                      | Default number of results when calling the `/api/airports` endpoint. This can be overrided per request via the `limit` query parameter. |
| `TAILWIND_API_PORT`                      | `'4000'`                                    | Port the Tailwind API will start on.                                                                                                    |

## Notes

- Built with [create-react-app](https://create-react-app.dev/).
- Airport data sourced from https://github.com/mwgg/Airports.
