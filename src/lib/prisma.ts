import { Decimal } from '@prisma/client/runtime/library';

export function serializeProduct(product: any) {
    return {
        ...product,
        basePrice: product.basePrice?.toString() || "0",
        discountedPrice: product.discountedPrice?.toString() || null,
    };
}