import { AvroDeserializer, AvroSerializer, SerdeType } from "@confluentinc/schemaregistry";
import GetKafkaInstance from "./config/Config";
import RegistryClient from "./schema/Config";
import { TradeType, topic as tradeTopic } from "./schema/Trade";

export const oversTopic = "overs";

const deserializer = new AvroDeserializer(RegistryClient, SerdeType.VALUE, {});
const serializer = new AvroSerializer(RegistryClient, SerdeType.VALUE, { useLatestVersion: true });

const kafka = GetKafkaInstance("stream-processor");
const consumer = kafka.consumer({
  "group.id": "stream-processor-group",
  "isolation.level": "read_committed",
});
const producer = kafka.producer({
    "compression.codec": "gzip",
    "retry.backoff.ms": 200,
    "message.send.max.retries": 10,
    "socket.keepalive.enable": true,
    "queue.buffering.max.messages": 100000,
    "queue.buffering.max.ms": 1000,
    "batch.num.messages": 1000000,
    dr_cb: true,
});

async function streamStart(): Promise<void> {
  try {
    await consumer.connect();
    await producer.connect();
    await consumer.subscribe({ topic: tradeTopic });

    console.log("Connected Stream Processor successfully");

    await consumer.run({
      eachMessage: async ({ message, topic }) => {
        try {
          const decodedMessage = {
            value: (await deserializer.deserialize(topic, message.value!)) as TradeType,
          };

          if (decodedMessage.value.price > 20000) {
            console.log("Found a trade with price > 20000", decodedMessage.value)
            const outgoingMessage = {
              key: message.key,
              value: await serializer.serialize(oversTopic, decodedMessage.value),
            };

            await producer.send({
              topic: oversTopic,
              messages: [outgoingMessage],
            });
          }
        } catch (error) {
          console.log("Stream Processor Error: ", error);
        }
      },
    });
  } catch (error) {
    console.log("Kafka Error: ", error);
  }
}

const shutdown = async (): Promise<void> => {
  console.log("Shutting down stream processor...");
  try {
    await consumer.disconnect();
    await producer.disconnect();
  } catch (error) {
    console.error("Error during shutdown: ", error);
  }
};

// Handle termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default streamStart;
