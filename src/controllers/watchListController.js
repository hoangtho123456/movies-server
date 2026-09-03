import { prisma } from "../config/db.js";

const addWatchList = async (req, res) => {
    try {
        const { userId, movieId, status, rating, notes } = req.body;

        // Check if the movie exists
        const movie = await prisma.movie.findUnique({where: { id: movieId }});
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        // Check if the movie is already in the user's watchlist
        const existingWatchListItem = await prisma.watchListItem.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });
        if (existingWatchListItem) {
            return res.status(400).json({ error: "Movie is already in the watchlist" });
        }

        // Add the movie to the user's watchlist
        const watchListItem = await prisma.watchListItem.create({
            data: {
                userId,
                movieId,
                status: status || "PLANNED",
                rating: !!rating && !isNaN(rating) ? parseInt(rating) : null,
                notes,
            },
        });

        res.status(201).json({
            status: "success",
            data: {
                watchListItem,
            },
        });
    } catch (error) {
        console.error("Error adding movie to watchlist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export { addWatchList };
