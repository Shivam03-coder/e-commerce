import { db } from "@src/db";
import AuthHelper from "@src/helpers/auth.helper";
import { SignUpUserType } from "@src/types/auth.types";
import {
  ValidationError,
  DatabaseError,
  NotFoundError,
} from "@src/utils/error.utils";

class AuthServices {
  static async signUp(userData: SignUpUserType) {
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
    } = userData;

    AuthHelper.isEmailValid(email);

    const isEmailAlreadyExist = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (isEmailAlreadyExist) {
      throw new ValidationError("User Already Exist");
    }

    const hashedPassword = await AuthHelper.hashPassword(password);

    return await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          isTermsAccepted: isAccepted,
          profileImage:
            "https://res.cloudinary.com/ddggctwjl/image/upload/v1751012126/yore3vhb6yh1ti5ymahm.jpg",
        },
        select: {
          id: true,
        },
      });

      const formatAddress = () => {
        if (!address) return null;
        return [address, city, countryandstate[1], countryandstate[0], pincode]
          .filter(Boolean)
          .join(", ");
      };

      await tx.address.create({
        data: {
          address,
          city,
          pincode,
          country: countryandstate[0],
          state: countryandstate[1],
          userId: newUser.id,
          formattedaddress: formatAddress(),
        },
      });

      return newUser;
    });
  }

  static async getUserInfo(userId: string) {
    try {
      const user = await db.user.findFirst({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          cartProductCount: true,
          favoriteProductCount: true,
          profileImage: true,
          userAddress: {
            select: {
              formattedaddress: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        cart: user.cartProductCount,
        favourite: user.favoriteProductCount,
        profileImage: user.profileImage,
        address: user.userAddress?.formattedaddress,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to fetch user information");
    }
  }

  static async forgotPassword(email: string, newPassword: string) {
    try {
      if (!email || !newPassword)
        throw new ValidationError("Email and password are required");

      const user = await db.user.findFirst({
        where: { email },
      });

      if (!user) throw new ValidationError("User not found");

      const hashedPassword = await AuthHelper.hashPassword(newPassword);

      await db.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new DatabaseError(
        "An unexpected error occurred during password reset"
      );
    }
  }

  static async signIn(email: string, password: string) {
    AuthHelper.isEmailValid(email);

    if (!email || !password)
      throw new ValidationError("Email and password are required");

    const user = await db.user.findFirst({
      where: { email },
    });

    if (!user) throw new ValidationError("User not found");

    const isPasswordCorrect = await AuthHelper.verifyPassword(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new ValidationError("You have enetred incorrect password !");
    }

    const { accessToken, refreshToken } = AuthHelper.generateTokens({
      id: user.id,
      role: user.userRole,
    });

    if (!accessToken || !refreshToken) {
      throw new ValidationError("Token generation failed.");
    }
    return {
      accessToken,
      refreshToken,
    };
  }
}

export default AuthServices;
