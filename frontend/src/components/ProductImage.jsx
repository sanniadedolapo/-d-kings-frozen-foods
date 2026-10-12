import { useState } from 'react'

const categoryImages = {
  chicken: '/images/products/chicken.jpg',
  turkey: '/images/products/turkey.jpg',
  fish: '/images/products/fish.jpg',
  seafood: '/images/products/seafood.jpg',
  beef: '/images/products/beef.jpg',
  snacks: '/images/products/spring-rolls.jpg',
}

export default function ProductImage({
  product,
  className = 'card-emoji',
  fallback = '🍗',
}) {
  const [imageFailed, setImageFailed] = useState(false)

  const imageUrl =
    product?.imageUrl ||
    (typeof product?.emoji === 'string' &&
    /^https?:\/\//i.test(product.emoji)
      ? product.emoji
      : categoryImages[product?.categorySlug] || null)

  if (imageUrl && !imageFailed) {
    return (
      <img
        className={className}
        src={imageUrl}
        alt={product?.name || 'Frozen food product'}
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    )
  }

  const emoji =
    product?.emoji &&
    !/^https?:\/\//i.test(product.emoji)
      ? product.emoji
      : fallback

  return <span className={className}>{emoji}</span>
}
