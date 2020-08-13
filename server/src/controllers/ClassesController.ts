import { Request, Response } from 'express'
import db from '../database/connection';
import convertHourToMinuts from '../utils/convertHourToMinuts';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    if (!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: "Missing filters to search classes"
      })
    }

    const timeInMinuts = convertHourToMinuts(time);

    try {
      const classes = await db('classes')
        .whereExists(function () {
          this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('`class_schedule`.`class_id`=`classes`.`id`')
            .whereRaw('`class_schedule`.`week_day`=??', [Number(week_day)])
            .whereRaw('`class_schedule`.`from`<= ??', [timeInMinuts])
            .whereRaw('`class_schedule`.`to`> ??', [timeInMinuts])
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')
        .select(['classes.*', 'users.*'])

      return response.json(classes)
    } catch (error) {
      response.status(400).send("Ocorreu um erro indesperado!" + error)
    }

  }
  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = request.body;

    const trx = await db.transaction();

    try {
      const insertedUserIds = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      })

      const user_id = insertedUserIds[0]

      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        user_id
      })

      const class_id = insertedClassesIds[0]

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinuts(scheduleItem.from),
          to: convertHourToMinuts(scheduleItem.to),
        }
      })

      await trx('class_schedule').insert(classSchedule)

      await trx.commit();

      return response.status(201).send("Sucesso!")

    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: "Ocorreu um erro inesperado!"
      })
    }

  }
}