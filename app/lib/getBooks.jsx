export async function getBooks() {
    const res = await fetch(`https://example-data.draftbit.com/books`)
    const data = await res.json()

    // on va renommer chaque field / attribut pour chaque livre par soucis de simplicité (et également si l'API change le nom du propriété, le site ne sera pas affecté)
    return data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.authors,
        // je ne vais prendre que les 3 premières catégories/genre:
        categoryA: book.genres ? book.genres.split(',').slice(0, 1).map(genre => genre.trim()) : [],
        categoryB: book.genres ? book.genres.split(',').slice(1, 2).map(genre => genre.trim()) : [],
        categoryC: book.genres ? book.genres.split(',').slice(2, 3).map(genre => genre.trim()) : [],
        image: book.image_url,
        description: book.description,
        rating: book.rating
    }))
}