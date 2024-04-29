import ejs from "ejs";
import "dotenv/config";
import path from "path";
import jwt, { Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import {
  IRegisterBody,
  ILoginRequest,
  IActivationToken,
  IActivationRequest,
} from "../../interfaces/user/auth.interface";
import { IUser } from "../../interfaces/user/user.interface";

import { sendToken } from "../../utils/jwt";
import { sendMail } from "../../utils/sendMail";
import { userModel } from "../../entities/user.entity";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import { IUserVerifyOpt } from "../../interfaces/user/userVerifyOtp.interface";

export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler(400, "Email já cadastrado!"));
      }

      const user: IRegisterBody = {
        email,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.email }, activationCode };

      const html = await ejs.renderFile(
        path.join(__dirname, "../../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Ativação da conta",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          message: `Please check your email: ${user.email} to active your account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(500, error.message));
      }
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

export const createActivationToken = (user: any): IActivationToken => {
  // generate 6 numbers of activation tokens
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.JWT_ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.JWT_ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler(400, "Código de ativação inválido!"));
      }

      const { email } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler(400, "Email já cadastrado!"));
      }
      const user = await userModel.create({
        email,
      });

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as ILoginRequest;

      if (!email) {
        return next(new ErrorHandler(400, "Por favor, insira seu email."));
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        return next(new ErrorHandler(400, "Usuário não encontrado!"));
      }

      const otp = await createVerityOTP(user);

      await sendMail({
        email: user.email,
        subject: "Código de Verificação OTP",
        template: "otp-mail.ejs",
        data: { otp },
      });

      res.status(201).json({
        message: `Please check your email: ${user.email} to active your account!`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

export const createVerityOTP = async (user: any) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  await user.save();

  return otp;
};

export const verifyOtp = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp } = req.body as IUserVerifyOpt;

      if (!otp) {
        return next(new ErrorHandler(400, "Por favor, forneça o OTP."));
      }

      const user = await userModel.findOne({ otp });

      if (!user) {
        return next(new ErrorHandler(400, "Usuário não encontrado!"));
      }

      if (user.otp !== otp) {
        return next(new ErrorHandler(400, "OTP inválido!"));
      }

      await user.save();

      // Envie o token de autenticação
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
