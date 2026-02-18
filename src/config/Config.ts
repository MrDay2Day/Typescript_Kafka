import { KafkaJS } from "@confluentinc/kafka-javascript";
import { CommonConstructorConfig } from "@confluentinc/kafka-javascript/types/kafkajs";

const { Kafka } = KafkaJS;

const kafkaConfig = (client_name: string): CommonConstructorConfig => {
  return {
    kafkaJS: {
      clientId: client_name,
      brokers: [
        "localhost:9092", "localhost:9093"
      ],
      // ssl: true,
      // sasl: {
      //   mechanism: "plain",
      //   username: "<API_KEY>",
      //   password: "API_SECRET",
      // },
    },
  }
};

function GetKafkaInstance(client_name: string) {
  return new Kafka(kafkaConfig(client_name));
}

export const topic = "trades";

export default GetKafkaInstance;
