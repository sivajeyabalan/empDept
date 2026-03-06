import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminService } from './modules/admin/admin.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const adminService = app.get(AdminService);

  try {
    const admin = await adminService.create({
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'Admin@123',
    });

    console.log('✅ Default admin created:', admin);
  } catch (err: any) {
    if (err?.status === 409) {
      console.log('ℹ️  Default admin already exists — skipping.');
    } else {
      console.error('❌ Seed failed:', err.message);
    }
  }

  await app.close();
}

seed();
