'use strict'

const {
  Command
} = require('@adonisjs/ace')
const Deal = use("App/Models/Deal")

const PipedriveResource = require('../Resources/Pipedrive')
const BlingResource = require('../Resources/Bling')

class SyncPipedriveDeal extends Command {
  static get signature() {
    return 'sync:pipedrive:deal'
  }

  static get description() {
    return 'Sync Pipedrive Deals'
  }

  async handle(args, options) {
    const pipedriveResource = new PipedriveResource()
    const blingResource = new BlingResource()
    let deals = await pipedriveResource.getWonDeals()

    deals.map(async deal => {
      let dealExists = await Deal.findOne({pipedrive_id: deal.pipedrive_id})
      if(!dealExists) {
        Deal.create(deal)
        blingResource.syncDeal(deal)
      }
    })
  }
}

module.exports = SyncPipedriveDeal
