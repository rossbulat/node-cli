const chalk = require('chalk')
const figlet = require('figlet')

module.exports = {

  title: () =>
    console.log(`${
      chalk.white(
        figlet.textSync(' My_CLI ', {
          horizontalLayout: 'full',
        })
      )}\n`)
}