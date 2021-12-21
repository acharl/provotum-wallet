import { InteractionSetting } from '../models/AirGapMarketWalletGroup'

export interface DecryptionProof {
  challenge: string
  response: string
}

export interface DecryptionPostBody {
  decryption_proof: DecryptionProof
  shares: number[][]
}

export interface DecryptionSync {
  decryptionPostBody: DecryptionPostBody
  interactionSetting?: InteractionSetting
}
