import { InteractionSetting } from '../models/AirGapMarketWalletGroup'

export interface DecryptionProof {
  challenge: string
  response: string
}

export interface DecryptionPostBody {
  decryption_proof: DecryptionProof
  shares: number[][]
}

export interface SealerDecryptionPostBody extends DecryptionPostBody {
  sealer: string
}
export interface DecryptionSync {
  decryptionPostBody: SealerDecryptionPostBody
  interactionSetting?: InteractionSetting
}
