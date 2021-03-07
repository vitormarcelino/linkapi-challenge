'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class Deal
 */
class Deal extends BaseModel {
  static boot({
    schema
  }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'DealHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * Deal's schema
   */
  static get schema() {
    return {
      pipedrive_id: Number,
      title: String,
      value: Number,
      won_time: Date,
      customer: {
        pipedrive_id: Number,
        name: String,
        email: String,
        phone: String,
      }
    }
  }
}

module.exports = Deal.buildModel('Deal')
