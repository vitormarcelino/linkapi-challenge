const lib = require('pipedrive')
const Config = use('Config')

class Pipedrive {

  constructor() {
    lib.Configuration.apiToken = Config.get('app.pipedriveToken')
  }

  async getWonDeals() {
    return new Promise(async (resolve) => {
      let input = []
      input['status'] = 'won'
      input['limit'] = 25
      let deals = []
      let hasNextPage = true

      while (hasNextPage) {
        const response = await lib.DealsController.getAllDeals(input)
        await Promise.all(response.data.map(async deal => {
          return this.getPipediveDealProducts(deal.id).then((products) => {
            let dealData = {
              pipedrive_id: deal.id,
              title: deal.title,
              value: deal.value,
              won_time: deal.won_time,
              customer: {
                pipedrive_id: deal.person_id.value,
                name: deal.person_id.name,
                email: deal.person_id.email.value,
                phone: deal.person_id.phone.value,
              },
              products
            }
            return dealData
          })

        })).then((itens) => deals.push(...itens))

        hasNextPage = response.additional_data.pagination.more_items_in_collection
        input['start'] = response.additional_data.pagination.next_start
        if (!hasNextPage) {
          resolve(deals)
        }
      }
    })
  }

  async getPipediveDealProducts(pipedriveDealId) {
    return new Promise(resolve => {
      lib.DealsController.listProductsAttachedToADeal({
        id: pipedriveDealId
      }, (err, response) => {
        let products = response.data.map(product => {
          return {
            pipedrive_id: product.id,
            name: product.name,
            unit_value: product.sum,
            quantity: product.quantity,
            total_discount: product.sum_no_discount,
            total_value: product.sum
          }
        })
        resolve(products)
      })
    })
  }

  async getData(deal) {
    let products = await this.getPipediveDealProducts(deal.id)
    return {
      pipedrive_id: deal.id,
      title: deal.title,
      value: deal.value,
      won_time: deal.won_time,
      customer: {
        name: deal.person_name,
      },
      products
    }
  }

}

module.exports = Pipedrive
