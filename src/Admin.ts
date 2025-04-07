import {
  IResourceConfigEntry,
  ITopicConfig,
} from "@confluentinc/kafka-javascript/types/kafkajs";
import GetKafkaInstance from "./config/Config";
import { topic as demoTopic } from "./schema/Order";

const topics = [{ topic: demoTopic, partitions: 15 }];

async function adminStart() {
  const kafka = GetKafkaInstance();
  const admin = kafka.admin();
  try {
    await admin.connect();

    const allTopic: string[] = await admin.listTopics();
    const allGroups = await admin.listGroups();

    console.dir({ allTopic, allGroups }, { depth: "*" });

    const createTopicIfNotExists = async ({
      topic,
      partitions,
    }: {
      topic: string;
      partitions: number;
    }) => {
      try {
        const configEntries: IResourceConfigEntry[] = [
          { name: "cleanup.policy", value: "delete" }, // Default cleanup policy - When cleaning up data based on data retention policy is to delete.
          // { name: "retention.bytes", value: "104857600" }, // 100 MB Limit
          // { name: "retention.ms", value: "86400000" }, // 1 day
          {
            name: "retention.ms",
            value: "30000", // 2 minutes
          },
        ];

        const topicConfig: ITopicConfig = {
          topic,
          numPartitions: partitions,
          replicationFactor: 2,
          configEntries,
        };
        await admin.createTopics({
          topics: [topicConfig],
        });
        console.log(`Created topic - ${topic}`);
        return true;
      } catch (error) {
        console.error("Error creating topic:", error);
      }
    };

    for (let ele of topics) {
      if (!allTopic.includes(ele.topic)) {
        await createTopicIfNotExists(ele);
      }
    }
    await admin.disconnect();
  } catch (error) {
    console.log("Admin Error: ", error);
    await admin.disconnect();
  }
}

export default adminStart;
