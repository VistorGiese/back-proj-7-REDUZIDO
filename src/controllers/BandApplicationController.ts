import { Request, Response } from "express";
import BandApplicationModel from "../models/BandApplicationModel";
import BookingModel from "../models/BookingModel";
import { Op } from "sequelize";

export const applyBandToEvent = async (req: Request, res: Response) => {
  try {
    const { banda_id, evento_id } = req.body;
    
    const evento = await BookingModel.findByPk(evento_id);
    if (!evento) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    if (evento.status === "aceito") {
      return res.status(400).json({ error: "Evento já está fechado para novas candidaturas" });
    }

    const candidaturaAceita = await BandApplicationModel.findOne({
      where: { evento_id, status: "aceito" }
    });
    
    if (candidaturaAceita) {
      return res.status(400).json({ error: "Evento já possui banda aceita e está fechado para novas candidaturas" });
    }

    const existente = await BandApplicationModel.findOne({
      where: { banda_id, evento_id }
    });
    
    if (existente) {
      return res.status(400).json({ error: "Banda já aplicou para este evento" });
    }
    const aplicacao = await BandApplicationModel.create({ banda_id, evento_id });
    res.status(201).json(aplicacao);
  } catch (error) {
    res.status(400).json({ error: "Erro ao aplicar banda ao evento" });
  }
};

export const acceptBandApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const aplicacao = await BandApplicationModel.findByPk(id);
    if (!aplicacao) {
      return res.status(404).json({ error: "Candidatura não encontrada" });
    }

    const jaAprovada = await BandApplicationModel.findOne({
      where: { evento_id: aplicacao.evento_id, status: "aprovada" }
    });
    
    if (jaAprovada) {
      return res.status(400).json({ error: "Já existe banda aprovada para este evento" });
    }

    await aplicacao.update({ status: "aprovada" });
    
    await BookingModel.update(
      { banda_id: aplicacao.banda_id, status: "aceito" },
      { where: { id: aplicacao.evento_id } }
    );
    
    await BandApplicationModel.destroy({
      where: {
        evento_id: aplicacao.evento_id,
        id: { [Op.ne]: aplicacao.id }
      }
    });

    res.json({ message: "Banda aprovada para o evento. Evento fechado para novas candidaturas e demais candidaturas removidas", aplicacao });
  } catch (error) {
    res.status(400).json({ error: "Erro ao aprovar banda" });
  }
};
export const getBandApplicationsForEvent = async (req: Request, res: Response) => {
  try {
    const { evento_id } = req.params;
    
    const evento = await BookingModel.findByPk(evento_id);
    if (!evento) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    if (evento.status === "aceito") {
      return res.json({ 
        message: "Evento fechado - já possui banda confirmada",
        candidaturas: []
      });
    }

    const aplicacoes = await BandApplicationModel.findAll({ 
      where: { evento_id },
      include: [
        {
          association: 'Band',
          attributes: ['id', 'nome_banda', 'descricao']
        }
      ]
    });
    
    res.json(aplicacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar aplicações de banda para evento" });
  }
};
