export interface Booking {
  id: string;
  clientId: string;
  roomId: string;
  hotelId: string;
  appliedPromotionId: string;

  clientName: string;
  hotelName: string;
  roomNumber: string;
  promotionName: string;

  subTotalAmount: number;
  discountAmount: number;
  totalAmount: number;

  checkInAt: string;
  checkOutAt: string;
  status: string;
}
