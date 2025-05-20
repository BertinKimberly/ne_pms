// utils/scheduler.ts
import cron from 'node-cron';
import bookingService from '../services/booking.service';
import logger from './logger';

export function startScheduledJobs() {
  // Check for overstay bookings every hour
  cron.schedule('0 * * * *', async () => {
    try {
      logger.info('Running overstay booking check');
      await bookingService.checkOverstayBookings();
    } catch (error) {
      logger.error('Error in overstay booking check:', error);
    }
  });

  logger.info('Scheduled jobs started');
}