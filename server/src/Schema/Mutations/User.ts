import { GraphQLString, GraphQLID } from "graphql";
import { UserType } from "../TypeDefs/User";
import { Users } from "../../Entities/Users";
import { MessageType } from "../TypeDefs/Messages";

export const CREATE_USER = {
  type: UserType,
  args: {
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (parent: any, args: any) => {
    const { name, username, password } = args;
    await Users.insert({ name, username, password });

    return args;
  },
};

export const UPDATE_PASSWORD = {
  type: MessageType,
  args: {
    username: { type: GraphQLString },
    oldPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },
  resolve: async (parent: any, args: any) => {
    const { username, oldPassword, newPassword } = args;
    const user = await Users.findOne({ username });

    if (!user) {
      throw new Error("User not Exist...");
    }

    const userPassword = user?.password;

    if (oldPassword === userPassword) {
      await Users.update({ username }, { password: newPassword });

      return { successful: true, message: "Password Updated!" };
    } else {
      throw new Error("Password Do Not Match!");
    }
  },
};

export const DELETE_USER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (parent: any, args: any) => {
    const id = args.id;
    await Users.delete(id);

    return { successful: true, message: "DELETE WORKED!" };
  },
};
