#!/usr/bin/env node

const ora = require('ora')
const chalk = require('chalk')
const clear = require('clear')
const logSymbols = require('log-symbols')
const ui = require('./lib/ui')
const auth = require('./lib/auth')
const inquirer = require('./lib/inquirer')

// clear console
clear()

// display title
ui.title()

// main execution
const run = async () => {

  // check whether a token exists in configStore
  const token = auth.checkTokenExists()

  let signedIn = false;
  if (token) {

    console.log(chalk.grey(`Authentication token found`))

    // invoke spinner while token is being validated
    let spinner = ora({
      text: ` ${chalk.green('Validating token...')}`,
      prefixText: logSymbols.info,
    }).start();

    spinner.stop()

    // validate token
    if (await auth.validateToken(token)) {
      signedIn = true
    } else {
      console.log(`\n${chalk.red('Could not validate token. Please sign in again')}`)
    }
  }

  while (!signedIn) {

    // prompt credentials
    const credentials = await inquirer.askSignInCredentials()

    // invoke spinner while authentication is being checked
    spinner = ora({
      text: `${chalk.green('Authenticating...')}`,
      color: 'yellow',
    }).start();

    // validate credentials
    const signIn = await auth.handleSignIn(credentials)
    spinner.stop()

    if (signIn.ack === 'success') {

      console.log(`\n ${chalk.green('Succesfully authenticated')}`)
      signedIn = true

      // ask to persist auth token
      const keepSignedIn = await inquirer.keepSignedIn()
      if (keepSignedIn) {
        auth.storeAuthToken(signIn.response.token);
      }

    } else {
      console.log(chalk.red('\nIncorrect credentials. Please try again'))
    }
  }

  clear()
  ui.title()

  while (signedIn) {

    console.log('\n')
    const { option } = await inquirer.mainOptions()

    // clean up UI
    clear()
    ui.title()

    switch (option) {
      case 'Exit':
        process.exit()

      case 'Sign Out and Exit':
        auth.clearAuthToken()
        process.exit()

      default:
        console.log(chalk.grey('Option not yet implemented'))
    }
  }
}

run();