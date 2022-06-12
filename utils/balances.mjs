import {
  Connection,
  PublicKey,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as SPLToken from '@solana/spl-token'
import BN from 'bn.js'

const connection = new Connection("https://solana-api.projectserum.com", {commitment: 'recent'});

const TOKENS = {
  "So11111111111111111111111111111111111111112" : "wSOL",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" : "USDC",
};

const fetchBalances = async (address) => {
  try {
    const response = await connection.getTokenAccountsByOwner(
      address,
      {
        programId: TOKEN_PROGRAM_ID,
      },
    )

    if (!response.value) {
      return {
        success: false,
        reason: 'Cannot fetch token accounts by owner',
      }
    }

    const balances = response.value.filter((item) => {
      const accountInfo = SPLToken.AccountLayout.decode(item.account.data)
      return TOKENS[accountInfo.mint.toString()]
    }).map((e) => {
      const accountInfo = SPLToken.AccountLayout.decode(e.account.data)
      return {
        token: TOKENS[accountInfo.mint.toString()],
        amount: new BN(accountInfo.amount.toString()).div(new BN(1e9)).toNumber(),
      }
    })

    return {
      success: true,
      balances,
    }
  } catch (e) {
    return {
      success: false,
      reason: e,
    }
  }
}

export default fetchBalances;
