import { prisma } from '../config/db.js';

const filterMovies = (query) => {
    const where = {};

    if (query.title) where.title = { contains: query.title, mode: 'insensitive' };
    if (query.genres) where.genres = { hasSome: query.genres.split(',').map(genre => genre.trim()) };
    if (query.releaseYear) where.releaseYear = parseInt(query.releaseYear);

    const options = {};
    if (query.limit >= 0) options.take =  parseInt(query.limit);
    if (query.offset) options.skip = parseInt(query.offset);
    if (query.page && query.limit) options.skip = (parseInt(query.page) - 1) * parseInt(query.limit);
    if (query.sortBy) options.orderBy = { [query.sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc' };

    return { where, options };
};

const getAllMovies = async (req, res) => {
    try {
        const { where, options } = filterMovies(req.query);

        const movies = await prisma.movie.findMany({
            where,
            ...options,
        });

        res.status(200).json({
            status: 'success',
            data: {
                movies,
            },
            options: {
                total: await prisma.movie.count({ where }),
                limit: options.take || null,
                offset: options.skip || null,
                page: req.query.page || null,
                sortBy: req.query.sortBy || null,
                sortOrder: req.query.sortOrder || null,
            },
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch movies'
        });
    }
};

export { getAllMovies };
