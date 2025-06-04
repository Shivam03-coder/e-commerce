import { db } from "@src/db";
import { GlobalUtils } from "@src/global";
import AuthServices from "@src/services/auth";
import {
  ApiError,
  ApiResponse,
  AsyncHandler,
} from "@src/utils/server-functions";
import { Request, Response } from "express";

export class UserAuthController {
  public static UserSignup = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        name,
        phoneNumber,
        email,
        password,
        address,
        city,
        pincode,
        countryandstate,
        isAccepted,
      } = req.body;

      const isEmailAlreadyExist = await db.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (isEmailAlreadyExist) throw new ApiError(400, "Email already exists");

      const hashedPassword = await AuthServices.hashPassword(password);

      await db.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            isTermsAccepted: isAccepted,
          },
          select: {
            id: true,
          },
        });

        await tx.address.create({
          data: {
            address,
            city,
            pincode,
            country: countryandstate[0],
            state: countryandstate[1],
            userId: newUser.id,
          },
        });
      });

      res.json(new ApiResponse(201, "Account created successfully"));
    }
  );

  public static UserSignin = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;

      if (!email || !password)
        throw new ApiError(400, "Email and password are required");

      const user = await db.user.findFirst({
        where: { email },
      });

      if (!user) throw new ApiError(404, "User not found");

      const isPasswordCorrect = await AuthServices.verifyPassword(
        password,
        user.password
      );

      if (!isPasswordCorrect) {
        throw new ApiError(401, "You have enetred incorrect password !");
      }

      const { sessionToken } = await AuthServices.generateTokens(user);

      GlobalUtils.setMultipleCookies(res, [
        { name: "sessionToken", value: sessionToken },
        { name: "UserId", value: user.id },
      ]);

      res.json(
        new ApiResponse(200, "You have been logged in successfully", {
          id: user.id,
          name: user.name,
          email: user.email,
        })
      );
    }
  );

  public static UserLogout = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      res.clearCookie("sessionToken");
      res
        .status(200)
        .json(new ApiResponse(200, "You have been logged out successfully"));
    }
  );

  public static ForgotPassword = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, newPassword } = req.body;
      if (!email || !newPassword)
        throw new ApiError(400, "Email and password are required");

      const user = await db.user.findFirst({
        where: { email },
      });

      if (!user) throw new ApiError(404, "User not found");

      const hashedPassword = await AuthServices.hashPassword(newPassword);

      await db.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });

      res.json(new ApiResponse(201, "Password changes successfully"));
    }
  );
}
