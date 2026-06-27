import { asyncHandler } from '../utils/asyncHandler.js';
import { listUsers } from '../services/userService.js';
import { memoryStore } from '../services/memoryStore.js';

export const getAdminStats = asyncHandler(async (_req, res) => {
  const users = await listUsers();
  res.json({
    stats: {
      users: users.length,
      profiles: memoryStore.profiles.length,
      scans: memoryStore.scans.length,
      sosAlerts: memoryStore.sosAlerts.length
    },
    users
  });
});
