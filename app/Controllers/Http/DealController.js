'use strict'

const Deal = use("App/Models/Deal")

class DealController {

    async list({ request, response}) {
        let deals = await Deal.find()
        return response.send(deals)
    }
}

module.exports = DealController
