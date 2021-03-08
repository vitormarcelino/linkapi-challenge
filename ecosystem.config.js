module.exports = {
  apps : [{
    script: 'adonis serve',
    watch: false
  },{
    script: 'adonis consume:pipedrive:update',
    watch: false
  }
]
};
