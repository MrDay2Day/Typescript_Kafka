import { AvroDeserializer, SerdeType } from "@confluentinc/schemaregistry";
import GetKafkaInstance from "./config/Config";
import RegistryClient from "./schema/Config";
import { OrderType, topic as theTopic } from "./schema/Order";

const deserializer = new AvroDeserializer(RegistryClient, SerdeType.VALUE, {});

const kafka = GetKafkaInstance();
const consumer = kafka.consumer({
  "group.id": "consumer-group-1",
  // Transactional Messages - To consumer a specific message once and only once from a topic
  "isolation.level": "read_committed",
  "client.id": "unique-client-id-for-transactions",
});
async function consumerStart(): Promise<void> {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: theTopic });

    console.log("Connected Consumer successfully");

    await consumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        try {
          console.log("Message value", message.value);
          const {
            value, // message contents as a Buffer,
            size, // size of the message, in bytes,
            offset, // offset the message was read from,
            key, // key of the message if present,
            timestamp, // timestamp of message creation if present
          } = message;
          const decodedMessage = {
            key: key?.toString(),
            value: (await deserializer.deserialize(topic, value!)) as OrderType,
          };
          console.log(
            `\nTopic: ${topic} \nPartition: ${partition} \nSize: ${size} \nOffset: ${offset} \nTimestamp: ${new Date(
              parseInt(timestamp)
            )} \nSerialized Value: ${value}`
          );
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
