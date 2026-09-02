import { prisma } from "../src/config/db.js";

// Movie.createdBy is a required FK to User.id.
const userId = "cmth0zfz00000p8uzwha07y9l";

const movies = [
    {
        title: "The Shawshank Redemption",
        overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        releaseYear: 1994,
        genres: ["Drama"],
        runtime: 142,
    },
    {
        title: "The Godfather",
        overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        releaseYear: 1972,
        genres: ["Crime"],
        runtime: 175,
    },
    {
        title: "The Dark Knight",
        overview: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
        releaseYear: 2008,
        genres: ["Action", "Crime", "Drama"],
        runtime: 152,
    },
    {
        title: "Pulp Fiction",
        overview: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        releaseYear: 1994,
        genres: ["Crime", "Drama"],
        runtime: 154,
    },
    {
        title: "Forrest Gump",
        overview: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
        releaseYear: 1994,
        genres: ["Drama"],
        runtime: 142,
    },
    {
        title: "Inception",
        overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        releaseYear: 2010,
        genres: ["Sci-Fi", "Action", "Thriller"],
        runtime: 148,
    },
    {
        title: "Fight Club",
        overview: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.",
        releaseYear: 1999,
        genres: ["Drama"],
        runtime: 139,
    },
    {
        title: "The Matrix",
        overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        releaseYear: 1999,
        genres: ["Sci-Fi", "Action"],
        runtime: 136,
    },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        overview: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
        releaseYear: 2001,
        genres: ["Fantasy", "Adventure", "Drama"],
        runtime: 178,
    },
    {
        title: "The Lord of the Rings: The Two Towers",
        overview: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
        releaseYear: 2002,
        genres: ["Fantasy"],
        runtime: 179,
    },
];

const main = async () => {
    try {
        console.log("Seeding movies...");

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error(`User ${userId} not found. Create it before seeding movies.`);
        }

        // Make the seed idempotent: clear this user's movies (and any watchlist
        // rows referencing them) before reinserting.
        const existing = await prisma.movie.findMany({
            where: { createdBy: userId },
            select: { id: true },
        });
        if (existing.length) {
            const ids = existing.map((m) => m.id);
            await prisma.watchListItem.deleteMany({ where: { movieId: { in: ids } } });
            await prisma.movie.deleteMany({ where: { id: { in: ids } } });
        }

        await prisma.movie.createMany({
            data: movies.map((movie) => ({ ...movie, createdBy: userId })),
        });

        console.log(`Seeded ${movies.length} movies for user ${user.email}.`);
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
        console.log("Seeding completed.");
    }
};

main();
