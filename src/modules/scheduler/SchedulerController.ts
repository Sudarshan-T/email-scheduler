import { Router, Request, Response } from "express";
import { Scheduler } from "./Scheduler";

export class SchedulerController {
  router = Router();
  constructor() {
    this.router.post('/', this.create);
    this.router.put('/', this.update);
    this.router.get('/', this.list);
    this.router.delete('/', this.delete);
  }

  create(req: Request, res: Response) {
    const scheduler = new Scheduler();
    scheduler.create(req.body).then(
      (resp) => res.status(200).json(resp),
      (err) => res.status(400).json(err)
    );
  }

  update(req: Request, res: Response) {
    const scheduler = new Scheduler();
    scheduler.update(req.body).then(
      (resp) => res.status(200).json(resp),
      (err) => res.status(400).json(err)
    );
  }

  list(req: Request, res: Response) {
    const scheduler = new Scheduler();
    scheduler.list(req.query).then(
      (resp) => res.status(200).json(resp),
      (err) => res.status(400).json(err)
    );
  }

  delete(req: Request, res: Response) {
    const scheduler = new Scheduler();
    scheduler.delete(req.body).then(
      (resp) => res.status(200).json(resp),
      (err) => res.status(400).json(err)
    );
  }
}
