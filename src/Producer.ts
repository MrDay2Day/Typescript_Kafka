import { AvroSerializer, SerdeType } from "@confluentinc/schemaregistry";
import GetKafkaInstance from "./config/Config";
import { OrderType, topic } from "./schema/Order";
import RegistryClient from "./schema/Config";

const orderInfo: OrderType = {
  region: "CA",
  item_type: "accessory",
  item_id: "Item_34",
  order_id: 105,
  units: 2,
};

const avroSerializerConfig = { useLatestVersion: true };

const serializer = new AvroSerializer(
  RegistryClient,
  SerdeType.VALUE,
  avroSerializerConfig
);

const kafka = GetKafkaInstance();
const producer = kafka.producer();

async function producerStart() {
  try {
    const outgoingMessage = {
      key: "user_id",
      value: await serializer.serialize(topic, orderInfo),
    };

    await producer.connect();
    console.log("Connected successfully");

    let count = 0;

    setInterval(async () => {
      await producer.send({
        topic,
        messages: [outgoingMessage],
      });
      count++;
      console.log(`Message Sent: ${count} - Message: `, outgoingMessage);
    }, 1000);
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
