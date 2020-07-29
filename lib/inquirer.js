const inquirer = require('inquirer')
const validate = require('./validate')
const logSymbols = require('log-symbols')

module.exports = {

  // sign in form
  askSignInCredentials: async () =>
    inquirer.prompt([
      {
        name: 'email',
        type: 'input',
        message: 'Enter your email address:',
        validate: value => validate.validateEmail(value)
          ? true
          : logSymbols.warning + ' Please enter a valid email address'
      }, {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        mask: '*',
        validate: value => value.length
          ? true
          : logSymbols.warning + ' Please enter your password'
      }
    ]),

  // ask whether to keep signed in
  keepSignedIn: async () =>
    inquirer.prompt([
      {
        name: 'keepSignedIn',
        type: 'confirm',
        message: 'Do you want to stay signed in on this device?'
      }
    ]),

  // ask whether to keep signed in
  mainOptions: async () =>
    inquirer.prompt([
      {
        name: 'option',
        type: 'rawlist',
        message: 'Choose an Option:\n',
        choices: [
          'Get Total Users',
          'Manage Users',
          new inquirer.Separator(),
          'Sign Out and Exit',
          'Exit',
        ]
      }
    ]),
}