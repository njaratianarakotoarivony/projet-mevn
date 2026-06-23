import Room from '../models/Room.js';
import Reservation from '../../reservation/models/Reservation.js';

// GET /api/rooms/availability?checkIn=&checkOut=&guests=
// Renvoie les chambres assez grandes et libres sur la période demandée.
const getAvailableRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut, guests } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'checkIn et checkOut requis' });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: 'Plage de dates invalide' });
    }

    // Chambres bloquées par une réservation active chevauchant la période.
    const overlapping = await Reservation.find({
      status: 'confirmée',
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    }).select('roomId');
    const bookedIds = overlapping.map((r) => r.roomId);

    const filter = { _id: { $nin: bookedIds } };
    const guestCount = Number(guests);
    if (guestCount > 0) {
      filter.capacity = { $gte: guestCount };
    }

    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }
    res.json(room);
  } catch (error) {
    next(error);
  }
};

const createRoom = async (req, res, next) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }
    res.json(room);
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }
    res.json({ message: 'Chambre supprimée' });
  } catch (error) {
    next(error);
  }
};

export { getAvailableRooms, getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };
