const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const Expense = require('../models/Expense');
const crypto = require('crypto');

exports.createTrip = async (req, res) => {
    try {
        const trip = await Trip.create({
            ...req.body,
            owner: req.user._id,
            members: [{ user: req.user._id, email: req.user.email, name: req.user.name, role: 'owner', status: 'active', joinedAt: new Date() }]
        });
        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ 'members.email': req.user.email }).sort({ startDate: 1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('owner', 'name email').populate('members.user', 'name email');
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        // Check access
        const isMember = trip.members.some(m => m.email === req.user.email);
        if (!isMember) return res.status(403).json({ message: 'Not authorized' });

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        const isOwner = trip.owner.toString() === req.user._id.toString();
        if (!isOwner) return res.status(403).json({ message: 'Not authorized to update trip details' });

        Object.assign(trip, req.body);
        const updatedTrip = await trip.save();
        res.json(updatedTrip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        if (trip.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only owner can delete' });
        }

        await Itinerary.deleteMany({ trip: trip._id });
        await Expense.deleteMany({ trip: trip._id });
        await trip.deleteOne();

        res.json({ message: 'Trip deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.inviteMember = async (req, res) => {
    try {
        const { email } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (trip.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only owner can invite' });
        }
        if (trip.type !== 'group') {
            return res.status(400).json({ message: 'Cannot invite to solo trip' });
        }
        if (trip.members.some(m => m.email === email)) {
            return res.status(400).json({ message: 'User already in trip' });
        }

        const inviteToken = crypto.randomUUID();
        trip.members.push({ email, role: 'editor', status: 'invited', inviteToken });
        await trip.save();

        res.json({ message: 'Invited successfully', inviteToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.respondToInvite = async (req, res) => {
    try {
        const { token } = req.params;
        const trip = await Trip.findOne({ 'members.inviteToken': token });
        if (!trip) return res.status(404).json({ message: 'Invalid token' });

        const member = trip.members.find(m => m.inviteToken === token);
        if (member.email !== req.user.email) {
            return res.status(403).json({ message: 'Token email mismatch' });
        }

        member.status = 'active';
        member.user = req.user._id;
        member.name = req.user.name;
        member.joinedAt = new Date();
        member.inviteToken = undefined;

        await trip.save();
        res.json({ message: 'Joined trip successfully', trip });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeMember = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        const memberId = req.params.memberId;

        if (trip.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only owner can remove' });
        }

        trip.members = trip.members.filter(m => m._id.toString() !== memberId);
        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
