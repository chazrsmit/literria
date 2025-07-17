export async function getBooks() {
    const res = await fetch(`https://example-data.draftbit.com/books`);
    const data = await res.json();

    const prices = [5.99, 11.99, 16.99, 21.99, 29.99];

    const getRandomPrice = () => {
        const indexRandom = Math.floor(Math.random() * prices.length);
        return prices[indexRandom];
    };

    return data.map(book => {
        const originalPrice = getRandomPrice();

        // ~20% chance (1 in 5) to apply discount
        const hasDiscount = Math.random() < 0.2;
        const discountedPrice = hasDiscount
            ? parseFloat((originalPrice * 0.9).toFixed(2)) // Apply 10% discount and round to 2 decimals
            : null;

        return {
            id: book.id,
            title: book.title,
            author: book.authors,
            categoryA: book.genres ? book.genres.split(',')[0]?.trim() ?? '' : '',
            categoryB: book.genres ? book.genres.split(',')[1]?.trim() ?? '' : '',
            categoryC: book.genres ? book.genres.split(',')[2]?.trim() ?? '' : '',
            image: book.image_url,
            description: book.description,
            rating: book.rating,
            price: originalPrice,
            discountedPrice: discountedPrice // Will be null if no discount applied
        };
    });
}
