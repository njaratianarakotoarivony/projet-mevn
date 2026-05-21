import Reservation from '../../reservation/models/Reservation.js';
import Room from '../../room/models/Room.js';

const getStats = async (req, res, next) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ available: true });
    const totalReservations = await Reservation.countDocuments();
    const confirmedReservations = await Reservation.countDocuments({ status: 'confirmée' });
    
    const reservations = await Reservation.find({ status: 'confirmée' });
    let totalRevenue = 0;
    
    for (const reservation of reservations) {
      const room = await Room.findById(reservation.roomId);
      if (room) {
        totalRevenue += room.price;
      }
    }
    
    const stats = {
      totalRevenue,
      totalRooms,
      availableRooms,
      totalReservations,
      confirmedReservations,
      occupancyRate: totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms * 100).toFixed(2) + '%' : '0%',
    };
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export { getStats };
