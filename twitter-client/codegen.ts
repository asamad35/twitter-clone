
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://d2tse3u0nwusi.cloudfront.net/",
  documents: "**/*.{tsx,ts}",
  generates: {
    "gql/": {
      preset: "client",
      plugins: []
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
