import bcrypt from "bcrypt";
import validator from "validator";
import { HydratedDocument, model, Model, Schema } from "mongoose";

export type UserRole = "student" | "security" | "admin" | "teacher";

export interface IUser {
  name: string;
  registrationNo: string;
  email: string;
  password: string;
  confirmPassword: string;
  passwordChangedAt?: Date;
  role: UserRole;
}

export interface IUserMethods {
  verifyPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
  passwordChangedAfter(jwtTimestamp: number): boolean;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<
  IUser,
  Model<IUser, {}, IUserMethods>,
  IUserMethods
>({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  registrationNo: {
    type: String,
    required: [true, "Please provide your registration number"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    minLength: 8,
    validate: {
      validator: function (value: string): boolean {
        return value === (this as HydratedDocument<IUser>).password;
      },
      message: "Password should be same!",
    },
  },
  role: {
    type: String,
    enum: ["student", "security", "admin", "teacher"],
    default: "student",
  },
});

userSchema.pre("save", async function (this: HydratedDocument<IUser>) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.set("confirmPassword", undefined);
});

userSchema.methods.verifyPassword = async function (
  this: UserDocument,
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = model<IUser, Model<IUser, {}, IUserMethods>>("User", userSchema);

export default User;
