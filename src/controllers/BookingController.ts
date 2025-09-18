import { Request, Response } from "express";
import BookingModel, { BookingStatus } from "../models/BookingModel";


export const createBooking = async (req: Request, res: Response) => {
  try {
    const { titulo_evento, descricao_evento, data_show, estabelecimento_id, horario_inicio, horario_fim } = req.body;
    const { Op } = require('sequelize');
    const conflito = await BookingModel.findOne({
      where: {
        estabelecimento_id,
        data_show,
        [Op.or]: [
          {
            horario_inicio: { [Op.lt]: horario_fim },
            horario_fim: { [Op.gt]: horario_inicio }
          }
        ]
      }
    });
    if (conflito) {
      return res.status(400).json({ error: "Já existe evento para este estabelecimento neste horário e dia." });
    }
    const booking = await BookingModel.create({
      titulo_evento,
      descricao_evento,
      data_show,
      estabelecimento_id,
      horario_inicio,
      horario_fim,
      status: BookingStatus.PENDENTE,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar evento", details: error });
  }
};

export const applyBandToBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { banda_id } = req.body;
    if (!banda_id) {
      return res.status(400).json({ error: 'O campo banda_id é obrigatório.' });
    }
    const booking = await BookingModel.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }
    if (booking.banda_id) {
      return res.status(400).json({ error: 'Já existe uma banda associada a este agendamento.' });
    }
    booking.banda_id = banda_id;
    booking.status = BookingStatus.ACEITO;
    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao associar banda ao agendamento.' });
  }
};

// Listar todos os agendamentos
export const getBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await BookingModel.findAll();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamentos", details: error });
  }
};

// Buscar agendamento por ID
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.findByPk(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Agendamento não encontrado" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamento", details: error });
  }
};

// Atualizar agendamento
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.findByPk(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Agendamento não encontrado" });

    const BandApplicationModel = require("../models/BandApplicationModel").default;
    const candidaturas = await BandApplicationModel.count({ where: { evento_id: booking.id } });
    if (candidaturas > 0) {
      return res.status(400).json({ error: "Não é possível editar: já existem candidaturas para este evento." });
    }

    await booking.update(req.body);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar agendamento", details: error });
  }
};

// Remover agendamento
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.findByPk(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Agendamento não encontrado" });
    await booking.destroy();
    res.json({ message: "Agendamento removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover agendamento", details: error });
  }
};
