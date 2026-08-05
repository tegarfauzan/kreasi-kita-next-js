import "dotenv/config";
import { disconnectSeedDatabase, seedDatabase } from "./seed";

seedDatabase({ overwriteCatalog: false, seedDemoUsers: false }).finally(disconnectSeedDatabase);
