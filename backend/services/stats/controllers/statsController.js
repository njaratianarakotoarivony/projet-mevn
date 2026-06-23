import Reservation from '../../reservation/models/Reservation.js';
import Room from '../../room/models/Room.js';

const getStats = async (req, res, next) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ available: true });
    const totalReservations = await Reservation.countDocuments();
    const confirmedReservations = await Reservation.countDocuments({ status: 'confirmée' });
    
    // Revenu = somme des montants réellement facturés (prix × nb de nuits),
    // déjà stocké dans `totalPrice` à la création de la réservation.
    const [revenueAgg] = await Reservation.aggregate([
      { $match: { status: 'confirmée' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg?.total || 0;

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
