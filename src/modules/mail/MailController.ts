import { Router, Request, Response } from "express";
import { Mail } from "./Mail";

export class MailController {
  router = Router();
  constructor() {
    this.router.get('/', this.list);
  }

  list(req: Request, res: Response) {
    const mail = new Mail();
    mail.list().then(
      (resp) => res.status(200).json(resp),
      (err) => res.status(400).json(err)
    );
  }

}
