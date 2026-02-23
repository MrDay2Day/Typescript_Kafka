import adminStart from "./src/Admin";
import consumerStart from "./src/Consumer";
import streamStart, { oversTopic } from "./src/Stream";
import RegistryClient from "./src/schema/Config";
import { tradeSchemaInfo, topic } from "./src/schema/Trade";

(async function () {
  try {
    // Register Schema
    const tradeSchemaId = await RegistryClient.register(
      `${topic}-value`,
      tradeSchemaInfo,
      true
    );
    console.log("Trade Schema ID: ", tradeSchemaId);

    const oversSchemaId = await RegistryClient.register(
      `${oversTopic}-value`,
      tradeSchemaInfo,
      true
    );
    console.log("Overs Schema ID: ", oversSchemaId);

    // Load Admin
    await adminStart();

    // Starting Consumer
    await consumerStart();

    // Starting Stream Processor
    await streamStart();

    console.log("Next");
  } catch (error) {
    console.log("Main Error: ", error);
  }
})();
