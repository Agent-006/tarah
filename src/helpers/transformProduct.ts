export const transformProduct = (product: any) => {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        basePrice: Number(product.basePrice),
        discountedPrice: product.discountedPrice ? Number(product.discountedPrice) : undefined,
        variants: product.variants || [],
        images: product.images || [],
        categories: product.categories || [],
        status: product.variants?.some((v: any) => v.inventory?.stock > 0)
            ? 'available'
            : 'soldout',
    };
};