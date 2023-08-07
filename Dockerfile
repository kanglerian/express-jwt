# Menggunakan image Node.js versi terbaru sebagai base image
FROM node:latest

# Buat direktori aplikasi di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Install dependensi aplikasi
RUN npm install

# Salin kode aplikasi ke direktori kerja
COPY . .

# Expose port 7654 untuk aplikasi
EXPOSE 7654

# Menjalankan aplikasi saat container dijalankan
CMD ["npm", "start"]