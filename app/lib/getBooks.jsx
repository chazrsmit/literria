export async function getBooks() {
    const res = await fetch(`https://example-data.draftbit.com/books`)
    const data = await res.json()

    // on va assigner des prix randoms aux livres:
    const prices = [
        5.99,
        11.99,
        16.99,
        21.99,
        29.99
    ]

    // fonction pour choper un des prix au hasard
    const getRandomPrice = () => {
        const indexRandom = Math.floor(Math.random()*prices.length)
        return prices[indexRandom]
    }

    // on va renommer chaque field / attribut pour chaque livre par soucis de simplicité (et également si l'API change le nom du propriété, le site ne sera pas affecté)
    return data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.authors,
        // je ne vais prendre que les 3 premières catégories/genres:
        categoryA: book.genres ? book.genres.split(',')[0]?.trim() ?? '' : '',
        categoryB: book.genres ? book.genres.split(',')[1]?.trim() ?? '' : '',
        categoryC: book.genres ? book.genres.split(',')[2]?.trim() ?? '' : '',
        image: book.image_url,
        description: book.description,
        rating: book.rating,
        price: getRandomPrice()
    }))
}