import adminStart from "./src/Admin";
import consumerStart from "./src/Consumer";
import producerStart from "./src/Producer";
import RegistryClient from "./src/schema/Config";
import { schemaInfo, topic } from "./src/schema/Order";

(async function () {
  try {
    // Register Schema
    const schemaId = await RegistryClient.register(
      `${topic}-value`,
      schemaInfo,
      true
    );
    console.log("Schema ID: ", schemaId);

    // Load Admin
    await adminStart();

    // Starting Consumer
    await consumerStart();

    // Starting Producer
    await producerStart();
    console.log("Next");
  } catch (error) {
    console.log("Main Error: ", error);
  }
})();
