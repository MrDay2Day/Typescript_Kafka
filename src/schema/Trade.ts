import { topic } from "../config/Config";
const tradeSchemaString = JSON.stringify({
  type: "record",
  name: "Trade",
  namespace: "com.trades",
  fields: [
    { name: "symbol", type: "string" },
    { name: "side", type: "string" },
    { name: "timestamp", type: "long" },
    { name: "price", type: "double" },
    { name: "amount", type: "double" },
  ],
});
export type TradeType = {
  symbol: string;
  side: string;
  timestamp: number;
  price: number;
  amount: number;
};

const tradeSchemaInfo = {
  schemaType: "AVRO",
  schema: tradeSchemaString,
};

export { tradeSchemaInfo, topic };
