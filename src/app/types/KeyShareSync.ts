import { InteractionSetting } from '../models/AirGapMarketWalletGroup'

export interface KeyGenerationProof {
  challenge: number[]
  response: number[]
}

export interface PublicKeyShare {
  pk: number[]
  proof: KeyGenerationProof
}
export interface KeyShareSync {
  keyShare: PublicKeyShare
  interactionSetting?: InteractionSetting
}
