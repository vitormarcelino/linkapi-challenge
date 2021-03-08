'use strict'

const {
  Command
} = require('@adonisjs/ace')

const amqp = require('amqplib/callback_api');
const Config = use('Config')
const Deal = use("App/Models/Deal")
const PipedriveResource = require('../Resources/Pipedrive')
const BlingResource = require('../Resources/Bling')

class ConsumePipedriveUpdate extends Command {
  static get signature() {
    return 'consume:pipedrive:update'
  }

  static get description() {
    return 'Consume RabbitMQ pipedrive_update queue'
  }

  async handle(args, options) {
    const pipedriveResource = new PipedriveResource()
    const blingResource = new BlingResource()
    amqp.connect(Config.get('app.rabbitMqConnectionString'), (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        let queue = 'pipedrive_update';

        channel.assertQueue(queue, {
          durable: false
        });

        channel.consume(queue, async (msg) => {
          let payload = JSON.parse(msg.content.toString())
          console.log(`[x] Received: ${payload.title} | Status: ${payload.status}`)
          if(payload.status == 'won') {
            let dealExists = await Deal.findOne({pipedrive_id: payload.id})
            if(!dealExists) {
              let dealData = await pipedriveResource.getData(payload)
              Deal.create(dealData)
              blingResource.syncDeal(dealData)
            }

          }
        }, {
          noAck: true
        });
      });
    });

  }
}

module.exports = ConsumePipedriveUpdate
