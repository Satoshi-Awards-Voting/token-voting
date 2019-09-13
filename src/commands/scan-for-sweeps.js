"use strict"

const { Command, flags } = require("@oclif/command")

const AppUtils = require("../util")
const appUtils = new AppUtils()

const collect = require("collect.js")

const config = require("../../config")
const BITBOX = new config.BCHLIB({ restURL: config.MAINNET_REST })

// Promise based sleep function.
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

class ScanForSweeps extends Command {
  constructor(argv, config) {
    super(argv, config)

    this.BITBOX = BITBOX
  }

  async run() {
    const { flags } = this.parse(ScanForSweeps)

    // Ensure flags meet qualifiying critieria.
    this.validateFlags(flags)

    await this.scanForSweeps(flags)
  }

  async scanForSweeps(flags) {
    try {
      // Open the file containing the array of addresses to scan.
      const filename = `${__dirname}/../../${flags.file}`
      const addrList = appUtils.openWallet(filename)
      //console.log(`addrList: ${JSON.stringify(addrList, null, 2)}`)

      // Break the input array into chunks for 20 elements.
      const chunks = collect(addrList).chunk(20)
      //console.log(`chunks: ${JSON.stringify(chunks, null, 2)}`)

      const sweptAddrs = collect([])

      // Loop through each chunk.
      for (let i = 0; i < 1; i++) {
        const thisChunk = chunks.items[i].items

        // Get the details for each address.
        // Dev Note: balance is the 'confirmed' balance. 'unconfirmedBalance'
        // will be a negative value when the ticket is swept.
        const details = await this.BITBOX.Address.details(thisChunk)
        //console.log(`details: ${JSON.stringify(details, null, 2)}`)

        // Filter out just the addresses that match the criteria that indicate
        // the ticket has been swept.
        const sweptAddrsDetected = details.filter(x => {
          // Ticket has been swept and at least 1 block confirmation has occured.
          const confirmedSweep = x.balance === 0.0 && x.transactions.length > 0

          // Ticket has been swept, but has not been confirmed.
          const unconfirmedSweep = x.balanceSat + x.unconfirmedBalanceSat === 0

          return confirmedSweep || unconfirmedSweep
        })
        //console.log(`sweptAddrsDetected: ${JSON.stringify(sweptAddrsDetected, null, 2)}`)

        // Get just the address from the details.
        const newSweptAddrs = sweptAddrsDetected.map(x => x.cashAddress)
        console.log(`newSweptAddrs: ${JSON.stringify(newSweptAddrs)}`)

        // Add any newly detected
        sweptAddrs.concat(newSweptAddrs)
      }
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
