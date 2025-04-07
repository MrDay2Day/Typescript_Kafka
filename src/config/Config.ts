import { KafkaJS } from "@confluentinc/kafka-javascript";
import { CommonConstructorConfig } from "@confluentinc/kafka-javascript/types/kafkajs";

const { Kafka } = KafkaJS;

const kafkaConfig: CommonConstructorConfig = {
  kafkaJS: {
    brokers: ["localhost:9092", "localhost:9093"],
    // ssl: true,
    // sasl: {
    //   mechanism: "plain",
    //   username: "<API_KEY>",
    //   password: "API_SECRET",
    // },
  },
};

function GetKafkaInstance() {
  return new Kafka(kafkaConfig);
}

export const topic = "orders-topic";

export default GetKafkaInstance;
