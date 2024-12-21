import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";
import { validationResult } from "express-validator"; // Using express-validator for more detailed validation

const send_reservation = async (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorHandler(errors.array().map(err => err.msg).join(', '), 400));
  }

  const { firstName, lastName, email, date, time, phone } = req.body;

  try {
    // Create the reservation in the database
    await Reservation.create({ firstName, lastName, email, date, time, phone });

    // Respond to the client
    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }

    // Handle other unexpected errors
    console.error(error); // Log the error for debugging purposes
    return next(new ErrorHandler("Internal Server Error", 500)); // More general error for server-side issues
  }
};

export default send_reservation;


