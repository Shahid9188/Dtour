import React, { createContext, useContext, useState, useCallback } from 'react';
import { tripAPI, itineraryAPI, expenseAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';

const TripContext = createContext();

export const useTrip = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
    const [trips, setTrips] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [itinerary, setItinerary] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState({});
    const [settlements, setSettlements] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchTrips = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await tripAPI.getAll();
            setTrips(data);
        } catch (err) {
            toast.error('Failed to fetch trips');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchTrip = useCallback(async (id) => {
        setIsLoading(true);
        try {
            const data = await tripAPI.getById(id);
            setCurrentTrip(data);
        } catch (err) {
            toast.error('Failed to fetch trip details');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createTrip = async (tripData) => {
        try {
            const data = await tripAPI.create(tripData);
            setTrips(prev => [...prev, data]);
            setCurrentTrip(data);
            return data;
        } catch (err) {
            toast.error('Failed to create trip');
            throw err;
        }
    };

    const deleteTrip = async (id) => {
        try {
            await tripAPI.delete(id);
            setTrips(prev => prev.filter(t => t._id !== id));
            if (currentTrip?._id === id) setCurrentTrip(null);
            toast.success('Trip deleted');
        } catch (err) {
            toast.error('Failed to delete trip');
        }
    };

    const fetchItinerary = useCallback(async (tripId) => {
        try {
            const data = await itineraryAPI.getByTrip(tripId);
            setItinerary(data.itineraries || data.itinerary || data || []);
        } catch (err) {
            toast.error('Failed to fetch itinerary');
        }
    }, []);

    const generateItinerary = async (tripId) => {
        setIsGenerating(true);
        try {
            const data = await aiAPI.generateItinerary(tripId);
            setItinerary(data.itineraries || []);
            toast.success('AI Itinerary Generated!');
        } catch (err) {
            toast.error('Failed to generate itinerary');
        } finally {
            setIsGenerating(false);
        }
    };

    const fetchExpenses = useCallback(async (tripId) => {
        try {
            const data = await expenseAPI.getAll(tripId);
            setExpenses(data);

            const balanceData = await expenseAPI.getBalances(tripId);
            setBalances(balanceData.balances || {});
            setSettlements(balanceData.settlements || []);
        } catch (err) {
            toast.error('Failed to fetch expenses');
        }
    }, []);

    const addExpense = async (tripId, data) => {
        try {
            await expenseAPI.add(tripId, data);
            await fetchExpenses(tripId);
            toast.success('Expense added');
        } catch (err) {
            toast.error('Failed to add expense');
        }
    };

    const inviteMember = async (tripId, data) => {
        try {
            const res = await tripAPI.invite(tripId, data);
            toast.success('User invited!');
            return res;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to invite');
        }
    };

    const value = {
        trips, currentTrip, itinerary, expenses, balances, settlements, analytics,
        isLoading, isGenerating,
        fetchTrips, fetchTrip, createTrip, deleteTrip,
        fetchItinerary, generateItinerary, setItinerary,
        fetchExpenses, addExpense, inviteMember,
        setCurrentTrip
    };

    return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
