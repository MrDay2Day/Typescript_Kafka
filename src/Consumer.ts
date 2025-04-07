import { AvroDeserializer, SerdeType } from "@confluentinc/schemaregistry";
import GetKafkaInstance from "./config/Config";
import RegistryClient from "./schema/Config";
import { OrderType, topic as theTopic } from "./schema/Order";

const deserializer = new AvroDeserializer(RegistryClient, SerdeType.VALUE, {});

const kafka = GetKafkaInstance();
const consumer = kafka.consumer({ "group.id": "consumer-group-1" });
async function consumerStart(): Promise<void> {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: theTopic });

    console.log("Connected Consumer successfully");

    await consumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        try {
          console.log("Message value", message.value);
          const decodedMessage = {
            key: message.key?.toString(),
            value: (await deserializer.deserialize(
              topic,
              message.value!
            )) as OrderType,
          };
          console.log(`Topic: ${topic}, Partition: ${partition}`);
          console.log("Decoded message", decodedMessage);
        } catch (error) {
          console.log("Consumer Error: ", error);
        }
      },
    });
  } catch (error) {
    console.log("Kafka Error: ", error);
  }
}

const shutdown = async (): Promise<void> => {
  console.log("Shutting down consumer...");
  try {
    await consumer.disconnect();
  } catch (error) {
    console.error("Error during shutdown: ", error);
  }
};

// Handle termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default consumerStart;
