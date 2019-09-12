"use strict"

const { Command, flags } = require("@oclif/command")

const AppUtils = require("../util")
const appUtils = new AppUtils()

class ScanForSweeps extends Command {
  async run() {
    const { flags } = this.parse(ScanForSweeps)

    // Ensure flags meet qualifiying critieria.
    this.validateFlags(flags)

    await this.scanForSweeps(flags)
  }

  async scanForSweeps(flags) {
    try {
      console.log(`hello world`)

      const filename = `${__dirname}/../../${flags.file}`
      const addrList = appUtils.openWallet(filename)
      console.log(`addrList: ${JSON.stringify(addrList, null, 2)}`)
    } catch (err) {
      console.error(`Error in scan-for-sweeps: `, err)
    }
  }

  // Validate the proper flags are passed in.
  validateFlags(flags) {
    //console.log(`flags: ${JSON.stringify(flags, null, 2)}`)

    // Exit if wallet not specified.
    const file = flags.file
    if (!file || file === "")
      throw new Error(`You must specify a wallet with the -f flag.`)

    // const qty = flags.qty
    // if (isNaN(Number(qty)))
    //   throw new Error(`You must specify a quantity of tokens with the -q flag.`)
    //
    // const sendAddr = flags.sendAddr
    // if (!sendAddr || sendAddr === "")
    //   throw new Error(`You must specify a send-to address with the -a flag.`)
    //
    // const tokenId = flags.tokenId
    // if (!tokenId || tokenId === "")
    //   throw new Error(`You must specifcy the SLP token ID`)
    //
    // // check Token Id should be hexademical chracters.
    // const re = /^([A-Fa-f0-9]{2}){32,32}$/
    // if (typeof tokenId !== "string" || !re.test(tokenId)) {
    //   throw new Error(
    //     "TokenIdHex must be provided as a 64 character hex string."
    //   )
    // }

    return true
  }
}

ScanForSweeps.description = `Example command from oclif
...
Leaving it here for future reference in development.
`

ScanForSweeps.flags = {
  file: flags.string({
    char: "f",
    description: "filename of json file with addresses to scan."
  })
}

module.exports = ScanForSweeps
