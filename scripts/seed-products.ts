import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const products = [
  // Budget Meals
  {
    name: "Hotsilog",
    description: "Hotdog with Sinangag (Fried Rice) and Itlog (Egg)",
    price: 60,
    category: "Budget Meals",
    productId: "hotsilog",
    image: "/images/products/hotsilog.jpg",
    isAvailable: true
  },
  {
    name: "Hamsilog",
    description: "Ham with Sinangag (Fried Rice) and Itlog (Egg)",
    price: 55,
    category: "Budget Meals",
    productId: "hamsilog",
    image: "/images/products/hamsilog.jpg",
    isAvailable: true
  },
  {
    name: "Silog",
    description: "Sinangag (Fried Rice) and Itlog (Egg)",
    price: 35,
    category: "Budget Meals",
    productId: "silog",
    image: "/images/products/silog.jpg",
    isAvailable: true
  },
  {
    name: "Skinless Rice",
    description: "Skinless Longganisa with Fried Rice",
    price: 40,
    category: "Budget Meals",
    productId: "skinless",
    image: "/images/products/skinless.jpg",
    isAvailable: true
  },
  {
    name: "Pork Chaofan",
    description: "Pork Fried Rice Chinese Style",
    price: 45,
    category: "Budget Meals",
    productId: "pork-chaofan",
    image: "/images/products/pork-chaofan.jpg",
    isAvailable: true,
    addons: [
      { name: "Siomai", price: 5 },
      { name: "Shanghai", price: 5 },
      { name: "Skinless", price: 10 },
      { name: "Egg", price: 15 },
    ],
  },
  {
    name: "Beef Chaofan",
    description: "Beef Fried Rice Chinese Style",
    price: 50,
    category: "Budget Meals",
    productId: "beef-chaofan",
    image: "/images/products/beef-chaofan.jpg",
    isAvailable: true,
    addons: [
      { name: "Siomai", price: 5 },
      { name: "Shanghai", price: 5 },
      { name: "Skinless", price: 10 },
      { name: "Egg", price: 15 },
    ],
  },
  {
    name: "Siomai Rice",
    description: "Siomai with Fried Rice",
    price: 39,
    category: "Budget Meals",
    productId: "siomai-rice",
    image: "/images/products/siomai-rice.jpg",
    isAvailable: true
  },
  {
    name: "Shanghai Rice",
    description: "Lumpia Shanghai with Rice",
    price: 39,
    category: "Budget Meals",
    productId: "shanghai-rice",
    image: "/images/products/shanghai-rice.jpg",
    isAvailable: true
  },
  // Silog Meals
  {
    name: "Tapsilog",
    description: "Beef Tapa with Sinangag and Itlog",
    price: 100,
    category: "Silog Meals",
    productId: "tapsilog",
    image: "/images/products/tapasilog.jpg",
    isAvailable: true
  },
  {
    name: "Porksilog",
    description: "Porkchop with Sinangag and Itlog",
    price: 95,
    category: "Silog Meals",
    productId: "porksilog",
    image: "/images/products/porksilog.jpg",
    isAvailable: true
  },
  {
    name: "Chicksilog",
    description: "Chicken with Sinangag and Itlog",
    price: 95,
    category: "Silog Meals",
    productId: "chicksilog",
    image: "/images/products/chicksilog.jpg",
    isAvailable: true
  },
  {
    name: "Bangsilog",
    description: "Bangus with Sinangag and Itlog",
    price: 100,
    category: "Silog Meals",
    productId: "bangsilog",
    image: "/images/products/bangsilog.jpg",
    isAvailable: true
  },
  {
    name: "Sisigsilog",
    description: "Sisig with Sinangag and Itlog",
    price: 95,
    category: "Silog Meals",
    productId: "sisigsilog",
    image: "/images/products/sisigsilog.jpg",
    isAvailable: true
  },
  {
    name: "Tocilog",
    description: "Tocino with Sinangag and Itlog",
    price: 85,
    category: "Silog Meals",
    productId: "tocilog",
    image: "/images/products/tocilog.jpg",
    isAvailable: true
  },
  // Ala Carte
  {
    name: "Lugaw",
    description: "Filipino Rice Porridge",
    price: 20,
    category: "Ala Carte",
    productId: "lugaw",
    image: "/images/products/lugaw.jpg",
    isAvailable: true
  },
  {
    name: "Goto",
    description: "Rice Porridge with Beef Tripe",
    price: 35,
    category: "Ala Carte",
    productId: "goto",
    image: "/images/products/goto.jpg",
    isAvailable: true
  },
  {
    name: "Beef Mami",
    description: "Beef Noodle Soup",
    price: 45,
    category: "Ala Carte",
    productId: "beef-mami",
    image: "/images/products/beef-mami.jpg",
    isAvailable: true
  },
  {
    name: "Pares",
    description: "Beef Stew with Rice",
    price: 60,
    category: "Ala Carte",
    productId: "pares",
    image: "/images/products/pares.jpg",
    isAvailable: true
  },
  {
    name: "Fries",
    description: "Crispy French Fries",
    price: 25,
    category: "Ala Carte",
    productId: "fries",
    image: "/images/products/fries.jpg",
    isAvailable: true
  },
  {
    name: "Waffle",
    description: "Fresh Baked Waffle",
    price: 15,
    category: "Ala Carte",
    productId: "waffle",
    image: "/images/products/waffle.jpg",
    isAvailable: true,
    variants: [
      { name: "Chocolate", price: 15 },
      { name: "Cheese", price: 15 },
      { name: "Hotdog", price: 15 }
    ],
    variantGroups: [
      {
        name: "Flavor",
        required: true,
        options: ["Chocolate", "Cheese", "Hotdog"]
      }
    ]
  },
  {
    name: "Graham Bar",
    description: "Graham Cracker Dessert Bar",
    price: 20,
    category: "Ala Carte",
    productId: "graham-bar",
    image: "/images/products/grahambar.jpg",
    isAvailable: true
  },
  {
    name: "Cheese Stick",
    description: "Crispy Cheese Stick (6 pieces per order)",
    price: 10,
    category: "Ala Carte",
    productId: "cheesetick",
    image: "/images/products/cheesetick.jpg",
    isAvailable: true
  },
  {
    name: "Siomai",
    description: "Chinese-style Siomai",
    price: 5,
    category: "Ala Carte",
    productId: "siomai-piece",
    image: "/images/products/siomai-rice.jpg",
    isAvailable: true,
    variants: [
      { name: "Chicken", price: 5 },
      { name: "Beef", price: 5 }
    ],
    variantGroups: [
      {
        name: "Flavor",
        required: true,
        options: ["Chicken", "Beef"]
      }
    ]
  },
  // Beverages
  {
    name: "Coke Float",
    description: "Coca-Cola with Ice Cream",
    price: 29,
    category: "Beverages",
    productId: "coke-float",
    image: "/images/products/coke-float.jpg",
    isAvailable: true
  },
  {
    name: "Iced Coffee",
    description: "Cold Brewed Coffee with Ice (22oz)",
    price: 29,
    category: "Beverages",
    productId: "iced-coffee",
    image: "/images/products/iced-coffee.jpg",
    isAvailable: true
  },
  {
    name: "Fruit Soda 16oz",
    description: "Refreshing Fruit-flavored Soda",
    price: 29,
    category: "Beverages",
    productId: "fruit-soda-16",
    image: "/images/products/16oz-fruits.jpg",
    isAvailable: true,
    variants: [
      { name: "Blueberry", price: 29 },
      { name: "Strawberry", price: 29 },
      { name: "Lemon", price: 29 },
      { name: "Green Apple", price: 29 }
    ],
    variantGroups: [
      {
        name: "Flavor",
        required: true,
        options: ["Blueberry", "Strawberry", "Lemon", "Green Apple"]
      }
    ]
  },
  {
    name: "Fruit Soda 22oz",
    description: "Large Refreshing Fruit-flavored Soda",
    price: 39,
    category: "Beverages",
    productId: "fruit-soda-22",
    image: "/images/products/22ozfruitsoda.jpg",
    isAvailable: true,
    variants: [
      { name: "Blueberry", price: 39 },
      { name: "Strawberry", price: 39 },
      { name: "Lemonade", price: 39 },
      { name: "Green Apple", price: 39 }
    ],
    variantGroups: [
      {
        name: "Flavor",
        required: true,
        options: ["Blueberry", "Strawberry", "Lemonade", "Green Apple"]
      }
    ]
  },
];

async function seedProducts() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env.local');
  }

  try {
    console.log('Connecting to MongoDB...');
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');

    const db = client.db();
    const collection = db.collection('products');

    // Delete existing products
    console.log('Clearing existing products...');
    await collection.deleteMany({});

    // Insert new products
    console.log('Inserting new products...');
    const result = await collection.insertMany(products);
    console.log(`Successfully inserted ${result.insertedCount} products`);

    await client.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedProducts();
