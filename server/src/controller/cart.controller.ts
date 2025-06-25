import CartService from "@src/services/cart.service";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import { Request, Response } from "express";

class CartController {
  static getCartItemsHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);

      const items = await CartService.getCartItems(userId);

      res.status(200).json(new ApiResponse("Fetched cart items", items));
    }
  );


  static removeItemFormCartHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const { productId } = req.params;

      const { message } = await CartService.removeItem(
        userId,
        parseInt(productId)
      );

      res.status(200).json(new ApiResponse(message));
    }
  );

  static increaseItemHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const { productId } = req.params;

      const { message } = await CartService.increaseItem(
        userId,
        parseInt(productId)
      );

      res.status(200).json(new ApiResponse(message));
    }
  );
}
export default CartController;
