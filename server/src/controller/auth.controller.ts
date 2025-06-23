import { Request, Response } from "express";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import AuthHelper from "@src/helpers/auth.helper";
import AuthServices from "@src/services/auth.service";

export class AuthController {
  static userSignupHandler = AsyncHandler(
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

      await AuthServices.signUp({
        name,
        phoneNumber,
        email,
        password,
        address,
        city,
        pincode,
        countryandstate,
        isAccepted,
      });

      res.json(new ApiResponse("Account created successfully"));
    }
  );

  static userSigninHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await AuthServices.signIn(
        email,
        password
      );

      AuthHelper.setCookies(res, {
        accessToken: {
          value: accessToken,
          days: 1,
        },
        refreshToken: {
          value: refreshToken,
          days: 7,
        },
      });

      res.status(200).json(new ApiResponse("Logged in successfully"));
    }
  );

  static userLogoutHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      AuthHelper.clearCookies(res, ["accessToken", "refreshToken"]);
      res
        .status(200)
        .json(new ApiResponse("You have been logged out successfully"));
    }
  );

  static forgotPasswordHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, newPassword } = req.body;

      await AuthServices.forgotPassword(email, newPassword);

      res.json(new ApiResponse("Password changed successfully"));
    }
  );

  static authenticatedUserInfoHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const userInfo = await AuthServices.getUserInfo(userId);
      res.json(new ApiResponse("User data fetched successfully", userInfo));
    }
  );
}
