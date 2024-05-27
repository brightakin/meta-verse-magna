import { DataSource } from "typeorm";
import { User } from "../entities/User";

// Tell TypeORM to use TypeDI for dependency injection
import { useContainer } from "typeorm";
import Container from "typedi";
useContainer(Container);

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "toluwase",
  database: "metaverse_db",
  entities: [User],
  synchronize: true,
  logging: false,
});

// Make sure to set the container manually
Container.set(DataSource, AppDataSource);
