import { Request, Response } from "express";
import { getInstagramFollowerCount } from "../functions/Instagram";
import {
  calculatePlayersScore,
  generateQuestion,
} from "../functions/Question";
import { PlayerModel } from "../models/Player";
import { RoomModel } from "../models/Room";

async function getRoomByCode(code: string) {
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw "Room not found";
  }

  return room;
}

export class RoomController {
  static async create(req: Request, res: Response) {
    try {
      const { player } = req.body;

      if (!player) {
        throw "Player is invalid";
      }

      const room = await RoomModel.create({ owner: player });

      return res.status(201).send({ room });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ error });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const rooms = await RoomModel.find({});

      return res.status(200).send(rooms);
    } catch (error) {
      return res.status(400).send({ error });
    }
  }

  static async join(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const { player } = req.body;

      const room = await RoomModel.findOne({ code });
      const newPlayer = await new PlayerModel(player);

      if (!room) {
        throw "Room not found";
      }

      if (!newPlayer) {
        throw "Invalid player";
      }

      if (room.players.find((p) => p.name === newPlayer.name)) {
        throw "Player is already in room";
      }

      room.players.push(player);
      await RoomModel.updateOne({ _id: room._id }, room);
      await req.io.emit(`${room.code}/update`, room);

      return res.send(room);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error });
    }
  }

  static async startNextRound(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const { player } = req.body;

      const room = await getRoomByCode(code);

      if (room.owner.name !== player.name) {
        throw "Apenas o host pode iniciar o próximo round";
      }

      if (room.round.current > room.round.total) {
        throw "O jogo já foi finalizado";
      }

      if (room.round.current === room.round.total) {
        room.status = "GAME_OVER";
      } else {
        room.round.current++;
        room.round.canSendAnswer = true;
        room.round.question = await generateQuestion();
        room.status = "READY_TO_ANSWER";
      }

      // room.players = await calculatePlayersScore(room);
      // console.log(calculateRelativeDifference(12000, 12930));
      // console.log(getInstagramFollowerCount("vit.orrr"));

      // const room = await getRepository(Room).findOne({
      //   where: {
      //     code,
      //   },
      // });
      // const player = room.players.find((p) => p.name === playerName);

      // if (!player) {
      //   throw "Invalid player";
      // }
      await req.io.emit(`${room.code}/update`, room);

      await RoomModel.updateOne({ _id: room._id }, room);

      return res.send(room);
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error });
    }
  }

  static async finishCurrentRound(req: Request, res: Response) {
    try {
      const { code } = req.params;

      const room = await getRoomByCode(code);

      if (!room.round.canSendAnswer) {
        throw "Rodada já foi finalizada, aguardando inicio da próxima";
      }

      room.players = await calculatePlayersScore(room);
      room.round.canSendAnswer = false;
      room.status = "WAITING_FOR_ROUND";

      await RoomModel.updateOne({ _id: room._id }, room);

      await req.io.emit(`${room.code}/update`, room);

      return res.send({ room });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error });
    }
  }

  static async answer(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const { player } = req.body;

      const room = await getRoomByCode(code);
      const findPlayer = room.players.find((p) => p.name === player.name);

      if (!room.round.canSendAnswer) {
        throw "O round ainda não comecou";
      }

      if (findPlayer.hasSentHunch) {
        throw "Você já enviou um palpite nessa rodada, aguarde a próxima";
      }

      if (!findPlayer) {
        throw "Jogador inválido";
      }

      room.players = room.players.map((p) => {
        if (p.name === findPlayer.name) {
          p.hasSentHunch = true;
          p.hunch = player.hunch;
        }

        return p;
      });

      await RoomModel.updateOne({ _id: room._id }, room);

      await req.io.emit(`${room.code}/update`, room);

      return res.send({ room });
    } catch (error) {
      return res.status(400).send({ error });
    }
  }

  static async restart(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const { player } = req.body;

      const room = await getRoomByCode(code);

      room.status = "WAITING_TO_START_GAME";
      room.round.current = 0;
      delete room.round.question;

      room.players = room.players.map((p) => {
        p.hasSentHunch = false;
        delete p.hunch;
        delete p.roundScore;
        p.score = 0;
        return p;
      });

      await RoomModel.updateOne({ _id: room._id }, room);

      await req.io.emit(`${room.code}/update`, room);

      return res.send({ room });
    } catch (error) {
      return res.status(400).send({ error });
    }
  }

  static async disconnect(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const { player } = req.body;
      const room = await getRoomByCode(code);
      const findPlayer = room.players.find((p) => p.name === player.name);

      room.players = room.players.filter((p) => p.name !== player.name);

      if (room.players.length === 0) {
        await RoomModel.deleteOne({ _id: room._id });
      } else {
        if (room.owner.name === player.name) {
          room.owner = room.players[0];
        }

        await RoomModel.updateOne({ _id: room._id }, room);
        await req.io.emit(`${room.code}/update`, room);

        return res.send({ room });
      }
    } catch (error) {
      return res.status(400).send({ error });
    }
  }
}
