import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  calories: integer("calories").notNull(),
  featured: integer("featured").notNull().default(0),
  image: text("image").notNull().default("lamb"),
});
