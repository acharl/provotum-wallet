import { InteractionSetting } from '../models/AirGapMarketWalletGroup'

export interface KeyGenerationProof {
  challenge: string
  response: string
}

export interface PublicKeyShare {
  pk: string
  proof: KeyGenerationProof
}
export interface Uint8KeyGenerationProof {
  challenge: number[]
  response: number[]
}

export interface Uint8PublicKeyShare {
  pk: number[]
  proof: Uint8KeyGenerationProof
}
export interface KeyShareSync {
  keyShare: Uint8PublicKeyShare
  interactionSetting?: InteractionSetting
}
