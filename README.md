# TypeScript Kafka® Example with Confluent's JavaScript Client

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]([https://github.com/confluentinc/confluent-kafka-javascript?tab=MIT-1-ov-file](https://github.com/confluentinc/confluent-kafka-javascript?tab=MIT-1-ov-file))
[![GitHub release](https://img.shields.io/github/v/release/confluentinc/confluent-kafka-javascript)](https://github.com/confluentinc/confluent-kafka-javascript/releases)

A comprehensive example demonstrating how to use Confluent's JavaScript Client for Apache Kafka® (CJSK) with TypeScript. This project showcases real-world implementation of Kafka producers, consumers, admin operations, and Schema Registry integration.

## Features

- **TypeScript Integration**: Fully typed Kafka implementation
- **Schema Registry**: AVRO schema definition and management
- **Producer/Consumer Pattern**: Complete producer and consumer implementation
- **Admin Operations**: Programmatic topic creation and management
- **Error Handling**: Robust error handling and graceful shutdowns

## Architecture

This project demonstrates a complete Kafka workflow:

1. **Schema Registration**: Registers an AVRO schema with Schema Registry
2. **Admin Operations**: Creates Kafka topics if they don't exist
3. **Producer**: Sends serialized messages to Kafka topics
4. **Consumer**: Consumes and deserializes messages from topics

## Prerequisites

- Node.js (v16+)
- Kafka cluster (local or remote)
- Schema Registry service

## Installation

```bash
# Clone the repository
git clone https://github.com/MrDay2Day/typescript_kafka.git
cd typescript_kafka

# Install dependencies
npm install
```

## Configuration

Update the Kafka and Schema Registry connection details in:

- `src/config/Config.ts` - Kafka broker configuration
- `src/schema/Config.ts` - Schema Registry configuration

For production environments, uncomment and configure the SSL and SASL authentication options.

## Usage

```bash
# Start the application
npm run dev
```

This will:

1. Register the schema with Schema Registry
2. Create the topic if it doesn't exist
3. Start the consumer
4. Start the producer (which sends a message every second)

## Project Structure

```
typescript_kafka/
├── index.ts                  # Main application entry point
├── src/
│   ├── Admin.ts              # Kafka Admin operations
│   ├── Consumer.ts           # Kafka Consumer implementation
│   ├── Producer.ts           # Kafka Producer implementation
│   ├── config/
│   │   └── Config.ts         # Kafka configuration
│   └── schema/
│       ├── Config.ts         # Schema Registry configuration
│       └── Order.ts          # AVRO schema definition
├── package.json
└── README.md
```

## Key Technical Components

### AVRO Schema Definition

```typescript
const schemaString = JSON.stringify({
  type: "record",
  name: "Order",
  fields: [
    { name: "region", type: "string" },
    { name: "item_type", type: "string" },
    { name: "item_id", type: "string" },
    { name: "order_id", type: "int" },
    { name: "units", type: "int" },
  ],
});
```

### Serialization & Deserialization

The project demonstrates both serialization for producers:

```typescript
const serializer = new AvroSerializer(
  RegistryClient,
  SerdeType.VALUE,
  avroSerializerConfig
);
```

And deserialization for consumers:

```typescript
const deserializer = new AvroDeserializer(RegistryClient, SerdeType.VALUE, {});
```

### Topic Configuration

Advanced topic configuration with retention policies:

```typescript
const configEntries: IResourceConfigEntry[] = [
  { name: "cleanup.policy", value: "delete" },
  { name: "retention.ms", value: "30000" }, // 2 minutes retention
];
```

## Error Handling & Graceful Shutdown

The implementation includes proper error handling and graceful shutdown hooks:

```typescript
// Handle termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
```

## Best Practices Demonstrated

- **Strongly Typed**: Complete TypeScript implementation
- **Async/Await Patterns**: Modern asynchronous code patterns
- **Separation of Concerns**: Modular code organization
- **Graceful Error Handling**: Proper error handling throughout
- **Resource Management**: Proper connection and disconnection

## OFFICIAL Confluent JavaScript Client for Apache Kafka®

- [Kafka JavaScript Client](https://docs.confluent.io/kafka-clients/javascript/current/overview.html)
- [Introducing Confluent’s JavaScript Client for Apache Kafka®](https://www.confluent.io/blog/introducing-confluent-kafka-javascript/)
- [Building a Full-Stack Application With Kafka and Node.js](https://www.confluent.io/blog/building-full-stack-app-with-kafka-and-nodejs/)

## License

[MIT](./LICENSE)

## Author

MrDay2Day

---

_This project demonstrates proficiency with Confluent's JavaScript Client for Apache Kafka® (CJSK), a fully supported JavaScript client backed by Confluent with native support for Confluent's Governance products._
