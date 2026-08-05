import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initSslCronJob = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running SSL Expiry Cron Job...');
    try {
      await checkSslCertificates();
    } catch (error) {
      console.error('Error running SSL Expiry Cron Job:', error);
    }
  });
  
  // For immediate test execution when the server starts
  setTimeout(checkSslCertificates, 5000); 
};

const checkSslCertificates = async () => {
  const certificates = await prisma.certificate.findMany({
    include: { environment: true }
  });

  const today = new Date();

  // We want to alert Admin users. Fetch all Admin users.
  const admins = await prisma.user.findMany({
    where: { role: 'Admin' }
  });

  if (admins.length === 0) return;

  for (const cert of certificates) {
    if (!cert.validTo) continue;

    // validTo is stored as "YYYY-MM-DD" or similar parsable date string
    const expiryDate = new Date(cert.validTo);
    
    // Calculate difference in days
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If it expires in exactly 10 days, or is less than 10 days and hasn't been notified today.
    // To avoid spamming, we can check if it's <= 10 days and >= 0.
    if (diffDays <= 10 && diffDays >= 0) {
      // Check if we already sent a notification recently for this cert? 
      // For simplicity, we will just create a notification if it's exactly 10 days, 
      // or we can just create it. Since it runs once a day, let's create a notification 
      // when it hits exactly 10 days, 5 days, and 1 day.
      if (diffDays === 10 || diffDays === 5 || diffDays === 1) {
        for (const admin of admins) {
          await prisma.notification.create({
            data: {
              userId: admin.id,
              message: `SSL Alert: Certificate for ${cert.domain} (${cert.environment.name}) expires in ${diffDays} days!`,
              link: `/environments/${cert.environment.id}`
            }
          });
        }
      }
    } else if (diffDays < 0) {
      // Already expired. We can optionally send an "Expired" alert, maybe once a week.
      // But for now, we just update the status to Expired if it's not already.
      if (cert.status !== 'Expired') {
        await prisma.certificate.update({
          where: { id: cert.id },
          data: { status: 'Expired' }
        });
      }
    }
  }
};
