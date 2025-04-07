import {
  SchemaRegistryClient,
  ClientConfig,
} from "@confluentinc/schemaregistry";

const config: ClientConfig = {
  baseURLs: ["http://localhost:8081/"],
  // basicAuthCredentials: {
  //   credentialsSource: "USER_INFO",
  //   userInfo: "<SR_API_KEY>:<SR_API_SECRET",
  // },
};

const RegistryClient = SchemaRegistryClient.newClient(config);

export default RegistryClient;
