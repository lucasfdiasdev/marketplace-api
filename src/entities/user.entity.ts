import bcrypt from "bcryptjs";
import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Por favor, insira seu nome."],
    },
    lastName: {
      type: String,
      required: [true, "Por favor, insira seu sobrenome."],
    },
    email: {
      type: String,
      required: [true, "Por favor, insira seu e-mail."],
      unique: true,
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Por favor, insira um email valido.",
      },
    },
    cpf: {
      type: String,
      required: [true, "Por favor, insira seu CPF."],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Por favor, insira seu telefone."],
      unique: true,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// hash password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const userModel: Model<IUser> = mongoose.model("User", userSchema);
