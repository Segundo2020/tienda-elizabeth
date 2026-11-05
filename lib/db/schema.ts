import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  unique,
  smallint,
  check,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 220 }).notNull().unique(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const productVariants = pgTable(
  'product_variants',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    size: varchar('size', { length: 20 }),
    color: varchar('color', { length: 50 }),
    sku: varchar('sku', { length: 50 }).unique(),
    stock: integer('stock').notNull().default(0),
  },
  (t) => ({
    productSizeColorUnique: unique().on(t.productId, t.size, t.color),
  })
);

export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  alt: varchar('alt', { length: 200 }),
  position: integer('position').default(0),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 200 }),
  customerPhone: varchar('customer_phone', { length: 50 }),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  variantId: integer('variant_id')
    .notNull()
    .references(() => productVariants.id),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
});

// Apariencia del sitio (una sola fila, id = 1). Creada con drizzle/0001_site_settings.sql
export const siteSettings = pgTable(
  'site_settings',
  {
    id: smallint('id').primaryKey().default(1),
    theme: varchar('theme', { length: 20 }).notNull().default('calido'),
    accent: varchar('accent', { length: 7 }),
    bg: varchar('bg', { length: 7 }),
    textColor: varchar('text_color', { length: 7 }),
    fontPair: varchar('font_pair', { length: 20 }).notNull().default('elegante'),
    radius: varchar('radius', { length: 10 }).notNull().default('recto'),
    adminTheme: varchar('admin_theme', { length: 10 }).notNull().default('light'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('site_settings_single_row', sql`${t.id} = 1`),
    check('site_settings_theme_chk', sql`${t.theme} in ('calido','noche','minimal','rosa','salvia')`),
    check('site_settings_font_chk', sql`${t.fontPair} in ('elegante','moderno','clasico')`),
    check('site_settings_radius_chk', sql`${t.radius} in ('recto','suave','redondeado')`),
    check('site_settings_admin_chk', sql`${t.adminTheme} in ('light','dark','system')`),
    check('site_settings_hex_chk', sql`(${t.accent} is null or ${t.accent} ~ '^#[0-9a-f]{6}$') and (${t.bg} is null or ${t.bg} ~ '^#[0-9a-f]{6}$') and (${t.textColor} is null or ${t.textColor} ~ '^#[0-9a-f]{6}$')`),
  ]
);

// Relaciones para queries con joins tipados
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));
