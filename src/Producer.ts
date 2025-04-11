import { AvroSerializer, SerdeType } from "@confluentinc/schemaregistry";
import GetKafkaInstance from "./config/Config";
import { OrderType, topic } from "./schema/Order";
import RegistryClient from "./schema/Config";

const avroSerializerConfig = { useLatestVersion: true };

const serializer = new AvroSerializer(
  RegistryClient,
  SerdeType.VALUE,
  avroSerializerConfig
);

const kafka = GetKafkaInstance();
const producer = kafka.producer({
  "compression.codec": "gzip",
  "retry.backoff.ms": 200,
  "message.send.max.retries": 10,
  "socket.keepalive.enable": true,
  "queue.buffering.max.messages": 100000,
  "queue.buffering.max.ms": 1000,
  "batch.num.messages": 1000000,
  dr_cb: true,
  // Transactional Messages - To send once and only once to a topic
  "enable.idempotence": true,
  // "transactional.id": "unique-producer-id-for-transactions",
});

async function producerStart() {
  try {
    await producer.connect();
    // await producer.transaction();
    console.log("Connected successfully");

    let count = 0;

    setInterval(async () => {
      const orderInfo: OrderType = {
        region: "CA",
        item_type: "accessory",
        item_id: "Item_34",
        order_id: 1035325 + count,
        units: 10000000 + count,
      };

      const outgoingMessage = {
        key: "user_id",
        value: await serializer.serialize(topic, orderInfo),
      };

      await producer.send({
        topic,
        messages: [outgoingMessage],
      });
      count++;
      console.log(`Message Sent: ${count} - Message: `, outgoingMessage);
    }, 500);
  } catch (error) {
    console.log("Producer Error: ", error);
  }
}

const shutdown = async (): Promise<void> => {
  console.log("Shutting down producer...");
  try {
    await producer.disconnect();
  } catch (error) {
    console.error("Error during shutdown: ", error);
  }
};

// Handle termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default producerStart;
