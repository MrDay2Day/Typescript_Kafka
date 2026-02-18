import { topic } from "../config/Config";
const orderSchemaString = JSON.stringify({
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

export type OrderType = {
  region: string;
  item_type: string;
  item_id: string;
  order_id: number;
  units: number;
};

const orderSchemaInfo = {
  schemaType: "AVRO",
  schema: orderSchemaString,
};

export { orderSchemaInfo, topic };
