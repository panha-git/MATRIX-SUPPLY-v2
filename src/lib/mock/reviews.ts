export type MockReview = {
  productId?: string;
  reviewerName: string;
  avatar: string;
  rating: number;
  comment: string;
  reviewDate: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  uploadedImages: string[];
  uploadedVideo: string | null;
  supplierReply: string | null;
};

const names = ["Dao Nguyen", "Sok Vanna", "Mina Chhoun", "Heng Rith", "Srey Leak", "Kosal Men", "Thida Chan", "Arun Phan", "Pisey Long", "Narin Srey", "Vuthy Kim", "Chantha Roeun"];
const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
];
const comments = [
  "Batch quality matched the sample and the packing held up well during delivery to our warehouse.",
  "The supplier confirmed stock quickly, labelled each carton clearly, and shipped within the promised lead time.",
  "Good value for repeat procurement. We especially appreciated the accurate carton count and clean invoice details.",
  "Our operations team checked the goods on arrival and found the specification consistent across the full lot.",
  "Response was practical and direct. The team helped adjust delivery timing for our receiving window.",
  "The order arrived with stronger wrapping than expected, which made unloading and storage easier.",
  "Useful for a monthly replenishment contract because the supplier keeps stock levels visible and realistic.",
  "A few cartons had light scuffs from transport, but the goods inside were protected and counted correctly.",
];

export function getMockReviews(productId?: string, count = 2400): MockReview[] {
  const scopedCount = productId ? 18 : count;
  return Array.from({ length: scopedCount }, (_, index) => {
    const rating = index % 17 === 0 ? 4 : index % 29 === 0 ? 3 : 5;
    const dayOffset = 3 + ((index * 9) % 720);
    return {
      productId: productId || `prod_${String((index % 260) + 1).padStart(4, "0")}`,
      reviewerName: names[index % names.length],
      avatar: avatars[index % avatars.length],
      rating,
      comment: comments[index % comments.length],
      reviewDate: new Date(Date.now() - dayOffset * 86400000).toISOString().slice(0, 10),
      verifiedPurchase: index % 8 !== 0,
      helpfulCount: 2 + ((index * 5) % 47),
      uploadedImages: index % 3 === 0 ? ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80"] : [],
      uploadedVideo: null,
      supplierReply: index % 2 === 0 ? "Thank you for the clear receiving note. We will keep the next replenishment lot reserved for your team." : null,
    };
  });
}
