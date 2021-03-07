const Config = use('Config')
const axios = require('axios')
const o2x = require('object-to-xml')

class Bling {

  apiUrl = 'https://bling.com.br/Api/v2'

  async syncDeal(deal) {
    let blingData = await this.getBlingData(deal)
    let response = await axios.post(`${this.apiUrl}/pedido/json`, null, {
      params: {
        xml: o2x(blingData),
        apikey: Config.get('app.blingApiKey'),
        gerarnfe: false
      }
    })
    return response.status
  }

  async getBlingData(deal) {
    return {
      '?xml version=\"1.0\" encoding=\"UTF-8\"?': null,
      pedido: {
        data: deal.won_time,
        cliente: {
          nome: deal.customer.name,
          email: deal.customer.email,
          fone: deal.customer.phone
        },
        itens: deal.products.reduce((products, product) => {
          return [...products, {
            item: {
              codigo: product.pipedrive_id,
              descricao: product.name,
              qtde: product.quantity,
              vlr_unit: product.unit_value,
              vlr_desconto: product.total_discount
            }
          }]
        }, [])
      }
    }

  }

}

module.exports = Bling
