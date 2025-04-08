
export const config = {
  PORT: process.env.PORT || 8080,
  MOONGODB: process.env.MOONGODB ||"mongodb+srv://catalinavilchesf99:pZM6ycPsdi7q3BTZ@ecommerce.vac1o.mongodb.net/?retryWrites=true&w=majority&appName=Ecommerce",
  SESSION_SECRET: process.env.SESSION_SECRET || 'secret',
  DBNAME: process.env.DBNAME || 'Ecommerce',
}