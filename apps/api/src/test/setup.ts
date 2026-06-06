process.env.PORT = process.env.PORT ?? "4000";
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/shaadihub?schema=public";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test_secret_with_minimum_length";
process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "demo";
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ?? "demo";
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "demo";

