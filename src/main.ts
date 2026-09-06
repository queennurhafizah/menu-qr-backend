// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Static files (uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Menu Digital QR API')
    .setDescription(
      `## API untuk aplikasi Menu Digital QR + Order Tracker\n\n` +
      `### Roles:\n` +
      `- **ADMIN** – Akses penuh ke semua data\n` +
      `- **OWNER** – Hanya bisa kelola store miliknya sendiri\n\n` +
      `### Autentikasi:\n` +
      `Gunakan endpoint \`/api/auth/login\` untuk mendapatkan token JWT, ` +
      `lalu klik tombol **Authorize** dan masukkan: \`Bearer <token>\``,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Register & Login')
    .addTag('Users', 'Manajemen pengguna (Admin only)')
    .addTag('Stores', 'Manajemen toko/warung')
    .addTag('Categories', 'Kategori menu')
    .addTag('Menu Items', 'Item menu')
    .addTag('Orders', 'Pesanan & tracking status')
    .addTag('Upload', 'Upload gambar menu')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT || 8080;
  console.log('PORT ENV =', process.env.PORT);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
  console.log(`🌐 API base URL: http://localhost:${port}/api`);
}
bootstrap();
